import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Phone, MessageCircle, Clock, MapPin } from "lucide-react";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { MedicalBackground } from "@/components/MedicalBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { BUSINESS } from "@/lib/data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: `Contact Us - ${BUSINESS.name}` },
      { name: "description", content: "Contact Diabetics King by phone or WhatsApp for friendly help with unused diabetic supplies." },
      { property: "og:title", content: "Contact Diabetics King" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    const message = `Hello ${BUSINESS.name},

Name: ${result.data.name}
Email: ${result.data.email}

${result.data.message}`;
    window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="relative overflow-hidden gradient-soft border-b border-border/60">
        <MedicalBackground />
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 animate-fade-in">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground shadow-soft">
            <MessageCircle className="h-4 w-4" /> We reply fast on WhatsApp
          </span>
          <h1 className="text-4xl font-extrabold sm:text-5xl">Talk with a <span className="text-gradient">real person</span></h1>
          <p className="mt-3 text-muted-foreground">Have a question or want to sell supplies? Send a message and we’ll help you with the next step.</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div className="space-y-4">
          {[
            { icon: Phone, label: "Phone", value: BUSINESS.phone },
            { icon: MessageCircle, label: "WhatsApp", value: BUSINESS.phone },
            { icon: Clock, label: "Business Hours", value: "Contact us on WhatsApp" },
            { icon: MapPin, label: "Location", value: BUSINESS.city },
          ].map((c) => (
            <div key={c.label} className="group flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-card">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl gradient-hero text-primary-foreground transition-transform duration-300 group-hover:scale-110"><c.icon className="h-5 w-5" /></span>
              <div>
                <p className="text-sm text-muted-foreground">{c.label}</p>
                <p className="font-semibold">{c.value}</p>
              </div>
            </div>
          ))}
          <div className="overflow-hidden rounded-2xl border border-border/60 shadow-soft">
            <iframe
              title={`${BUSINESS.name} location`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.city)}&output=embed`}
              className="h-56 w-full"
              loading="lazy"
            />
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-border/60 bg-card p-6 shadow-soft">
          <h2 className="text-xl font-bold">Send us a quick WhatsApp message</h2>
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you have or how we can help." rows={5} className="mt-1" />
          </div>
          <Button type="submit" className="w-full" size="lg">Open WhatsApp</Button>
        </form>
      </div>
    </Layout>
  );
}
