import { useEffect, useState } from "react";
import { ImagePlus, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { adminApi } from "@/lib/admin-api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Supply, SupplyFormData } from "@/lib/admin-types";

const emptyForm: SupplyFormData = {
  name: "",
  slug: "",
  short_description: "",
  full_description: "",
  category: "",
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

export function AdminSupplyForm({
  supply,
  open,
  onClose,
  onSubmit,
  loading,
}: {
  supply?: Supply | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SupplyFormData) => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<SupplyFormData>(emptyForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (supply) {
      setForm({
        name: supply.name,
        slug: supply.slug,
        short_description: supply.short_description,
        full_description: supply.full_description,
        category: supply.category,
        requirements: Array.isArray(supply.requirements) ? supply.requirements.join(", ") : "",
        models: Array.isArray(supply.accepted_models || supply.models)
          ? (supply.accepted_models || supply.models).join(", ")
          : "",
        image_url: supply.image_url || "",
        features: Array.isArray(supply.features) ? supply.features.join(", ") : "",
        is_active: supply.is_active,
      });
    } else {
      setForm(emptyForm);
    }
  }, [supply, open]);

  function updateField(field: keyof SupplyFormData, value: string | number | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image_url.trim()) {
      toast.error("Product image is required.");
      return;
    }
    onSubmit({ ...form, slug: form.slug.trim() || slugify(form.name) });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    const result = await adminApi.uploadImage(file);
    setUploading(false);

    if (result.error || !result.data?.url) {
      toast.error("Image upload failed", {
        description: result.error?.message ?? "Could not upload product image",
      });
      return;
    }

    updateField("image_url", result.data.url);
    toast.success("Product image uploaded");
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{supply ? "Edit Product" : "Add Product"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Dexcom G7 Sensors"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="dexcom-g7-sensors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                placeholder="cgm-sensors"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                value={form.short_description}
                onChange={(e) => updateField("short_description", e.target.value)}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="full_description">Full Description</Label>
              <Textarea
                id="full_description"
                value={form.full_description}
                onChange={(e) => updateField("full_description", e.target.value)}
                rows={4}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-3 sm:col-span-2">
              <Label htmlFor="image_url">Product Image</Label>
              <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                <div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border bg-muted">
                  {form.image_url ? (
                    <img src={form.image_url} alt="Product preview" className="h-full w-full object-cover" />
                  ) : (
                    <Package className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-3">
                  <Input
                    id="image_url"
                    value={form.image_url}
                    onChange={(e) => updateField("image_url", e.target.value)}
                    placeholder="Upload an image or paste an image URL"
                    required
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" disabled={uploading || loading}>
                      <label htmlFor="product-image-upload" className="flex cursor-pointer items-center gap-2">
                        {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                        {uploading ? "Uploading..." : "Upload Image"}
                      </label>
                    </Button>
                    {form.image_url && (
                      <Button type="button" variant="ghost" onClick={() => updateField("image_url", "")}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    id="product-image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading || loading}
                  />
                  <p className="text-xs text-muted-foreground">JPG, PNG, or WEBP up to 5MB.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="models">Accepted Models (comma-separated)</Label>
              <Input
                id="models"
                value={form.models}
                onChange={(e) => updateField("models", e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="requirements">Requirements (comma-separated)</Label>
              <Input
                id="requirements"
                value={form.requirements}
                onChange={(e) => updateField("requirements", e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input
                id="features"
                value={form.features}
                onChange={(e) => updateField("features", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(checked) => updateField("is_active", checked)}
              />
              <Label>Active and visible on public product pages</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : supply ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
