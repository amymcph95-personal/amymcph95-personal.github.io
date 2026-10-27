// Post-build step: renders every route to static HTML so crawlers and AI
// scrapers that don't run JavaScript still get full content, meta tags and
// JSON-LD. Also writes sitemap.xml and llms.txt from the same data.
//
// Pipeline (see package.json "build"): tsc -b && vite build && vite build --ssr ... && node scripts/prerender.mjs
import { mkdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const serverEntry = pathToFileURL(join(root, "dist-server", "entry-server.js")).href;
const { render, getSeo, workToMarkdown, works, SITE_URL, SITE_DESCRIPTION, PERSON, EXPERIENCE, TOOLS, BIO, EMAIL, LINKEDIN_URL, AVAILABILITY } = await import(serverEntry);
const ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

// The source files hard-code a placeholder origin; swap in the real one (VITE_SITE_URL) for the build.
const PLACEHOLDER_ORIGIN = "https://amymcpherson.design";
const withOrigin = (t) => t.split(PLACEHOLDER_ORIGIN).join(SITE_URL);
const template = withOrigin(readFileSync(join(dist, "index.html"), "utf8"));
writeFileSync(join(dist, "robots.txt"), withOrigin(readFileSync(join(dist, "robots.txt"), "utf8")));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function page(url, { is404 = false } = {}) {
  const seo = getSeo(url);
  const app = render(url);
  const head = [
    `<meta property="og:title" content="${esc(seo.title)}" />`,
    `<meta property="og:description" content="${esc(seo.description)}" />`,
    `<meta property="og:url" content="${esc(seo.canonical)}" />`,
    `<meta property="og:image" content="${esc(seo.image.url)}" />`,
    `<meta property="og:image:alt" content="${esc(seo.image.alt)}" />`,
    ...(seo.image.width ? [`<meta property="og:image:width" content="${seo.image.width}" />`, `<meta property="og:image:height" content="${seo.image.height}" />`] : []),
    `<meta name="twitter:image" content="${esc(seo.image.url)}" />`,
    `<meta name="twitter:image:alt" content="${esc(seo.image.alt)}" />`,
    `<meta name="twitter:title" content="${esc(seo.title)}" />`,
    `<meta name="twitter:description" content="${esc(seo.description)}" />`,
    `<meta name="robots" content="${is404 || seo.noindex ? "noindex, follow" : ROBOTS}" />`,
    ...seo.jsonLd.map(
      (d) => `<script type="application/ld+json" data-seo-jsonld="true">${JSON.stringify(d).replace(/</g, "\\u003c")}</script>`
    ),
  ].join("\n    ");

  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`)
    .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${esc(seo.description)}" />`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${esc(seo.canonical)}" />`)
    .replace(/<link rel="alternate" hreflang[^>]*>/, `<link rel="alternate" hreflang="en-AU" href="${esc(seo.canonical)}" />`)
    .replace(/<meta property="og:type"[^>]*>/, `<meta property="og:type" content="${url === "/" ? "website" : "article"}" />`)
    .replace("<!--seo-head-->", head)
    .replace('<div id="root"><!--app-html--></div>', `<div id="root" data-prerendered="true" data-route="${esc(url)}">${app}</div>`);
}

function write(file, html) {
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

write(join(dist, "index.html"), page("/"));
for (const w of works) write(join(dist, "work", w.id, "index.html"), page(`/work/${w.id}`));
write(join(dist, "404.html"), page("/404", { is404: true }));

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const urls = ["/", ...works.map((w) => `/work/${w.id}`)];
writeFileSync(
  join(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
    urls
      .map((u) => {
        const w = works.find((x) => `/work/${x.id}` === u);
        const img = w?.cardImage ? `<image:image><image:loc>${SITE_URL}${w.cardImage.src}</image:loc><image:title>${esc(w.title)}</image:title></image:image>` : "";
        return `  <url><loc>${SITE_URL}${u === "/" ? "/" : u}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>${u === "/" ? "1.0" : "0.8"}</priority>${img}</url>`;
      })
      .join("\n") +
    `\n</urlset>\n`
);

// llms.txt: plain-language summary for AI assistants (https://llmstxt.org)
const availability = `${AVAILABILITY.label} from ${AVAILABILITY.date}`;
const resume = [
  `## Experience`,
  ``,
  ...EXPERIENCE.map((e) => `- ${e.role}, ${e.company} (${e.period})`),
  ``,
  `## Skills and focus`,
  ``,
  ...PERSON.knowsAbout.map((k) => `- ${k}`),
  ``,
  `## Tools`,
  ``,
  TOOLS.join(", "),
  ``,
];
const contact = [
  `## Contact`,
  ``,
  `- Email: ${EMAIL}`,
  `- LinkedIn: ${LINKEDIN_URL}`,
  `- Location: ${PERSON.location}`,
  `- Availability: ${availability}`,
  ``,
];

writeFileSync(
  join(dist, "llms.txt"),
  [
    `# ${PERSON.name}`,
    ``,
    `> ${SITE_DESCRIPTION}`,
    ``,
    BIO,
    ``,
    ...contact,
    ...resume,
    `## Case studies`,
    ``,
    ...works.map((w) => `- [${w.title}](${SITE_URL}/work/${w.id}): ${w.description}`),
    ``,
    `## Optional`,
    ``,
    `- [Full text of every case study](${SITE_URL}/llms-full.txt)`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    ``,
  ].join("\n")
);

// llms-full.txt: the whole portfolio as one markdown document (resume + every case study)
writeFileSync(
  join(dist, "llms-full.txt"),
  [
    `# ${PERSON.name}: ${PERSON.jobTitle}, ${PERSON.location}`,
    ``,
    `Source: ${SITE_URL}/`,
    ``,
    BIO,
    ``,
    ...contact,
    ...resume,
    `# Case studies`,
    ``,
    ...works.map((w) => workToMarkdown(w) + "\n"),
  ].join("\n")
);

rmSync(join(root, "dist-server"), { recursive: true, force: true });
console.log(`Prerendered ${urls.length} pages + 404, sitemap.xml, llms.txt, llms-full.txt`);
