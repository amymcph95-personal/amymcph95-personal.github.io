import { useRef, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticLinkProps {
  href: string;
  label: string;
  children: ReactNode;
  external?: boolean;
  light?: boolean;
}

export default function MagneticLink({
  href,
  label,
  children,
  external,
  light,
}: MagneticLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 16 });
  const springY = useSpring(y, { stiffness: 260, damping: 16 });

  const handleMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.4);
    y.set(relY * 0.4);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Internal links go through the router so page transitions play and the
  // SPA doesn't reload. Modifier-clicks keep their native behaviour.
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (external || href.startsWith("mailto:") || !href.startsWith("/")) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();

    // Same-page jump link (e.g. "/#about" while already on "/"): scroll straight to the
    // section every time, even if the URL hash is unchanged and the router wouldn't react.
    const [path, hash] = href.split("#");
    if (hash && (path === location.pathname || path === "")) {
      const el = document.getElementById(hash);
      if (el) {
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        el.setAttribute("tabindex", "-1");
        el.focus({ preventScroll: true });
        if (location.hash !== `#${hash}`) navigate(href, { preventScrollReset: true });
        return;
      }
    }
    navigate(href);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={label}
      title={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer noopener" : undefined}
      onClick={handleClick}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ x: springX, y: springY }}
      className={`group relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3 py-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80 ${light ? "text-white/80 hover:text-white" : "text-ink/85 hover:text-ink"}`}
    >
      {children}
      <span className={`pointer-events-none absolute inset-0 -z-10 rounded-full transition-colors duration-300 ${light ? "bg-white/0 group-hover:bg-white/15" : "bg-ink/0 group-hover:bg-ink/[0.06]"}`} />
    </motion.a>
  );
}
