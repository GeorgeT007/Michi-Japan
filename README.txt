MICHI AI BACKEND

This folder is a small Node.js service for the Michi Japan GitHub Pages website.

IMPORTANT SECURITY NOTES
- Never put your OpenAI API key in index.html or any GitHub file.
- Add OPENAI_API_KEY only as a private environment variable in the hosting dashboard.
- This service can use OpenAI web search; API requests may consume your OpenAI API credit.

DEPLOYMENT SETTINGS
- Runtime/language: Node
- Root directory (if asked): michi-ai-backend
- Build command: npm install
- Start command: npm start
- Instance: choose Free if available; do not select a paid plan unless you want to pay.
- Environment variable: OPENAI_API_KEY = your secret API key (enter privately in host dashboard)
- Optional environment variable: ALLOWED_ORIGINS = https://georget007.github.io
- Optional environment variable: OPENAI_MODEL = gpt-4.1-mini

After deployment, test https://YOUR-SERVICE-URL/health. It should return status ok and configured true after the key is saved.

The website frontend must then be updated to call https://YOUR-SERVICE-URL/api/chat. Do not share the secret key in chat or in the repository.
