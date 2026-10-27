import { AnimatePresence, motion } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import AlertBar from "./components/AlertBar";
import FigmaCursor from "./components/FigmaCursor";
import ScrollManager from "./components/ScrollManager";
import Home from "./pages/Home";
import CaseStudy from "./pages/CaseStudy";
import NotFound from "./pages/NotFound";

/** Fades each route in. Kept short so navigation still feels instant. */
function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  const location = useLocation();
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-canvas text-ink">
      <a
        href="#main"
        onClick={(e) => {
          // Router doesn't own in-page anchors; move focus to <main> directly.
          const main = document.getElementById("main");
          if (!main) return;
          e.preventDefault();
          main.setAttribute("tabindex", "-1");
          main.focus();
          main.scrollIntoView();
        }}
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 t-pill text-white shadow-lg transition-transform focus:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      >
        Skip to main content
      </a>
      <AlertBar />
      <FigmaCursor />
      <ScrollManager />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/work/:slug" element={<Page><CaseStudy /></Page>} />
          <Route path="*" element={<Page><NotFound /></Page>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
