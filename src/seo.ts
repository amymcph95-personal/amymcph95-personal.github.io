import { getWork, sortedWorks } from "./data/works";
import { BIO, EMAIL, EXPERIENCE, LINKEDIN_URL, OG_IMAGE, PERSON, SITE_DESCRIPTION, SITE_TITLE, SITE_URL, TOOLS } from "./data/site";

export interface SeoData {
  title: string;
  description: string;
  canonical: string;
  /** Absolute social-share image. */
  image: { url: string; alt: string; width?: number; height?: number };
  noindex?: boolean;
  jsonLd: Record<string, unknown>[];
}

const personId = `${SITE_URL}/#person`;

const person = {
  "@type": "Person",
  "@id": personId,
  name: PERSON.name,
  url: SITE_URL,
  jobTitle: PERSON.jobTitle,
  description: BIO,
  image: `${SITE_URL}/images/amy.png`,
  email: `mailto:${EMAIL}`,
  gender: "Female",
  // Current role plus full work history (newest first) so resume parsers and
  // knowledge graphs can reconstruct the career timeline.
  worksFor: {
    "@type": "OrganizationRole",
    roleName: EXPERIENCE[0].role,
    startDate: EXPERIENCE[0].start,
    worksFor: { "@type": "Organization", name: EXPERIENCE[0].company, url: EXPERIENCE[0].url },
  },
  hasOccupation: EXPERIENCE.map((e) => ({
    "@type": "Role",
    roleName: e.role,
    startDate: e.start,
    ...(e.end ? { endDate: e.end } : {}),
    description: `${e.role} at ${e.company}, ${e.period}`,
    memberOf: { "@type": "Organization", name: e.company, ...(e.url ? { url: e.url } : {}) },
  })),
  alumniOf: EXPERIENCE.slice(1).map((e) => ({ "@type": "Organization", name: e.company, ...(e.url ? { url: e.url } : {}) })),
  address: { "@type": "PostalAddress", addressLocality: "Melbourne", addressRegion: "VIC", addressCountry: "AU" },
  knowsAbout: [...PERSON.knowsAbout, ...TOOLS],
  knowsLanguage: "en-AU",
  sameAs: [LINKEDIN_URL],
};

const DEFAULT_IMAGE = { url: `${SITE_URL}${OG_IMAGE.path}`, alt: OG_IMAGE.alt, width: OG_IMAGE.width, height: OG_IMAGE.height };

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: "Amy McPherson, Product Designer at Canva",
  inLanguage: "en-AU",
  publisher: { "@id": personId },
};

export function getSeo(pathname: string): SeoData {
  const path = pathname.replace(/\/+$/, "") || "/";

  if (path === "/") {
    return {
      title: SITE_TITLE,
      description: SITE_DESCRIPTION,
      canonical: `${SITE_URL}/`,
      image: DEFAULT_IMAGE,
      jsonLd: [
        { "@context": "https://schema.org", ...person },
        {
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${SITE_URL}/#profile`,
          url: `${SITE_URL}/`,
          name: SITE_TITLE,
          inLanguage: "en-AU",
          mainEntity: { "@id": personId },
          about: { "@id": personId },
          isPartOf: { "@id": `${SITE_URL}/#website` },
        },
        { "@context": "https://schema.org", ...website },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Product design, digital design and UX/UI case studies by Amy McPherson",
          itemListElement: sortedWorks.map((w, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/work/${w.id}`,
            name: w.title,
          })),
        },
      ],
    };
  }

  const slug = path.startsWith("/work/") ? path.slice("/work/".length) : undefined;
  const work = getWork(slug);
  if (work) {
    const url = `${SITE_URL}/work/${work.id}`;
    const image = work.cardImage
      ? { url: `${SITE_URL}${work.cardImage.src}`, alt: work.cardImage.alt, width: 766, height: 830 }
      : DEFAULT_IMAGE;
    return {
      title: `${work.title}: ${work.tags.join(" & ")} case study | Amy McPherson, Product Designer at Canva`,
      description: work.description,
      canonical: url,
      image,
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": ["CreativeWork", "WebPage"],
          "@id": `${url}#work`,
          name: work.title,
          headline: work.headline,
          description: work.description,
          url,
          creator: { "@id": personId },
          author: { "@id": personId },
          abstract: work.intro.join(" ").replace(/\*\*/g, ""),
          image: image.url,
          thumbnailUrl: image.url,
          mainEntityOfPage: url,
          keywords: [...work.tags, work.company, work.meta.role].join(", "),
          creditText: `Designed by ${PERSON.name}`,
          genre: work.tags,
          about: ["Product design", "Digital design", "UX/UI design", work.company],
          inLanguage: "en-AU",
          isPartOf: { "@id": `${SITE_URL}/#website` },
        },
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Work", item: `${SITE_URL}/#work` },
            { "@type": "ListItem", position: 3, name: work.title, item: url },
          ],
        },
      ],
    };
  }

  return {
    title: "Page not found | Amy McPherson, Product Designer at Canva",
    description: SITE_DESCRIPTION,
    canonical: `${SITE_URL}/`,
    image: DEFAULT_IMAGE,
    noindex: true,
    jsonLd: [],
  };
}

const clean = (t: string) => t.replace(/\*\*/g, "");

/** Plain-text/markdown rendering of a case study, used for llms-full.txt. */
export function workToMarkdown(work: ReturnType<typeof getWork> & object): string {
  const out: string[] = [];
  const m = work.meta;
  out.push(`## ${work.headline}`, "", `URL: ${SITE_URL}/work/${work.id}`);
  out.push(`Company: ${work.company}`, `Disciplines: ${work.tags.join(", ")}`);
  out.push(`Role: ${m.role}${m.team ? ` | Team: ${m.team}` : ""}${m.timeline ? ` | Timeline: ${m.timeline}` : ""}${m.tools ? ` | Tools: ${m.tools}` : ""}${m.businessModel ? ` | Business model: ${m.businessModel}` : ""}`, "");
  work.intro.forEach((p) => out.push(clean(p), ""));
  for (const b of work.blocks) {
    if (b.type === "gallery") continue;
    if (b.type === "columns") {
      b.items.forEach((c) => out.push(`### ${c.title}`, "", ...c.paragraphs.flatMap((p) => [clean(p), ""])));
      continue;
    }
    out.push(`### ${b.heading}`, "");
    if ("intro" in b && b.intro) out.push(clean(b.intro), "");
    if ("paragraphs" in b) b.paragraphs.forEach((p) => out.push(clean(p), ""));
    if ("items" in b) b.items.forEach((i) => out.push(`- ${i.title ? `**${clean(i.title)}**: ` : ""}${clean(i.body)}`));
    if ("items" in b) out.push("");
    if ("bullets" in b && b.bullets) {
      b.bullets.forEach((i) => out.push(typeof i === "string" ? `- ${clean(i)}` : `- ${i.title ? `**${clean(i.title)}**: ` : ""}${clean(i.body)}`));
      out.push("");
    }
  }
  return out.join("\n");
}
