import { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import medicineProducts from "@/assets/medicine.jpeg";

type HeroSlide = {
  src: string;
  alt: string;
  title: string;
  caption: string;
  fit?: "contain" | "cover";
};

export type HeroBrandImage = {
  name: string;
  image: string | null;
  description?: string;
};

const fallbackSlides: HeroSlide[] = [
  {
    src: medicineProducts,
    alt: "Diabetes medicine and pump supply boxes",
    title: "Diabetes Supplies",
    caption: "We review selected sealed diabetes supplies in a simple WhatsApp flow.",
    fit: "cover",
  },
];

export function HeroSlideshow({ brandImages = [] }: { brandImages?: HeroBrandImage[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const slides = useMemo(() => {
    const brandSlides = brandImages
      .filter((brand) => Boolean(brand.image))
      .slice(0, 8)
      .map((brand) => ({
        src: brand.image as string,
        alt: `${brand.name} diabetic supply brand`,
        title: brand.name,
        caption:
          brand.description ||
          "Choose this brand from our buying list and send the product details in a few simple steps.",
        fit: "contain" as const,
      }));

    return brandSlides.length > 0 ? brandSlides : fallbackSlides;
  }, [brandImages]);

  const go = useCallback(
    (next: number) => {
      setIndex((i) => (next + slides.length) % slides.length);
    },
    [slides.length],
  );

  useEffect(() => {
    setIndex((current) => (current >= slides.length ? 0 : current));
  }, [slides.length]);

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

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
        role="group"
        aria-roledescription="carousel"
        aria-label="Diabetes products we buy"
        tabIndex={0}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onKeyDown={onKeyDown}
        className="group relative aspect-[5/4] w-full overflow-hidden rounded-3xl shadow-card ring-1 ring-border/50 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <img
          key={current.src}
          src={current.src}
          alt={current.alt}
          width={1280}
          height={1024}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className={`h-full w-full animate-in fade-in-0 zoom-in-95 bg-white duration-700 ${
            current.fit === "contain" ? "object-contain p-8 sm:p-10" : "object-cover"
          }`}
        />

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
