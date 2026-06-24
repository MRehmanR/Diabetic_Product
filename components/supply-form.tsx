"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Supply, SupplyFormData } from "@/types/product";

const categories = [
  "CGM Sensors",
  "Insulin Pump Supplies",
  "Test Strips",
];

const emptyForm: SupplyFormData = {
  name: "",
  short_description: "",
  full_description: "",
  category: "CGM Sensors",
  payout_min: 0,
  payout_max: 0,
  requirements: "",
  models: "",
  image_url: "",
  features: "",
  is_active: true,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface SupplyFormProps {
  supply?: Supply | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SupplyFormData & { slug: string }) => void;
  loading?: boolean;
}

export function SupplyForm({ supply, open, onClose, onSubmit, loading }: SupplyFormProps) {
  const [form, setForm] = useState<SupplyFormData>(emptyForm);

  useEffect(() => {
    if (supply) {
      setForm({
        name: supply.name,
        short_description: supply.short_description,
        full_description: supply.full_description,
        category: supply.category,
        payout_min: supply.payout_min || 0,
        payout_max: supply.payout_max || 0,
        requirements: Array.isArray(supply.requirements) ? supply.requirements.join(", ") : "",
        models: Array.isArray(supply.models) ? supply.models.join(", ") : "",
        image_url: supply.image_url || "",
        features: Array.isArray(supply.features) ? supply.features.join(", ") : "",
        is_active: supply.is_active,
      });
    } else {
      setForm(emptyForm);
    }
  }, [supply, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ ...form, slug: slugify(form.name) });
  }

  function updateField(field: keyof SupplyFormData, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{supply ? "Edit Supply" : "Add New Supply"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Supply Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="e.g. Dexcom G7 Sensors"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="short_description">Short Description *</Label>
              <Input
                id="short_description"
                value={form.short_description}
                onChange={(e) => updateField("short_description", e.target.value)}
                placeholder="Brief summary of what we buy"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="full_description">Full Description *</Label>
              <Textarea
                id="full_description"
                value={form.full_description}
                onChange={(e) => updateField("full_description", e.target.value)}
                placeholder="Detailed description of what we buy and our process"
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={form.category} onValueChange={(v) => updateField("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={form.image_url}
                onChange={(e) => updateField("image_url", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payout_min">Min Payout ($)</Label>
              <Input
                id="payout_min"
                type="number"
                step="0.01"
                min="0"
                value={form.payout_min}
                onChange={(e) => updateField("payout_min", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payout_max">Max Payout ($)</Label>
              <Input
                id="payout_max"
                type="number"
                step="0.01"
                min="0"
                value={form.payout_max}
                onChange={(e) => updateField("payout_max", parseFloat(e.target.value) || 0)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="models">Models We Buy (comma-separated)</Label>
              <Input
                id="models"
                value={form.models}
                onChange={(e) => updateField("models", e.target.value)}
                placeholder="Dexcom G7 012, Dexcom G7 013, Dexcom G7 15-Day"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="requirements">Requirements (comma-separated)</Label>
              <Input
                id="requirements"
                value={form.requirements}
                onChange={(e) => updateField("requirements", e.target.value)}
                placeholder="Factory sealed, Valid expiration, No moisture damage"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="features">Features / Why Sell to Us (comma-separated)</Label>
              <Input
                id="features"
                value={form.features}
                onChange={(e) => updateField("features", e.target.value)}
                placeholder="Same-day payment, Competitive rates, Free shipping"
              />
            </div>

            <div className="space-y-2 flex items-center gap-3 sm:col-span-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => updateField("is_active", checked)}
              />
              <Label>Active (visible on site)</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : supply ? "Update Supply" : "Add Supply"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
