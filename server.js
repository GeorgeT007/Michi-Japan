import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(express.json({ limit: '1mb' }));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://georget007.github.io').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    // Permit non-browser health checks, and only allow the configured website in browsers.
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed by CORS'));
  }
}));

app.get('/', (_req, res) => res.json({ service: 'Michi AI backend', status: 'ok' }));
app.get('/health', (_req, res) => res.json({ status: 'ok', configured: Boolean(process.env.OPENAI_API_KEY) }));

app.post('/api/chat', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: 'Michi AI is not configured yet. Add the OPENAI_API_KEY environment variable to the backend.' });
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) return res.status(400).json({ error: 'Please enter a message.' });
  if (message.length > 6000) return res.status(413).json({ error: 'Please shorten your message and try again.' });

  const prefs = req.body?.preferences && typeof req.body.preferences === 'object' ? req.body.preferences : {};
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-10).filter(m => ['user', 'assistant'].includes(m?.role) && typeof m?.content === 'string').map(m => ({ role: m.role, content: m.content.slice(0, 3000) })) : [];
  const instructions = `You are Michi AI, a helpful, honest Japan travel-planning assistant. Give practical, balanced advice and explain trade-offs. Do not claim to have checked a source unless a web search result supports it. For changing details such as opening hours, transport, prices, and entry rules, use web search where useful and link to reliable official sources. Never claim to book anything. If unsure, say so. Tailor advice to these optional preferences: destination=${String(prefs.destination || 'Japan').slice(0,100)}, trip length=${String(prefs.days || 'unspecified').slice(0,30)} days, travel style=${String(prefs.style || 'Balanced').slice(0,100)}, budget=${String(prefs.budget || 'Mid-range').slice(0,100)}.`;

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const input = [...history, { role: 'user', content: message }];
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
      instructions,
      tools: [{ type: 'web_search' }],
      input
    });
    const citations = [];
    for (const item of response.output || []) {
      if (item.type !== 'message') continue;
      for (const part of item.content || []) {
        for (const ann of part.annotations || []) {
          if (ann.type === 'url_citation' && ann.url && !citations.some(c => c.url === ann.url)) citations.push({ title: ann.title || ann.url, url: ann.url });
        }
      }
    }
    return res.json({ reply: response.output_text || 'Sorry, I could not produce an answer. Please try again.', citations: citations.slice(0, 8) });
  } catch (err) {
    console.error('Michi AI request failed:', err?.status || '', err?.message || 'unknown error');
    const status = Number(err?.status) >= 400 && Number(err?.status) < 500 ? 502 : 500;
    return res.status(status).json({ error: 'Michi AI could not complete that request. Check the backend logs and your OpenAI API account, then try again.' });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, '0.0.0.0', () => console.log(`Michi AI backend listening on ${port}`));
