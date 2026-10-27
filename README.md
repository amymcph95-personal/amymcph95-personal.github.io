# Amy McPherson — Portfolio

Product design portfolio built from the Figma file `A6x2GnANjwYRXzeaSxpUca`. Nine case studies at `/work/<slug>`, a physics hero, and a prerendered static build for SEO and AI crawlers.

## Stack

- React 18 + TypeScript, Vite 5
- Tailwind CSS 3
- Framer Motion (reveals, magnetic links, cursor)
- matter-js (hero letter physics)
- react-router-dom 7

## Getting started

```bash
npm install
npm run dev      # dev server (http://localhost:5173)
npm run build    # type-check, client build, SSR build, then prerender every route into dist/
npm run preview  # preview the production build
```

`npm run build` outputs a fully static site into `dist/` (per-route `index.html` with title, description, canonical, Open Graph and JSON-LD, plus `404.html`, `sitemap.xml`, `llms.txt` and `llms-full.txt`). Host it anywhere that serves static files from the root of a domain. Set `VITE_SITE_URL` to your production origin before building; it replaces the placeholder domain in the canonical tags, sitemap, robots.txt and structured data.

### Deploying to GitHub Pages

1. Name the repo `<your-username>.github.io` (or attach a custom domain). A project repo served from `/<repo>/` will not work, because the site uses root-relative URLs.
2. Push to `main`, then in the repo go to Settings → Pages → Source: **GitHub Actions**.
3. `.github/workflows/deploy.yml` builds and publishes on every push. It uses `https://<owner>.github.io` as the site URL; for a custom domain add a repo variable `SITE_URL`.

## Structure

```
src/
  App.tsx                  Routes, skip link, page transitions
  main.tsx / entry-server  Client (hydrates prerendered HTML) and SSR entry
  seo.ts, data/site.ts     Metadata, JSON-LD, site constants
  index.css                Design tokens and the .t-* type system (see header comment)
  data/works.ts            All case studies as ordered blocks, tags and colours
  pages/                   Home, CaseStudy, NotFound
  components/
    Hero.tsx               Gravity-drop headline (click to drop, hover to push)
    WorkGrid / WorkCard    Filters and 3-column project cards
    MoreProjects.tsx       Case-study carousel
    About.tsx, WordDropdown "I'm a ___" menu and timeline
    BrandMarquee, Footer, TopNav, StickyNav, MagneticLink, FigmaCursor, Reveal, TagPill
    blocks/                Case-study blocks (dot points, large image, 50/50, columns, ...)
scripts/prerender.mjs      Static prerender, sitemap and llms.txt / llms-full.txt
```

## Customising

- **Case-study content and images** — edit `src/data/works.ts`. Media (`src` image or looping `video` + `poster`) falls back to a pink placeholder when empty; TypeScript requires `alt` text. Files live in `public/images/work/<slug>/`; homepage cards in `public/images/cards/<slug>.jpg`.
- **Tag colours** — `TAG_COLORS` / `TAG_COLORS_HOVER` in `src/data/works.ts`.
- **Type styles** — `.t-*` classes in `src/index.css`.
- **Links, bio, work history and SEO** — `src/data/site.ts` (also feeds the JSON-LD and llms.txt).

Animations respect `prefers-reduced-motion`.
