"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Camera,
  Zap,
  ArrowRight,
} from "lucide-react";
import type { OfferFormData, Supply } from "@/types/product";

export default function GetOfferPage() {
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [form, setForm] = useState<OfferFormData>({
    name: "",
    email: "",
    phone: "",
    supply_type: "",
    quantity: 1,
    condition_description: "",
    expiration_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const whatsappUrl = "https://wa.me/18001234567?text=Hi!%20I%20have%20some%20diabetic%20supplies%20to%20sell.%20Can%20you%20provide%20a%20quote?";

  useEffect(() => {
    async function fetchSupplies() {
      const { data } = await supabase
        .from("supplies")
        .select("id, name, category")
        .eq("is_active", true)
        .order("name");
      if (data) setSupplies(data as Supply[]);
    }
    fetchSupplies();
  }, []);

  function updateField(field: keyof OfferFormData, value: string | number) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) { setError("Name is required"); return; }
    if (!form.email.trim()) { setError("Email is required"); return; }
    if (!form.supply_type) { setError("Please select a supply type"); return; }

    setLoading(true);

    const supplyMatch = supplies.find((s) => s.name === form.supply_type);
    const payload = {
      supply_id: supplyMatch?.id || null,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone?.trim() || null,
      supply_type: form.supply_type,
      quantity: form.quantity,
      condition_description: form.condition_description?.trim() || null,
      expiration_date: form.expiration_date || null,
      image_urls: [],
      status: "pending",
    };

    const { error: insertError } = await supabase.from("offers").insert(payload);

    if (insertError) {
      setError(insertError.message);
      toast.error("Failed to submit offer request", { description: insertError.message });
      setLoading(false);
      return;
    }

    toast.success("Offer request submitted!", { description: "We will review and contact you shortly." });
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Request Sent!</h2>
          <p className="text-muted-foreground mb-6">
            We have received your offer request. For faster service, contact us directly on WhatsApp with photos of your items.
          </p>
          <Button
            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
            onClick={() => window.open(whatsappUrl, "_blank")}
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp Us for Faster Service
          </Button>
          <div className="mt-4">
            <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", supply_type: "", quantity: 1, condition_description: "", expiration_date: "" }); }}>
              Submit Another
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-600 text-white mx-auto mb-4">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Get Your Offer</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Tell us about your unused diabetic supplies
          </p>
        </div>

        {/* WhatsApp CTA */}
        <Card className="border-emerald-200 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Faster on WhatsApp</p>
                  <p className="text-xs text-muted-foreground">Send photos, get a quote in minutes</p>
                </div>
              </div>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 gap-1"
                onClick={() => window.open(whatsappUrl, "_blank")}
              >
                <MessageCircle className="h-4 w-4" /> Chat Now
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-card px-2 text-xs text-muted-foreground">or fill out the form below</span>
          </div>
        </div>

        <Card className="border-border/50">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Submit Your Items</CardTitle>
            <CardDescription>Fill in the details and we will get back to you</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="you@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => updateField("quantity", parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="supply_type">Supply Type *</Label>
                <Select
                  value={form.supply_type}
                  onValueChange={(v) => updateField("supply_type", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select what you have" />
                  </SelectTrigger>
                  <SelectContent>
                    {supplies.map((s) => (
                      <SelectItem key={s.id} value={s.name}>
                        {s.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other (describe below)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiration_date">Expiration Date</Label>
                <Input
                  id="expiration_date"
                  type="date"
                  value={form.expiration_date}
                  onChange={(e) => updateField("expiration_date", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition_description">Condition &amp; Notes</Label>
                <Textarea
                  id="condition_description"
                  value={form.condition_description}
                  onChange={(e) => updateField("condition_description", e.target.value)}
                  placeholder="Describe the condition of your items, box condition, any details..."
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading} size="lg">
                {loading ? "Submitting..." : "Submit Request"} <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
