import Container from "../Container";
import Reveal from "../Reveal";
import type { Block, Bullet } from "../../data/works";
import { Media, MediaRow, RichText, SectionHeading, bodyClass } from "./primitives";

/** Shared vertical rhythm + max width for every block. */
function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`py-8 sm:py-12 lg:py-[72px] ${className}`}>
      <Container>
        <Reveal>{children}</Reveal>
      </Container>
    </section>
  );
}

/** Figma "BulletItem": pink dot, bold title on one line, softer body copy beneath. */
function Bullets({ items, gap = "gap-6" }: { items: Bullet[]; gap?: string }) {
  return (
    <ul className={`flex flex-col ${gap}`}>
      {items.map((b, i) => (
        <li key={i} className="grid grid-cols-[10px_minmax(0,1fr)] gap-x-4">
          <span aria-hidden="true" className="mt-[7px] h-[7px] w-[7px] rounded-full bg-hero-pink" />
          <div className="flex flex-col gap-1.5">
            {b.title && (
              <p className="t-subhead text-ink">
                <RichText text={b.title} />
              </p>
            )}
            <p className="t-body">
              <RichText text={b.body} />
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Figma Img-Module "Dot Points": two equal columns (first half left, second half right), stacked on mobile. */
function BulletColumns({ items }: { items: Bullet[] }) {
  const half = Math.ceil(items.length / 2);
  return (
    <div className="grid gap-8 md:grid-cols-2 md:gap-x-8">
      <Bullets items={items.slice(0, half)} gap="gap-8" />
      {items.length > 1 && <Bullets items={items.slice(half)} gap="gap-8" />}
    </div>
  );
}

function Paragraphs({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-4">
      {items.map((p, i) => (
        <p key={i} className={bodyClass}>
          <RichText text={p} />
        </p>
      ))}
    </div>
  );
}

const twoCol = "grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16";

export function DotPoints({ block }: { block: Extract<Block, { type: "dotPoints" }> }) {
  return (
    <Section>
      <div className={twoCol}>
        <div className="flex flex-col gap-4">
          <SectionHeading>{block.heading}</SectionHeading>
          {block.intro && (
            <p className={bodyClass}>
              <RichText text={block.intro} />
            </p>
          )}
        </div>
        <Bullets items={block.items} />
      </div>
      <MediaRow media={block.media} className="mt-8 sm:mt-12" />
    </Section>
  );
}

export function ParagraphBlock({ block }: { block: Extract<Block, { type: "paragraph" }> }) {
  return (
    <Section>
      <div className={twoCol}>
        <SectionHeading>{block.heading}</SectionHeading>
        <Paragraphs items={block.paragraphs} />
      </div>
      <MediaRow media={block.media} className="mt-8 sm:mt-12" />
    </Section>
  );
}

/** Figma "Large image": text (heading + dot points) on the left, large image on the right. */
export function LargeImage({ block }: { block: Extract<Block, { type: "largeImage" }> }) {
  return (
    <Section>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div className="flex flex-col gap-5">
          <SectionHeading>{block.heading}</SectionHeading>
          {block.intro && (
            <p className={bodyClass}>
              <RichText text={block.intro} />
            </p>
          )}
          <Bullets items={block.items} />
        </div>
        <Media media={block.media ?? { ratio: "16:9" }} />
      </div>
    </Section>
  );
}

export function Split({ block }: { block: Extract<Block, { type: "split" }> }) {
  const right = block.side === "right";
  return (
    <Section>
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className={`flex flex-col gap-4 ${right ? "lg:order-2" : ""}`}>
          <SectionHeading>{block.heading}</SectionHeading>
          <Paragraphs items={block.paragraphs} />
          {block.bullets && (
            <ul className="mt-1 flex list-disc flex-col gap-2 pl-5 marker:text-ink/50">
              {block.bullets.map((b, i) => (
                <li key={i} className={bodyClass}>
                  <RichText text={b} />
                </li>
              ))}
            </ul>
          )}
        </div>
        <Media media={block.media ?? { ratio: "16:9" }} className={right ? "lg:order-1" : ""} />
      </div>
    </Section>
  );
}

export function Columns({ block }: { block: Extract<Block, { type: "columns" }> }) {
  const n = block.items.length;
  const cols = n >= 3 ? "md:grid-cols-3" : n === 2 ? "md:grid-cols-2" : "";
  return (
    <Section>
      <div className={`grid gap-4 sm:gap-6 ${cols}`}>
        {block.items.map((c, i) => (
          <div key={i} className="flex flex-col gap-3 rounded-[16px] border border-ink/15 bg-white/40 p-6 sm:p-8">
            <h3 className="t-card-title text-ink">
              {c.title}
            </h3>
            <Paragraphs items={c.paragraphs} />
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ImgModule({ block }: { block: Extract<Block, { type: "imgModule" }> }) {
  return (
    <Section>
      <div className="flex flex-col gap-6 lg:gap-8">
        {/* Figma Img-Module: heading + copy on the left, badge pill pinned to the right */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="flex max-w-[820px] flex-col gap-4">
            <SectionHeading>{block.heading}</SectionHeading>
            <Paragraphs items={block.paragraphs} />
          </div>
          {block.links && (
            <div className="flex flex-wrap gap-2 self-start lg:justify-end lg:self-auto">
              {block.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ "--pill": l.bg, "--pill-hover": l.hoverBg } as React.CSSProperties}
                  className="inline-flex h-[30px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[var(--pill)] px-4 t-pill text-ink transition-colors hover:bg-[var(--pill-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  {l.label}
                  <span aria-hidden="true">↗</span>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ))}
            </div>
          )}
          {block.badge &&
            (block.badgeHref ? (
              <a
                href={block.badgeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-[30px] shrink-0 items-center gap-1.5 self-start whitespace-nowrap rounded-full bg-pill-pink lg:self-auto px-4 t-pill text-ink transition-colors hover:bg-[#FFC4E6] focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
              >
                {block.badge}
                <span aria-hidden="true">↗</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ) : (
              <span className="inline-flex h-[30px] shrink-0 items-center self-start whitespace-nowrap rounded-full bg-pill-pink px-4 t-pill text-ink lg:self-auto">
                {block.badge}
              </span>
            ))}
        </div>
        {block.bullets && <BulletColumns items={block.bullets} />}
        <Media media={block.media} />
      </div>
    </Section>
  );
}

export function Gallery({ block }: { block: Extract<Block, { type: "gallery" }> }) {
  return (
    <Section>
      <div className="flex flex-col gap-4 sm:gap-6">
        {block.media.map((m, i) => (
          <Media key={i} media={m} />
        ))}
      </div>
    </Section>
  );
}

/** Maps a data block to its component. */
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "dotPoints":
      return <DotPoints block={block} />;
    case "paragraph":
      return <ParagraphBlock block={block} />;
    case "largeImage":
      return <LargeImage block={block} />;
    case "split":
      return <Split block={block} />;
    case "columns":
      return <Columns block={block} />;
    case "imgModule":
      return <ImgModule block={block} />;
    case "gallery":
      return <Gallery block={block} />;
  }
}
