"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { SupplyDetailSkeleton } from "@/components/supply-skeleton";
import { apiClient } from "@/lib/api-client";
import {
  ArrowLeft,
  CheckCircle2,
  Package,
  Info,
  ShieldCheck,
  Camera,
  Zap,
  MessageCircle,
} from "lucide-react";
import type { Supply } from "@/types/product";

export default function SupplyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [supply, setSupply] = useState<Supply | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSupply() {
      const slug = params.slug as string;
      const { data } = await apiClient
        .from("supplies")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) setSupply(data as Supply);
      setLoading(false);
    }
    fetchSupply();
  }, [params.slug]);

  if (loading) return <SupplyDetailSkeleton />;

  if (!supply) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Supply Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The supply category you are looking for does not exist.
        </p>
        <Button variant="outline" onClick={() => router.push("/supplies")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Supplies
        </Button>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in selling ${supply.name}. Can you provide more information about what you pay for this item?`
  );
  const whatsappUrl = `https://wa.me/18001234567?text=${whatsappMessage}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <Link href="/supplies">
          <Button variant="ghost" size="sm" className="mb-6 gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Supplies
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-sm">
              {supply.image_url ? (
                <motion.div
                  className="w-full h-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Image
                    src={supply.image_url}
                    alt={supply.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <Package className="h-20 w-20 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-5"
          >
            <div>
              <Badge variant="outline" className="mb-3">{supply.category}</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                {supply.name}
              </h1>
            </div>

            <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 p-4">
              <p className="text-sm text-emerald-700 dark:text-emerald-400">
                We pay competitive rates for this item. Contact us on WhatsApp for a quick quote!
              </p>
            </div>

            <Button
              size="lg"
              className="gap-2 w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg"
              onClick={() => window.open(whatsappUrl, "_blank")}
            >
              <MessageCircle className="h-5 w-5" /> Ask on WhatsApp
            </Button>

            <Separator />

            <div>
              <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" /> About This Category
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {supply.full_description}
              </p>
            </div>

            {/* Models we buy */}
            {supply.models && supply.models.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-3">Models We Buy</h3>
                <div className="flex flex-wrap gap-2">
                  {supply.models.map((model, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {supply.features && supply.features.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-3">Why Sell to Us</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {supply.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Requirements & How to Sell */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <Separator className="mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Requirements */}
            <Card className="border-primary/20 lg:col-span-2">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">Condition Requirements</h3>
                </div>
                {supply.requirements && supply.requirements.length > 0 ? (
                  <ul className="space-y-2">
                    {supply.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ul className="space-y-2">
                    {[
                      "Factory sealed (no broken security tabs)",
                      "Valid expiration date",
                      "No moisture damage",
                      "No opened or tampered packaging",
                    ].map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            {/* How to Sell */}
            <Card className="border-emerald-200 dark:border-emerald-900/30">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="font-semibold">How to Sell</h3>
                </div>
                <div className="space-y-3">
                  {[
                    { step: "1", text: "Send photos of your items on WhatsApp" },
                    { step: "2", text: "Receive your competitive quote" },
                    { step: "3", text: "Get paid same-day after verification" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center justify-center flex-shrink-0 mt-0.5 font-bold">
                        {item.step}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full gap-2 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  size="sm"
                  onClick={() => window.open(whatsappUrl, "_blank")}
                >
                  <MessageCircle className="h-3.5 w-3.5" /> Ask on WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Related */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              More in <span className="font-medium text-foreground">{supply.category}</span>
            </p>
            <Link href={`/supplies?category=${encodeURIComponent(supply.category)}`}>
              <Button variant="outline" size="sm" className="gap-1">
                View All <ArrowLeft className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}


