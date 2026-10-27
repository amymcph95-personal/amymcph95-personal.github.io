import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Identities and pill colours come from the Figma "Pills" component set.
const INK = "#372129";
const identities: { label: string; color: string }[] = [
  { label: "designer",           color: "#FFD6F0" },
  { label: "kpop fan",           color: "#C7F3F0" },
  { label: "practicing painter", color: "#FEEF99" },
  { label: "plant mum",          color: "#B8EEB1" },
  { label: "gamer",              color: "#E2DDFC" },
  { label: "pilates princess",   color: "#FFCBBC" },
];

interface Props {
  onLabelChange?: (label: string) => void;
}

export default function WordDropdown({ onLabelChange }: Props) {
  const [open, setOpen]       = useState(false);
  const [current, setCurrent] = useState(identities[0]);
  const [direction, setDirection] = useState<1 | -1>(1); // 1 = down→up, -1 = up→down
  const ref = useRef<HTMLSpanElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [focusIdx, setFocusIdx] = useState(0);

  // Move DOM focus to the active menu item whenever the menu is open.
  useEffect(() => {
    if (open) itemRefs.current[focusIdx]?.focus();
  }, [open, focusIdx]);

  const openMenu = (idx = identities.indexOf(current)) => {
    setFocusIdx(idx);
    setOpen(true);
  };
  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };
  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      openMenu(e.key === "ArrowUp" ? identities.length - 1 : identities.indexOf(current));
    }
  };
  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const n = identities.length;
    if (e.key === "ArrowDown") { e.preventDefault(); setFocusIdx((i) => (i + 1) % n); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setFocusIdx((i) => (i - 1 + n) % n); }
    else if (e.key === "Home") { e.preventDefault(); setFocusIdx(0); }
    else if (e.key === "End") { e.preventDefault(); setFocusIdx(n - 1); }
    else if (e.key === "Escape") { e.preventDefault(); closeMenu(); }
    else if (e.key === "Tab") { setOpen(false); }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (item: typeof identities[number]) => {
    if (item.label === current.label) { closeMenu(); return; }
    // If new item is lower in the list than current, slot goes up; otherwise down
    const newIdx = identities.indexOf(item);
    const curIdx = identities.indexOf(current);
    setDirection(newIdx > curIdx ? 1 : -1);
    setCurrent(item);
    onLabelChange?.(item.label);
    closeMenu();
  };

  return (
    <span ref={ref} className="relative inline-block">
      {/* Pill button */}
      <button
        ref={buttonRef}
        onClick={() => (open ? closeMenu(false) : openMenu())}
        onKeyDown={onButtonKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Change what I am. Currently: ${current.label}`}
        style={{ backgroundColor: current.color }}
        className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-4 py-2 leading-[0.992] text-ink transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80"
      >
        {/* Animated word */}
        <span className="relative -my-[0.2em] flex items-center gap-2 overflow-hidden py-[0.2em]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={current.label}
              initial={{ y: direction * 24, opacity: 0, filter: "blur(4px)" }}
              animate={{ y: 0,              opacity: 1, filter: "blur(0px)" }}
              exit={{    y: direction * -24, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-2 whitespace-nowrap font-semibold"
            >
                            {current.label}
            </motion.span>
          </AnimatePresence>
        </span>

        {/* Chevron */}
        <motion.svg
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
          className="shrink-0 text-ink"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="menu"
            aria-label="Things I am"
            onKeyDown={onMenuKeyDown}
            className="glass-strong absolute left-0 top-[calc(100%+8px)] z-50 min-w-[220px] overflow-hidden rounded-2xl py-1.5 shadow-glass-lg"
          >
            {identities.map((item, idx) => {
              const isActive = item.label === current.label;
              return (
                <li key={item.label}>
                  <button
                    ref={(el) => { itemRefs.current[idx] = el; }}
                    role="menuitemradio"
                    aria-checked={isActive}
                    tabIndex={idx === focusIdx ? 0 : -1}
                    onClick={() => select(item)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-base font-medium leading-normal tracking-normal transition-colors focus:outline-none focus-visible:bg-ink/10"
                    style={isActive ? { backgroundColor: `${item.color}99`, color: INK } : { color: INK }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = `${item.color}99`;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "";
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="check"
                        className="ml-auto text-xs opacity-60"
                        style={{ color: INK }}
                      >
                        ✓
                      </motion.span>
                    )}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </span>
  );
}
