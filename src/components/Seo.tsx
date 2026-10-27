import { useEffect } from "react";
import { getSeo } from "../seo";

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Keeps <head> in sync on client-side navigation. The same data (`getSeo`) is
 * baked into every page's static HTML by scripts/prerender.mjs, so crawlers that
 * don't run JavaScript see identical tags.
 */
export default function Seo({ path, notFound }: { path: string; notFound?: boolean }) {
  useEffect(() => {
    const seo = getSeo(path);
    document.title = seo.title;
    setMeta("name", "description", seo.description);
    setMeta("name", "robots", notFound || seo.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    setMeta("property", "og:title", seo.title);
    setMeta("property", "og:description", seo.description);
    setMeta("property", "og:url", seo.canonical);
    setMeta("property", "og:type", path === "/" ? "website" : "article");
    setMeta("property", "og:image", seo.image.url);
    setMeta("property", "og:image:alt", seo.image.alt);
    if (seo.image.width) setMeta("property", "og:image:width", String(seo.image.width));
    if (seo.image.height) setMeta("property", "og:image:height", String(seo.image.height));
    setMeta("name", "twitter:image", seo.image.url);
    setMeta("name", "twitter:image:alt", seo.image.alt);
    setMeta("name", "twitter:title", seo.title);
    setMeta("name", "twitter:description", seo.description);

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = seo.canonical;

    document.head.querySelectorAll("script[data-seo-jsonld]").forEach((n) => n.remove());
    seo.jsonLd.forEach((data) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.dataset.seoJsonld = "true";
      s.text = JSON.stringify(data);
      document.head.appendChild(s);
    });
  }, [path, notFound]);

  return null;
}
