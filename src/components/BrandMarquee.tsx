import { useState } from "react";
import { brands } from "../data/works";

/** Map each brand name to its primary domain for the favicon logo lookup. */
const BRAND_DOMAINS: Record<string, string> = {
  Canva:                  "canva.com",
  Envato:                 "envato.com",
  Placeit:                "placeit.net",
  Officeworks:            "officeworks.com.au",
  "Australian Open":      "ausopen.com",
  "Tennis Australia":     "tennis.com.au",
  "Holey Moley":          "holeymoley.com.au",
  "Strike Bowling":       "strikebowling.com.au",
  "Jukes Karaoke":        "jukeskaraoke.com.au",
  "Archie Brothers":      "archiebrothers.com.au",
  "Hijinx Hotel":         "hijinxhotel.com.au",
  Skyzone:                "skyzone.com",
  VICE:                   "vice.com",
  "B. Lucky and Sons":    "bluckyandsons.com.au",
  "Department of Health": "health.gov.au",
};

function BrandLogo({ name }: { name: string }) {
  const [failed, setFailed] = useState(false);
  const domain = BRAND_DOMAINS[name];
  if (!domain || failed) return null;

  return (
    <img
      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
      alt=""
      aria-hidden="true"
      className="h-4 w-4 rounded-sm object-contain"
      onError={() => setFailed(true)}
    />
  );
}

export default function BrandMarquee() {
  const loop = [...brands, ...brands];

  return (
    <section
      className="py-10 sm:py-14"
      aria-label="Brands I've worked with"
    >
      <p className="t-label mb-6 text-center">
        Brands I&rsquo;ve worked with
      </p>
      <div className="group relative flex overflow-hidden py-10 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <div className="flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]">
          {loop.map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              className="mr-10 inline-flex items-center gap-2.5 whitespace-nowrap t-small-strong text-ink/75"
            >
              <BrandLogo name={brand} />
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
