MICHI — JAPAN, BETTER PLANNED
Updated website package with accommodation comparison, booking organiser and Michi AI backend.

WHAT IS INCLUDED
- public/index.html: Michi website
- public/manifest.webmanifest, public/michi-icon.svg, public/sw.js: app assets
- netlify/functions/chat.mjs: secure server-side AI endpoint
- netlify.toml: Netlify build settings

IMPORTANT: THE CHATBOT MUST BE DEPLOYED AS A SERVERLESS FUNCTION
If you uploaded only the HTML with Netlify Drop, Michi AI cannot use the backend and cannot perform a live web search. The page must be served by the Netlify site that also deploys netlify/functions/chat.mjs. A static HTML upload alone is not enough.

HOW TO CHECK THE LIVE SITE
1. Open https://YOUR-SITE/.netlify/functions/chat in a browser (replace YOUR-SITE with your site's domain).
2. A working function should return JSON like {"configured":true,"webSearchEnabled":true}. If you see a 404, a website HTML page, or configured:false, the function/key is not correctly deployed.
3. After deployment, ask Michi a current question. The chat status should say "Web search completed" and display source links when returned. If the search tool did not run, the updated backend refuses to present the answer as web-checked.

IMPORTANT: THE AI NEEDS A PRIVATE API KEY
The website does not include an API key. Create your own OpenAI API key and add it in Netlify as an environment variable named OPENAI_API_KEY. Never paste the key into index.html or share it publicly. API usage may incur charges; set a budget/usage limits in your OpenAI API account.
Optional variables:
- OPENAI_MODEL: model available to your API account (default: gpt-6-astra)
- MICHI_AI_WEB_SEARCH: set to false to disable web search (default: true; web search may increase usage cost)
After changing environment variables, redeploy the site.

DEPLOYMENT NOTE
A plain Netlify Drop upload publishes static files only; it does not build/package the serverless function. To enable the chatbot, deploy this package using a Git-connected Netlify site or Netlify CLI.

RECOMMENDED BEGINNER ROUTE: GITHUB + NETLIFY
1. Create a private GitHub repository and upload the contents of this package, keeping the folder layout exactly as supplied.
2. In Netlify, choose Add new site / Import an existing project and connect that repository.
3. Keep the build settings from netlify.toml (publish directory: public; functions directory: netlify/functions) and deploy.
4. In Netlify Site configuration / Environment variables, add OPENAI_API_KEY with your secret API key. Give it Functions/runtime scope if Netlify offers scopes. Optionally set OPENAI_MODEL.
5. Trigger a new deploy after adding the variable.
6. Open the public site, go to AI Trip Planner and send a test question. If it reports an error, inspect the Netlify function logs for the chat function.

ALTERNATIVE: NETLIFY CLI
From the extracted package directory, install/use Netlify CLI, link it to your existing site, then run a production deploy with the public directory and functions directory. Do not upload the secret key in this folder.

FEATURE NOTES
- Accommodation comparison suggests areas and opens booking-provider/map searches. It does not show verified live hotel inventory or rates.
- Booking records and saved AI notes are stored in each visitor's browser on that device; they do not sync across devices.
- The backend forces the web_search tool when enabled, checks the API response for a confirmed web_search_call, and refuses to return an answer as web-checked if no search call is present. The frontend no longer labels every successful response as web-searched; it reports the confirmed result and source-link count.
- The frontend waits up to 45 seconds for web research. The service-worker cache was bumped so a new deployment can replace the old cached page.
- Search results can still be incomplete or wrong; verify important details with the official provider.
- The chatbot displays a Sources checked list from search citations where available. It cannot book anything or guarantee availability.
- Never store passwords, card numbers, or sensitive passport details in the booking organiser.
