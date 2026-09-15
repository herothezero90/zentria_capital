# TGM Invest

Fictional investment brand portfolio concept. The original page layouts and animations are preserved.

Marketing site built with [Astro](https://astro.build), styled with Tailwind CSS v4 (build-time, via the Vite plugin) plus a hand-written stylesheet in `src/styles/global.css`. Content is edited through [Decap CMS](https://decapcms.org) at `/admin`.

## Development

```sh
npm install
npm run dev          # site at http://localhost:4321
```

To edit content through the CMS locally (no Netlify account needed):

```sh
npm run dev          # terminal 1
npm run cms          # terminal 2 (decap-server, local git proxy)
```

Then open <http://localhost:4321/admin/>. Changes made in the CMS are written straight to files in `src/content/` — review them with `git status` and commit yourself.

## Content

| Collection | Where | Shown at |
| --- | --- | --- |
| Insights | `src/content/insights/*.md` | `/insights` and `/insights/<slug>` |
| Selected mandates | `src/content/mandates/*.yaml` | "Selected mandates" marquee on the homepage |

Field definitions live in two places that must stay in sync:
`src/content.config.js` (Astro) and `public/admin/config.yml` (Decap).

## Structure

- `src/pages/` — one file per route (`index.astro`, `contact.astro`, `insights/`)
- `src/layouts/Base.astro` — shared `<head>`, fonts, scripts
- `src/components/` — header/nav, heroes, homepage sections, footer
- `src/styles/global.css` — Tailwind import, design tokens (`@theme`), custom component CSS
- `public/js/` — behaviour (`main.js` animations/nav, `form.js` contact form), vendored anime.js
- `public/admin/` — Decap CMS admin app + config

The two hero concepts (1 = bar chart, 2 = split photo) are both live; the small
1/2 switcher bottom-right is a client review tool persisted in localStorage.
Delete the unused `Hero*.astro`, the switcher markup and related CSS/JS once a
concept is chosen.

## Deploying to Netlify (when ready)

1. Connect the GitHub repo to a Netlify site. Build command `npm run build`, publish directory `dist`.
2. Enable **Identity** and **Git Gateway** on the Netlify site (Site settings → Identity), invite the client as a user.
3. In `public/admin/config.yml`, the `git-gateway` backend then works as-is; update `branch:` to the production branch and remove `local_backend` (or leave it — it only activates when decap-server runs locally).

## Deferred (intentionally not wired up in the demo)

- Contact form does not submit anywhere yet — wire to Netlify Forms (the honeypot field `company_website` is already in the markup, check it server-side/in the Forms settings).
- The "privacy policy" mention in the consent checkbox needs a real page before go-live.
- SEO extras (sitemap, canonical/OG tags) — add `@astrojs/sitemap` and meta tags in `Base.astro` for the production build.
