import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent } from "react";
import Container from "./Container";
import WorkCard from "./WorkCard";
import { sortedWorks } from "../data/works";

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ transform: dir === "prev" ? "scaleX(-1)" : undefined }}>
      <path d="M5 12h14m0 0-6-6m6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Figma "More projects": every other case study, Canva first, as a snap-scrolling carousel. */
export default function MoreProjects({ currentId }: { currentId: string }) {
  const items = sortedWorks.filter((w) => w.id !== currentId);
  const trackRef = useRef<HTMLDivElement>(null);
  const [canNext, setCanNext] = useState(true);
  const drag = useRef({ active: false, moved: false, startX: 0, startLeft: 0 });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = (card?.offsetWidth ?? 360) + 16;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Only hijack arrows when the track itself (not an inner link) has focus.
    if (e.target !== e.currentTarget) return;
    if (e.key === "ArrowRight") {
      e.preventDefault();
      scrollByCard(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      scrollByCard(-1);
    }
  };

  // Mouse drag-to-scroll (touch already swipes natively with scroll-snap).
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current!;
    drag.current = { active: true, moved: false, startX: e.clientX, startLeft: el.scrollLeft };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = e.clientX - d.startX;
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true;
      trackRef.current!.style.scrollSnapType = "none";
      trackRef.current!.style.cursor = "grabbing";
    }
    if (d.moved) trackRef.current!.scrollLeft = d.startLeft - dx;
  };
  const endDrag = () => {
    const el = trackRef.current;
    if (!drag.current.active || !el) return;
    drag.current.active = false;
    el.style.scrollSnapType = "";
    el.style.cursor = "";
    // let click handler read `moved`, then reset
    window.setTimeout(() => (drag.current.moved = false), 0);
  };
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section aria-labelledby="more-heading" className="py-12 sm:py-16 lg:py-20">
      <Container>
        <h2 id="more-heading" className="t-h2 mb-6 text-center text-ink sm:mb-8">
          More projects
        </h2>
      </Container>

      <div className="relative">
      <p id="carousel-help" className="sr-only-text">Use the left and right arrow keys to scroll through projects, or tab to a project link.</p>
      {/* Figma: a single floating circular button at the right edge; it flips to "previous" at the end. */}
      <button
        type="button"
        onClick={() => scrollByCard(canNext ? 1 : -1)}
        aria-label={canNext ? "Next projects" : "Back to first projects"}
        aria-controls="more-track"
        className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-[0_2px_12px_rgba(55,33,41,0.18)] transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80 sm:right-6 lg:right-[max(1.5rem,calc((100vw-1264px)/2+1rem))]"
      >
        <Arrow dir={canNext ? "next" : "prev"} />
      </button>
      {/* The track bleeds to the viewport edge on mobile; left padding matches the container. */}
      <div
        ref={trackRef}
        id="more-track"
        role="region"
        aria-roledescription="carousel"
        aria-label="More projects carousel"
        aria-describedby="carousel-help"
        tabIndex={0}
        onScroll={update}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-4 [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/70 sm:px-8 lg:px-[max(2.5rem,calc((100vw-1264px)/2))] [&::-webkit-scrollbar]:hidden"
        style={{ scrollPaddingLeft: "max(1.25rem, calc((100vw - 1264px) / 2))" }}
      >
        {items.map((w, i) => (
          <div key={w.id} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`} data-card className="w-[78vw] max-w-[411px] shrink-0 snap-start sm:w-[340px] lg:w-[calc((1264px-32px)/3)] lg:max-w-none">
            <WorkCard work={w} compact />
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
