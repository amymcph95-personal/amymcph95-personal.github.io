/** Production origin used for canonical URLs, sitemap, and JSON-LD. Override with VITE_SITE_URL. */
export const SITE_URL: string =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_SITE_URL?.replace(/\/$/, "") ??
  "https://amymcpherson.design";

export const LINKEDIN_URL = "https://www.linkedin.com/in/amy-mcpherson-6662a9131/";
export const EMAIL = "amymcphh@gmail.com";

export const PERSON = {
  name: "Amy McPherson",
  jobTitle: "Product Designer",
  employer: "Canva",
  location: "Melbourne, Australia",
  knowsAbout: [
    "Product design",
    "Digital design",
    "UX/UI design",
    "Design systems",
    "Landing page optimisation",
    "AI product design",
    "Conversion-focused design",
    "B2B SaaS design",
    "Accessibility (WCAG AAA)",
  ],
};

export const SITE_TITLE = "Amy McPherson | Product Designer at Canva — UX/UI, Digital & Product Design";
export const SITE_DESCRIPTION =
  "Amy McPherson is a Product Designer at Canva in Melbourne. Portfolio of product design, digital design and UX/UI case studies: AI landing page tooling, design systems, conversion-focused B2B SaaS design and accessible web design.";

/** Announcement bar shown at the top of every page. */
export const AVAILABILITY = { label: "Available for work", date: "February 1st, 2027" };

/** Default social share image (1200x630). Case studies use their own card image. */
export const OG_IMAGE = { path: "/og-image.png", width: 1200, height: 630, alt: "Amy McPherson, Product Designer at Canva: product, UX/UI and digital design portfolio." };

/** Work history, newest first. Drives the About timeline, JSON-LD and llms.txt. */
export const EXPERIENCE = [
  { role: "Product Designer", company: "Canva", url: "https://www.canva.com", start: "2026", end: null as string | null, period: "2026 — Present" },
  { role: "Senior Digital Designer", company: "Envato", url: "https://www.envato.com", start: "2022", end: "2026", period: "2022 — 2026" },
  { role: "Digital Designer", company: "Officeworks", url: "https://www.officeworks.com.au", start: "2021", end: "2022", period: "2021 — 2022" },
  { role: "Digital Designer", company: "Tennis Australia", url: "https://www.tennis.com.au", start: "2020", end: "2021", period: "2020 — 2021" },
  { role: "Graphic Designer", company: "Studio Yeah", url: undefined as string | undefined, start: "2017", end: "2020", period: "2017 — 2020" },
];

export const TOOLS = ["Figma", "Adobe Creative Cloud", "Cursor", "Claude", "Squarespace", "WordPress"];

export const BIO =
  "Creative product designer with 5+ years across SaaS, in-house teams and studios, specialising in conversion-focused B2B design, design systems and landing pages. Builds the tools she wishes existed, such as QuickPage AI, an AI landing page builder that grew from a Canva hackathon idea into a tool with its own team.";
