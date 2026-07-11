import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

const slides = [
  {
    src: heroImg,
    alt: "Boxed glucose monitors and continuous glucose monitoring (CGM) sensors on a clean medical surface",
    title: "Glucose Monitors & CGM Sensors",
    caption: "We buy Dexcom, Freestyle Libre and more — top prices paid.",
  },
  {
    src: hero2,
    alt: "Blood glucose monitor with test strips and an insulin pen arranged neatly",
    title: "Test Strips & Insulin Supplies",
    caption: "Sealed, in-date boxes wanted — quick WhatsApp quotes.",
  },
  {
    src: hero3,
    alt: "Healthcare worker holding a boxed glucose monitor kit",
    title: "Trusted, Fast & Fair",
    caption: "Share your product details and get paid the best price.",
  },
];

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const regionRef = useRef<HTMLDivElement>(null);

  const go = useCallback((next: number) => {
    setIndex((i) => (next + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    // Respect users who prefer reduced motion — no auto-advance.
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => go(index + 1), 5000);
    return () => clearInterval(id);
  }, [paused, index, go]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };

  const current = slides[index];

  return (
    <div className="relative">
      <div className="absolute -inset-4 -z-10 rounded-[2rem] gradient-hero opacity-20 blur-2xl" />
      <div
        ref={regionRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Diabetes products we buy"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        className="group relative aspect-[5/4] w-full overflow-hidden rounded-3xl shadow-card ring-1 ring-border/50 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {slides.map((s, i) => (
          <div
            key={s.src}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${slides.length}: ${s.title}`}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <img
              src={s.src}
              alt={s.alt}
              width={1280}
              height={1024}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={i === 0 ? "high" : "low"}
              className="h-full w-full object-cover transition-transform duration-[6000ms] ease-out motion-safe:group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            {/* Captions: always visible on mobile, reveal on hover/focus on larger screens */}
            <div className="absolute inset-x-0 bottom-0 p-5 pb-14 text-left text-white">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified buyer
              </span>
              <h3 className="text-lg font-bold sm:translate-y-2 sm:opacity-0 sm:transition-all sm:duration-500 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:text-xl">
                {s.title}
              </h3>
              <p className="text-sm text-white/85 sm:translate-y-2 sm:opacity-0 sm:transition-all sm:delay-100 sm:duration-500 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
                {s.caption}
              </p>
            </div>
          </div>
        ))}

        {/* Prev / Next controls */}
        <button
          type="button"
          onClick={() => go(index - 1)}
          aria-label="Previous slide"
          className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          aria-label="Next slide"
          className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}: ${s.title}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                i === index ? "w-6 bg-white" : "w-2 bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>

        {/* Live region for screen readers */}
        <div aria-live="polite" className="sr-only">
          {`Slide ${index + 1} of ${slides.length}: ${current.title}. ${current.caption}`}
        </div>
      </div>
    </div>
  );
}
