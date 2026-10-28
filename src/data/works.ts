// ─────────────────────────────────────────────────────────────────────────────
// Portfolio content. Every case study is an ordered list of `blocks` that map
// 1:1 onto the Figma component kit (Dot points, Paragraph, Large image, 50.50,
// Columns, Img-Module, Gallery). Images are intentionally blank for now: add a
// `src` to any `Media` entry (or `heroImages`) and it will render automatically.
// ─────────────────────────────────────────────────────────────────────────────

export type WorkTag = "UX/UI" | "Product Design" | "Visual Design";

/** Pill background for each tag (Figma "Tags" component). */
export const TAG_COLORS: Record<WorkTag, string> = {
  "UX/UI": "#FFF5BE",
  "Product Design": "#DEF5F3",
  "Visual Design": "#FFE7F6",
};

/** Darker pill shade shown while a card is hovered (keeps contrast against the hovered card bg). */
export const TAG_COLORS_HOVER: Record<WorkTag, string> = {
  "UX/UI": "#FFE978",
  "Product Design": "#B5E6E1",
  "Visual Design": "#FFC4E6",
};

/** Image slot shapes from the Figma "Image Sizes" component. */
export type MediaRatio = "16:9" | "narrow" | "1:1" | "9:16";

/**
 * Media slot. With no `src`/`video` it shows the pink placeholder. An image
 * (`src`) or looping silent video (`video`, with an optional `poster`) must
 * come with meaningful `alt` text (use `alt: ""` only for purely decorative images).
 */
export type Media = { ratio: MediaRatio } & (
  | { src?: undefined; video?: undefined; poster?: undefined; alt?: string }
  | { src: string; video?: undefined; poster?: undefined; alt: string }
  | { video: string; poster?: string; src?: undefined; alt: string }
);

export interface Bullet {
  /** Bold lead-in. When omitted the bullet renders as plain body copy. */
  title?: string;
  body: string;
}

export type Block =
  /** "Dot points": heading (+ optional intro) on the left, bullets on the right. */
  | { type: "dotPoints"; heading: string; intro?: string; items: Bullet[]; media?: Media[] }
  /** "Paragraph": heading on the left, copy on the right, optional image below. */
  | { type: "paragraph"; heading: string; paragraphs: string[]; media?: Media[] }
  /** "Large image": text on one side, a 16:9 image on the other. */
  | { type: "largeImage"; heading: string; intro?: string; items: Bullet[]; side?: "left" | "right"; media?: Media }
  /** "50.50": half text, half image. */
  | { type: "split"; heading: string; paragraphs: string[]; bullets?: string[]; side?: "left" | "right"; media?: Media }
  /** "Columns": outlined cards. */
  | { type: "columns"; items: { title: string; paragraphs: string[] }[] }
  /** "Img-Module": heading + copy, optional badge, then a wide image. */
  | {
      type: "imgModule";
      heading: string;
      paragraphs: string[];
      badge?: string;
      /** Makes the badge a link (opens in a new tab), e.g. a Figma prototype. */
      badgeHref?: string;
      /** Link pills (open in a new tab) shown in place of the badge, with their own colours. */
      links?: { label: string; href: string; bg: string; hoverBg: string }[];
      media: Media;
      bullets?: Bullet[];
    }
  /** "Gallery": a stack of full-width images. */
  | { type: "gallery"; media: Media[] };

export interface ProjectMeta {
  role: string;
  team?: string;
  timeline?: string;
  tools?: string;
  businessModel?: string;
}

export interface Work {
  /** URL slug: /work/<id>. Matches the project name. */
  id: string;
  /** Card / breadcrumb title. */
  title: string;
  /** Large H1 on the case-study page. */
  headline: string;
  /** Small uppercase eyebrow above the headline. */
  company: string;
  /** Sort priority: Canva first, then Envato, then the rest. */
  group: "canva" | "envato" | "other";
  tags: WorkTag[];
  /** SEO meta description + OG description. */
  description: string;
  /** Intro paragraphs under the headline. */
  intro: string[];
  meta: ProjectMeta;
  /** One entry per hero image slot (two entries = side-by-side hero). */
  heroImages: Media[];
  blocks: Block[];
  /** Homepage / “More projects” card image (square, 1:1). */
  cardImage?: { src: string; alt: string };
  year?: string;
}

