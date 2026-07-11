import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  MessageCircle,
  Share2,
  Check,
  ShieldCheck,
  ArrowLeft,
  Package,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { OrderDialog } from "@/components/OrderDialog";
import {
  loadProduct,
  loadProducts,
  categoryName,
  formatPayout,
} from "@/lib/data";

export const Route = createFileRoute("/products/$id")({
  loader: async ({ params }) => {
    const { product, error } = await loadProduct(params.id);
    if (!product && !error) throw notFound();
    const { products } = product ? await loadProducts() : { products: [] };
    return {
      product,
      error,
      related: products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4),
    };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    return {
      meta: [
        { title: p ? `${p.name} - Diabaticking` : "Product - Diabaticking" },
        { name: "description", content: p?.description ?? "" },
        { property: "og:title", content: p?.name ?? "Product" },
        { property: "og:description", content: p?.description ?? "" },
        { property: "og:type", content: "product" },
        { property: "og:image", content: p?.image ?? "" },
        { property: "og:url", content: p ? `/products/${p.id}` : "/products" },
      ],
      links: p ? [{ rel: "canonical", href: `/products/${p.id}` }] : [],
    };
  },
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button asChild className="mt-6"><Link to="/products">Back to products</Link></Button>
      </div>
    </Layout>
  ),
  errorComponent: () => (
    <Layout>
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product could not load</h1>
        <Button asChild className="mt-6"><Link to="/products">Back to products</Link></Button>
      </div>
    </Layout>
  ),
  component: ProductDetails,
});

function ProductDetails() {
  const { product, related, error } = Route.useLoaderData();

  if (!product) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-24 text-center">
          <h1 className="text-2xl font-bold">Product could not load</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error ? `Backend connection issue: ${error}` : "The product is unavailable."}
          </p>
          <Button asChild className="mt-6"><Link to="/products">Back to products</Link></Button>
        </div>
      </Layout>
    );
  }

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Product link copied to clipboard");
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <Button asChild variant="ghost" size="sm" className="mb-4">
          <Link to="/products"><ArrowLeft className="h-4 w-4" /> Back to products</Link>
        </Button>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-soft">
              {product.image ? (
                <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
              ) : (
                <div className="grid aspect-square w-full place-items-center text-muted-foreground">
                  <Package className="h-16 w-16" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-accent text-accent-foreground">{categoryName(product.category)}</Badge>
              <Badge variant={product.isActive ? "default" : "secondary"}>
                {product.isActive ? "Currently buying" : product.status}
              </Badge>
            </div>
            <h1 className="text-3xl font-extrabold leading-tight">{product.name}</h1>
            <p className="text-2xl font-extrabold text-secondary">{formatPayout(product)}</p>
            <p className="text-muted-foreground">{product.fullDescription || product.description}</p>

            <div className="flex flex-wrap gap-3">
              <OrderDialog product={product} disabled={!product.isActive}>
                <Button size="lg" disabled={!product.isActive} className="flex-1 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90">
                  <MessageCircle className="h-5 w-5" /> Ask on WhatsApp
                </Button>
              </OrderDialog>
              <Button size="lg" variant="outline" onClick={share}>
                <Share2 className="h-5 w-5" /> Share
              </Button>
            </div>

            <div className="rounded-2xl border border-border/60 bg-card p-4">
              <div className="flex items-center gap-2 text-sm font-bold"><ShieldCheck className="h-4 w-4 text-secondary" /> Backend connected</div>
              <p className="mt-2 text-sm text-muted-foreground">
                This product is loaded from the backend catalog. Offer submissions are saved to the backend before WhatsApp opens.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2">
          {product.features.length > 0 && (
            <InfoList title="Key Features" items={product.features} />
          )}
          {product.requirements.length > 0 && (
            <InfoList title="Requirements" items={product.requirements} />
          )}
          {product.acceptedModels.length > 0 && (
            <InfoList title="Accepted Models" items={product.acceptedModels} />
          )}
          <div>
            <h2 className="mb-4 text-xl font-bold">Specifications</h2>
            <dl className="divide-y divide-border rounded-2xl border border-border/60 text-sm">
              <Spec k="Brand" v={product.brand} />
              <Spec k="Category" v={categoryName(product.category)} />
              <Spec k="Status" v={product.status} />
            </dl>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-extrabold">Related Products</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

function InfoList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-secondary" /> {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 px-4 py-2.5">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="text-right font-medium">{v}</dd>
    </div>
  );
}
