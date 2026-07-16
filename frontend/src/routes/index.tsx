import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  ShieldCheck,
  Award,
  Lock,
  MessageCircle,
  Zap,
  ArrowRight,
  Store,
  PackageCheck,
  Quote,
  Star,
  ClipboardCheck,
  Truck,
  CircleDollarSign,
  CheckCircle2,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { MedicalBackground } from "@/components/MedicalBackground";
import { BUSINESS, loadProducts, type Product } from "@/lib/data";
import freestyleProducts from "@/assets/WhatsApp Image 2026-07-14 at 20.38.19.jpeg";
import oneTouchProducts from "@/assets/brands/one-touch.svg";
import dexcomProducts from "@/assets/WhatsApp Image 2026-07-14 at 17.31.47.jpeg";
import omnipodProducts from "@/assets/WhatsApp Image 2026-07-14 at 17.44.29.jpeg";
import medtronicImage from "@/assets/medtronic.jpeg";
import accuChekImage from "@/assets/accu-chek.jpeg";
import contourNextImage from "@/assets/contour next.jpeg";

export const Route = createFileRoute("/")({
  loader: () => loadProducts(),
  head: () => ({
    meta: [
      { title: BUSINESS.name },
      {
        name: "description",
        content:
          "Sell your unused Dexcom, Omnipod, FreeStyle Libre 3 Plus sensors, Ozempic, test strips, and more to Diabetics King.",
      },
      { property: "og:title", content: "Diabetics King" },
      {
        property: "og:description",
        content: "Turn your extra diabetes supplies into cash and get top dollar.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const whyChoose = [
  {
    icon: ShieldCheck,
    title: "Respectful Review",
    text: "We look at your supply details carefully before following up.",
  },
  {
    icon: PackageCheck,
    title: "Clear Product Details",
    text: "Brand, condition, quantity, and expiry are kept easy to understand.",
  },
  {
    icon: Award,
    title: "Focused Buying",
    text: "You only see the product types we are currently reviewing.",
  },
  {
    icon: Lock,
    title: "Private Submission",
    text: "Your information is handled with care before the WhatsApp conversation starts.",
  },
  {
    icon: MessageCircle,
    title: "Real WhatsApp Follow-Up",
    text: "A real person can continue the conversation with the details you already sent.",
  },
  {
    icon: Zap,
    title: "Quick Next Step",
    text: "The form gives our team what they need to respond without back-and-forth confusion.",
  },
];

const brandImages = [
  { name: "FREESTYLE", image: freestyleProducts, type: "Brand" },
  { name: "DEXCOM", image: dexcomProducts, type: "Brand" },
  { name: "OMNIPOD", image: omnipodProducts, type: "Brand" },
  { name: "ONE TOUCH", image: oneTouchProducts, type: "Brand" },
  { name: "MEDTRONIC", image: medtronicImage, type: "Brand" },
  { name: "ACCU-CHEK", image: accuChekImage, type: "Brand" },
  { name: "CONTOUR NEXT", image: contourNextImage, type: "Brand" },
];

const normalizeBrandName = (value: string) => value.trim().replace(/\s+/g, " ").toUpperCase();

function buildBrandCards(products: Product[]) {
  const brands = new Map<string, { name: string; image: string | null; type: string }>();

  brandImages.forEach((brand) => {
    brands.set(normalizeBrandName(brand.name), brand);
  });

  products.forEach((product) => {
    const brandName = normalizeBrandName(product.brand);
    if (!brandName || brands.has(brandName)) return;

    brands.set(brandName, {
      name: brandName,
      image: product.image,
      type: "Brand",
    });
  });

  return Array.from(brands.values());
}

const sellerReviews = [
  {
    quote:
      "I had extra test strips after switching meters. Diabetics King made it easy to turn them into cash.",
    name: "Sarah M.",
    label: "Local Seller",
  },
  {
    quote:
      "Quick response, friendly communication, and a very simple process from start to finish.",
    name: "James K.",
    label: "Repeat Customer",
  },
  {
    quote:
      "Instead of letting supplies go to waste, I got help right away. The whole experience felt stress-free.",
    name: "Linda R.",
    label: "Happy Seller",
  },
  {
    quote:
      "The instructions were clear, and I knew exactly what details to send before getting my offer.",
    name: "Michael T.",
    label: "Verified Seller",
  },
  {
    quote:
      "I had sealed Dexcom sensors I no longer needed. The process felt simple and respectful.",
    name: "Amanda P.",
    label: "Dexcom Seller",
  },
  {
    quote:
      "They answered my questions quickly and helped me understand the next step without pressure.",
    name: "Robert H.",
    label: "Local Seller",
  },
  {
    quote:
      "I liked that everything continued through WhatsApp, so the conversation stayed easy to follow.",
    name: "Nadia K.",
    label: "Happy Seller",
  },
  {
    quote:
      "The offer process was straightforward. I submitted the product details and got a clear response.",
    name: "Chris W.",
    label: "Repeat Customer",
  },
  {
    quote:
      "I had extra Omnipod supplies after a device change. This gave them a useful second chance.",
    name: "Emily R.",
    label: "Omnipod Seller",
  },
  {
    quote: "The team was polite and made the whole thing feel less complicated than I expected.",
    name: "Daniel S.",
    label: "Verified Seller",
  },
  {
    quote:
      "I appreciated the quick follow-up and the simple form. It saved a lot of back-and-forth.",
    name: "Monica B.",
    label: "Local Seller",
  },
  {
    quote:
      "Selling my unused supplies was much easier once I could choose the exact product brand first.",
    name: "Anthony J.",
    label: "Happy Seller",
  },
  {
    quote:
      "The process was clear from product selection to payment details. Very smooth experience.",
    name: "Grace L.",
    label: "Repeat Customer",
  },
  {
    quote:
      "I had unopened FreeStyle Libre sensors at home. Diabetics King helped me move forward quickly.",
    name: "Olivia N.",
    label: "FreeStyle Seller",
  },
  {
    quote:
      "Friendly communication, simple steps, and no confusion about what information was needed.",
    name: "Kevin D.",
    label: "Verified Seller",
  },
];

const easySteps = [
  {
    number: "1",
    title: "Select Your Product",
    text: "Choose the items you want to sell from our list of accepted products.",
    tone: "from-emerald-50 to-green-100/70",
    titleClass: "text-emerald-700",
    numberClass: "from-emerald-600 to-green-500",
    icon: PackageCheck,
  },
  {
    number: "2",
    title: "Get An Offer From Experts",
    text: "Our experts will review your items and send you a fair, competitive offer.",
    tone: "from-sky-50 to-blue-100/70",
    titleClass: "text-sky-700",
    numberClass: "from-sky-600 to-blue-500",
    icon: ClipboardCheck,
  },
  {
    number: "3",
    title: "We Provide Free Shipping Label",
    text: "We’ll send you a prepaid shipping label. Pack your items and ship it to us for free.",
    tone: "from-orange-50 to-amber-100/80",
    titleClass: "text-orange-600",
    numberClass: "from-orange-600 to-amber-500",
    icon: Truck,
  },
  {
    number: "4",
    title: "Cashout On Delivery Day",
    text: "Once we receive and inspect your items, you’ll get paid the same day via your preferred method.",
    tone: "from-emerald-50 to-green-100/70",
    titleClass: "text-emerald-700",
    numberClass: "from-emerald-600 to-green-500",
    icon: CircleDollarSign,
  },
];

const trustBadges = [
  { icon: CheckCircle2, label: "Safe & Secure Transactions" },
  { icon: ClipboardCheck, label: "Expert Evaluation" },
  { icon: Truck, label: "Fast & Free Shipping" },
  { icon: CircleDollarSign, label: "Fast Payments" },
];

const legalQuestions = [
  {
    question: "Do you buy opened or used diabetic products?",
    answer:
      "We primarily review sealed, unused products. If packaging is damaged or opened, tell us clearly before shipping so our team can confirm whether it qualifies.",
  },
  {
    question: "Am I responsible for following local rules?",
    answer:
      "Yes. Sellers are responsible for confirming that they are allowed to sell the products they submit and that the items were obtained legally.",
  },
  {
    question: "Do you provide medical advice?",
    answer:
      "No. Diabetics King is a product review and buyback service. We do not provide medical, dosage, prescription, or treatment advice.",
  },
  {
    question: "When is payment sent?",
    answer:
      "Payment is sent after we receive and inspect the package, confirm it matches the submitted details, and approve the items.",
  },
  {
    question: "What happens if an item does not match the details?",
    answer:
      "Our team will contact you before completing the offer. Items that are expired, damaged, opened, or different from the submitted details may be rejected or repriced.",
  },
];

function Home() {
  const { products, error } = Route.useLoaderData();
  const activeProducts = useMemo(() => products.filter((product) => product.isActive), [products]);
  const featured = useMemo(() => activeProducts.slice(0, 8), [activeProducts]);
  const visibleBrands = useMemo(() => buildBrandCards(activeProducts), [activeProducts]);

  return (
    <Layout>
      <section className="relative overflow-hidden gradient-soft">
        <MedicalBackground />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
          <div className="space-y-6 animate-fade-in">
            <span className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-1 text-sm font-bold text-accent-foreground">
              <ShieldCheck className="h-4 w-4" /> Verified buyer • Fast payment
            </span>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              Turn Your Extra Diabetes Supplies Into Cash – Get Top Dollar💸
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Sell Your Unused Dexcom, Omnipod, FreeStyle Libre 3 Plus Sensors, Ozempic, Test Strips
              & More — Get an Offer, Ship Your Products, and Get Paid.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">
                  Browse Products <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={BUSINESS.facebook} target="_blank" rel="noopener noreferrer">
                  <Store className="h-4 w-4" /> Visit our Facebook
                </a>
              </Button>
            </div>
          </div>
          <HeroSlideshow />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {error && <ProductListError message={error} />}
        <SectionHeading
          title="Browse by Brand"
          subtitle="Choose the brand you have, then send the product details in a few simple steps."
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleBrands.map((brand) => (
            <Link
              key={brand.name}
              to="/products"
              search={{ brand: brand.name }}
              className="group overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-1.5 hover:border-secondary/50 hover:shadow-card"
            >
              <div className="relative overflow-hidden bg-white">
                {brand.image ? (
                  <img
                    src={brand.image}
                    alt={`${brand.name} diabetic supply brand`}
                    loading="lazy"
                    className="h-56 w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105 sm:h-64 lg:h-72"
                  />
                ) : (
                  <div className="grid h-56 w-full place-items-center text-secondary sm:h-64 lg:h-72">
                    <PackageCheck className="h-14 w-14" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/55 via-transparent to-transparent opacity-70" />
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-extrabold text-secondary shadow-soft backdrop-blur">
                  {brand.type}
                </span>
              </div>
              <div className="border-t border-border/60 px-5 py-5 text-center">
                <h3 className="text-base font-extrabold tracking-wide text-secondary">
                  {brand.name}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  View products from this {brand.type.toLowerCase()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeading
              title="Products We Buy"
              subtitle="Choose the item that matches what you have at home."
              align="left"
            />
            <Button asChild variant="ghost" className="shrink-0">
              <Link to="/products">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {featured.length === 0 ? (
            <EmptyState text="No active products are available yet." />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            title="What Our Sellers Say"
            subtitle="15 seller reviews moving across the page in a smooth horizontal flow."
          />
          <ReviewsMarquee />
        </div>
      </section>

      <HowToGetPaidSection />

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading
          title="Why Choose Diabetics King"
          subtitle="A warmer way to share your product details and get a clear follow-up."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((w) => (
            <div
              key={w.title}
              className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-hero text-primary-foreground">
                <w.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-bold">{w.title}</h3>
                <p className="text-sm text-muted-foreground">{w.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <LegalSection />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl gradient-hero px-6 py-12 text-center text-primary-foreground shadow-card sm:px-12">
          <h2 className="text-3xl font-extrabold">Have Diabetic Supplies to Sell?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Pick a product from our current buying list, send the details once, and continue on
            WhatsApp with a real person.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/products">
              Browse Products <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

function ReviewsMarquee() {
  return (
    <div className="reviews-marquee" aria-label="Seller reviews carousel">
      <div className="reviews-marquee-track">
        {[0, 1].map((group) => (
          <div key={group} className="flex shrink-0 gap-5 pr-5" aria-hidden={group === 1}>
            {sellerReviews.map((review) => (
              <ReviewCard key={`${group}-${review.name}`} review={review} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: (typeof sellerReviews)[number] }) {
  return (
    <article className="w-[20rem] shrink-0 rounded-3xl border border-border/60 bg-card p-6 shadow-soft sm:w-[23rem]">
      <div className="mb-4 flex items-center gap-1 text-secondary">
        {[0, 1, 2, 3, 4].map((star) => (
          <Star key={star} className="h-4 w-4 fill-current" />
        ))}
      </div>
      <Quote className="h-8 w-8 text-primary/30" />
      <p className="mt-3 min-h-24 text-sm leading-6 text-muted-foreground">“{review.quote}”</p>
      <div className="mt-5">
        <p className="font-bold">{review.name}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{review.label}</p>
      </div>
    </article>
  );
}

function HowToGetPaidSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <h2 className="text-4xl font-black uppercase tracking-wide text-[#06345f] sm:text-5xl">
          How To Get Paid
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
          A simple, secure flow from product selection to same-day payout after inspection.
        </p>
      </div>

      <div className="mt-9 grid gap-6 lg:grid-cols-4">
        {easySteps.map((step, index) => {
          const Icon = step.icon;

          return (
            <article
              key={step.number}
              className={`relative flex min-h-[360px] flex-col items-center rounded-[2rem] bg-gradient-to-br ${step.tone} px-6 py-7 text-center shadow-soft ring-1 ring-border/50`}
            >
              <span
                className={`grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${step.numberClass} text-4xl font-black text-white shadow-card`}
              >
                {step.number}
              </span>

              <span className="mt-8 grid h-20 w-20 place-items-center rounded-3xl bg-white/85 shadow-soft">
                <Icon className={`h-10 w-10 ${step.titleClass}`} />
              </span>

              <h3 className={`mt-7 text-2xl font-black uppercase leading-tight ${step.titleClass}`}>
                {step.title}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-800">{step.text}</p>

              {index < easySteps.length - 1 && (
                <span className="pointer-events-none absolute -right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#06345f] text-white shadow-card lg:grid">
                  <ArrowRight className="h-6 w-6" />
                </span>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {trustBadges.map((badge) => {
          const Icon = badge.icon;

          return (
            <div
              key={badge.label}
              className="flex items-center justify-center gap-3 text-slate-700"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-soft">
                <Icon className="h-7 w-7" />
              </span>
              <span className="max-w-40 text-base font-black uppercase leading-tight">
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function LegalSection() {
  return (
    <section className="bg-muted/40 py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-accent text-secondary shadow-soft">
            <Scale className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-3xl font-extrabold">Legal & Seller Questions</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            A few important notes before sending products for review.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {legalQuestions.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-border/60 bg-card p-5 shadow-soft"
            >
              <summary className="cursor-pointer list-none font-bold text-foreground">
                <span className="inline-flex w-full items-center justify-between gap-4">
                  {item.question}
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-open:rotate-90" />
                </span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  title,
  subtitle,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : ""}`}>
      <h2 className="text-3xl font-extrabold">{title}</h2>
      {subtitle && (
        <p
          className={`mt-2 text-muted-foreground ${align === "center" ? "mx-auto max-w-2xl" : ""}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
      {text}
    </div>
  );
}

function ProductListError({ message }: { message: string }) {
  return (
    <div className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
      Product list issue: {message}
    </div>
  );
}
