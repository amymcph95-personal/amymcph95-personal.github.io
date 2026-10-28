import React, { type RefObject } from "react";
import MagneticLink from "./MagneticLink";
import { EMAIL, LINKEDIN_URL } from "../data/site";

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 10 10" aria-hidden="true">
      <circle cx="5" cy="5" r="5" fill="#372129" />
    </svg>
  );
}

export function LinkedInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 22 10.8 22 14.2V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2.01 0-2.32 1.57-2.32 3.2V21H9V9Z" />
    </svg>
  );
}

export function EmailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface TopNavProps {
  /** Ref forwarded so the parent can observe visibility (drives the sticky nav). */
  navRef: RefObject<HTMLElement | null>;
}

/** Figma "Nav": dot on the left, Work / About / LinkedIn / mail on the right. */
export default function TopNav({ navRef }: TopNavProps) {
  return (
    <nav
      ref={navRef as React.RefObject<HTMLElement>}
      aria-label="Top navigation"
      className="mx-auto w-full max-w-[1264px] px-5 py-4 sm:px-8 sm:py-8 lg:px-10 lg:py-[42px] xl:px-0"
    >
      {/* -mx-3 cancels the links' 12px hit-area padding so the dot and mail icon sit on the content edges */}
      <div className="-mx-3 flex items-center justify-between">
      <MagneticLink href="/" label="Home">
        <HomeIcon />
      </MagneticLink>

      <div className="flex items-center gap-0 sm:gap-4 lg:gap-6">
        <MagneticLink href="/#work" label="Work">
          <span className="t-nav">Work</span>
        </MagneticLink>
        <MagneticLink href="/#about" label="About">
          <span className="t-nav">About</span>
        </MagneticLink>
        <MagneticLink href={LINKEDIN_URL} label="LinkedIn" external>
          <LinkedInIcon />
        </MagneticLink>
        <MagneticLink href={`mailto:${EMAIL}`} label="Email">
          <EmailIcon />
        </MagneticLink>
      </div>
      </div>
    </nav>
  );
}
