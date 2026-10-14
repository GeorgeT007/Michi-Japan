Michi Japan — GitHub Pages version

This folder is prepared for GitHub Pages and contains no Netlify configuration or Netlify function files.

FILES
- index.html: website homepage (upload this at the repository root)
- manifest.webmanifest, michi-icon.svg, sw.js: installable-site support files

PUBLISH
1. Open your GitHub repository.
2. Upload these four files to the repository root (same level as index.html).
3. In Settings > Pages, choose Deploy from a branch, select main and /(root), then Save.

IMPORTANT ABOUT MICHI AI
GitHub Pages only hosts static files. In this version, Michi AI uses the built-in demo planner and does not call OpenAI. To enable live OpenAI answers, connect a separate secure backend host and configure its URL. Never put OPENAI_API_KEY in index.html or any public GitHub file.

No Netlify files are included in this package.
