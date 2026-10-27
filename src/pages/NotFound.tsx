import { Link, useLocation } from "react-router-dom";
import { useRef } from "react";
import Container from "../components/Container";
import TopNav from "../components/TopNav";
import Seo from "../components/Seo";
import { sortedWorks } from "../data/works";

export default function NotFound() {
  const navRef = useRef<HTMLElement | null>(null);
  const { pathname } = useLocation();
  return (
    <>
      <Seo path={pathname} notFound />
      <TopNav navRef={navRef} />
      <main id="main" className="outline-none">
        <Container className="py-20 sm:py-28">
          <p className="t-overline">404</p>
          <h1 className="t-display mt-3 text-ink">
            That page wandered off.
          </h1>
          <p className="t-lead mt-4 max-w-[520px]">
            The link may be old or mistyped. Head back home, or jump straight into some work.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/" className="inline-flex min-h-[44px] items-center t-pill rounded-full bg-ink px-6 text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80 focus-visible:ring-offset-2">
              Back to home
            </Link>
            {sortedWorks.slice(0, 3).map((w) => (
              <Link key={w.id} to={`/work/${w.id}`} className="inline-flex min-h-[44px] items-center t-pill rounded-full bg-card px-5 text-ink hover:bg-pill-pink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80">
                {w.title}
              </Link>
            ))}
          </div>
        </Container>
      </main>
    </>
  );
}
