# Hey Suraj · Personal Headquarters

**Live domain:** https://heysuraj.com  
**GitHub Pages source:** \`main\` → \`/ (root)\`

A fast, interactive, static-first personal website for Suraj Kumar: professional work, ventures, experiments, writing ideas and building in public.

## HeySuraj 3060

The interface uses a retro-futuristic visual system — but the site is intentionally practical, lightweight and privacy-respecting.

### Shipped features

- Orbital, pointer-responsive hero with animated ambient particle canvas
- Fully responsive dark/light themes
- Animation toggle and reduced-motion accessibility support
- Searchable project universe with category filters and detailed project modals
- Interactive experimentation lab: hypotheses, methods and learnings
- Editorial ideas and preview notes (clearly labelled as **not yet published**)
- Command centre: \`Ctrl/Cmd+K\` to search pages, projects and actions
- Keyboard support including \`/\` for project search and \`Esc\` to close dialogs
- Semantic HTML, focus outlines, dialog focus handling and skip navigation
- SEO metadata, Person JSON-LD, XML sitemap, robots.txt and custom 404
- Custom favicon, manifest, and no login/API/database requirement

### Tech stack

Plain HTML, CSS and JavaScript. No build command. No package manager. No frameworks. No external JavaScript libraries. Google Fonts improves typography but there are robust local font fallbacks. No cookies, third-party analytics, forms or customer data collection are configured.

### Files

| File | Purpose |
| ---- | ------- |
| \`index.html\` | SEO, page structure, accessible markup |
| \`assets/style.css\` | 3060 visual system, animation and responsive layouts |
| \`assets/app.js\` | Project archive, experiment lab, writing library, command centre and interactions |
| \`assets/favicon.svg\` | Brand icon |
| \`site.webmanifest\` | App display metadata |
| \`sitemap.xml\` | Indexing sitemap |
| \`robots.txt\` | Search crawler guidance |
| \`404.html\` | Custom not-found page |
| \`CNAME\` | Production domain binding — **do not delete** |

### Updating content

- Edit \`PROJECTS\`, \`LAB\`, and \`WRITING\` in \`assets/app.js\`.
- Edit headline, professional story, experience and contact links in \`index.html\`.
- Edit visual tokens at the top of \`assets/style.css\`.
- After any content changes, commit to \`main\`; GitHub Pages should redeploy automatically.

### Publishing

GitHub repository → **Settings → Pages** → Source: **Deploy from a branch** → Branch: **main / (root)**. Custom domain: **heysuraj.com**.

Hostinger DNS points to GitHub Pages via the four official apex A records and a \`www\` CNAME. Keep those DNS records and \`CNAME\` intact. Enable **Enforce HTTPS** when the GitHub certificate is ready.

### Editorial safeguards

- An experiment, concept, historical venture, professional practice area and working SaaS are not equivalent; labels should remain accurate.
- Do not publish employer-confidential details, sensitive customer information, unapproved client screenshots or invented results.
- Detailed client case studies should be added only with permission and verified supporting evidence.
- Never hardcode secrets or API keys in this public repository.

### Next recommended improvements

Add a verified professional contact method and social URLs; publish original case studies and articles; replace the abstract monogram with a real professional photo where it suits your brand; set up Search Console when ready.

© Suraj Kumar — designed for the future, built in the present.
