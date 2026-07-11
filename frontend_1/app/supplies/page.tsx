"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupplyCard } from "@/components/supply-card";
import { SupplyCardSkeleton } from "@/components/supply-skeleton";
import { apiClient } from "@/lib/api-client";
import type { Supply } from "@/types/product";

const allCategories = [
  "CGM Sensors",
  "Insulin Pump Supplies",
  "Test Strips",
];

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "name_asc", label: "Name: A to Z" },
];

export default function SuppliesPage() {
  const searchParams = useSearchParams();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    async function fetchSupplies() {
      setLoading(true);
      const { data } = await apiClient
        .from("supplies")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (data) setSupplies(data as Supply[]);
      setLoading(false);
    }
    fetchSupplies();
  }, []);

  const filtered = useMemo(() => {
    let result = [...supplies];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.short_description.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      );
    }

    if (category && category !== "all") {
      result = result.filter((s) => s.category === category);
    }

    switch (sort) {
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return result;
  }, [supplies, search, category, sort]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Diabetic Supplies We Buy</h1>
          <p className="text-muted-foreground mt-1">
            Browse the factory-sealed diabetic supplies we purchase. Contact us for competitive rates.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search supplies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active filters */}
        {(category !== "all" || search.trim()) && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {category !== "all" && (
              <Badge variant="secondary" className="gap-1">
                {category}
                <button
                  onClick={() => setCategory("all")}
                  className="ml-1 hover:text-destructive"
                >
                  x
                </button>
              </Badge>
            )}
            {search.trim() && (
              <Badge variant="secondary" className="gap-1">
                &quot;{search}&quot;
                <button
                  onClick={() => setSearch("")}
                  className="ml-1 hover:text-destructive"
                >
                  x
                </button>
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-6"
              onClick={() => {
                setCategory("all");
                setSearch("");
              }}
            >
              Clear all
            </Button>
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-4">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <SupplyCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-1">No supplies found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Try adjusting your search or filter criteria.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setCategory("all");
                setSearch("");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((s, i) => (
              <SupplyCard key={s.id} supply={s} index={i} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

