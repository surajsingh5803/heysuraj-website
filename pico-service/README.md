# Pico's private companion API

This service is **not** hosted by GitHub Pages. The public mascot works on HeySuraj already; deploy this Node 22+ service to add AI conversations and a durable, consent-based inbox.

## Setup

1. Create a separate Render **Web Service** from the existing repository, with **Root Directory** set to \`pico-service\`.
2. Build command: \`npm install\`. Start command: \`npm start\`.
3. Set \`DATABASE_URL\` to a *separate* Neon PostgreSQL database. The server creates \`pico_messages\` on startup.
4. Set \`OPENAI_API_KEY\` (if you want genuinely open-ended AI chat), optionally \`PICO_MODEL\` (default \`gpt-5.5\`), and \`PICO_MEMORY\` to owner-approved personal facts **only**. No sensitive memories belong in public GitHub files.
5. Set \`PICO_ALLOWED_ORIGIN=https://heysuraj.com\`. The service allows the www variant too.
6. For automatic email notifications, configure a verified sender with \`RESEND_API_KEY\`, \`PICO_MAIL_FROM\` and \`PICO_OWNER_EMAIL\`. Database persistence works without email.
7. Generate an unpredictable \`PICO_ADMIN_TOKEN\` for retrieving and updating messages. Never put it into the website.
8. Once service responds at \`https://YOUR-SERVICE.onrender.com/health\`, update \`assets/pico-config.js\` with \`apiBase: "https://YOUR-SERVICE.onrender.com"\`, then deploy GitHub Pages.

GitHub Pages remains the website hosting platform. Render's domain is just the private API. Model and email providers may incur charges. Avoid pretending that a message is delivered until the API returns saved=true. The client falls back to a visitor-approved WhatsApp handoff when the service is unavailable.

### Private owner dashboard

Visit `https://YOUR-SERVICE.onrender.com/admin` after deployment. Paste your `PICO_ADMIN_TOKEN` into the unlock form; the token is held only in memory for that browser tab. You can review up to 100 recent consented notes, filter by status, and mark them reviewed/replied/archived. Do **not** share this dashboard or token publicly.

### API routes

- \`GET /health\` — whether AI and DB are configured (no private data)
- \`POST /api/chat\` — bounded AI response, no conversation stored in API
- \`POST /api/messages\` — only with consent; persists securely in PostgreSQL
- \`GET /api/messages\` — requires \`Authorization: Bearer ADMIN_TOKEN\`, returns last 100
- \`PATCH /api/messages/:id\` — admin token, status new/reviewed/replied/archived

### Important security notes

- Do not publish the admin token in any public front-end file.
- The basic rate limiter is in memory; add a durable abuse-prevention service before large-scale traffic.
- Use separate database credentials, maintain backups and a retention/deletion policy, and monitor API costs.
- Message storage is opt-in; chat history on the static site uses *sessionStorage* in the visitor's tab, and voice input is processed by their browser's speech-recognition provider where supported.
- OpenAI's responses are requested with \`store:false\`; provider handling is subject to its API terms.
- Notifications are best effort. A saved note can exist even if email sending fails.
- This is a deployment-ready starting point, **not** a claim that the backend is already live.
