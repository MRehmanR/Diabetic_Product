"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SupplyCard } from "@/components/supply-card";
import { SupplyCardSkeleton } from "@/components/supply-skeleton";
import { supabase } from "@/lib/supabase";
import {
  ArrowRight,
  Shield,
  Clock,
  Activity,
  Droplets,
  Syringe,
  CheckCircle2,
  Camera,
  Zap,
  Banknote,
  Package,
  MessageCircle,
  Phone,
} from "lucide-react";
import type { Supply } from "@/types/product";

const howItWorks = [
  {
    step: 1,
    icon: Camera,
    title: "Send Photos",
    desc: "Send clear photos of your sealed supplies on WhatsApp — front and back with expiration dates visible.",
  },
  {
    step: 2,
    icon: MessageCircle,
    title: "Get a Quote",
    desc: "We review your items on WhatsApp and send a competitive offer, typically within minutes.",
  },
  {
    step: 3,
    icon: Banknote,
    title: "Get Paid Fast",
    desc: "Same-day payment via cash, Zelle, or PayPal once items are verified.",
  },
];

const trustBadges = [
  { icon: CheckCircle2, text: "50,000+ Payouts Made" },
  { icon: Shield, text: "Verified & Trusted" },
  { icon: Clock, text: "Same-Day Payment" },
  { icon: MessageCircle, text: "WhatsApp Support" },
];

const categories = [
  { name: "CGM Sensors", icon: Activity, slug: "CGM+Sensors", desc: "Dexcom, Libre, Medtronic" },
  { name: "Insulin Pump Supplies", icon: Syringe, slug: "Insulin+Pump+Supplies", desc: "Omnipod 5, DASH" },
  { name: "Test Strips", icon: Droplets, slug: "Test+Strips", desc: "Accu-Chek, Contour, OneTouch" },
];

