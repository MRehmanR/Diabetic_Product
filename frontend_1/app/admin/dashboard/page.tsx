"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Card, CardContent } from "@/components/ui/card";
import { SupplyForm } from "@/components/supply-form";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Search,
  Package,
  LayoutDashboard,
  TrendingUp,
  AlertTriangle,
  XCircle,
  ArrowLeft,
  DollarSign,
  ClipboardList,
  Clock,
  CheckCircle2,
  X as XIcon,
} from "lucide-react";
import type { Supply, SupplyFormData, Offer } from "@/types/product";

const offerStatusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" },
  quoted: { label: "Quoted", className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  accepted: { label: "Accepted", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" },
  declined: { label: "Declined", className: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
  completed: { label: "Completed", className: "bg-primary/10 text-primary" },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [offerSearch, setOfferSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<Supply | null>(null);
  const [deleteSupply, setDeleteSupply] = useState<Supply | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await apiClient.auth.getSession();
      if (!session) {
        router.replace("/admin/login");
        return;
      }
      setAuthChecked(true);
    }
    checkAuth();
  }, [router]);

  const fetchData = useCallback(async () => {
    const [suppliesRes, offersRes] = await Promise.all([
      apiClient.from("supplies").select("*").order("created_at", { ascending: false }),
      apiClient.from("offers").select("*").order("created_at", { ascending: false }),
    ]);
    if (suppliesRes.data) setSupplies(suppliesRes.data as Supply[]);
    if (offersRes.data) setOffers(offersRes.data as Offer[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authChecked) fetchData();
  }, [authChecked, fetchData]);

  async function handleLogout() {
    await apiClient.auth.signOut();
    router.replace("/admin/login");
  }

  async function handleFormSubmit(formData: SupplyFormData & { slug: string }) {
    setFormLoading(true);
    const payload = {
      name: formData.name,
      slug: formData.slug,
      short_description: formData.short_description,
      full_description: formData.full_description,
      category: formData.category,
      payout_min: formData.payout_min || null,
      payout_max: formData.payout_max || null,
      requirements: formData.requirements.split(",").map((s) => s.trim()).filter(Boolean),
      models: formData.models.split(",").map((s) => s.trim()).filter(Boolean),
      image_url: formData.image_url || null,
      features: formData.features.split(",").map((s) => s.trim()).filter(Boolean),
      is_active: formData.is_active,
    };

    if (editingSupply) {
      const { error } = await apiClient.from("supplies").update(payload).eq("id", editingSupply.id);
      if (error) {
        toast.error("Failed to update supply", { description: error.message });
      } else {
        toast.success("Supply updated successfully");
        setFormOpen(false);
        setEditingSupply(null);
        fetchData();
      }
    } else {
      const { error } = await apiClient.from("supplies").insert(payload);
      if (error) {
        toast.error("Failed to add supply", { description: error.message });
      } else {
        toast.success("Supply added successfully");
        setFormOpen(false);
        fetchData();
      }
    }
    setFormLoading(false);
  }

  async function handleDelete() {
    if (!deleteSupply) return;
    const { error } = await apiClient.from("supplies").delete().eq("id", deleteSupply.id);
    if (error) {
      toast.error("Failed to delete supply", { description: error.message });
    } else {
      toast.success("Supply deleted successfully");
      fetchData();
    }
    setDeleteSupply(null);
  }

  async function updateOfferStatus(offer: Offer, status: string, quotedAmount?: number) {
    const update: Record<string, unknown> = { status };
    if (quotedAmount !== undefined) update.quoted_amount = quotedAmount;
    const { error } = await apiClient.from("offers").update(update).eq("id", offer.id);
    if (error) {
      toast.error("Failed to update offer", { description: error.message });
    } else {
      toast.success(`Offer ${status}`);
      setEditingOffer(null);
      fetchData();
    }
  }

  const filteredSupplies = supplies.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  const filteredOffers = offers.filter((o) => {
    if (!offerSearch.trim()) return true;
    const q = offerSearch.toLowerCase();
    return o.name.toLowerCase().includes(q) || o.supply_type.toLowerCase().includes(q) || o.email.toLowerCase().includes(q);
  });

  if (!authChecked) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-shimmer h-8 w-48 rounded bg-muted" />
      </div>
    );
  }

  const supplyStats = [
    { label: "Total Supplies", value: supplies.length, icon: Package, color: "text-primary" },
    { label: "Active", value: supplies.filter((s) => s.is_active).length, icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Pending Offers", value: offers.filter((o) => o.status === "pending").length, icon: Clock, color: "text-amber-600 dark:text-amber-400" },
    { label: "Completed", value: offers.filter((o) => o.status === "completed").length, icon: CheckCircle2, color: "text-primary" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage supplies and offers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/supplies")} className="gap-1.5">
              <ArrowLeft className="h-3.5 w-3.5" /> View Site
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
              <LogOut className="h-3.5 w-3.5" /> Sign Out
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {supplyStats.map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted/80 flex items-center justify-center flex-shrink-0">
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

        {/* Tabs */}
        <Tabs defaultValue="supplies" className="space-y-6">
          <TabsList>
            <TabsTrigger value="supplies" className="gap-1.5">
              <Package className="h-3.5 w-3.5" /> Supplies
            </TabsTrigger>
            <TabsTrigger value="offers" className="gap-1.5">
              <ClipboardList className="h-3.5 w-3.5" /> Offers
            </TabsTrigger>
          </TabsList>

          {/* Supplies Tab */}
          <TabsContent value="supplies" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search supplies..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button onClick={() => { setEditingSupply(null); setFormOpen(true); }} className="gap-2">
                <Plus className="h-4 w-4" /> Add Supply
              </Button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-shimmer" />
                ))}
              </div>
            ) : filteredSupplies.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No supplies found</p>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Supply</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Payout Range</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSupplies.map((supply) => (
                        <TableRow key={supply.id}>
                          <TableCell className="font-medium text-sm max-w-[200px] line-clamp-1">{supply.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{supply.category}</TableCell>
                          <TableCell className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            {supply.payout_min && supply.payout_max
                              ? `$${supply.payout_min.toFixed(0)} – $${supply.payout_max.toFixed(0)}`
                              : "Custom"}
                          </TableCell>
                          <TableCell>
                            <Badge variant={supply.is_active ? "default" : "secondary"} className={supply.is_active ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-muted text-muted-foreground"}>
                              {supply.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingSupply(supply); setFormOpen(true); }}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteSupply(supply)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile */}
                <div className="md:hidden space-y-3">
                  {filteredSupplies.map((supply) => (
                    <Card key={supply.id} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0 space-y-1">
                            <h4 className="font-semibold text-sm line-clamp-1">{supply.name}</h4>
                            <p className="text-xs text-muted-foreground">{supply.category}</p>
                            <div className="flex items-center gap-2 pt-1">
                              <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400">
                                {supply.payout_min && supply.payout_max ? `$${supply.payout_min.toFixed(0)} – $${supply.payout_max.toFixed(0)}` : "Custom"}
                              </span>
                              <Badge variant={supply.is_active ? "default" : "secondary"} className={supply.is_active ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-[10px]" : "text-[10px]"}>
                                {supply.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingSupply(supply); setFormOpen(true); }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteSupply(supply)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </TabsContent>

          {/* Offers Tab */}
          <TabsContent value="offers" className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search offers by name, email, or type..."
                  value={offerSearch}
                  onChange={(e) => setOfferSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded-lg animate-shimmer" />
                ))}
              </div>
            ) : filteredOffers.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">No offers found</p>
              </div>
            ) : (
              <>
                {/* Desktop */}
                <div className="hidden md:block rounded-xl border border-border/50 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30">
                        <TableHead>Name</TableHead>
                        <TableHead>Supply</TableHead>
                        <TableHead>Qty</TableHead>
                        <TableHead>Expiration</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Quoted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOffers.map((offer) => {
                        const st = offerStatusConfig[offer.status] || offerStatusConfig.pending;
                        return (
                          <TableRow key={offer.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{offer.name}</p>
                                <p className="text-xs text-muted-foreground">{offer.email}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{offer.supply_type}</TableCell>
                            <TableCell className="text-sm">{offer.quantity}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {offer.expiration_date || "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge className={st.className}>{st.label}</Badge>
                            </TableCell>
                            <TableCell className="text-sm font-semibold">
                              {offer.quoted_amount ? `$${offer.quoted_amount.toFixed(2)}` : "—"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                {offer.status === "pending" && (
                                  <>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setEditingOffer(offer)}>
                                      <DollarSign className="h-3 w-3" /> Quote
                                    </Button>
                                  </>
                                )}
                                {offer.status === "quoted" && (
                                  <>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-emerald-600" onClick={() => updateOfferStatus(offer, "accepted", offer.quoted_amount || undefined)}>
                                      <CheckCircle2 className="h-3 w-3" /> Accept
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-red-600" onClick={() => updateOfferStatus(offer, "declined")}>
                                      <XIcon className="h-3 w-3" /> Decline
                                    </Button>
                                  </>
                                )}
                                {offer.status === "accepted" && (
                                  <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => updateOfferStatus(offer, "completed", offer.quoted_amount || undefined)}>
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

                {/* Mobile */}
                <div className="md:hidden space-y-3">
                  {filteredOffers.map((offer) => {
                    const st = offerStatusConfig[offer.status] || offerStatusConfig.pending;
                    return (
                      <Card key={offer.id} className="border-border/50">
                        <CardContent className="p-4 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-sm">{offer.name}</p>
                              <p className="text-xs text-muted-foreground">{offer.email}</p>
                            </div>
                            <Badge className={st.className}>{st.label}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>{offer.supply_type}</span>
                            <span>Qty: {offer.quantity}</span>
                            {offer.quoted_amount && <span className="font-semibold text-emerald-600">${offer.quoted_amount.toFixed(2)}</span>}
                          </div>
                          <div className="flex gap-1 pt-1">
                            {offer.status === "pending" && (
                              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => setEditingOffer(offer)}>
                                <DollarSign className="h-3 w-3" /> Send Quote
                              </Button>
                            )}
                            {offer.status === "quoted" && (
                              <>
                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-emerald-600" onClick={() => updateOfferStatus(offer, "accepted", offer.quoted_amount || undefined)}>
                                  <CheckCircle2 className="h-3 w-3" /> Accept
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 text-xs gap-1 text-red-600" onClick={() => updateOfferStatus(offer, "declined")}>
                                  <XIcon className="h-3 w-3" /> Decline
                                </Button>
                              </>
                            )}
                            {offer.status === "accepted" && (
                              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => updateOfferStatus(offer, "completed", offer.quoted_amount || undefined)}>
                                <CheckCircle2 className="h-3 w-3" /> Mark Complete
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Supply Form */}
      <SupplyForm
        supply={editingSupply}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditingSupply(null); }}
        onSubmit={handleFormSubmit}
        loading={formLoading}
      />

      {/* Delete Supply */}
      <AlertDialog open={!!deleteSupply} onOpenChange={(o) => !o && setDeleteSupply(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supply</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{deleteSupply?.name}&quot;? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quote Offer Dialog */}
      <AlertDialog open={!!editingOffer} onOpenChange={(o) => !o && setEditingOffer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Send Quote to {editingOffer?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              {editingOffer?.supply_type} — Qty: {editingOffer?.quantity}
              {editingOffer?.condition_description && ` — ${editingOffer.condition_description}`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 py-2">
            <Label htmlFor="quoteAmount">Quote Amount ($)</Label>
            <Input
              id="quoteAmount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              defaultValue={editingOffer?.quoted_amount || ""}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditingOffer(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const input = document.getElementById("quoteAmount") as HTMLInputElement;
                const amount = parseFloat(input?.value || "0");
                if (editingOffer && amount > 0) {
                  updateOfferStatus(editingOffer, "quoted", amount);
                }
              }}
            >
              Send Quote
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
