import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  Award,
  Lock,
  MessageCircle,
  Zap,
  ArrowRight,
  Store,
  PackageCheck,
  HeartHandshake,
  Quote,
  Recycle,
  Clock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { MedicalBackground } from "@/components/MedicalBackground";
import { BUSINESS, categoriesFromProducts, loadProducts } from "@/lib/data";
import heroImage from "@/assets/hero.jpg";
import heroImageTwo from "@/assets/hero-2.jpg";
import heroImageThree from "@/assets/hero-3.jpg";
import freestyleImage from "@/assets/brands/freestyle.svg";
import dexcomImage from "@/assets/brands/dexcom.svg";
import omnipodImage from "@/assets/brands/omnipod.svg";
import bayerImage from "@/assets/brands/bayer.svg";
import oneTouchImage from "@/assets/brands/one-touch.svg";
import medtronicImage from "@/assets/brands/medtronic.svg";
import accuChekImage from "@/assets/brands/accu-chek.svg";

export const Route = createFileRoute("/")({
  loader: () => loadProducts(),
  head: () => ({
    meta: [
      { title: BUSINESS.name },
      { name: "description", content: "Sell unused diabetic products to Diabetics King. Share product details and continue on WhatsApp for a friendly follow-up." },
      { property: "og:title", content: "Diabetics King" },
      { property: "og:description", content: "We buy unused diabetic products on top dollars." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const whyChoose = [
  { icon: ShieldCheck, title: "Respectful Review", text: "We look at your supply details carefully before following up." },
  { icon: PackageCheck, title: "Clear Product Details", text: "Brand, condition, quantity, and expiry are kept easy to understand." },
  { icon: Award, title: "Focused Buying", text: "You only see the product types we are currently reviewing." },
  { icon: Lock, title: "Private Submission", text: "Your information is handled with care before the WhatsApp conversation starts." },
  { icon: MessageCircle, title: "Real WhatsApp Follow-Up", text: "A real person can continue the conversation with the details you already sent." },
  { icon: Zap, title: "Quick Next Step", text: "The form gives our team what they need to respond without back-and-forth confusion." },
];

const brandImages = [
  { name: "FREESTYLE", image: freestyleImage },
  { name: "DEXCOM", image: dexcomImage },
  { name: "OMNIPOD", image: omnipodImage },
  { name: "BAYER", image: bayerImage },
  { name: "ONE TOUCH", image: oneTouchImage },
  { name: "MEDTRONIC", image: medtronicImage },
  { name: "ACCU-CHEK", image: accuChekImage },
];

const sellerReviews = [
  {
    quote: "I had extra test strips after switching meters. Diabetics King made it easy to turn them into cash.",
    name: "Sarah M.",
    label: "Local Seller",
  },
  {
    quote: "Quick response, friendly communication, and a very simple process from start to finish.",
    name: "James K.",
    label: "Repeat Customer",
  },
  {
    quote: "Instead of letting supplies go to waste, I got help right away. The whole experience felt stress-free.",
    name: "Linda R.",
    label: "Happy Seller",
  },
];

const whySellHere = [
  {
    icon: Recycle,
    title: "Unused supplies can help someone else",
    text: "If you receive more sealed diabetic products than you can use, selling them keeps good supplies from sitting unused.",
  },
  {
    icon: HeartHandshake,
    title: "A human team reviews every offer",
    text: "Share the product brand, quantity, condition, and expiry. We follow up with care instead of making the process feel cold.",
  },
  {
    icon: Clock,
    title: "Simple flow, quick follow-up",
    text: "Pick the product, submit the details once, and continue the conversation directly on WhatsApp.",
  },
];

const categoryImageFallbacks: Record<string, string> = {
  "glucose-meters": heroImageTwo,
  "test-strips": heroImage,
  lancets: heroImageThree,
  "insulin-supplies": heroImageTwo,
  "sugar-free-foods": heroImageThree,
  "medicine-accessories": heroImage,
  "foot-care": heroImageTwo,
  "bp-monitors": heroImageThree,
  supplements: heroImage,
  "medical-equipment": heroImageTwo,
};

function Home() {
  const { products, error } = Route.useLoaderData();
  const activeProducts = products.filter((product) => product.isActive);
  const featured = activeProducts.slice(0, 8);
  const categories = categoriesFromProducts(activeProducts);

  const imageForCategory = (slug: string) =>
    activeProducts.find((product) => product.category === slug && product.image)?.image ||
    categoryImageFallbacks[slug] ||
    heroImage;

  return (
    <Layout>
      <section className="relative overflow-hidden gradient-soft">
        <MedicalBackground />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
          <div className="space-y-6 animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-soft">
              <ShieldCheck className="h-4 w-4" /> {BUSINESS.tagline}
            </span>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
              We Buy Your Unused Diabetic Products with Care
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Tell us what sealed diabetic supplies you have. Share the brand, quantity, condition, and expiry, and our team will follow up on WhatsApp with a fair next step.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">Browse Products <ArrowRight className="h-4 w-4" /></Link>
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
        <SectionHeading title="Browse by Category" subtitle="Start with the supply type you have, then send the details in a few simple steps." />
        {categories.length === 0 ? (
          <EmptyState text="No active product categories are available yet." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const categoryImage = imageForCategory(c.slug);
              return (
                <Link
                  key={c.slug}
                  to="/products"
                  search={{ category: c.slug }}
                  className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-1.5 hover:border-secondary/50 hover:shadow-card"
                >
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={categoryImage}
                      alt={`${c.name} diabetic supplies`}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/20 to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-extrabold text-secondary shadow-soft backdrop-blur">
                      Category
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-extrabold leading-tight">{c.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">See the products we review in this category.</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading title="Brands We Buy" subtitle="We review sealed, unused diabetic supplies from trusted major brands." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {brandImages.map((brand) => (
              <div key={brand.name} className="group overflow-hidden rounded-3xl border border-border/60 bg-card shadow-soft transition-all hover:-translate-y-1 hover:border-secondary/50 hover:shadow-card">
                <img
                  src={brand.image}
                  alt={`${brand.name} diabetic supply brand`}
                  loading="lazy"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="border-t border-border/60 px-3 py-3 text-center text-xs font-extrabold tracking-wide text-secondary">
                  {brand.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeading title="Products We Buy" subtitle="Choose the item that matches what you have at home." align="left" />
            <Button asChild variant="ghost" className="shrink-0">
              <Link to="/products">View all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          {featured.length === 0 ? (
            <EmptyState text="No active products are available yet." />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading title="What Our Sellers Say" subtitle="Simple, human experiences from people who had extra diabetic supplies." />
          <div className="grid gap-5 md:grid-cols-3">
            {sellerReviews.map((review) => (
              <article key={review.name} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
                <div className="mb-4 flex items-center gap-1 text-secondary">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <Quote className="h-8 w-8 text-primary/30" />
                <p className="mt-3 text-sm leading-6 text-muted-foreground">“{review.quote}”</p>
                <div className="mt-5">
                  <p className="font-bold">{review.name}</p>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">{review.label}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-soft">
              <HeartHandshake className="h-4 w-4" /> Why sell here?
            </span>
            <h2 className="mt-4 text-3xl font-extrabold">Turn extra diabetic supplies into a helpful second chance.</h2>
            <p className="mt-3 text-muted-foreground">
              Many people receive more supplies than they can use, switch devices, or have sealed boxes sitting at home. Diabetics King gives you a simple, respectful way to send those details to a real team and keep usable products from going to waste.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link to="/products">Start with your product <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-4">
            {whySellHere.map((item) => (
              <div key={item.title} className="flex gap-4 rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl gradient-hero text-primary-foreground">
                  <item.icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading title="Why Choose Diabetics King" subtitle="A warmer way to share your product details and get a clear follow-up." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whyChoose.map((w) => (
            <div key={w.title} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
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

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl gradient-hero px-6 py-12 text-center text-primary-foreground shadow-card sm:px-12">
          <h2 className="text-3xl font-extrabold">Have Diabetic Supplies to Sell?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Pick a product from our current buying list, send the details once, and continue on WhatsApp with a real person.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/products">Browse Products <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}

function SectionHeading({ title, subtitle, align = "center" }: { title: string; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={`mb-8 ${align === "center" ? "text-center" : ""}`}>
      <h2 className="text-3xl font-extrabold">{title}</h2>
      {subtitle && <p className={`mt-2 text-muted-foreground ${align === "center" ? "mx-auto max-w-2xl" : ""}`}>{subtitle}</p>}
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