const requirements = [
  "Factory sealed — no broken security tabs",
  "Valid expiration date",
  "No moisture damage",
  "No opened or tampered packaging",
];

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function HomePage() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSupplies() {
      const { data } = await supabase
        .from("supplies")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(4);
      if (data) setSupplies(data as Supply[]);
      setLoading(false);
    }
    fetchSupplies();
  }, []);

  const whatsappUrl = "https://wa.me/18001234567?text=Hi!%20I%20have%20some%20diabetic%20supplies%20to%20sell.%20Can%20you%20help?";

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-background to-secondary/[0.05]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/[0.04] rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32 relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1">
                <MessageCircle className="h-3 w-3 mr-1.5" /> WhatsApp Support Available
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.1]">
                We Buy Your
                <span className="text-primary block mt-1">Unused Diabetic</span>
                <span className="text-secondary block mt-1">Supplies</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-lg leading-relaxed">
                Have extra Dexcom, Libre, Omnipod, or test strips? We pay competitive rates for factory-sealed, unexpired diabetic supplies. Contact us on WhatsApp for a quick quote!
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  size="lg"
                  className="gap-2 shadow-lg shadow-emerald-500/20 h-11 px-6 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => window.open(whatsappUrl, "_blank")}
                >
                  <MessageCircle className="h-4 w-4" /> WhatsApp Us
                </Button>
                <Link href="/supplies">
                  <Button size="lg" variant="outline" className="gap-2 h-11 px-6">
                    <Package className="h-4 w-4" /> What We Buy
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-4">
                {trustBadges.map((badge) => (
                  <div key={badge.text} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <badge.icon className="h-4 w-4 text-primary" />
                    {badge.text}
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 animate-pulse-soft" />
                <div className="absolute inset-4 rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.pexels.com/photos/4114603/pexels-photo-4114603.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Diabetic supplies we buy"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                <motion.div
                  className="absolute -bottom-2 -left-4 bg-card border border-border/50 rounded-xl p-3.5 shadow-xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Contact</p>
                      <p className="text-sm font-semibold">WhatsApp Us</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -top-2 -right-4 bg-card border border-border/50 rounded-xl p-3.5 shadow-xl"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Trusted</p>
                      <p className="text-sm font-semibold">50K+ Payouts</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 border-y border-border/30 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="outline" className="mb-3 text-primary border-primary/30">Simple Process</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="text-muted-foreground mt-2">Three easy steps to turn your unused supplies into cash</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {howItWorks.map((step) => (
              <motion.div key={step.step} variants={fadeUp}>
                <div className="text-center p-6 rounded-xl border border-border/50 bg-card">
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {step.step}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <Badge variant="outline" className="mb-3 text-primary border-primary/30">Categories</Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What We Buy</h2>
            <p className="text-muted-foreground mt-2">We purchase a wide range of factory-sealed diabetic supplies</p>
          </motion.div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto"
          >
            {categories.map((cat) => (
              <motion.div key={cat.name} variants={fadeUp}>
                <Link href={`/supplies?category=${cat.slug}`}>
                  <div className="group relative rounded-xl border border-border/50 bg-card p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300 text-center h-full">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <cat.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{cat.name}</h3>
                    <p className="text-xs text-muted-foreground">{cat.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Supplies */}
      <section className="py-16 bg-card/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-8"
          >
            <div>
              <Badge variant="outline" className="mb-3 text-primary border-primary/30">Popular</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Supplies We Buy</h2>
              <p className="text-muted-foreground mt-1">Click on any item to ask on WhatsApp</p>
            </div>
            <Link href="/supplies" className="hidden sm:block">
              <Button variant="outline" size="sm" className="gap-1">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SupplyCardSkeleton key={i} />)
              : supplies.map((s, i) => <SupplyCard key={s.id} supply={s} index={i} />)}
          </div>

          <div className="mt-6 text-center sm:hidden">
            <Link href="/supplies">
              <Button variant="outline" className="gap-1">
                View All Supplies <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Condition Requirements */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Badge variant="outline" className="text-primary border-primary/30">Requirements</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Condition &amp; Expiration<br />Requirements
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All products must meet the following conditions to qualify for our buy-back program. Send us photos on WhatsApp for a quick assessment.
              </p>
              <div className="space-y-3">
                {requirements.map((req) => (
                  <div key={req} className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm pt-1">{req}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <Card className="border-primary/20">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-sm">Contact Us on WhatsApp</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    For the fastest response, reach out to us on WhatsApp. Send photos of your items and receive a competitive quote in minutes.
                  </p>
                  <Button
                    className="w-full gap-2 mt-4 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => window.open(whatsappUrl, "_blank")}
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp Us Now
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Banknote className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-sm">Payment Methods</h4>
                  </div>
                  <div className="space-y-2">
                    {[
                      { method: "Cash", desc: "Local in-person in Los Angeles" },
                      { method: "Zelle", desc: "Fast bank transfer, nationwide" },
                      { method: "PayPal", desc: "Secure digital payment" },
                    ].map((p) => (
                      <div key={p.method} className="flex items-center justify-between py-1">
                        <span className="text-sm font-medium">{p.method}</span>
                        <span className="text-xs text-muted-foreground">{p.desc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-sm">Drop-Off &amp; Shipping</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      In-person drop-off in Canoga Park / Los Angeles
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      Nationwide mail-in options available
                    </div>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      Same-day payment after verification
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 p-8 sm:p-12 lg:p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 relative">
              Ready to Sell Your Unused Diabetic Supplies?
            </h2>
            <p className="text-white/80 max-w-md mx-auto mb-6 relative">
              Contact us on WhatsApp with photos of your sealed supplies and get a competitive quote in minutes. Same-day payment after verification.
            </p>
            <div className="flex flex-wrap justify-center gap-3 relative">
              <Button
                size="lg"
                className="gap-2 shadow-lg bg-white text-emerald-700 hover:bg-emerald-50"
                onClick={() => window.open(whatsappUrl, "_blank")}
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp Us Now
              </Button>
              <Link href="/supplies">
                <Button size="lg" variant="outline" className="gap-2 border-white/30 text-white hover:bg-white/10">
                  <Package className="h-4 w-4" /> See What We Buy
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