const baseWorks: Work[] = [
  // ───────────────────────────── CANVA ─────────────────────────────
  {
    id: "canva-quickpage-ai",
    title: "Canva QuickPage AI",
    headline: "Canva QuickPage AI",
    company: "Canva",
    group: "canva",
    tags: ["Product Design"],
    description:
      "Case study: how Amy McPherson, Product Designer at Canva, took QuickPage AI (QPAI) from a hackathon idea to an AI landing page builder with its own team, turning a brief into a buildable page in minutes.",
    intro: [
      "What if marketers could turn a brief into a real landing page in minutes, without waiting for a designer?",
      "That’s the question behind QuickPage AI (QPAI). It’s an internal AI tool I created and campaigned for on my own during a Canva hackathon. It has since grown into a real tool with its own dedicated team, and a wider rollout is planned later this year.",
    ],
    meta: {
      role: "Product Designer",
      team: "Marketing Technology",
      timeline: "1 Month",
      tools: "Cursor, Claude, Figma, Internal prototype hosting",
      businessModel: "SaaS/Tech",
    },
    heroImages: [
      {
        ratio: "narrow",
        src: "/images/work/canva-quickpage-ai/hero.jpg",
        alt: "The QuickPage AI brief upload screen beside the generated landing page in the editor, surrounded by Canva’s googly-eyed characters.",
      },
    ],
    blocks: [
      {
        type: "dotPoints",
        heading: "Context",
        items: [
          {
            title: "What are QuickPages?",
            body: "Canva’s system for building landing pages on canva.com from pre-made sections, with brand, accessibility, localisation and analytics already built in. It’s meant to be self-serve, but most marketers don’t know where to start without a designer.",
          },
          {
            title: "Why landing pages matter at Canva.",
            body: "Marketing launches pages all year round, in many languages, and every page has to meet the same brand, accessibility and legal standards. That’s a lot of work to produce a single landing page.",
          },
        ],
      },
      {
        type: "dotPoints",
        heading: "The Challenge",
        items: [
          {
            title: "Pain point observations",
            body: "I used QuickPages every day and kept seeing marketers get stuck. Some were working from outdated designs. Others had a great brief but no way to make it buildable, so they waited in the design backlog.",
          },
          {
            title: "Canva’s current landing page workflow",
            body: "A single page took 4 to 8 weeks and 6+ handoffs to ship. Leadership was asking why teams couldn’t just vibe code pages, but vibe-coded pages skip the brand, accessibility, security and legal checks QuickPages already handles.",
          },
          {
            title: "How might we...",
            body: "Help a marketer with no design support turn a brief into a page that's ready to build, without lowering the standards every Canva page has to meet?",
          },
        ],
      },
      {
        type: "split",
        heading: "How it started",
        side: "left",
        paragraphs: [
          "Canva’s hackathon week is time set aside to explore AI tools. I used it to vibe code QuickPage components in Cursor, with the real options and limits from the design system, as a reusable prototyping template.",
          "Once they existed, I got curious. If an LLM had these components, plus Canva’s own guidance on product messaging, tone of voice, content design and landing page strategy, could it draft a page from a brief?",
          "I tried it with a real brief, and it produced a full landing page in under 10 minutes.",
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/canva-quickpage-ai/started.jpg",
          alt: "The QuickPage AI home screen, where a marketer drops in a brief or asks for help writing one.",
        },
      },
      {
        type: "split",
        heading: "How it grew",
        side: "right",
        paragraphs: [
          "I shared it with designers and marketers, then leadership. Marketers without design support were especially excited, because it gave them a starting point they’d never had. Leadership saw a much faster path from request to live page.",
          "Around the same time, an engineer I’d worked with had built an MCP that could publish pages in the CMS. Mine went from brief to design, and his went from design to CMS, so we joined forces.",
          "With backing from Marketing Technology leadership, a tiger team formed to build an MVP to test and launch.",
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/canva-quickpage-ai/grew.jpg",
          alt: "The QuickPages Design Kit prototype playground, listing section components by category: Hero, General, Carousels & Grids, Social proof, Footer & FAQ and Global Nav/Footer.",
        },
      },
      {
        type: "paragraph",
        heading: "The Solution",
        paragraphs: [
          "One tool that takes a marketer from brief to a built, editable page. They upload a brief or create one with AI help. QPAI then generates a page using only supported QuickPage components, with copy in Canva’s voice.",
          "From there, marketers edit the page, swap components, check accessibility and share it for feedback. Once it’s approved, the page exports as structured data that a Content Admin imports straight into the CMS.",
        ],
        media: [
          {
            ratio: "16:9",
            src: "/images/work/canva-quickpage-ai/solution.jpg",
            alt: "The QuickPage AI editor showing a generated landing page, with a side panel to edit each section’s preheader, heading, body copy and calls to action.",
          },
        ],
      },
      {
        type: "dotPoints",
        heading: "Design decisions",
        items: [
          {
            title: "Buildable over flexible",
            body: "The AI only uses what QuickPages supports, from section guidance to copy limits and tone of voice. Every section maps to a real component, so anything designed can be built.",
          },
          {
            title: "People approve what ships",
            body: "The AI does the first draft, but marketers, designers and content strategists review anything with brand, legal or quality risk. Teams without a designer can get started, while specialists still sign off.",
          },
          {
            title: "Error prevention",
            body: "Checks for copy limits, accessibility and component rules run while marketers work, so issues are caught early instead of at build.",
          },
          {
            title: "Structured handover to the CMS",
            body: "QPAI exports each section’s component, copy and image fields in order, so Content Admins no longer retype designs. This is a big part of our goal to halve brief-to-live time.",
          },
        ],
      },
      {
        type: "paragraph",
        heading: "User testing the beta MVP",
        paragraphs: [
          "We tested the MVP in two ways. Our Customer Zero, the first team to use it on real work, took a live campaign page from brief to published. We also ran 7 moderated sessions with 5 marketers and 2 designers.",
        ],
      },
      {
        type: "columns",
        items: [
          {
            title: "What worked",
            paragraphs: [
              "Marketers loved how quickly they could go from a brief to a full draft. As one put it, “Wow. Oh wait, that’s amazing. I basically made a page.”",
              "Uploading a brief felt natural, and features like page duplication and accessibility checks helped people move quickly and confidently. Our Customer Zero marketer went on to build several pages on her own.",
            ],
          },
          {
            title: "What didn't",
            paragraphs: [
              "The feedback gave us a clear to-do list. Marketers wanted the AI to stick more closely to their brief, easier ways to share and collaborate, and editing that feels safer and more intuitive. These were now our top priorities.",
            ],
          },
        ],
      },
      {
        type: "imgModule",
        heading: "The Outcome",
        paragraphs: [
          "In 4 weeks, QPAI went from a hackathon idea to an MVP. Marketers get a buildable, editable landing page in minutes to review with their stakeholders, and Customer Zero proved it works on a real Canva campaign.",
          "There’s more to come. Next, we’re moving QPAI to internal hosting with accounts and sync, then running a second beta round before a wider rollout later this year.",
          "This is an internal tool, so I can’t share a prototype link. Give me a shout for a demo!",
        ],
        media: {
          ratio: "16:9",
          video: "/images/work/canva-quickpage-ai/outcome.mp4",
          poster: "/images/work/canva-quickpage-ai/outcome.jpg",
          alt: "Screen recording of QuickPage AI turning a brief into an editable landing page.",
        },
      },
      {
        type: "paragraph",
        heading: "Reflection",
        paragraphs: [
          "This is the project I’m proudest of. I spotted a problem in a workflow I used every day, used hackathon week to test an idea, and built something teams found valuable. That momentum caught leadership’s attention, and a team of designers, engineers and a product manager came together to make it real.",
        ],
      },
    ],
  },
  {
    id: "canva-higher-education",
    title: "Higher Education at Canva",
    headline: "Higher Education at Canva",
    company: "Canva",
    group: "canva",
    tags: ["Visual Design", "Product Design"],
    description:
      "Case study: how Amy McPherson, Product Designer at Canva, redesigned the Canva for Higher Education landing page for buyers and created a new Faculty page, improving lead quality for Sales.",
    intro: [
      "Universities buy Canva for Higher Education to give their whole campus access. The people who make that call usually work in IT, marketing or administration. But most visitors to the Higher Education page, about 60%, were actually faculty and students who don’t make the purchase. I redesigned the page to keep buyers on it, and created a new Faculty page so faculty had a home of their own.",
    ],
    meta: {
      role: "Product Designer",
      team: "Marketing Technology",
      timeline: "1 month",
      tools: "Figma, UserTesting",
      businessModel: "SaaS/Tech",
    },
    heroImages: [
      {
        ratio: "narrow",
        src: "/images/work/canva-higher-education/hero.jpg",
        alt: "The redesigned Canva for Higher Education page and the new Faculty page.",
      },
    ],
    blocks: [
      {
        type: "dotPoints",
        heading: "The Challenge",
        items: [
          { title: "Sending buyers away at peak intent", body: "The Contact Sales button took buyers to a separate page, right when they were ready to get in touch." },
          { title: "Nowhere for faculty to go", body: "Students had their own page, but faculty didn’t. They either left or filled in a sales form that wasn’t meant for them." },
          { title: "Mostly non-buyers", body: "About 60% of identified traffic was non-buyers, and the Student page was only mentioned in an unlinked line in the FAQ." },
          { title: "Relevance that took too long to land", body: "49% of visits didn’t scroll at all and 57% bounced. There was nothing aimed at specific buyers like IT or Marketing." },
        ],
      },
      {
        type: "dotPoints",
        heading: "The Solution",
        intro: "Two pages that work together: a Higher Education page for buyers, and a new Faculty page for faculty.",
        items: [
          { title: "Re-routing above the fold", body: "A module right at the top points faculty and students to their own pages." },
          { title: "A brand new page for faculty", body: "Students already had a page, and now faculty have one too." },
          { title: "Contacting sales is even easier", body: "The primary CTA is a jump link to an embedded form, so users aren’t redirected off the page." },
          { title: "Messages for each buyer persona", body: "Tabs for IT, Marketing, and Student & Academic Affairs, each with its own reasons to choose Canva." },
        ],
      },
      {
        type: "largeImage",
        heading: "The Benefits",
        side: "right",
        items: [
          { title: "Better leads for Sales", body: "Fewer non-buyers should reach the form, so Sales can focus on institutions ready to buy." },
          { title: "A page for every audience", body: "Faculty and students find content made just for them, instead of bouncing." },
          { title: "Less drop-off at peak intent", body: "Buyers can reach out without leaving the page that convinced them." },
          { title: "Faster relevance", body: "Each buyer finds what matters to them in one click." },
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/canva-higher-education/benefits.jpg",
          alt: "The original Canva for Higher Education page beside the redesigned page with its student and faculty re-routing module.",
        },
      },
      {
        type: "dotPoints",
        heading: "Design decisions",
        items: [
          {
            title: "Changing what success meant",
            body: "The original ask was more submissions, but the data showed the real issue was who was submitting. I proposed measuring lead quality instead, and agreed with stakeholders up front that fewer submissions could be a good result.",
          },
          {
            title: "Questioning the data",
            body: "Analytics showed Enterprise visitors at about 1% of traffic. That’s likely too low, because a university IT manager wouldn’t call themselves “Enterprise”. So we measure the drop in non-buyers instead, which we can track reliably.",
          },
        ],
      },
      {
        type: "split",
        heading: "User testing",
        side: "left",
        paragraphs: ["I ran an unmoderated usability test with the hifi designs with 5 participants:"],
        bullets: [
          "All 5 understood who the page was for on first read",
          "Participants went straight to the tab that matched their role",
          "Buyers recognised the page was for them and not faculty or students",
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/canva-higher-education/user-testing.jpg",
          alt: "The tested designs: the Higher Education and Faculty pages on desktop and mobile.",
        },
      },
      {
        type: "dotPoints",
        heading: "Experimentation",
        intro: "The redesign is being A/B tested 50/50 against the original page across English-speaking markets.",
        items: [
          { title: "What we’re measuring", body: "Lead quality (MQLs) and Contact Sales submissions, with the qualified submission rate as a guardrail." },
          { title: "Questioning the data", body: "The original sent buyers to a separate form, while the redesign uses an embedded one, so we track the two separately for a fair comparison." },
        ],
      },
      {
        type: "imgModule",
        heading: "The Outcome",
        paragraphs: [
          "Both pages are live, and the A/B test is in progress. A big part of this project was deciding who the page wasn’t for, and making sure those visitors had somewhere better to go.",
        ],
        links: [
          { label: "Higher Education LP", href: "https://www.canva.com/higher-education/", bg: "#FEEDED", hoverBg: "#FBD3D3" },
          { label: "Faculty LP", href: "https://www.canva.com/higher-education/faculty/", bg: "#FFE5DE", hoverBg: "#FFCCBF" },
        ],
        media: {
          ratio: "16:9",
          video: "/images/work/canva-higher-education/outcome.mp4",
          poster: "/images/work/canva-higher-education/outcome.jpg",
          alt: "Screen recording of the redesigned Higher Education page, from the audience re-routing module to the embedded contact form.",
        },
      },
    ],
  },
  {
    id: "canva-ai-vision",
    title: "Canva AI Vision",
    headline: "Canva AI Vision",
    company: "Canva",
    group: "canva",
    tags: ["Visual Design", "Product Design"],
    description:
      "Case study: how Amy McPherson, Product Designer at Canva, designed and iterated the AI Vision On Demand page across the New York, Sydney and London events, turning one gated video into a library of sessions that also captures business leads.",
    intro: [
      "AI Vision is Canva’s event series about AI, held in New York, Sydney and London in 2026. After each event, the session recordings go on an On Demand page. Visitors fill in a short form to watch them, and the form also collects business leads for Canva. I designed that page and changed it after each event, using what we saw in New York to improve Sydney and London.",
    ],
    meta: {
      role: "Product Designer",
      team: "Marketing Technology",
      timeline: "1 month each",
      tools: "Figma, Looker",
      businessModel: "SaaS/Tech",
    },
    heroImages: [
      {
        ratio: "narrow",
        src: "/images/work/canva-ai-vision/hero.jpg",
        alt: "The AI Vision speaker on stage in a green jacket, surrounded by floating images of a cloud penguin, bubbles, a purple fabric and a blue sky.",
      },
    ],
    blocks: [
      {
        type: "dotPoints",
        heading: "The Challenge",
        intro:
          "An event lasts a day, but the recordings can be watched for months. The On Demand page has to keep people’s attention after the event ends, and collect business leads at the same time.",
        items: [
          { title: "Visitors left before reaching the recordings", body: "Most traffic came from a post-event email, so people already knew about AI Vision. Still, 79% didn’t scroll, 54% left within 5 seconds, and only 3% got past the form to a session." },
          { title: "The next step was unclear", body: "The page promoted events that had already closed registration, and the Watch page offered a single video." },
          { title: "Three cities, a changing brief", body: "Each event brought new speakers, sponsors and requests." },
        ],
      },
      {
        type: "dotPoints",
        heading: "The Solution",
        intro: "I treated the page as one system and improved it after each event.",
        items: [
          { title: "Trust and next steps up front", body: "Partner logos moved above the speakers, and a bar at the top links to tickets for the next AI Vision. It replaced a banner at the bottom that got 0.23% of clicks." },
          { title: "A library, not one video", body: "The Watch page lists every session, with tabs for past AI Vision events, so visitors have more to watch." },
          { title: "Built from swappable sections", body: "Speakers, logos, colours and sessions change for each city. A new sponsor section and short interest form fitted in without a redesign." },
        ],
      },
      {
        type: "largeImage",
        heading: "The Approach",
        items: [
          { title: "New York, March 2026", body: "We launched with a gated page, a Watch page with one recording and an interest form. Afterwards I audited it. 84% of traffic came from email, and 97% of Watch page clicks went to the one video." },
          { title: "Sydney, August 2026", body: "I applied those findings. Logos moved up, a promo bar replaced the interest banner, and I removed the outdated interest form. I also added a sponsor section and turned the single video into a grid of sessions." },
          { title: "London, September 2026", body: "The same system with new speakers, sponsors and colours, and tabs for every past AI Vision." },
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/canva-ai-vision/approach.jpg",
          alt: "The AI Vision On Demand pages for New York, Sydney and London side by side, each with new speakers, sponsors and colours.",
        },
      },
      {
        type: "imgModule",
        heading: "The Outcome",
        paragraphs: [
          "The On Demand page grew from one video into a library of sessions across three events. Each version used what we learned from the one before. The events went well too, and Sydney sold out.",
        ],
        badge: "Prototype",
        badgeHref:
          "https://www.figma.com/proto/tvmn1V3WZ77naFLkwQMhys/Canva-Files?node-id=7-26090&viewport=476%2C-811%2C0.25&t=N5JSHoPxUFUvk1wJ-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=7%3A26090&page-id=0%3A1",
        media: {
          ratio: "16:9",
          video: "/images/work/canva-ai-vision/outcome.mp4",
          poster: "/images/work/canva-ai-vision/outcome.jpg",
          alt: "Screen recording scrolling through the finished AI Vision On Demand page.",
        },
      },
    ],
  },
  {
    id: "canva-contact-sales",
    title: "Contacting Sales at Canva",
    headline: "Contacting Sales at Canva",
    company: "Canva",
    group: "canva",
    tags: ["Product Design"],
    description:
      "Case study: how Amy McPherson, Product Designer at Canva, redesigned the Contact Sales form as a two-step flow, driving a statistically significant +6.3% lift in submissions without hurting lead quality.",
    intro: [
      "When a company wants Canva for its whole team, its first step is the Contact Sales form. In B2B, this is where interest turns into pipeline. The best submissions become marketing qualified leads (MQLs) for the sales team. My goal was to make getting in touch easier for genuine buyers, without letting lead quality slip.",
    ],
    meta: {
      role: "Product Designer",
      team: "Marketing Technology",
      timeline: "1 Month",
      tools: "Figma, Cursor",
      businessModel: "SaaS/Tech",
    },
    heroImages: [
      {
        ratio: "narrow",
        src: "/images/work/canva-contact-sales/hero.jpg",
        alt: "The first step of the redesigned two-step Contact Sales form.",
      },
    ],
    blocks: [
      {
        type: "dotPoints",
        heading: "The Challenge",
        intro:
          "This form is the last step before a buyer talks to Sales, and too many were giving up. The fix had to balance two goals that often pull against each other in B2B: an easier form, and high-quality leads.",
        items: [
          { title: "Losing buyers at peak intent", body: "These visitors are close to buying, yet only around 4% of pageviews became a submission." },
          { title: "Friction before value", body: "All 11 fields appeared at once, and on smaller screens the submit button was hidden below the fold." },
          { title: "Asking for what we already knew", body: "Logged-in users had to retype details Canva already had." },
          { title: "Volume that wasn't pipeline", body: "Personal email addresses were reaching Sales, adding noise and slowing follow-up on real opportunities." },
        ],
      },
      {
        type: "dotPoints",
        heading: "The Solution",
        items: [
          { body: "I split the form into two short steps, with the easy questions first." },
          { title: "Step 1", body: "Name, company email and enquiry type, which is what Sales needs to route a lead. Logged-in users get their name and email prefilled, so they only answer one question." },
          { title: "Step 2", body: "Company details, role, an optional phone number and “How can we help?”" },
          { body: "I also changed the email helper text to “Enter your company email” to nudge people towards work addresses." },
        ],
        media: [
          {
            ratio: "16:9",
            src: "/images/work/canva-contact-sales/solution.jpg",
            alt: "The two-step Contact Sales form: Step 1 asks for name, company email and enquiry type; Step 2 asks for company details, role, phone and how Canva can help.",
          },
        ],
      },
      {
        type: "largeImage",
        heading: "Design decisions and impact",
        side: "right",
        items: [
          { title: "Putting the hardest question last", body: "“How can we help?” takes the most thought, so it moved to Step 2, once people have already started. More people finish, and Sales still gets the context it needs." },
          { title: "Prefilled, but editable", body: "A Canva login isn’t always someone’s work identity, so every prefilled field can be changed. People save time, and lead data stays accurate." },
          { title: "Protecting lead quality", body: "We tracked submission-to-MQL and MQL-to-opportunity rates, work email usage, step drop-off and mobile completion. That way, more submissions wouldn’t come at the cost of pipeline quality." },
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/canva-contact-sales/design-impact.jpg",
          alt: "The old Contact Sales page beside the redesigned page with the shorter two-step form.",
        },
      },
      {
        type: "columns",
        items: [
          {
            title: "Hypothesis",
            paragraphs: [
              "If we split the form into two shorter steps and prefill known fields, more buyers will submit it, because there's less effort and less repetition, while MQL quality holds.",
            ],
          },
          {
            title: "Success criteria",
            paragraphs: [
              "A 3 to 5% increase in conversion or submissions, with no drop in submission-to-MQL or MQL-to-opportunity rates. I worked with Data Science on the test plan, and the form was translated into 31 locales.",
            ],
          },
        ],
      },
      {
        type: "imgModule",
        heading: "The Outcome",
        paragraphs: [
          "We A/B tested the two-step form against the original, and it delivered a statistically significant **+6.3%** increase in Contact Sales submissions. It’s now live for 100% of users.",
          "That means more buyers are reaching Sales from the same traffic, through a form that asks for less up front.",
        ],
        badge: "Prototype",
        badgeHref:
          "https://www.figma.com/proto/tvmn1V3WZ77naFLkwQMhys/Canva-Files?node-id=27-20782&viewport=-2856%2C21%2C0.26&t=ZzOM5HHiwHnz06d1-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=27%3A20782&page-id=2%3A2449",
        media: {
          ratio: "16:9",
          video: "/images/work/canva-contact-sales/outcome.mp4",
          poster: "/images/work/canva-contact-sales/outcome.jpg",
          alt: "Screen recording of the two-step Contact Sales form being completed.",
        },
      },
    ],
  },

  // ───────────────────────────── ENVATO ─────────────────────────────
  {
    id: "envato-x-adobe-express",
    title: "Envato x Adobe Express",
    headline: "Envato x Adobe Express",
    company: "Envato",
    group: "envato",
    tags: ["Visual Design", "Product Design"],
    description:
      "Case study: how Amy McPherson, Senior Digital Designer at Envato, designed the Envato x Adobe Express competition landing page that explained the rules and drove strong entries.",
    intro: [
      "When Envato teamed up with Adobe Express, they launched a competition. Envato users could create designs with the Adobe Express plugin for a chance to win prizes. I designed the landing page that explained how it worked and got people excited to enter.",
      "The result? A dynamic, user-friendly landing page that effectively captured the collaborative spirit of two industry-leading platforms while driving strong competition engagement.",
    ],
    meta: {
      role: "Digital Designer",
      team: "Creative team",
      timeline: "3 weeks",
      tools: "Figma, WordPress",
      businessModel: "SaaS/Tech",
    },
    heroImages: [
      {
        ratio: "narrow",
        src: "/images/work/envato-x-adobe-express/hero.jpg",
        alt: "The top of the Envato x Adobe Express competition page: a black hero with colourful shapes and the “Reimagine” headline.",
      },
    ],
    blocks: [
      {
        type: "dotPoints",
        heading: "The Challenge",
        intro:
          "The page needed to explain the competition clearly and make people want to jump in. Every detail, from layout to visuals, was designed to keep people engaged.",
        items: [
          { title: "Informative yet inspiring", body: "Explain the rules while building excitement for the Adobe Express integration." },
          { title: "Brand consistency", body: "Feel unmistakably Envato, with a fresh competition twist." },
          { title: "Easy navigation", body: "To present clear competition details without overwhelming users, ensuring easy navigation" },
        ],
      },
      {
        type: "largeImage",
        heading: "The Approach",
        side: "right",
        items: [
          { title: "Heatmaps", body: "I looked at heatmaps from past campaigns to see what people actually engaged with, and used that to shape the wireframes." },
          { title: "Collaboration", body: "Partnered with brand designers to craft campaign assets that stayed true to Envato's identity" },
          { title: "Stakeholders", body: "I aligned with product stakeholders on the key messages, and on how the page fitted with Envato’s site and the Adobe promotion." },
          { title: "Developers", body: "I worked closely with developers for a smooth handover." },
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/envato-x-adobe-express/approach.jpg",
          alt: "Greyscale wireframes of the competition page on desktop and mobile, with a hero, intro, “How to enter” steps and prize sections.",
        },
      },
      {
        type: "imgModule",
        heading: "The Outcome",
        paragraphs: [
          "A high-converting page that increased competition entries and platform engagement. Clear rules and judging criteria made entering easy, and the assets were reused across social and marketing.",
        ],
        badge: "Prototype",
        badgeHref:
          "https://www.figma.com/proto/h6e3V6LhtOYyLZbyIiqgk3/Adobe-x-Envato-LP?page-id=0%3A1&node-id=5-3244&viewport=1163%2C1526%2C0.36&t=l2VJogO8Cw7J6s0e-1&scaling=contain&content-scaling=responsive",
        media: {
          ratio: "16:9",
          video: "/images/work/envato-x-adobe-express/outcome.mp4",
          poster: "/images/work/envato-x-adobe-express/outcome.jpg",
          alt: "Screen recording scrolling through the finished Envato x Adobe Express “Reimagine to Win” competition page.",
        },
      },
    ],
  },

  // ───────────────────────────── OTHER ─────────────────────────────
  {
    id: "play-tennis",
    title: "Play Tennis",
    headline: "Play Tennis",
    company: "Tennis Australia",
    group: "other",
    tags: ["Visual Design", "Product Design"],
    description:
      "Case study: how Amy McPherson redesigned the Play Tennis website for Tennis Australia and built an AAA-accessible design system with playful animated assets.",
    intro: [
      "Play Tennis had a fresh new brand, and its website needed to catch up. I redesigned the site from the ground up and built a new design system to match. That covered colour, type and imagery, all while keeping it AAA accessible so everyone could use it.",
      "During the rebrand process, I was also able to create a number of digital assets with fun tennis-y animations for launch.",
    ],
    meta: {
      role: "Product Designer",
      team: "Web Experience",
      timeline: "6 weeks",
      tools: "Figma",
      businessModel: "Government",
    },
    heroImages: [
      {
        ratio: "narrow",
        src: "/images/work/play-tennis/hero.jpg",
        alt: "The redesigned Play Tennis website on a laptop: the header navigation and a photo of two smiling children on a court, on a yellow background.",
      },
    ],
    blocks: [
      {
        type: "dotPoints",
        heading: "The Challenge",
        items: [
          { title: "Outdated design", body: "The site felt dated and no longer matched the new brand." },
          { title: "No design system", body: "There was no centralised design system, leading to inconsistencies across pages." },
          { title: "Accessibility standards", body: "The site needed to meet AAA accessibility requirements to ensure inclusivity for all users, and government-contracted guidelines." },
          { title: "Limited engagement", body: "Static pages gave visitors little reason to stick around." },
        ],
      },
      {
        type: "paragraph",
        heading: "The Solution",
        paragraphs: [
          "A modern design system, refreshed branding and animated assets, which together made the site consistent, accessible and a lot more fun to explore.",
        ],
      },
      {
        type: "largeImage",
        heading: "The Benefits",
        side: "right",
        items: [
          { title: "Enhanced brand alignment", body: "The refreshed design fully reflects Play Tennis’s brand identity while adhering to accessibility standards." },
          { title: "Improved consistency", body: "The newly developed design system ensures uniformity across pages and future updates." },
          { title: "Scalability", body: "A documented design system allows for easy updates and future expansions." },
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/play-tennis/benefits.jpg",
          alt: "Five colour-coded Play Tennis page designs: Open Court Sessions in green, Court Hire in red, Cardio Tennis in magenta, Coaching in orange and ANZ Tennis Hot Shots in blue.",
        },
      },
      {
        type: "largeImage",
        heading: "The Approach",
        side: "right",
        items: [
          { title: "Audited the existing site", body: "I reviewed the layout, usability and visuals to see what was and wasn’t working, then restructured the navigation and content hierarchy." },
          { title: "Built and documented a design system", body: "Brand-aligned colours, typography, tennis imagery and reusable components, all meeting AAA." },
          { title: "Supported launch", body: "I worked closely with developers through the build, so the design stayed true from Figma to live site." },
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/play-tennis/approach.jpg",
          alt: "Pages from the Play Tennis design system: the primary navigation, header and footer, the typography scale, and the colour palette.",
        },
      },
      {
        type: "imgModule",
        heading: "The Outcome",
        paragraphs: [
          "A cohesive, accessible site with playful animations that lifted engagement. The design system gives the team a solid foundation for future campaigns, and user feedback on the redesign has been really positive.",
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/play-tennis/outcome.jpg",
          alt: "The finished Play Tennis home page on a laptop, with a “a match for all” hero photo, a court search bar and a red Court Hire panel.",
        },
      },
    ],
  },
  {
    id: "upguard",
    title: "UpGuard",
    headline: "Vendor Risk Campaign & Brand Refresh",
    company: "UpGuard",
    group: "other",
    tags: ["Visual Design", "Product Design"],
    description:
      "Case study: how Amy McPherson designed UpGuard's Vendor Risk campaign landing page and refreshed the brand with a brighter, more human visual language and a scalable card-based design system.",
    intro: [
      "UpGuard is a cybersecurity company with a big launch coming up for its Vendor Risk product. They saw it as the perfect chance to refresh their brand too. I designed a landing page that did both: it sold the product and set a brighter, more modern direction for how UpGuard looks and feels.",
    ],
    meta: { role: "Product Designer", timeline: "1 week", tools: "Figma", businessModel: "SaaS/Tech" },
    heroImages: [
      {
        ratio: "narrow",
        src: "/images/work/upguard/hero.jpg",
        alt: "The UpGuard Vendor Risk landing page: a dark hero reading “Take control of vendor risk management” beside a feature card and a photo.",
      },
    ],
    blocks: [
      {
        type: "dotPoints",
        heading: "The Challenge",
        items: [
          { title: "Dual objective", body: "One page had to promote Vendor Risk and introduce a new look for the whole brand." },
          { title: "Establishing trust in cybersecurity", body: "The visual identity must remain professional and trustworthy while adopting more modern, human centred design trends." },
          { title: "Creating a cohesive system", body: "The new direction required a scalable design system with refined components, like a card based layout, that could be applied across other marketing channels." },
          { title: "Balancing innovation with alignment", body: "The design had to push the brand forward and still feel unmistakably UpGuard." },
        ],
      },
      {
        type: "paragraph",
        heading: "The Solution",
        paragraphs: [
          "A responsive landing page with a brighter, more human visual language. A refined palette, bold typography and a card-based layout make complex security information clear and easy to follow.",
        ],
      },
      {
        type: "largeImage",
        heading: "The Benefits",
        side: "right",
        items: [
          { title: "A modernised brand identity", body: "The refresh positions UpGuard as both a trusted leader and a forward thinking innovator in the cybersecurity space." },
          { title: "A scalable design system", body: "Cards and a clear type hierarchy are ready to reuse in future campaigns." },
          { title: "Improved user engagement", body: "A clear, intuitive layout with scannable content sections reduces cognitive load and improves information retention for users." },
          { title: "Cross device consistency", body: "A fully responsive design ensures a seamless brand experience for all users, regardless of their device." },
        ],
        media: {
          ratio: "1:1",
          src: "/images/work/upguard/benefits.jpg",
          alt: "The full UpGuard Vendor Risk landing page: hero, feature list, customer logos and the “Absolute visibility” card section.",
        },
      },
      {
        type: "dotPoints",
        heading: "The Approach",
        intro: "Modernise the brand while keeping its core message of trust and simplicity.",
        items: [
          { title: "Market discovery and trend analysis", body: "I looked at where B2B design was heading and found a shift towards warmer, more human visuals." },
          { title: "Audit of existing brand assets", body: "I worked out what to keep, like the core colours, and what to evolve, like type hierarchy and spacing." },
          { title: "Component led design", body: "Cards group complex information into bite-sized pieces and create a modular system for future work." },
          { title: "Responsive first mindset", body: "I designed the layout with a mobile first approach, ensuring all components and imagery would adapt gracefully to provide an optimal experience on any screen size." },
        ],
        media: [
          {
            ratio: "narrow",
            src: "/images/work/upguard/approach1.jpg",
            alt: "A Discovery board of reference sites and apps collected during the market and trend analysis.",
          },
          {
            ratio: "narrow",
            src: "/images/work/upguard/approach2.jpg",
            alt: "Wireframes and layout studies for the UpGuard landing page next to the redesigned Vendor Risk hero.",
          },
        ],
      },
      {
        type: "imgModule",
        heading: "The Outcome",
        paragraphs: [
          "A high-fidelity prototype with a brighter palette, bold Inter typography and a card-based layout. The human-centred look makes cybersecurity feel approachable, in a category that usually sells on fear.",
        ],
        badge: "Prototype",
        badgeHref:
          "https://www.figma.com/proto/HCIYc6RajeXF2aI2r35S8f/UpGuard?page-id=0%3A1&node-id=1-63&viewport=465%2C153%2C0.08&t=G67pGSAjoyqjlXII-1&scaling=contain&content-scaling=responsive",
        media: {
          ratio: "16:9",
          video: "/images/work/upguard/outcome.mp4",
          poster: "/images/work/upguard/outcome.jpg",
          alt: "Screen recording scrolling through the finished UpGuard Vendor Risk landing page.",
        },
      },
    ],
  },
  {
    id: "local-agent-finder",
    title: "Local Agent Finder",
    headline: "LAF UX Redesign",
    company: "Local Agent Finder",
    group: "other",
    tags: ["Product Design"],
    description:
      "Case study: how Amy McPherson redesigned the Local Agent Finder end-to-end flow around trust, transparency and momentum to help more homeowners connect with a real estate agent.",
    intro: [
      "Selling your home is a big decision, and it starts with finding the right agent. Local Agent Finder helps homeowners do exactly that. I redesigned their end-to-end flow, focusing on the early moments when people are still deciding whether to trust the platform. The goal was simple: help more homeowners feel confident enough to connect with an agent.",
    ],
    meta: { role: "Product Designer", timeline: "1 week", tools: "Figma", businessModel: "SaaS/Tech" },
    heroImages: [
      {
        ratio: "narrow",
        src: "/images/work/local-agent-finder/hero.jpg",
        alt: "Three Local Agent Finder wireframes on red: the property questions, the agent search progress screen and the agent results list.",
      },
    ],
    blocks: [
      {
        type: "dotPoints",
        heading: "The Challenge",
        items: [
          { title: "Converting hesitation into action", body: "Overcoming user anxiety and uncertainty during the initial research phase, where homeowners are reluctant to commit personal information." },
          { title: "High stakes decision making", body: "Designing for a major, emotional life decision, selling a home, requires building significant trust within a digital experience." },
          { title: "Identifying critical friction points", body: "Pinpointing exact moments in the existing flow where a lack of clarity or reassurance caused abandonment." },
          { title: "Streamlining a complex process", body: "Simplifying an overwhelming amount of information and steps into a digestible and guided path forward." },
        ],
      },
      {
        type: "paragraph",
        heading: "The Solution",
        paragraphs: [
          "A simpler flow built around trust and transparency. It fixes the moments where people were dropping off, so homeowners feel confident connecting with an agent.",
        ],
      },
      {
        type: "largeImage",
        heading: "The Benefits",
        side: "right",
        items: [
          { title: "Increased conversion rates", body: "A clearer, more trustworthy flow means more homeowners connect with an agent." },
          { title: "User confidence", body: "Homeowners feel informed and supported, never pushed." },
          { title: "Reduced drop off", body: "With less friction, people stay engaged long enough to see the value." },
          { title: "Better lead quality", body: "The flow collects better information, so agents get better matches." },
        ],
        media: {
          ratio: "16:9",
          src: "/images/work/local-agent-finder/benefits.jpg",
          alt: "The redesigned Local Agent Finder results page: a Top Performer agent card and four more agent cards with badges, below a promotional banner.",
        },
      },
      {
        type: "dotPoints",
        heading: "The Approach",
        intro: "I started by getting to know homeowners and how the current experience felt to them.",
        items: [
          { title: "Empathy mapping", body: "I mapped how homeowners think and feel at this stage. They’re worried about spam, unsure what their home is worth, and want reassurance before they commit." },
        ],
        media: [{
            ratio: "narrow",
            src: "/images/work/local-agent-finder/approach.jpg",
            alt: "An empathy map of homeowners with sticky notes under Says, Thinks, Does and Feels.",
          }],
      },
      {
        type: "dotPoints",
        heading: "Current Flow and Friction Analysis",
        intro: "Next, I audited the existing flow to see exactly where people were dropping off. Three issues stood out:",
        items: [
          { title: "Asking for data too early", body: "The flow asked for personal details before showing any value, which made people sceptical straight away." },
          { title: "Uncertainty points", body: "Questions like “What’s most important to you in an agent?” made people stop and second-guess themselves early on." },
          { title: "Lack of progress transparency", body: "A tiny progress bar didn’t show that the platform was working for them." },
        ],
        media: [{
            ratio: "narrow",
            src: "/images/work/local-agent-finder/flow-friction.jpg",
            alt: "Three screens from the existing flow annotated with blue sticky notes about friction points, such as asking for an address and too many options in the property questions.",
          }],
      },
      {
        type: "imgModule",
        heading: "The Outcome",
        paragraphs: [
          "A high-fidelity prototype that rebuilt the flow around trust and momentum, removing barriers between homeowners and the right agent. Key decisions:",
        ],
        badge: "Prototype",
        badgeHref:
          "https://www.figma.com/proto/Z3qClbQBDltmWPSrL3gPuy/Hybrid-UX---Marketing-Design-Case-Study---Amy-McPherson?page-id=2%3A3&node-id=21-20639&viewport=2454%2C-1520%2C0.28&t=fUxl6Hoa02djOdfZ-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=21%3A20639",
        media: {
          ratio: "16:9",
          src: "/images/work/local-agent-finder/outcome.jpg",
          alt: "The final wireframe of the agent results page with annotations explaining the Top Performer label and the new agent badges.",
        },
        bullets: [
          { title: "Trust building copy and transparency", body: "Friendly, clear microcopy sets expectations. A bigger progress bar shows people how far they’ve come and makes the wait feel shorter." },
          { title: "Reduced friction and cognitive load", body: "I cut non-essential questions so people reach the good stuff faster." },
          { title: "Confidence building features", body: "A home value calculator answers one of homeowners’ biggest questions inside the flow." },
          { title: "Credibility through badges", body: "Agent badges like “Top Performer”, “Local Expert” and “5 Star Rated” make it easier to choose with confidence." },
        ],
      },
    ],
  },
  {
    id: "antiglum-app",
    title: "Antiglum App",
    headline: "Antiglum App",
    company: "Antiglum",
    group: "other",
    tags: ["Visual Design", "Product Design"],
    description:
      "Case study: how Amy McPherson designed the brand, UX/UI and website for Antiglum, a deliberately campy brutalist app made to beat Melbourne lockdown boredom.",
    intro: [
      "Melbourne lockdown was... rough. So we made an app to beat the boredom. I worked on the brand, UX/UI and web design for Antiglum. We kept it deliberately campy, using brutalist design to bring a bit of humour to a very strange time. @antiglum",
    ],
    meta: { role: "Digital Designer", team: "Creative Studio", timeline: "4 week", tools: "Figma, Adobe CC", businessModel: "Agency" },
    heroImages: [],
    blocks: [
      {
        type: "gallery",
        media: [
          {
            ratio: "16:9",
            src: "/images/work/antiglum-app/gallery.jpg",
            alt: "Six Antiglum app screens on phones against a yellow background, in a campy brutalist style with bright pink, blue and orange layouts.",
          },
        ],
      },
    ],
  },
  {
    id: "ross-thompson-furniture-website",
    title: "Ross Thompson Furniture",
    headline: "Ross Thompson Furniture Website",
    company: "Ross Thompson Furniture",
    group: "other",
    tags: ["Product Design"],
    description:
      "Case study: how Amy McPherson rebranded Ross Thompson Furniture, from logo and business cards to collateral and a Squarespace website for handcrafted furniture.",
    intro: [
      "Ross Thompson makes beautiful handcrafted furniture, and his brand needed to reflect that. I rebranded the business from top to bottom: the logo, business cards, collateral and website.",
    ],
    meta: { role: "Digital Designer", team: "Creative Studio", timeline: "4 week", tools: "Squarespace", businessModel: "Agency" },
    heroImages: [],
    blocks: [
      {
        type: "gallery",
        media: [
          {
            ratio: "16:9",
            src: "/images/work/ross-thompson-furniture-website/gallery.jpg",
            alt: "The Ross Thompson Furniture website on a desktop monitor and a phone, showing a handcrafted orange armchair and furniture portfolio.",
          },
        ],
      },
    ],
  },
];

