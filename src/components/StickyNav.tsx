import { motion } from "framer-motion";
import MagneticLink from "./MagneticLink";

import { EMAIL, LINKEDIN_URL } from "../data/site";

function HomeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 10 10" aria-hidden="true">
      <circle cx="5" cy="5" r="5" fill="#F383CA" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.4 8.65 22 10.8 22 14.2V21h-4v-6.1c0-1.45-.03-3.3-2-3.3-2.01 0-2.32 1.57-2.32 3.2V21H9V9Z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface StickyNavProps {
  visible: boolean;
}

export default function StickyNav({ visible }: StickyNavProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 40 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!visible}
      aria-label="Primary"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(!visible ? ({ inert: "" } as any) : {})}
      className={`fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 ${
        visible ? "" : "pointer-events-none"
      }`}
    >
      <div className="glass-strong flex w-[clamp(196px,28vw,336px)] items-center justify-between rounded-full px-4 py-1.5 !bg-white/30">
        <MagneticLink href="/" label="Home">
          <HomeIcon />
        </MagneticLink>

        <MagneticLink href="/#work" label="Work">
          <span className="t-pill">Work</span>
        </MagneticLink>

        <MagneticLink href="/#about" label="About">
          <span className="t-pill">About</span>
        </MagneticLink>

        <span className="mx-1 h-6 w-px bg-ink/10" aria-hidden="true" />

        <MagneticLink href={LINKEDIN_URL} label="LinkedIn" external>
          <LinkedInIcon />
        </MagneticLink>

        <MagneticLink href={`mailto:${EMAIL}`} label="Email">
          <EmailIcon />
        </MagneticLink>
      </div>
    </motion.nav>
  );
}
