import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  ClipboardList,
  DollarSign,
  LayoutDashboard,
  LogOut,
  Package,
  Pencil,
  Plus,
  Search,
  Tags,
  Trash2,
  TrendingUp,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import type { BlogFormData, BlogPost, Offer, Supply, SupplyFormData } from "@/lib/admin-types";
import { AdminSupplyForm } from "@/components/AdminSupplyForm";
import { AdminBlogForm } from "@/components/AdminBlogForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Admin Dashboard - Diabetics King" }],
  }),
  component: AdminDashboardPage,
});

const offerStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800" },
  quoted: { label: "Quoted", className: "bg-blue-100 text-blue-800" },
  accepted: { label: "Accepted", className: "bg-emerald-100 text-emerald-800" },
  declined: { label: "Declined", className: "bg-red-100 text-red-800" },
  completed: { label: "Completed", className: "bg-primary/10 text-primary" },
};

const brandToCategory = (brand: string) =>
  brand
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "products";

const normalizeBrand = (brand: string) => brand.trim().replace(/\s+/g, " ").toUpperCase();
const ALL_BRANDS_VALUE = "__all_brands__";

type ProductSort = "newest" | "oldest" | "name_asc" | "brand_asc" | "active_first";

const formatMoney = (amount: number | string | null | undefined) => {
  const value = Number(amount);
  if (!Number.isFinite(value)) return "-";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
};

