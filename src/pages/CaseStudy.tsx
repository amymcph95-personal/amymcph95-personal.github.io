import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, useScroll, useSpring } from "framer-motion";
import TopNav from "../components/TopNav";
import StickyNav from "../components/StickyNav";
import Container from "../components/Container";
import Footer from "../components/Footer";
import Seo from "../components/Seo";
import MoreProjects from "../components/MoreProjects";
import { TagPill } from "../components/TagPill";
import { BlockRenderer } from "../components/blocks/Blocks";
import { MediaRow, RichText } from "../components/blocks/primitives";
import { getWork, type Work } from "../data/works";
import NotFound from "./NotFound";

function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-50 h-[3px] origin-left bg-hero-pink"
      style={{ scaleX }}
    />
  );
}

function MetaItem({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="t-label">{label}</dt>
      <dd className="t-meta text-ink">
        {value}
      </dd>
    </div>
  );
}

/**
 * Figma "Item-Hero" order: hero image(s), eyebrow, headline, intro, tags,
 * divider, then the project facts in a single row.
 */
function ItemHero({ work }: { work: Work }) {
  const { meta } = work;
  return (
    <header className="pb-6 pt-2 sm:pt-4 lg:pb-10">
      <Container>
        <MediaRow media={work.heroImages} eager />

        <p className={`t-overline ${work.heroImages.length ? "mt-8 sm:mt-10" : ""}`}>{work.company}</p>
        <h1
          className="t-display mt-2 max-w-[1000px] text-ink"
        >
          {work.headline}
        </h1>

        <div className="mt-5 flex max-w-[760px] flex-col gap-4 sm:mt-6">
          {work.intro.map((p, i) => (
            <p key={i} className="t-lead">
              <RichText text={p} />
            </p>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {work.tags.map((t) => (
            <TagPill key={t} tag={t} />
          ))}
        </div>

        <hr className="mt-8 border-0 border-t border-ink/10 sm:mt-10" />
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:flex lg:flex-wrap lg:gap-x-14">
          <MetaItem label="Role" value={meta.role} />
          <MetaItem label="Team" value={meta.team} />
          <MetaItem label="Timeline" value={meta.timeline} />
          <MetaItem label="Tools" value={meta.tools} />
          <MetaItem label="Business model" value={meta.businessModel} />
        </dl>
      </Container>
    </header>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const work = getWork(slug);
  const topNavRef = useRef<HTMLElement | null>(null);
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const el = topNavRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setShowSticky(!entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [work?.id]);

  if (!work) return <NotFound />;

  return (
    <>
      <Seo path={`/work/${work.id}`} />
      <ReadingProgress />
      <TopNav navRef={topNavRef} />
      <main id="main" className="outline-none">
        <article>
          <ItemHero work={work} />
          {work.blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </article>
        <MoreProjects currentId={work.id} />
      </main>
      <Footer />
      <StickyNav visible={showSticky} />
    </>
  );
}
