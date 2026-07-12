# ArthaOak - Luxury Home & Office Furniture

Production website for **ArthaOak Living Solutions Private Limited** (Est. 2026) - [arthaoak.com](https://arthaoak.com).

A cinematic glassmorphism single-page site: a furniture-studio film runs behind the
whole page under a cream-ivory veil, and every piece of content sits in a frosted
glass frame with bronze rims. Fully animated at every stage.

## Stack

- **React 18 + Vite** (Node.js toolchain, `npm run dev` / `npm run build`)
- **GSAP 3 + ScrollTrigger** (npm) - hero intro, scroll reveals, parallax, popups, scroll rail
- **Instrument Serif + Inter** via Google Fonts
- Background film: Mixkit Free License (free for commercial use, no attribution required)

## Interactions

3D-tilting product cards, magnetic CTAs, scroll-spy navigation, pause-on-hover
tickers, glass video play/pause control, enquiry popups with copy-to-clipboard
toast, अ→O custom scroll rail, cursor-reactive ember particles.

## Project structure

```
├── index.html              # Vite entry (meta, favicons, fonts)
├── style.css               # the whole design system
├── public/                 # favicons, robots.txt, sitemap.xml, webmanifest
└── src/
    ├── main.jsx / App.jsx  # app shell, modal + toast state
    ├── useMotion.js        # GSAP: intro, reveals, parallax, magnetic buttons
    ├── data/products.js    # all 14 collection cards + modal copy
    └── components/         # Nav, Hero, Story, Collection, Contact, Modal, ...
```

## Run locally

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Deploy to Vercel

Import the repo on vercel.com - Vite is auto-detected (build `npm run build`,
output `dist`). No environment variables needed.

---

© 2026 ArthaOak Living Solutions Pvt. Ltd. · All rights reserved.