/** Portrait card images shown on the homepage grid and the “More projects” carousel. */
const CARD_ALTS: Record<string, string> = {
  "canva-quickpage-ai": "The QuickPage AI editor above the brief upload screen, with a purple googly-eyed character.",
  "canva-higher-education": "The redesigned Canva for Higher Education page with student and faculty re-routing cards.",
  "canva-contact-sales": "Step 1 of 2 of the redesigned Canva Contact Sales form.",
  "canva-ai-vision": "The AI Vision: Sydney 2026 On Demand page hero, with the speaker and floating images against a blue sky.",
  "envato-x-adobe-express": "The Envato x Adobe Express “Reimagine to win $10K” campaign page.",
  "play-tennis": "The redesigned Play Tennis website on a laptop with two smiling children on a court.",
  "upguard": "The UpGuard Vendor Risk landing page with the “Take control of vendor risk management” hero.",
  "local-agent-finder": "Local Agent Finder wireframes of the agent results page on a red background.",
  "antiglum-app": "Antiglum app screens on phones against a yellow background.",
  "ross-thompson-furniture-website": "The Ross Thompson Furniture website on a desktop monitor and a phone.",
};

export const works: Work[] = baseWorks.map((w) => ({
  ...w,
  cardImage: CARD_ALTS[w.id] ? { src: `/images/cards/${w.id}.jpg`, alt: CARD_ALTS[w.id] } : undefined,
}));

/** Canva first, then Envato, then everything else. Stable within each group. */
const GROUP_ORDER = { canva: 0, envato: 1, other: 2 } as const;
export const sortedWorks: Work[] = [...works].sort(
  (a, b) => GROUP_ORDER[a.group] - GROUP_ORDER[b.group]
);

export const getWork = (slug: string | undefined) => works.find((w) => w.id === slug);

export const brands: string[] = [
  "Canva",
  "Envato",
  "Placeit",
  "Officeworks",
  "Australian Open",
  "Tennis Australia",
  "Holey Moley",
  "Strike Bowling",
  "Jukes Karaoke",
  "Archie Brothers",
  "Hijinx Hotel",
  "Skyzone",
  "VICE",
  "B. Lucky and Sons",
  "Department of Health",
];
