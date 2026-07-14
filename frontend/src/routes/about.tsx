import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  CircleDollarSign,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { MedicalBackground } from "@/components/MedicalBackground";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/data";
import howItWorksImage from "@/assets/how it work.jpeg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: `How It Works - ${BUSINESS.name}` },
      {
        name: "description",
        content:
          "See the simple four-step process Diabetics King uses to review unused diabetic supplies, provide shipping, and help sellers get paid.",
      },
      { property: "og:title", content: `How It Works - ${BUSINESS.name}` },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: HowItWorks,
});

const steps = [
  {
    number: "1",
    icon: PackageCheck,
    title: "Select Your Product",
    text: "Choose the diabetes supplies, medicine, sensors, strips, or pump products you want to sell.",
    color: "text-emerald-700",
    badge: "from-emerald-600 to-green-500",
    card: "from-emerald-50 to-green-100/70",
  },
  {
    number: "2",
    icon: ClipboardCheck,
    title: "Get An Offer",
    text: "Send product details once. Our team reviews your item and follows up with a fair offer.",
    color: "text-sky-700",
    badge: "from-sky-600 to-blue-500",
    card: "from-sky-50 to-blue-100/70",
  },
  {
    number: "3",
    icon: Truck,
    title: "Free Shipping Label",
    text: "After your offer is confirmed, we provide a prepaid shipping label so you can ship for free.",
    color: "text-orange-600",
    badge: "from-orange-600 to-amber-500",
    card: "from-orange-50 to-amber-100/80",
  },
  {
    number: "4",
    icon: CircleDollarSign,
    title: "Get Paid",
    text: "Once your package is received and inspected, payment is sent through your preferred method.",
    color: "text-emerald-700",
    badge: "from-emerald-600 to-green-500",
    card: "from-emerald-50 to-green-100/70",
  },
];

const trustItems = [
  { icon: ShieldCheck, label: "Safe & Secure Transactions" },
  { icon: ClipboardCheck, label: "Expert Evaluation" },
  { icon: Truck, label: "Fast & Free Shipping" },
  { icon: CircleDollarSign, label: "Fast Payments" },
];

function HowItWorks() {
  return (
    <Layout>
      <section className="relative overflow-hidden gradient-soft border-b border-border/60">
        <MedicalBackground />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
          <div className="animate-fade-in">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground shadow-soft">
              <CheckCircle2 className="h-4 w-4" /> Simple. Fast. Secure.
            </span>
            <h1 className="text-4xl font-black uppercase tracking-wide text-[#06345f] sm:text-5xl">
              4 Easy Steps To Get Paid
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              Select your product, get a clear offer, ship with a prepaid label, and receive payment after inspection.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/products">Start With Your Product <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a href={`tel:${BUSINESS.phone}`}>Call {BUSINESS.phone}</a>
              </Button>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-white p-3 shadow-card">
            <img
              src={howItWorksImage}
              alt="Four easy steps to get paid: select product, get an offer, free shipping label, and receive payment"
              className="h-full w-full rounded-[1.5rem] object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-wide text-[#06345f] sm:text-4xl">How It Works</h2>
          <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
            A clear four-step flow designed to make selling extra diabetes supplies feel easy and human.
          </p>
        </div>

        <div className="mt-9 grid gap-6 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className={`relative rounded-[2rem] bg-gradient-to-br ${step.card} p-6 text-center shadow-soft ring-1 ring-border/50`}
              >
                <span
                  className={`mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br ${step.badge} text-4xl font-black text-white shadow-card`}
                >
                  {step.number}
                </span>
                <span className="mx-auto mt-6 grid h-20 w-20 place-items-center rounded-3xl bg-white/80 shadow-soft">
                  <Icon className={`h-10 w-10 ${step.color}`} />
                </span>
                <h3 className={`mt-5 text-2xl font-black uppercase leading-tight ${step.color}`}>{step.title}</h3>
                <p className="mt-4 text-base leading-7 text-slate-800">{step.text}</p>

                {index < steps.length - 1 && (
                  <span className="pointer-events-none absolute -right-5 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#06345f] text-white shadow-card lg:grid">
                    <ArrowRight className="h-6 w-6" />
                  </span>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-muted/40 py-14">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="flex items-center justify-center gap-3 rounded-2xl bg-card p-5 text-slate-700 shadow-soft">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-soft">
                  <Icon className="h-7 w-7" />
                </span>
                <span className="max-w-40 text-base font-black uppercase leading-tight">{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <div className="rounded-[2rem] gradient-hero px-6 py-12 text-primary-foreground shadow-card">
          <h2 className="text-3xl font-extrabold">Ready to sell your unused diabetes supplies?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-primary-foreground/90">
            Browse accepted products, choose what you have, and send the details to our team for review.
          </p>
          <Button asChild size="lg" variant="secondary" className="mt-6">
            <Link to="/products">Browse Products <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
