import { createFileRoute, Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
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
  { icon: ShieldCheck, title: "Verified Process", text: "Your offer is saved directly to our review system." },
  { icon: PackageCheck, title: "Clear Product Review", text: "We check the brand, condition, quantity, and expiry details before following up." },
  { icon: Award, title: "Focused Buying", text: "Browse only the product types we are actively reviewing." },
  { icon: Lock, title: "Secure Submission", text: "Your details are saved for our review team before WhatsApp opens." },
  { icon: MessageCircle, title: "WhatsApp Follow-Up", text: "Continue the conversation immediately after submitting." },
  { icon: Zap, title: "Fast Response", text: "Our team receives your product details with every offer." },
];

const brandNames = [
  "FREESTYLE",
  "DEXCOM",
  "OMNIPOD",
  "BAYER",
  "ONE TOUCH",
  "MEDTRONIC",
  "ACCU-CHEK",
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

function Home() {
  const { products, error } = Route.useLoaderData();
  const activeProducts = products.filter((product) => product.isActive);
  const featured = activeProducts.slice(0, 8);
  const categories = categoriesFromProducts(activeProducts);

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
              We Buy your Diabetic Unused Products on Top Dollars
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Tell us what sealed diabetic products you have, share the condition and expiry, and we will follow up on WhatsApp with a fair offer.
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
        <SectionHeading title="Browse by Category" subtitle="Choose the type of unused diabetic product you want to sell." />
        {categories.length === 0 ? (
          <EmptyState text="No active product categories are available yet." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => {
              const Icon = (Icons[c.icon as keyof typeof Icons] ?? Icons.Package) as React.ComponentType<{ className?: string }>;
              return (
                <Link
                  key={c.slug}
                  to="/products"
                  search={{ category: c.slug }}
                  className="group rounded-3xl border border-border/60 bg-card p-6 shadow-soft transition-all hover:-translate-y-1.5 hover:border-secondary/50 hover:shadow-card"
                >
                  <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent text-secondary transition-colors group-hover:gradient-hero group-hover:text-primary-foreground">
                      <Icon className="h-7 w-7" />
                    </span>
                    <div className="text-left">
                      <h3 className="font-bold leading-tight">{c.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">View products in this category</p>
                    </div>
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
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
            {brandNames.map((brand) => (
              <div
                key={brand}
                className="rounded-2xl border border-border/60 bg-card px-4 py-5 text-center text-sm font-extrabold tracking-wide text-secondary shadow-soft"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-8 flex items-end justify-between gap-4">
            <SectionHeading title="Products We Buy" subtitle="A current buying list for unused diabetic products." align="left" />
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
          <SectionHeading title="What Our Sellers Say" subtitle="Real experiences from people who sold their unused diabetic supplies." />
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
              Many people receive more supplies than they can use, switch devices, or have sealed boxes sitting at home. Diabetics King gives you a simple way to send those details to a real team and keep usable products from going to waste.
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
        <SectionHeading title="Why Choose Diabetics King" subtitle="A simple, friendly way to send your product details." />
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
          <h2 className="text-3xl font-extrabold">Have Diabetes Products to Sell?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Pick a product from our current buying list, submit your details, and continue on WhatsApp.
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
