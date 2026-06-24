"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Package, MessageCircle } from "lucide-react";
import type { Supply } from "@/types/product";

export function SupplyCard({ supply, index }: { supply: Supply; index: number }) {
  const whatsappMessage = encodeURIComponent(
    `Hi! I'm interested in selling ${supply.name}. Can you provide more information?`
  );
  const whatsappUrl = `https://wa.me/18001234567?text=${whatsappMessage}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <Link href={`/supplies/${supply.slug}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            {supply.image_url ? (
              <motion.div
                className="w-full h-full"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
              >
                <Image
                  src={supply.image_url}
                  alt={supply.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <Package className="h-12 w-12 text-muted-foreground/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute top-3 right-3">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm text-xs border-border/50">
                {supply.category}
              </Badge>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {supply.name}
            </h3>
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {supply.short_description}
            </p>
          </div>
        </Link>

        <div className="px-4 pb-4">
          <Button
            size="sm"
            className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={(e) => {
              e.preventDefault();
              window.open(whatsappUrl, "_blank");
            }}
          >
            <MessageCircle className="h-4 w-4" /> Ask on WhatsApp
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
