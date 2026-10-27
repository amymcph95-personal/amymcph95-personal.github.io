import { useEffect, useRef, useState } from "react";
import TopNav from "../components/TopNav";
import StickyNav from "../components/StickyNav";
import Hero from "../components/Hero";
import WorkGrid from "../components/WorkGrid";
import BrandMarquee from "../components/BrandMarquee";
import About from "../components/About";
import Seo from "../components/Seo";
import Footer from "../components/Footer";

export default function Home() {
  const topNavRef = useRef<HTMLElement | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const el = topNavRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Seo path="/" />
      <TopNav navRef={topNavRef} />
      <main id="main" className="outline-none">
        <Hero />
        <WorkGrid />
        <BrandMarquee />
        <About />
      </main>
      <Footer />
      <StickyNav visible={showSticky} />
    </>
  );
}
