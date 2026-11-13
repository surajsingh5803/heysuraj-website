# Hey Suraj — Suraj Kumar's Personal Headquarters

**Website:** https://heysuraj.com/  
**Hosting:** GitHub Pages (main branch, repository root)  
**Author:** Suraj Kumar  
**Source:** https://github.com/surajsingh5803/heysuraj-website

I turn ambitious ideas into real-world experiences — blending AI, digital strategy and entrepreneurship to build what's next.

> A mix of ventures, experiments and tools — because the best way to learn is to build.

## Pages now available

- [Home](https://heysuraj.com/) — overview, portrait, Experience Studio, 22 project/practice-area cards and AI lab.
- [About](https://heysuraj.com/about/) — career, education, consulting journey, tools and philosophy.
- [Work](https://heysuraj.com/work/) — SEO, local SEO, campaigns, analytics, conversions and automation methods.
- [Writing](https://heysuraj.com/writing/) — published guides and the honest 30-topic editorial roadmap.
- Deep project notes: `/projects/lazy-plex/`, `/projects/lp-crm/`, `/projects/lp-leados/`, `/projects/seo-audit-engine/`, `/projects/heysuraj-website/`.

### Complete long-form writing

1. **4,457 words:** [SEO on GitHub Pages — Domain Setup to Search Console](https://heysuraj.com/writing/seo-github-pages-guide/)
2. **4,364 words:** [Why Low Cost per Lead Can Hide Poor Campaign Performance](https://heysuraj.com/writing/google-ads-lead-quality/)
3. **4,160 words:** [AI Agents vs Workflow Automation](https://heysuraj.com/writing/ai-agents-vs-automations/)

The editorial roadmap contains **30 topics** total. **Three are published; 27 remain planned.** See `writing/editorial-plan.json`. Drafts and planned topics must **not** be described as published, submitted to the sitemap, or passed off as 4,000-word articles.

### Editorial standards

Each published article must use a distinct canonical URL and be meaningfully useful, accurate and original; the article-renderer has a 4,000-word minimum gate. Relevance, factual checks, source review and firsthand evidence matter more than word count. Avoid artificial keyword repetition and mass-produced filler.

## Connections and identity

- [LinkedIn](https://www.linkedin.com/in/surajkumarmarketing/) — professional collaborations.
- [Instagram](https://www.instagram.com/the.surajsingh/) — personal identity and informal content.
- [WhatsApp](https://wa.me/917257919567) — direct contact, through user-provided number.
- [GitHub](https://github.com/surajsingh5803) — project source and development trail.

The homepage includes Person JSON-LD with social profile references. Contact links are also visible in the footer and in several long-form pages.

## Experience Studio

- **6 colour worlds:** Midnight Lime, Ivory Atelier, Deep Ocean, Ember Studio, Orchid Night and Rose Paper.
- **5 animation styles + Still:** Orbit, Constellation, Aurora, Meteor and Breathe; a low-motion mode is available.
- Project filters, interactive lab, keyboard command palette (`Ctrl/Cmd+K`), mobile navigation and animated portrait artwork.
- OS reduced-motion support, accessible focus styles and static HTML for important reading content.

## Technology and SEO

Plain HTML, CSS and JavaScript. No CMS subscription or paid hosting requirement.

| Asset | Purpose |
|---|---|
| `index.html` | Main one-page interactive experience |
| `about/index.html`, `work/index.html` | Deep indexable career and work pages |
| `writing/index.html` | Library with published and planned material separated |
| `writing/<slug>/index.html` | Canonical long-form articles |
| `projects/<slug>/index.html` | Deep project status and technical notes |
| `assets/app.js` | Homepage projects, lab, writing and interaction logic |
| `assets/experience.js` | Homepage colour worlds, motion selection and hover states |
| `assets/content.js` | Theme switching, mobile nav and reading progress on inner pages |
| `assets/style.css` | Shared design system, editorial templates and responsive styles |
| `tools/article-renderer.js` | Quality-gated article template; requires 4,000+ words |
| `tools/project-renderer.js` | Detailed project-page template |
| `writing/editorial-plan.json` | 30-topic roadmap and publication statuses |
| `seo/backlink-outreach-plan.md` | 30 relevant *candidate* websites, not 30 achieved links |
| `seo/backlink-ledger.csv` | Source links with verification state |
| `sitemap.xml` | Twelve canonical indexable URLs |
| `robots.txt` | Crawl instructions and sitemap pointer |
| `CNAME` | Custom-domain binding; **do not delete** |

## Pico — a companion, not a tour guide

**Pico is live as a frontend companion** on all 12 pages: an original red-panda mascot with blinking, animated tail, hover-petting, sleeping, subtle cursor tracking and optional cursor-follow mode. His comments adapt to what a visitor is reading, without interrupting navigation.

- **Conversation:** friendly, role-aware static chat for friends, recruiters, founders and curious visitors. Session chat continues across pages via sessionStorage.
- **Voice:** opt-in speech synthesis, and optional microphone input using browser speech-recognition support. This site does not record audio, although a browser speech-recognition provider may process speech.
- **Music and sounds:** optional original Web Audio tones; voice, music and sound effects are separate opt-in settings.
- **Notes:** explicit consent form. Without a private backend configured, Pico opens a prepared **WhatsApp draft**; the visitor must press Send. No automatic storage or delivery is claimed.
- **Privacy:** static mode uses no third-party chat API. Pico does not embed private memories, tokens or credentials in its public client.

**Optional secure backend** in [pico-service/](pico-service/README.md) supports OpenAI Responses chat, owner-approved memories, Neon PostgreSQL note storage, optional Resend notifications and a private dashboard at the service's /admin URL. It has consent validation, basic rate-limiting and authenticated owner access.

To activate, deploy the Node service separately, configure secrets privately, then set the public `apiBase` in `assets/pico-config.js`. **The private backend is not live just because its code is committed.** Both frontend and backend are covered by GitHub Actions tests.

### Pico project files

| File | Purpose |
|---|---|
| `assets/pico-red-panda.svg` | Original interactive red panda mascot |
| `assets/pico.css` | Responsive mascot, chat and animation styles |
| `assets/pico-widget.html` | Reusable chat, settings and consent form |
| `assets/pico.js` | Behaviour, page awareness, chat, speech and music |
| `assets/pico-config.js` | Public API URL only; never API keys |
| `pico-service/server.mjs` | Optional private AI and message API |
| `pico-service/admin.html` | Owner-only inbox interface |
| `tests/pico-api-smoke.mjs` | Consent, authentication, CORS and fallback tests |

## Ethical authority building

Owner-controlled READMEs in four GitHub repos link back to corresponding project notes. These are **four source URLs on one referring domain**, not four distinct referring websites. The outreach plan identifies 30 distinct sites that may be suitable for legitimate contributions, but none should be counted as a backlink without a verified live link. Do not submit the same content to irrelevant directories, buy artificial links, or automate spam comments.

## Deployment

Commit to `main`; GitHub Pages publishes from `main / (root)`. Check the **Actions** or **Pages** panel to confirm deployment. The custom domain remains `heysuraj.com`.

After new pages appear live, open `https://heysuraj.com/sitemap.xml` and inspect the URLs in Search Console. A sitemap is a discovery aid, not an indexing or ranking guarantee.

### Security and privacy

The repository is public. Do not store API keys, passwords, customer information, confidential reports or unapproved client screenshots. Obtain permission before publishing client-specific results.

© 2026 Suraj Kumar · Build / Think / Prove
