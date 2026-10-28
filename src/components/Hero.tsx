import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
import Matter from "matter-js";

// ─────────────────────────────────────────────────────────────────────────────
// Gravity-drop hero.
//
// The headline is real text laid out exactly like the Figma frame, so it is
// readable, selectable and crawlable straight away. Pressing "Drop the letters"
// (or grabbing any letter) hands every glyph to a matter-js rigid body: they
// fall, pile up on the floor, and can be dragged / flicked. "Put them back"
// tweens them home. With reduced motion there is no
// physics at all, just the static composed headline.
// ─────────────────────────────────────────────────────────────────────────────

type Tone = "ink" | "pink" | "teal";
interface Glyph {
  ch: string;
  tone: Tone;
  star?: boolean;
}

const g = (text: string, tone: Tone): Glyph[] => [...text].map((ch) => ({ ch, tone }));
const SPACE: Glyph = { ch: " ", tone: "ink" };

// Figma headline (frames 88:7651–88:7683): "AMY’S PRODUCT & UX/UI DESIGN FOLIO" on three lines.
const LINES: Glyph[][] = [
  g("AMY’S", "ink"),
  [...g("PRODUCT", "pink"), SPACE, ...g("&", "ink"), SPACE, ...g("UX/UI", "teal")],
  [...g("DESIGN", "ink"), SPACE, ...g("FOLIO", "ink")],
];

const TONE_CLASS: Record<Tone, string> = {
  ink: "text-ink",
  pink: "text-hero-pink",
  teal: "text-hero-teal",
};

interface Home {
  cx: number;
  cy: number;
  w: number;
  h: number;
  /** transform-origin (px, relative to the span) so rotation pivots on the body centre. */
  ox: number;
  oy: number;
}

