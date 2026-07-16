import { Link } from "@tanstack/react-router";
import { MessageCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderDialog } from "@/components/OrderDialog";
import { type Product, categoryName } from "@/lib/data";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:shadow-card">
      <Link
        to="/products/$id"
        params={{ id: product.id }}
        preload={false}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            width={480}
            height={480}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1280px) 280px, (min-width: 640px) 50vw, 100vw"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-muted-foreground">
            <Package className="h-12 w-12" />
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary">
          {categoryName(product.category)}
        </span>
        <Link
          to="/products/$id"
          params={{ id: product.id }}
          preload={false}
          className="line-clamp-2 font-semibold leading-snug transition-colors hover:text-primary"
        >
          {product.name}
        </Link>
        <span className="w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
          Brand: {product.brand}
        </span>
        {product.serialNumber && (
          <span className="text-xs font-semibold text-muted-foreground">
            Serial No: {product.serialNumber}
          </span>
        )}

        <div className="text-xs font-medium text-muted-foreground">
          {product.isActive ? "Ready for review" : "Not currently active"}
        </div>

        <div className="mt-auto grid grid-cols-1 gap-2 pt-2 sm:grid-cols-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/products/$id" params={{ id: product.id }} preload={false}>
              Details
            </Link>
          </Button>
          <OrderDialog product={product} disabled={!product.isActive}>
            <Button size="sm" variant="whatsapp" className="w-full" disabled={!product.isActive}>
              <MessageCircle className="h-4 w-4" />
              <span className="truncate">Ask on WhatsApp</span>
            </Button>
          </OrderDialog>
        </div>
      </div>
    </div>
  );
}
