import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";

/**
 * One color per speech-bubble message, alternating pink → brown through the
 * palette. All are dark enough that the bubble's white text stays accessible
 * (≥ 4.5:1 contrast), unlike the light blush (#F6AFD7) used on surfaces.
 */
const LABEL_COLORS: Record<string, string> = {
  "Let's go!":                     "#BE185D", // deep pink
  "Wanna take a look?":            "#6B3A2C", // brown
  "That's a loooooooot of brands": "#A61E4D", // berry pink
  "That's me!":                    "#5C3A2E", // warm brown
  "Pretty cool, huh?":             "#372129", // ink brown
  "View project":                  "#BE185D", // deep pink
  "Reset":                         "#372129", // ink brown
  "Drop":                          "#BE185D", // deep pink
  "Drag":                          "#6B3A2C", // brown
  "Click me":                      "#BE185D", // deep pink (matches the pink FOLIO)
  "Toss me around":                "#0F766E", // deep teal (matches hero teal, AA with white text)
};

const DEFAULT_COLOR = "#BE185D"; // deep pink when no label

/**
 * A Figma-style multiplayer cursor: an arrow pointer with a colored name tag.
 * The tag text changes depending on the section being hovered (via the
 * `data-cursor-label` attribute) and disappears when over un-tagged areas.
 * Disabled on touch devices and when reduced motion is preferred.
 */
export default function FigmaCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const color = label ? (LABEL_COLORS[label] ?? DEFAULT_COLOR) : DEFAULT_COLOR;

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 3000, damping: 100, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 3000, damping: 100, mass: 0.1 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.body.classList.add("cursor-none");

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      const tagged = target?.closest<HTMLElement>("[data-cursor-label]");
      setLabel(tagged?.dataset.cursorLabel ?? null);
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.body.classList.remove("cursor-none");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60]"
      style={{ x: springX, y: springY, willChange: "transform" }}
    >
      {/* Rounded arrow (Figma "Cursor" 14:496) — tip anchored to the pointer,
          rotated -29.66° so it points up-left. Each section sets the fill. */}
      <motion.svg
        className="drop-shadow-[0_2px_5px_rgba(14,14,18,0.3)]"
        width="19"
        height="20"
        viewBox="0 0 117.412 126.957"
        fill="none"
        style={{ rotate: -29.66, x: "-50%", transformOrigin: "50% 0%" }}
        animate={{ scale: label ? 1.15 : 1 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.path
          d="M49.6043 5.85702C53.1592 -1.95236 64.2523 -1.95233 67.8072 5.85704L116.478 112.779C120.31 121.197 111.643 129.858 103.228 126.021L62.8543 107.613C60.2191 106.411 57.1924 106.411 54.5571 107.613L14.1834 126.021C5.76837 129.858 -2.89826 121.197 0.933331 112.779L49.6043 5.85702Z"
          animate={{ fill: color }}
          transition={{ duration: 0.25 }}
          stroke="#ffffff"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      </motion.svg>

      <AnimatePresence mode="wait">
        {label && (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.6, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 4 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: color }}
            className="absolute left-[15px] top-[18px] origin-top-left whitespace-nowrap rounded-xl rounded-tl-none px-3 py-1.5 text-xs font-semibold text-white shadow-glow"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