export default function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const apiRef = useRef<{ drop: () => void; compose: () => void } | null>(null);

  const [width, setWidth] = useState(1264);
  const [reduced, setReduced] = useState(false);
  // False while the letters are composed (cursor says "Click me"), true once dropped ("Toss me around").
  const [dropped, setDropped] = useState(false);

  const mobile = width < 640;
  const lines = LINES;
  // Desktop type is sized from the Figma frame (1264px wide); mobile fills the width.
  // `fit` is a measured correction so the widest line's ink spans the stage exactly;
  // `shift` nudges the block so its ink starts flush with the content edge.
  const [fit, setFit] = useState(1);
  const [shift, setShift] = useState(0);
  const fontSize = Math.max(30, width * 0.1263 * fit);

  // Track the wrapper width.
  useIsoLayoutEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(el);
    setWidth(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Fit the headline's ink to the stage width, always (any viewport, any font load timing).
  useIsoLayoutEffect(() => {
    let cancelled = false;
    const measure = () => {
      const stage = stageRef.current;
      if (cancelled || !stage) return;
      const ctx = document.createElement("canvas").getContext("2d");
      if (!ctx) return;
      let minL = Infinity;
      let maxR = -Infinity;
      stage.querySelectorAll<HTMLElement>("[data-letter]").forEach((el) => {
        const cs = getComputedStyle(el);
        ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const m = ctx.measureText(el.textContent?.replace("\u200b", "") ?? "");
        const left = el.offsetLeft - m.actualBoundingBoxLeft;
        const right = el.offsetLeft + m.actualBoundingBoxRight;
        minL = Math.min(minL, left);
        maxR = Math.max(maxR, right);
      });
      const ink = maxR - minL;
      if (!isFinite(ink) || ink <= 0) return;
      const ratio = stage.clientWidth / ink;
      if (Math.abs(ratio - 1) > 0.002) setFit((f) => f * ratio);
      else setShift(Math.round(minL * 10) / 10);
    };
    measure();
    document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, [width, fit, reduced]);

  // Build the physics world whenever the layout (size / line breaks) changes.
  useEffect(() => {
    if (reduced) return;
    const stage = stageRef.current;
    if (!stage) return;

    let cancelled = false;
    let raf = 0;
    let teardown: (() => void) | null = null;

    const setup = () => {
      if (cancelled) return;
      const spans = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
      spans.forEach((s) => (s.style.transform = ""));
      const stageRect = stage.getBoundingClientRect();
      const ctx = document.createElement("canvas").getContext("2d");
      const homes: Home[] = spans.map((s) => {
        const r = s.getBoundingClientRect();
        const home: Home = {
          cx: r.left - stageRect.left + r.width / 2,
          cy: r.top - stageRect.top + r.height / 2,
          w: r.width,
          h: r.height,
          ox: r.width / 2,
          oy: r.height / 2,
        };
        // The asterisk glyph sits high inside its line box, so a box-sized body would
        // stop well above the floor. Use the real ink bounds of the glyph instead.
        const marker = s.querySelector<HTMLElement>("[data-baseline]");
        if (s.dataset.star && marker && ctx) {
          const cs = getComputedStyle(s);
          ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
          const m = ctx.measureText("*");
          const baseline = marker.getBoundingClientRect().top;
          const inkTop = baseline - m.actualBoundingBoxAscent;
          const inkBottom = baseline + m.actualBoundingBoxDescent;
          const inkH = inkBottom - inkTop;
          const inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
          if (inkH > 0 && inkW > 0) {
            const cyAbs = (inkTop + inkBottom) / 2;
            home.cy = cyAbs - stageRect.top;
            home.w = inkW / 0.9;
            home.h = inkH / 0.85;
            home.oy = cyAbs - r.top;
            s.style.transformOrigin = `${home.ox}px ${home.oy}px`;
          }
        }
        return home;
      });
      const W = stageRect.width;
      const H = stageRect.height;

      const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = Matter;
      const engine = Engine.create({ enableSleeping: true });
      engine.gravity.y = 1.4;

      const bodies = homes.map((h) =>
        Bodies.rectangle(h.cx, h.cy, h.w * 0.9, h.h * 0.85, {
          restitution: 0.25,
          friction: 0.5,
          frictionAir: 0.012,
          chamfer: { radius: Math.min(h.w, h.h) * 0.12 },
        })
      );
      // Created dynamic, then frozen, so matter keeps real mass/inertia for the later drop.
      bodies.forEach((b) => Body.setStatic(b, true));
      const t = 200;
      const walls = [
        Bodies.rectangle(W / 2, H + t / 2, W * 3, t, { isStatic: true }), // floor
        Bodies.rectangle(W / 2, -t / 2, W * 3, t, { isStatic: true }), // ceiling (keeps tossed letters inside the hero)
        Bodies.rectangle(-t / 2, H / 2, t, H * 6, { isStatic: true }), // left
        Bodies.rectangle(W + t / 2, H / 2, t, H * 6, { isStatic: true }), // right
      ];
      Composite.add(engine.world, [...bodies, ...walls]);

      let mode: "composed" | "dropped" | "composing" = "composed";
      let composeStart = 0;
      let composeFrom: { x: number; y: number; a: number }[] = [];
      let visible = true;
      let running = false;
      let last = 0;
      let drag: { id: number; constraint: Matter.Constraint } | null = null;

      const paint = () => {
        bodies.forEach((b, i) => {
          const el = spans[i];
          if (!el) return;
          el.style.transform = `translate3d(${b.position.x - homes[i].cx}px, ${
            b.position.y - homes[i].cy
          }px, 0) rotate(${b.angle}rad)`;
        });
      };

      const tick = (now: number) => {
        raf = 0;
        if (cancelled) return;
        const dt = Math.min(16.6, last ? now - last : 16.6);
        last = now;

        if (visible) {
          if (mode === "composing") {
            const p = Math.min(1, (now - composeStart) / 750);
            const e = 1 - Math.pow(1 - p, 3);
            bodies.forEach((b, i) => {
              const f = composeFrom[i];
              Body.setPosition(b, {
                x: f.x + (homes[i].cx - f.x) * e,
                y: f.y + (homes[i].cy - f.y) * e,
              });
              Body.setAngle(b, f.a * (1 - e));
            });
            if (p >= 1) mode = "composed";
          } else if (mode === "dropped") {
            Engine.update(engine, dt);
          }
          paint();
        }

        const allAsleep = bodies.every((b) => b.isSleeping || b.isStatic);
        const keepGoing = mode === "composing" || (mode === "dropped" && (!allAsleep || drag));
        if (keepGoing) {
          raf = requestAnimationFrame(tick);
        } else {
          running = false;
          last = 0;
        }
      };

      const start = () => {
        if (running || cancelled) return;
        running = true;
        raf = requestAnimationFrame(tick);
      };

      const drop = () => {
        if (mode === "dropped") return;
        mode = "dropped";
        setDropped(true);
        bodies.forEach((b) => {
          Body.setStatic(b, false);
          Sleeping.set(b, false);
          Body.setVelocity(b, { x: (Math.random() - 0.5) * 3, y: -Math.random() * 2 });
          Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.12);
        });
        start();
      };

      const compose = () => {
        if (mode === "composed" || mode === "composing") return;
        if (drag) {
          Composite.remove(engine.world, drag.constraint);
          drag = null;
        }
        composeFrom = bodies.map((b) => ({ x: b.position.x, y: b.position.y, a: b.angle }));
        bodies.forEach((b) => Body.setStatic(b, true));
        composeStart = performance.now();
        mode = "composing";
        setDropped(false);
        start();
      };

      apiRef.current = { drop, compose };

      // Letters start composed; the first click (or grab) drops them.
      setDropped(false);

      // ── Pointer: drag / flick a letter, and nudge on hover ──
      const toLocal = (e: PointerEvent) => {
        const r = stage.getBoundingClientRect();
        return { x: e.clientX - r.left, y: e.clientY - r.top };
      };

      // Touch: a drop needs a deliberate tap (release without travelling), so a scroll
      // gesture that starts on the hero never fires it by accident.
      let tap: { id: number; x: number; y: number; t: number } | null = null;
      let lastPointer: { x: number; y: number } | null = null;
      const onDown = (e: PointerEvent) => {
        lastPointer = null;
        // The drop / reset button handles its own click; don't also drop on its pointerdown.
        if ((e.target as HTMLElement).closest("button")) return;
        if (e.pointerType !== "mouse" && mode !== "dropped") {
          tap = { id: e.pointerId, x: e.clientX, y: e.clientY, t: performance.now() };
          return;
        }
        const target = (e.target as HTMLElement).closest<HTMLElement>("[data-letter]");
        if (!target) {
          if (mode === "composed") drop();
          return;
        }
        const i = Number(target.dataset.letter);
        const body = bodies[i];
        if (!body) return;
        if (mode !== "dropped") drop();
        const p = toLocal(e);
        Sleeping.set(body, false);
        const constraint = Constraint.create({
          pointA: p,
          bodyB: body,
          pointB: { x: p.x - body.position.x, y: p.y - body.position.y },
          stiffness: 0.18,
          damping: 0.12,
          length: 0,
        });
        Composite.add(engine.world, constraint);
        drag = { id: i, constraint };
        stage.setPointerCapture(e.pointerId);
        stage.style.cursor = "grabbing";
        start();
      };

      const onMove = (e: PointerEvent) => {
        const p = toLocal(e);
        if (drag) {
          drag.constraint.pointA = p;
          Sleeping.set(bodies[drag.id], false);
          start();
          return;
        }
        if (mode === "dropped") {
          // Mouse hover or a finger swipe pushes nearby letters; faster movement throws harder.
          const speed = lastPointer ? Math.hypot(p.x - lastPointer.x, p.y - lastPointer.y) : 0;
          lastPointer = p;
          const boost = 1 + Math.min(speed / 16, 2);
          // Reach scales with the type so a thumb on a small screen doesn't sweep everything.
          const R = Math.min(190, Math.max(80, fontSize * (e.pointerType === "mouse" ? 1.2 : 1.25)));
          bodies.forEach((b) => {
            const dx = b.position.x - p.x;
            const dy = b.position.y - p.y;
            const d = Math.hypot(dx, dy);
            if (d < R && d > 0.1) {
              Sleeping.set(b, false);
              const f = ((R - d) / R) * 0.0085 * b.mass * boost;
              Body.applyForce(b, b.position, { x: (dx / d) * f, y: (dy / d) * f - Math.abs(f) * 0.9 });
              Body.setAngularVelocity(b, b.angularVelocity + (Math.random() - 0.5) * 0.03 * boost * ((R - d) / R));
            }
          });
          start();
        }
      };

      const onUp = (e: PointerEvent) => {
        lastPointer = null;
        if (tap && tap.id === e.pointerId) {
          const moved = Math.hypot(e.clientX - tap.x, e.clientY - tap.y);
          const quick = performance.now() - tap.t < 500;
          tap = null;
          if (e.type === "pointerup" && moved < 10 && quick && mode === "composed") {
            navigator.vibrate?.(8);
            drop();
          }
          return;
        }
        if (!drag) return;
        Composite.remove(engine.world, drag.constraint);
        drag = null;
        stage.style.cursor = "";
        if (stage.hasPointerCapture(e.pointerId)) stage.releasePointerCapture(e.pointerId);
        start();
      };

      const onDbl = () => compose();
      stage.addEventListener("dblclick", onDbl);
      stage.addEventListener("pointerdown", onDown);
      stage.addEventListener("pointermove", onMove);
      stage.addEventListener("pointerup", onUp);
      stage.addEventListener("pointercancel", onUp);

      // ── Scroll jolt: a fast scroll shakes the page, so the dropped letters hop and fall back. ──
      // Slow scrolling does nothing; the harder the flick, the higher they jump.
      let scrollY = window.scrollY;
      let scrollT = performance.now();
      let lastJolt = 0;
      const jumpScale = Math.min(1.2, Math.max(0.5, fontSize / 120));
      const onScroll = () => {
        const now = performance.now();
        const dy = window.scrollY - scrollY;
        const dtMs = Math.max(1, now - scrollT);
        scrollY = window.scrollY;
        scrollT = now;
        if (mode !== "dropped" || !visible || drag) return;
        const speed = Math.abs(dy) / dtMs; // px per ms
        if (speed < 1.1 || now - lastJolt < 140) return;
        lastJolt = now;
        const power = Math.min((speed - 1) / 2.5, 1);
        bodies.forEach((b) => {
          Sleeping.set(b, false);
          Body.setVelocity(b, {
            x: b.velocity.x + (Math.random() - 0.5) * 5 * power * jumpScale,
            y: b.velocity.y - (3 + Math.random() * 6) * power * jumpScale,
          });
          Body.setAngularVelocity(b, b.angularVelocity + (Math.random() - 0.5) * 0.14 * power);
        });
        start();
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      // Pause the simulation when the hero is off-screen.
      const io = new IntersectionObserver(([en]) => {
        visible = en.isIntersecting;
        if (visible) {
          last = 0;
          start();
        }
      });
      io.observe(stage);

      teardown = () => {
        stage.removeEventListener("dblclick", onDbl);
        stage.removeEventListener("pointerdown", onDown);
        stage.removeEventListener("pointermove", onMove);
        stage.removeEventListener("pointerup", onUp);
        stage.removeEventListener("pointercancel", onUp);
        window.removeEventListener("scroll", onScroll);
        io.disconnect();
        if (raf) cancelAnimationFrame(raf);
        Composite.clear(engine.world, false);
        Engine.clear(engine);
        spans.forEach((s) => (s.style.transform = ""));
        apiRef.current = null;
      };
    };

    // Wait for Figtree so glyph boxes are measured at their final size.
    if (document.fonts?.ready) document.fonts.ready.then(setup);
    else setup();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, [reduced, mobile, width, fit, shift]);

  let letterIndex = -1;

  return (
    <header className="relative px-5 pb-3 pt-4 sm:px-8 sm:pb-8 sm:pt-10 lg:px-10 lg:pt-14 xl:px-0" data-cursor-label={reduced || dropped ? undefined : "Click me"}>
      <h1 className="sr-only-text">Amy’s Product & UX/UI Design Folio: Amy McPherson, Creative Product Designer at Canva</h1>

      {/* Physics stage: the whole hero block is the canvas, so letters can scatter across all of it. */}
      <div
        ref={stageRef}
        className="relative mx-auto w-full max-w-[1264px] select-none [-webkit-touch-callout:none]"
        style={{ fontSize, lineHeight: 0.7, touchAction: "pan-y", paddingBottom: mobile ? "calc(0.1em + 56px)" : "0.1em" }}
      >
        <div className="mx-auto w-fit" style={{ transform: shift ? `translateX(${-shift}px)` : undefined }}>
          <div aria-hidden="true">
            {lines.map((line, li) => (
              <div key={li} className="flex font-semibold" style={{ height: "0.7em", marginBottom: li === lines.length - 1 ? 0 : "0.13em" }}>
                {line.map((glyph, gi) => {
                  if (glyph.ch === " ") {
                    return <span key={gi} style={{ width: "0.235em" }} />;
                  }
                  letterIndex += 1;
                  const idx = letterIndex;
                  return (
                    <span
                      key={gi}
                      ref={(el) => {
                        letterRefs.current[idx] = el;
                      }}
                      data-letter={idx}
                      data-star={glyph.star ? "1" : undefined}
                      className={`inline-block ${TONE_CLASS[glyph.tone]} ${reduced ? "" : "cursor-grab"}`}
                      style={{
                        height: "0.7em",
                        lineHeight: "0.7em",
                        letterSpacing: "-0.055em",
                        touchAction: reduced ? undefined : dropped ? "none" : "pan-y",
                        willChange: reduced ? undefined : "transform",
                        // The asterisk glyph sits near cap height; drop it to the baseline like the Figma stars.
                        ...(glyph.star
                          ? { fontSize: "1.15em", position: "relative", top: "0.12em" }
                          : null),
                      }}
                    >
                      {glyph.ch}
                      {glyph.star && <i data-baseline aria-hidden="true" style={{ display: "inline-block", width: 0, height: 0 }} />}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>

        </div>

        {/* Touch hint: there is no cursor label on touch screens, so point at the drop button. */}
        {!reduced && !dropped && (
          <span aria-hidden="true" className="pointer-events-none absolute right-10 top-0 z-30 hidden h-8 items-center t-small [@media(pointer:coarse)]:flex">
            Tap me
          </span>
        )}

        {!reduced && (
          <button
            type="button"
            onClick={() => (dropped ? apiRef.current?.compose() : apiRef.current?.drop())}
            aria-label={dropped ? "Reset the letters" : "Drop the letters"}
            title={dropped ? "Reset letters" : "Drop letters"}
            className="absolute right-0 top-0 z-30 flex h-8 w-8 items-center before:absolute before:-inset-2 before:content-[''] sm:h-11 sm:w-11 sm:before:inset-0 justify-center rounded-full bg-card text-ink/80 transition-colors hover:bg-pill-pink hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/80"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {dropped ? (
                <path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M12 4v16m0 0-6-6m6 6 6-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        )}
      </div>
    </header>
  );
}
