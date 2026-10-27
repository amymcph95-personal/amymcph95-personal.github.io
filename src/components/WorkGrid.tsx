import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WorkCard from "./WorkCard";
import Container from "./Container";
import { sortedWorks, TAG_COLORS, type WorkTag } from "../data/works";

export default function WorkGrid() {
  const [active, setActive] = useState<WorkTag[]>([]);

  // Only offer filters that at least one project uses.
  const filters = useMemo(
    () => (["UX/UI", "Product Design", "Visual Design"] as WorkTag[]).filter((t) => sortedWorks.some((w) => w.tags.includes(t))),
    []
  );

  const toggle = (tag: WorkTag) =>
    setActive((cur) => (cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]));

  const visible = active.length === 0 ? sortedWorks : sortedWorks.filter((w) => active.some((t) => w.tags.includes(t)));

  return (
    <section id="work" aria-labelledby="work-heading" data-cursor-label="Wanna take a look?" className="scroll-mt-8 pb-10 pt-6 sm:py-14">
      <Container>
        <h2 id="work-heading" className="sr-only-text">Selected product design work</h2>

        <div className="mb-8 flex flex-wrap items-center gap-2" role="group" aria-label="Filter projects by discipline">
          <span className="t-pill mr-1 text-ink">Filter by:</span>
          {filters.map((tag) => {
            const on = active.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggle(tag)}
                aria-pressed={on}
                className={`relative inline-flex h-[30px] items-center gap-1.5 whitespace-nowrap rounded-full t-pill px-4 before:absolute before:-inset-x-1 before:-inset-y-[7px] before:content-[''] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80 active:scale-95 ${
                  on ? "bg-ink text-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.35)]" : "text-ink hover:brightness-95"
                }`}
                style={on ? undefined : { backgroundColor: TAG_COLORS[tag] }}
              >
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.svg
                      key="check"
                      initial={{ width: 0, opacity: 0, marginRight: -6 }}
                      animate={{ width: 14, opacity: 1, marginRight: 0 }}
                      exit={{ width: 0, opacity: 0, marginRight: -6 }}
                      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                      viewBox="0 0 16 16"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 overflow-visible"
                      height="14"
                    >
                      <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  )}
                </AnimatePresence>
                {tag}
              </button>
            );
          })}
          {active.length > 0 && (
            <button
              type="button"
              onClick={() => setActive([])}
              className="ml-1 relative inline-flex h-[30px] items-center rounded-full t-pill px-3 before:absolute before:-inset-x-1 before:-inset-y-[7px] before:content-[''] text-ink/70 transition-colors hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80"
            >
              Clear
            </button>
          )}
          <span className="sr-only-text" role="status" aria-live="polite">{visible.length} projects shown</span>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((work) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex"
              >
                <WorkCard work={work} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </Container>
    </section>
  );
}
