import type { CSSProperties } from "react";
import { TAG_COLORS, TAG_COLORS_HOVER, type WorkTag } from "../data/works";

/** Coloured tag used on case-study pages (Figma "Tags" component). */
export function TagPill({ tag }: { tag: WorkTag }) {
  return (
    <span
      className="t-pill inline-flex h-[30px] items-center whitespace-nowrap rounded-full bg-[var(--pill)] px-4 text-ink transition-colors duration-300 group-hover:bg-[var(--pill-hover)]"
      style={{ "--pill": TAG_COLORS[tag], "--pill-hover": TAG_COLORS_HOVER[tag] } as CSSProperties}
    >
      {tag}
    </span>
  );
}

/** Tag chip used on project cards; same colours as everywhere else. */
export function CardPill({ children }: { children: WorkTag }) {
  return <TagPill tag={children} />;
}
