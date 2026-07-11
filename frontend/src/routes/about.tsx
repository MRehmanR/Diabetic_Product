import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, ClipboardCheck, HeartHandshake, ShieldCheck, Award } from "lucide-react";
import { Layout } from "@/components/Layout";
import { MedicalBackground } from "@/components/MedicalBackground";
import { Button } from "@/components/ui/button";
import { BUSINESS } from "@/lib/data";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us - Diabaticking" },
      { name: "description", content: "Learn how Diabaticking reviews diabetes care product offers through its backend-powered catalog and quote request flow." },
      { property: "og:title", content: "About Diabaticking" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <Layout>
      <section className="relative overflow-hidden gradient-soft border-b border-border/60">
        <MedicalBackground />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 animate-fade-in">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-soft">
            <HeartHandshake className="h-4 w-4" /> Trusted Diabetes Care Buyers
          </span>
          <h1 className="text-4xl font-extrabold sm:text-5xl">About <span className="text-gradient">{BUSINESS.name}</span></h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            We review diabetes care products through a backend-managed catalog. Choose a product, submit your details, and our team receives the offer for follow-up.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, title: "Our Mission", text: "Make it simple for people to submit diabetes care products for review and pricing." },
            { icon: Eye, title: "Our Process", text: "The public catalog and offer form are connected to the backend, so submissions reach the admin workflow." },
            { icon: ClipboardCheck, title: "Our Catalog", text: "Products, categories, payout ranges and requirements are managed from backend data." },
          ].map((c) => (
            <div key={c.title} className="group rounded-2xl border border-border/60 bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-card">
              <span className="grid h-12 w-12 place-items-center rounded-xl gradient-hero text-primary-foreground transition-transform duration-300 group-hover:scale-110"><c.icon className="h-6 w-6" /></span>
              <h2 className="mt-4 text-xl font-bold">{c.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <span className="grid mx-auto h-14 w-14 place-items-center rounded-2xl bg-accent text-secondary"><HeartHandshake className="h-7 w-7" /></span>
          <h2 className="mt-4 text-3xl font-extrabold">Connected Offer Flow</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Each product offer is saved through the backend offer endpoint before WhatsApp opens, giving the admin side a real record to review.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-soft"><ShieldCheck className="h-4 w-4 text-secondary" /> Backend Catalog</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium shadow-soft"><Award className="h-4 w-4 text-primary" /> Saved Offers</span>
          </div>
          <Button asChild size="lg" className="mt-8"><Link to="/products">Explore Products</Link></Button>
        </div>
      </section>
    </Layout>
  );
}
