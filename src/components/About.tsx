import { useState, type ReactNode } from "react";
import Reveal from "./Reveal";
import WordDropdown from "./WordDropdown";
import { EXPERIENCE } from "../data/site";

function PillLabel({ children }: { children: ReactNode }) {
  return (
    <span className="t-label">{children}</span>
  );
}

function ProfileCard() {
  // Figma "Profile Card": 258 square, gradient overlay with the name block pinned bottom-left.
  return (
    <div className="relative aspect-square w-full max-w-[258px] overflow-hidden rounded-[20.64px] bg-ink">
      <img
        src="/images/amy.png"
        alt="Amy McPherson"
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[2px] bg-gradient-to-t from-black/75 to-transparent p-[17px] pt-12">
        <p className="t-small-strong text-white">Amy McPherson</p>
        <p className="t-small !text-white/70">She/her</p>
      </div>
    </div>
  );
}

const experience = EXPERIENCE;

const VOWELS = /^[aeiou]/i;

export default function About() {
  const [currentLabel, setCurrentLabel] = useState("designer");
  const article = VOWELS.test(currentLabel) ? "an" : "a";
  return (
    <section
      id="about"
      className="mx-auto max-w-[1296px] scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16"
    >
      <div className="relative overflow-hidden rounded-[32px] border border-[#EBEBEB]/50 bg-[#FFE7F6] p-8 sm:p-12 lg:p-14">

        {/* ── Top row: profile card + bio ── */}
        <div className="relative grid grid-cols-1 gap-6 min-[465px]:grid-cols-[20%_1fr] lg:grid-cols-[258px_1fr] lg:gap-14">

          {/* Profile card */}
          <Reveal>
            <ProfileCard />
          </Reveal>

          {/* Bio */}
          <Reveal delay={0.1} className="flex flex-col justify-center">
            <PillLabel>About</PillLabel>
            <h2 className="t-h2-lg mt-4 inline-flex flex-wrap items-center gap-x-3 gap-y-2 text-ink">
              I&rsquo;m {article} <WordDropdown onLabelChange={setCurrentLabel} />
            </h2>
            <p className="t-lead mt-4 !text-ink/70 lg:max-w-[85%]">
              I&rsquo;m Amy, a creative product designer with 5+ years across
              SaaS, in-house teams and studios. I specialise in
              conversion-focused B2B design, design systems and landing pages,
              and I have a habit of building the tools I wish existed.
            </p>
          </Reveal>
        </div>

        {/* ── Horizontal timeline ── */}
        <Reveal delay={0.15} className="relative mt-10 lg:mt-12">
          <div className="mb-5">
            <PillLabel>Where I&rsquo;ve worked</PillLabel>
          </div>

          <ol className="relative grid list-none grid-cols-2 gap-x-4 gap-y-6 p-0 sm:flex">
            {/* Connector line running through the dot centres (wide layout only) */}
            <span
              aria-hidden="true"
              className="absolute left-1.5 right-0 top-[5.5px] hidden h-px bg-ink/20 sm:block"
            />
{experience.map((item, i) => {
              const isCurrent = i === 0;
              return (
                <li key={item.company} className="relative sm:flex-1 sm:pr-4">
                  {/* Dot */}
                  <span className="relative mb-3 flex h-3 w-3 shrink-0 items-center justify-center">
                    {isCurrent && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/40" />
                    )}
                    <span
                      className={`relative h-3 w-3 rounded-full ${
                        isCurrent
                          ? "bg-ink"
                          : "border-2 border-ink/35 bg-petal"
                      }`}
                    />
                  </span>

                  <p className="t-overline">{item.period}</p>
                  <p className="t-small-strong mt-1 text-ink">{item.company}</p>
                  <p className="t-small">{item.role}</p>
                </li>
              );
            })}
          </ol>
        </Reveal>

      </div>
    </section>
  );
}
