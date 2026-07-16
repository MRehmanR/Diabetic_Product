import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import freestyleProducts from "@/assets/WhatsApp Image 2026-07-14 at 20.38.19.jpeg";
import dexcomProducts from "@/assets/WhatsApp Image 2026-07-14 at 17.31.47.jpeg";
import omnipodProducts from "@/assets/WhatsApp Image 2026-07-14 at 17.44.29.jpeg";
import oneTouchProducts from "@/assets/brands/one-touch.svg";
import medicineProducts from "@/assets/medicine.jpeg";

const slides = [
  {
    src: freestyleProducts,
    alt: "FreeStyle Libre and FreeStyle diabetic testing supply boxes",
    title: "FreeStyle & Libre Supplies",
    caption: "We review sealed FreeStyle boxes and sensors with fair, friendly follow-up.",
  },
  {
    src: dexcomProducts,
    alt: "Dexcom G7 continuous glucose monitoring sensor boxes",
    title: "Dexcom G7 Sensors",
    caption: "Have unopened Dexcom supplies? Send the details and we will take a look.",
  },
  {
    src: omnipodProducts,
    alt: "Omnipod 5 pod supply boxes",
    title: "Omnipod Pod Supplies",
    caption: "We review sealed Omnipod boxes and continue the offer conversation on WhatsApp.",
  },
  {
    src: oneTouchProducts,
    alt: "OneTouch Verio and OneTouch Ultra test strip boxes",
    title: "OneTouch Test Strips",
    caption: "Share brand, quantity, and expiry so our team can respond with context.",
    fit: "contain",
  },
  {
    src: medicineProducts,
    alt: "Medtronic diabetic medicine and pump supply boxes",
    title: "Medicine & Pump Supplies",
    caption: "We also review selected sealed diabetes medicine and pump supplies.",
  },
];

export function HeroSlideshow() {
  const [index, setIndex] = useState(0);

  const go = useCallback((next: number) => {
    setIndex((i) => (next + slides.length) % slides.length);
  }, []);

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
        onKeyDown={onKeyDown}
        className="group relative aspect-[5/4] w-full overflow-hidden rounded-3xl shadow-card ring-1 ring-border/50 outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <img
          src={current.src}
          alt={current.alt}
          width={1280}
          height={1024}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className={`h-full w-full bg-white ${
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
