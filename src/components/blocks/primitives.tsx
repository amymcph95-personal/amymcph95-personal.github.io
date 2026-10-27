import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import type { Media as MediaT, MediaRatio } from "../../data/works";

/** Renders **bold** inline markers used in the content data. */
export function RichText({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {p}
          </strong>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        )
      )}
    </>
  );
}

const RATIO_STYLE: Record<MediaRatio, string> = {
  "16:9": "aspect-video",
  narrow: "aspect-[1920/518]",
  "1:1": "aspect-square",
  "9:16": "aspect-[9/16] max-w-[420px] mx-auto",
};

/**
 * Looping, silent product video. Autoplays only when visible and when the visitor
 * hasn't asked for reduced motion (then it shows the poster with native controls).
 * A pause button is always available (WCAG 2.2.2).
 */
const btn =
  "flex h-9 w-9 items-center justify-center rounded-full bg-ink/70 text-white backdrop-blur transition-opacity hover:bg-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-white";

function VideoMedia({ media }: { media: Extract<MediaT, { video: string }> }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);
  const [full, setFull] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Play only while on screen (saves battery/CPU), unless the visitor paused it.
  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(([en]) => {
      if (en.isIntersecting && !userPaused.current) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  // Native controls (scrubber, exit) while the video is fullscreen.
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const on = () => setFull(document.fullscreenElement === v);
    document.addEventListener("fullscreenchange", on);
    return () => document.removeEventListener("fullscreenchange", on);
  }, []);

  const goFullscreen = () => {
    const v = ref.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (!v) return;
    v.play().catch(() => {});
    if (v.requestFullscreen) v.requestFullscreen().catch(() => {});
    else v.webkitEnterFullscreen?.(); // iOS Safari
  };

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) {
      userPaused.current = false;
      v.play().catch(() => {});
    } else {
      userPaused.current = true;
      v.pause();
    }
  };

  return (
    <>
      <video
        ref={ref}
        src={media.video}
        poster={media.poster}
        aria-label={media.alt}
        muted
        loop
        playsInline
        preload="metadata"
        controls={reduced || full}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        className="absolute inset-0 h-full w-full object-cover [&:-webkit-full-screen]:object-contain [&:fullscreen]:object-contain"
      />
      {!reduced && (
        <div className="absolute bottom-3 right-3 flex items-center gap-2 sm:bottom-4 sm:right-4">
          <button
            type="button"
            onClick={goFullscreen}
            aria-label="View video full screen"
            className={`${btn} md:hidden`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M1.5 5V1.5H5M9 1.5h3.5V5M12.5 9v3.5H9M5 12.5H1.5V9" />
            </svg>
          </button>
          <button type="button" onClick={toggle} aria-label={paused ? "Play video" : "Pause video"} className={btn}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              {paused ? <path d="M3 1.5v11l9-5.5z" /> : <path d="M3 1.5h3v11H3zM8 1.5h3v11H8z" />}
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

/** Media slot: pink placeholder until an image (`src`) or video is supplied in the data. */
export function Media({ media, className = "", eager = false }: { media: MediaT; className?: string; eager?: boolean }) {
  return (
    <div className={`relative w-full overflow-hidden rounded-[8px] bg-placeholder sm:rounded-[12px] ${RATIO_STYLE[media.ratio]} ${className}`}>
      {media.video ? (
        <VideoMedia media={media} />
      ) : (
        media.src && (
          <img
            src={media.src}
            alt={media.alt ?? ""}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        )
      )}
    </div>
  );
}

/** A row of one or more media slots (two 16:9 slots sit side by side from md up). */
export function MediaRow({ media, className = "", eager = false }: { media?: MediaT[]; className?: string; eager?: boolean }) {
  if (!media || media.length === 0) return null;
  return (
    <div className={`grid gap-4 sm:gap-6 ${media.length > 1 && media.every((m) => m.ratio === "16:9") ? "md:grid-cols-2" : ""} ${className}`}>
      {media.map((m, i) => (
        <Media key={i} media={m} eager={eager} />
      ))}
    </div>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="t-h2 text-ink">
      {children}
    </h2>
  );
}

export const bodyClass = "t-body";
