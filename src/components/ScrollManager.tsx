import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * On route change: scroll to top (or the #hash target), move focus to <main>
 * and announce the new page title to screen readers. The first load is left
 * alone so the browser's normal focus start isn't hijacked.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation();
  const first = useRef(true);
  const [announce, setAnnounce] = useState("");

  useEffect(() => {
    const wasFirst = first.current;
    first.current = false;

    if (hash) {
      // The target page may still be mounting behind a page transition, so poll briefly for it.
      const id = decodeURIComponent(hash.slice(1));
      let tries = 0;
      const t = window.setInterval(() => {
        const el = document.getElementById(id);
        tries += 1;
        if (el) {
          window.clearInterval(t);
          const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        } else if (tries > 40) {
          window.clearInterval(t);
        }
      }, 60);
      return () => window.clearInterval(t);
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (wasFirst) return;

    // Let the exit/enter page transition finish, then hand focus to the new page.
    const t = window.setTimeout(() => {
      const main = document.getElementById("main");
      if (main) {
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
      }
      setAnnounce(document.title);
    }, 320);
    return () => window.clearTimeout(t);
  }, [pathname, hash]);

  return (
    <div role="status" aria-live="polite" className="sr-only-text">
      {announce}
    </div>
  );
}
