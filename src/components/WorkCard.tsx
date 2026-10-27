import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Work } from "../data/works";
import { CardPill } from "./TagPill";

interface WorkCardProps {
  work: Work;
  /** Fixed width card used inside the "More projects" carousel. */
  compact?: boolean;
}

export default function WorkCard({ work, compact }: WorkCardProps) {
  const image = work.cardImage;
  return (
    <motion.div
      initial={compact ? false : { opacity: 0, y: 24 }}
      whileInView={compact ? undefined : { opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      whileTap={{ y: -3 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="h-full w-full"
    >
      <Link
        to={`/work/${work.id}`}
        data-cursor-label="View project"
        draggable={false}
        className="group flex h-full w-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80 focus-visible:ring-offset-4 focus-visible:ring-offset-canvas rounded-[16px]"
      >
        <div className="flex h-full flex-col gap-4 rounded-[16px] bg-card p-3 pb-5 transition-colors duration-300 group-hover:bg-[#F0EDEA] sm:p-3.5 sm:pb-5">
          {/* Image slot: pink placeholder until an image src is provided */}
          <div className="relative w-full overflow-hidden rounded-[8px] bg-placeholder" style={{ aspectRatio: "568 / 616" }}>
            {image?.src && (
              <img
                src={image.src}
                alt=""
                loading="lazy"
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col justify-between gap-4 px-0.5">
            <div className="flex flex-col gap-2">
              <h3 className="t-card-title flex items-center gap-2 text-ink">
                {work.title}
                <span aria-hidden="true" className="inline-block -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  →
                </span>
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {work.tags.map((tag) => (
                <CardPill key={tag}>{tag}</CardPill>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
