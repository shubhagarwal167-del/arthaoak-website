# ArthaOak — Luxury Home & Office Furniture

Production website for **ArthaOak Living Solutions Private Limited** (Est. 2026) — [arthaoak.com](https://arthaoak.com).

A fully animated, single-page static site: cream-ivory retro-modernist design with metallic gold accents, WebGL fluid background, ember particles, scroll-driven motion and popup enquiry modals.

## Stack

- **HTML / CSS / vanilla JavaScript** — no build step, no framework
- **GSAP 3 + ScrollTrigger** (CDN) — reveals, parallax, popups, scroll rail
- **Three.js** (CDN) — domain-warped simplex-noise fluid background with cursor-reactive glow
- **Playfair Display / Crimson Pro / Archivo Black** via Google Fonts

## Project structure

```
├── index.html              # the entire site (single page)
├── style.css               # design system + responsive rules
├── script.js               # WebGL, particles, GSAP motion, modals
├── founder.jpg             # founder portrait
├── favicon.ico             # + favicon-16/32, apple-touch-icon,
├── android-chrome-*.png    #   android icons
├── site.webmanifest        # PWA metadata
├── robots.txt / sitemap.xml
└── vercel.json             # security headers + clean URLs
```

## Run locally

Open `index.html` directly in a browser, or serve it:

```bash
npm run dev
# → http://localhost:4173
```

(Requires internet — GSAP/Three.js/fonts load from CDN.)

## Deploy to Vercel

1. Push this repository to GitHub.
2. On [vercel.com](https://vercel.com) → **Add New → Project** → import this repo.
3. Framework preset: **Other**. No build command, no output directory — accept defaults and **Deploy**.
4. Add the custom domain **arthaoak.com** under *Project → Settings → Domains*.

There are no npm dependencies to install — the site is served exactly as committed.

---

© 2026 ArthaOak Living Solutions Pvt. Ltd. · All rights reserved.
