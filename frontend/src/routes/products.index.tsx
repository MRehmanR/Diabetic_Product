import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Layout } from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BUSINESS, brandsFromProducts, categoryName, loadProducts, type Product } from "@/lib/data";

type ProductSearch = {
  brand?: string;
  q?: string;
};

export const Route = createFileRoute("/products/")({
  loader: () => loadProducts(),
  validateSearch: (s: Record<string, unknown>): ProductSearch => ({
    brand: typeof s.brand === "string" ? s.brand : undefined,
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: `Products We Buy - ${BUSINESS.name}` },
      {
        name: "description",
        content:
          "Browse unused diabetic supplies Diabetics King is currently reviewing and start a friendly offer.",
      },
      { property: "og:title", content: "Products We Buy" },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

type SortKey = "newest" | "name";

function ProductsPage() {
  const { products, error } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const [query, setQuery] = useState(search.q ?? "");
  const [sort, setSort] = useState<SortKey>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const brands = brandsFromProducts(products);
  const brand = search.brand ?? "all";

  const setBrand = (value: string) =>
    navigate({
      search: (prev: ProductSearch) => ({ ...prev, brand: value === "all" ? undefined : value }),
    });

  const filtered = useMemo(() => {
    let list: Product[] = products.filter((p) => {
      const searchable =
        `${p.brand} ${p.name} ${p.serialNumber || ""} ${p.category} ${categoryName(p.category)} ${p.description}`.toLowerCase();

      if (brand !== "all" && !searchable.includes(brand.toLowerCase())) return false;
      if (query && !searchable.includes(query.toLowerCase())) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
    return list;
  }, [products, brand, query, sort]);

  return (
    <Layout>
      <section className="gradient-soft border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <h1 className="text-3xl font-extrabold">Products We Buy</h1>
          <p className="mt-1 text-muted-foreground">
            {error
              ? "Products could not be loaded"
              : `${filtered.length} products ready for a friendly review`}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr]">
        <aside className={`${showFilters ? "block" : "hidden"} space-y-6 lg:block`}>
          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
            <h3 className="mb-3 font-bold">Find your supply</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by product, brand, or serial no..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-soft">
            <h3 className="mb-2 font-bold">Brand / Category</h3>
            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All brands & categories</SelectItem>
                {brands.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </aside>

        <div>
          {error && (
            <div className="mb-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              Product list issue: {error}
            </div>
          )}
          <div className="mb-5 flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowFilters((v) => !v)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>
            <div className="ml-auto w-48">
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No products match your filters yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