function AdminDashboardPage() {
  const navigate = useNavigate();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [customBrands, setCustomBrands] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [search, setSearch] = useState("");
  const [brandFilter, setBrandFilter] = useState(ALL_BRANDS_VALUE);
  const [productSort, setProductSort] = useState<ProductSort>("newest");
  const [offerSearch, setOfferSearch] = useState("");
  const [blogSearch, setBlogSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [brandFormOpen, setBrandFormOpen] = useState(false);
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [deleteSupply, setDeleteSupply] = useState<Supply | null>(null);
  const [deleteBlog, setDeleteBlog] = useState<BlogPost | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [blogFormLoading, setBlogFormLoading] = useState(false);
  const [brandFormLoading, setBrandFormLoading] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [quoteAmount, setQuoteAmount] = useState("");
  const [brandToRename, setBrandToRename] = useState("");
  const [newBrandName, setNewBrandName] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const {
        data: { session },
      } = await adminApi.auth.getSession();
      if (!session) {
        navigate({ to: "/admin/login", replace: true });
        return;
      }
      setAuthChecked(true);
    }
    checkAuth();
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [suppliesRes, offersRes, blogsRes] = await Promise.all([
      adminApi.from("supplies").select("*").order("created_at", { ascending: false }),
      adminApi.from("offers").select("*").order("created_at", { ascending: false }),
      adminApi.from("blogs").select("*").order("created_at", { ascending: false }),
    ]);

    if (suppliesRes.error)
      toast.error("Could not load products", { description: suppliesRes.error.message });
    if (offersRes.error)
      toast.error("Could not load offers", { description: offersRes.error.message });
    if (blogsRes.error)
      toast.error("Could not load blogs", { description: blogsRes.error.message });

    setSupplies((suppliesRes.data as Supply[]) || []);
    setOffers((offersRes.data as Offer[]) || []);
    setBlogs((blogsRes.data as BlogPost[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authChecked) fetchData();
  }, [authChecked, fetchData]);

  async function handleLogout() {
    await adminApi.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  async function handleFormSubmit(formData: SupplyFormData) {
    setFormLoading(true);
    const normalizedBrand = normalizeBrand(formData.brand);
    const descriptionFallback = formData.name.trim();
    const payload = {
      name: formData.name,
      brand: normalizedBrand,
      serial_number: formData.serial_number.trim() || null,
      short_description: formData.short_description.trim() || descriptionFallback,
      full_description: formData.short_description.trim() || descriptionFallback,
      category: brandToCategory(normalizedBrand),
      requirements: [],
      models: [],
      image_url: formData.image_url,
      features: [],
      is_active: formData.is_active,
      status: formData.is_active ? "active" : "inactive",
    };

    const result = editingSupply
      ? await adminApi.from("supplies").update(payload).eq("id", editingSupply.id)
      : await adminApi.from("supplies").insert(payload);

    setFormLoading(false);

    if (result.error) {
      toast.error(editingSupply ? "Failed to update product" : "Failed to add product", {
        description: result.error.message,
      });
      return;
    }

    toast.success(editingSupply ? "Product updated" : "Product added");
    setCustomBrands((prev) => (prev.includes(normalizedBrand) ? prev : [...prev, normalizedBrand]));
    setFormOpen(false);
    setEditingSupply(null);
    fetchData();
  }

  async function handleDelete() {
    if (!deleteSupply) return;
    const { error } = await adminApi.from("supplies").delete().eq("id", deleteSupply.id);
    if (error) {
      toast.error("Failed to delete product", { description: error.message });
    } else {
      toast.success("Product deleted");
      fetchData();
    }
    setDeleteSupply(null);
  }

  function openBrandRenameForm() {
    const selectedBrand = brandFilter !== ALL_BRANDS_VALUE ? brandFilter : availableBrands[0] || "";
    setBrandToRename(selectedBrand);
    setNewBrandName(selectedBrand);
    setBrandFormOpen(true);
  }

  async function handleBrandRename(e: FormEvent) {
    e.preventDefault();
    const oldBrand = normalizeBrand(brandToRename);
    const renamedBrand = normalizeBrand(newBrandName);

    if (!oldBrand || !renamedBrand) {
      toast.error("Please select a brand and enter a new brand name.");
      return;
    }

    if (oldBrand === renamedBrand) {
      toast.error("New brand name must be different.");
      return;
    }

    const productsToUpdate = supplies.filter(
      (supply) => normalizeBrand(supply.brand || "") === oldBrand,
    );
    if (productsToUpdate.length === 0) {
      toast.error("No products found for this brand.");
      return;
    }

    setBrandFormLoading(true);
    const results = await Promise.all(
      productsToUpdate.map((supply) =>
        adminApi
          .from("supplies")
          .update({
            brand: renamedBrand,
            category: brandToCategory(renamedBrand),
          })
          .eq("id", supply.id),
      ),
    );
    setBrandFormLoading(false);

    const failed = results.find((result) => result.error);
    if (failed?.error) {
      toast.error("Failed to rename brand", { description: failed.error.message });
      fetchData();
      return;
    }

    setSupplies((prev) =>
      prev.map((supply) =>
        normalizeBrand(supply.brand || "") === oldBrand
          ? { ...supply, brand: renamedBrand, category: brandToCategory(renamedBrand) }
          : supply,
      ),
    );
    setCustomBrands((prev) => [
      ...prev.filter((brand) => normalizeBrand(brand) !== oldBrand),
      renamedBrand,
    ]);
    setBrandFilter(renamedBrand);
    setBrandFormOpen(false);
    setBrandToRename("");
    setNewBrandName("");
    toast.success(`Renamed ${oldBrand} to ${renamedBrand}`);
    fetchData();
  }

  async function handleBlogSubmit(formData: BlogFormData) {
    setBlogFormLoading(true);
    const payload = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      image_url: formData.image_url || null,
      author: formData.author || "Diabetics King",
      is_published: formData.is_published,
      status: formData.is_published ? "published" : "draft",
    };

    const result = editingBlog
      ? await adminApi.from("blogs").update(payload).eq("id", editingBlog.id)
      : await adminApi.from("blogs").insert(payload);

    setBlogFormLoading(false);

    if (result.error) {
      toast.error(editingBlog ? "Failed to update article" : "Failed to add article", {
        description: result.error.message,
      });
      return;
    }

    toast.success(editingBlog ? "Article updated" : "Article added");
    setBlogFormOpen(false);
    setEditingBlog(null);
    fetchData();
  }

  async function handleDeleteBlog() {
    if (!deleteBlog) return;
    const { error } = await adminApi.from("blogs").delete().eq("id", deleteBlog.id);
    if (error) {
      toast.error("Failed to delete article", { description: error.message });
    } else {
      toast.success("Article deleted");
      fetchData();
    }
    setDeleteBlog(null);
  }

  async function updateOfferStatus(offer: Offer, status: Offer["status"], quotedAmount?: number) {
    const update: Record<string, unknown> = { status };
    if (quotedAmount !== undefined) update.quoted_amount = quotedAmount;
    const { error } = await adminApi.from("offers").update(update).eq("id", offer.id);
    if (error) {
      toast.error("Failed to update offer", { description: error.message });
      return;
    }
    toast.success(`Offer marked ${status}`);
    setEditingOffer(null);
    setQuoteAmount("");
    fetchData();
  }

  const filteredSupplies = useMemo(() => {
    const q = search.trim().toLowerCase();
    const selectedBrand = brandFilter === ALL_BRANDS_VALUE ? "" : normalizeBrand(brandFilter);
    const rows = supplies.filter((supply) => {
      const matchesSearch =
        !q ||
        `${supply.name} ${supply.brand || ""} ${supply.serial_number || ""} ${supply.category}`
          .toLowerCase()
          .includes(q);
      const matchesBrand = !selectedBrand || normalizeBrand(supply.brand || "") === selectedBrand;
      return matchesSearch && matchesBrand;
    });

    return [...rows].sort((left, right) => {
      if (productSort === "oldest") {
        return new Date(left.created_at).getTime() - new Date(right.created_at).getTime();
      }
      if (productSort === "name_asc") {
        return left.name.localeCompare(right.name);
      }
      if (productSort === "brand_asc") {
        return `${left.brand} ${left.name}`.localeCompare(`${right.brand} ${right.name}`);
      }
      if (productSort === "active_first") {
        return (
          Number(right.is_active) - Number(left.is_active) || left.name.localeCompare(right.name)
        );
      }
      return new Date(right.created_at).getTime() - new Date(left.created_at).getTime();
    });
  }, [supplies, search, brandFilter, productSort]);

  const filteredOffers = useMemo(() => {
    const q = offerSearch.trim().toLowerCase();
    if (!q) return offers;
    return offers.filter((offer) =>
      `${offer.name} ${offer.email || ""} ${offer.phone || ""} ${offer.supply_type}`
        .toLowerCase()
        .includes(q),
    );
  }, [offers, offerSearch]);

  const filteredBlogs = useMemo(() => {
    const q = blogSearch.trim().toLowerCase();
    if (!q) return blogs;
    return blogs.filter((post) =>
      `${post.title} ${post.excerpt} ${post.author}`.toLowerCase().includes(q),
    );
  }, [blogs, blogSearch]);

  const availableBrands = useMemo(
    () =>
      Array.from(
        new Set([
          ...supplies.map((supply) => normalizeBrand(supply.brand || "")).filter(Boolean),
          ...customBrands,
        ]),
      ).sort((a, b) => a.localeCompare(b)),
    [supplies, customBrands],
  );

  const stats = [
    { label: "Total Products", value: supplies.length, icon: Package, color: "text-primary" },
    {
      label: "Active",
      value: supplies.filter((s) => s.is_active).length,
      icon: TrendingUp,
      color: "text-emerald-600",
    },
    { label: "Brands", value: availableBrands.length, icon: Tags, color: "text-sky-600" },
    {
      label: "Pending Offers",
      value: offers.filter((o) => o.status === "pending").length,
      icon: Clock,
      color: "text-amber-600",
    },
    { label: "Blog Articles", value: blogs.length, icon: BookOpen, color: "text-primary" },
  ];

  if (!authChecked) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Manage backend products and customer offers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate({ to: "/products" })}>
              <ArrowLeft className="h-3.5 w-3.5" /> View Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted/80">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" className="gap-1.5">
              <Package className="h-3.5 w-3.5" /> Products
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" /> Offers
            </TabsTrigger>
            <TabsTrigger value="blogs" className="gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> Blogs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-4">
            <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto_auto]">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={brandFilter} onValueChange={setBrandFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_BRANDS_VALUE}>All brands</SelectItem>
                  {availableBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={productSort}
                onValueChange={(value) => setProductSort(value as ProductSort)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort products" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest first</SelectItem>
                  <SelectItem value="oldest">Oldest first</SelectItem>
                  <SelectItem value="name_asc">Product A-Z</SelectItem>
                  <SelectItem value="brand_asc">Brand A-Z</SelectItem>
                  <SelectItem value="active_first">Active first</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                disabled={availableBrands.length === 0}
                onClick={openBrandRenameForm}
              >
                <Pencil className="h-4 w-4" /> Edit Brand
              </Button>
              <Button
                onClick={() => {
                  setEditingSupply(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Add Product
              </Button>
            </div>

            {loading ? (
              <LoadingRows />
            ) : filteredSupplies.length === 0 ? (
              <EmptyState icon={Package} text="No products found" />
            ) : (
              <ProductsTable
                supplies={filteredSupplies}
                onEdit={(supply) => {
                  setEditingSupply(supply);
                  setFormOpen(true);
                }}
                onDelete={setDeleteSupply}
              />
            )}
          </TabsContent>

          <TabsContent value="offers" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search offers by name, email, phone, or product..."
                value={offerSearch}
                onChange={(e) => setOfferSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {loading ? (
              <LoadingRows />
            ) : filteredOffers.length === 0 ? (
              <EmptyState icon={ClipboardList} text="No offers found" />
            ) : (
              <OffersTable
                offers={filteredOffers}
                onQuote={(offer) => {
                  setEditingOffer(offer);
                  setQuoteAmount(offer.quoted_amount ? String(offer.quoted_amount) : "");
                }}
                onStatus={updateOfferStatus}
              />
            )}
          </TabsContent>

          <TabsContent value="blogs" className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search blog articles..."
                  value={blogSearch}
                  onChange={(e) => setBlogSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                onClick={() => {
                  setEditingBlog(null);
                  setBlogFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Add Article
              </Button>
            </div>

            {loading ? (
              <LoadingRows />
            ) : filteredBlogs.length === 0 ? (
              <EmptyState icon={BookOpen} text="No blog articles found" />
            ) : (
              <BlogsTable
                posts={filteredBlogs}
                onEdit={(post) => {
                  setEditingBlog(post);
                  setBlogFormOpen(true);
                }}
                onDelete={setDeleteBlog}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AdminSupplyForm
        supply={editingSupply}
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingSupply(null);
        }}
        onSubmit={handleFormSubmit}
        loading={formLoading}
        brandOptions={availableBrands}
      />

      <AdminBlogForm
        post={editingBlog}
        open={blogFormOpen}
        onClose={() => {
          setBlogFormOpen(false);
          setEditingBlog(null);
        }}
        onSubmit={handleBlogSubmit}
        loading={blogFormLoading}
      />

      <Dialog open={brandFormOpen} onOpenChange={(open) => !open && setBrandFormOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Brand Name</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleBrandRename} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="brand-to-rename">Current Brand</Label>
              <Select value={brandToRename} onValueChange={setBrandToRename}>
                <SelectTrigger id="brand-to-rename">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {availableBrands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-brand-name">New Brand Name</Label>
              <Input
                id="new-brand-name"
                value={newBrandName}
                onChange={(event) => setNewBrandName(event.target.value.toUpperCase())}
                placeholder="Enter new brand name"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setBrandFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={brandFormLoading}>
                {brandFormLoading ? "Saving..." : "Rename Brand"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteSupply} onOpenChange={(open) => !open && setDeleteSupply(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteSupply?.name}"? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!editingOffer} onOpenChange={(open) => !open && setEditingOffer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Quote to {editingOffer?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              {editingOffer?.supply_type} - Qty: {editingOffer?.quantity}
              {editingOffer?.condition_description
                ? ` - ${editingOffer.condition_description}`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="quoteAmount">Quote Amount (Rs)</Label>
            <Input
              id="quoteAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={quoteAmount}
              onChange={(e) => setQuoteAmount(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditingOffer(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const amount = Number(quoteAmount);
                if (!editingOffer || amount <= 0) {
                  toast.error("Enter a quote amount greater than zero");
                  return;
                }
                updateOfferStatus(editingOffer, "quoted", amount);
              }}
            >
              Send Quote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteBlog} onOpenChange={(open) => !open && setDeleteBlog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteBlog?.title}"? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteBlog}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ProductsTable({
  supplies,
  onEdit,
  onDelete,
}: {
  supplies: Supply[];
  onEdit: (supply: Supply) => void;
  onDelete: (supply: Supply) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead>Product</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Serial No.</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supplies.map((supply) => (
            <TableRow key={supply.id}>
              <TableCell className="max-w-[260px] font-medium">
                <span className="line-clamp-1">{supply.name}</span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {supply.brand || supply.category}
              </TableCell>
              <TableCell className="text-muted-foreground">{supply.serial_number || "-"}</TableCell>
              <TableCell>
                <Badge
                  className={
                    supply.is_active
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {supply.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(supply)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onDelete(supply)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function BlogsTable({
  posts,
  onEdit,
  onDelete,
}: {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead>Article</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="max-w-[360px]">
                <p className="line-clamp-1 font-medium">{post.title}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">/{post.slug}</p>
              </TableCell>
              <TableCell className="text-muted-foreground">{post.author}</TableCell>
              <TableCell>
                <Badge
                  className={
                    post.is_published
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {post.is_published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onEdit(post)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onDelete(post)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function OffersTable({
  offers,
  onQuote,
  onStatus,
}: {
  offers: Offer[];
  onQuote: (offer: Offer) => void;
  onStatus: (offer: Offer, status: Offer["status"], quotedAmount?: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/50">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead>Name</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Expiration</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Quoted</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {offers.map((offer) => {
            const status = offerStatusConfig[offer.status] || offerStatusConfig.pending;
            return (
              <TableRow key={offer.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{offer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {offer.email || "No email provided"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{offer.supply_type}</TableCell>
                <TableCell>{offer.quantity}</TableCell>
                <TableCell className="text-muted-foreground">
                  {offer.expiration_date || "N/A"}
                </TableCell>
                <TableCell>
                  <Badge className={status.className}>{status.label}</Badge>
                </TableCell>
                <TableCell className="font-semibold">
                  {offer.quoted_amount ? formatMoney(offer.quoted_amount) : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-wrap justify-end gap-1">
                    {offer.status === "pending" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => onQuote(offer)}
                      >
                        <DollarSign className="h-3 w-3" /> Quote
                      </Button>
                    )}
                    {offer.status === "quoted" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-emerald-600"
                          onClick={() =>
                            onStatus(offer, "accepted", offer.quoted_amount || undefined)
                          }
                        >
                          <CheckCircle2 className="h-3 w-3" /> Accept
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs text-red-600"
                          onClick={() => onStatus(offer, "declined")}
                        >
                          <X className="h-3 w-3" /> Decline
                        </Button>
                      </>
                    )}
                    {offer.status === "accepted" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() =>
                          onStatus(offer, "completed", offer.quoted_amount || undefined)
                        }
                      >
                        <CheckCircle2 className="h-3 w-3" /> Complete
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="py-12 text-center">
      <Icon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
      <p className="text-muted-foreground">{text}</p>
    </div>
  );
}
