import { useEffect, useState } from "react";
import { ImagePlus, Loader2, Tags } from "lucide-react";
import { toast } from "sonner";
import { adminApi } from "@/lib/admin-api";
import { resolveMediaUrl } from "@/lib/data";
import type { Brand, BrandFormData } from "@/lib/admin-types";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const emptyForm: BrandFormData = {
  name: "",
  image_url: "",
  description: "",
  display_order: "0",
  is_active: true,
};

export function AdminBrandForm({
  brand,
  open,
  onClose,
  onSubmit,
  loading,
}: {
  brand?: Brand | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BrandFormData) => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<BrandFormData>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const imagePreviewUrl = resolveMediaUrl(form.image_url);

  useEffect(() => {
    if (brand) {
      setForm({
        name: brand.name,
        image_url: brand.image_url || "",
        description: brand.description || "",
        display_order: String(brand.display_order ?? 0),
        is_active: brand.is_active,
      });
    } else {
      setForm(emptyForm);
    }
  }, [brand, open]);

  function updateField(field: keyof BrandFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    const result = await adminApi.uploadImage(file);
    setUploading(false);

    if (result.error || !result.data?.url) {
      toast.error("Brand image upload failed", {
        description: result.error?.message ?? "Could not upload brand image",
      });
      return;
    }

    updateField("image_url", result.data.url);
    toast.success("Brand image uploaded");
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{brand ? "Edit Brand" : "Add Brand"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSubmit(form);
          }}
          className="mt-2 space-y-4"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value.toUpperCase())}
                placeholder="DEXCOM"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand-order">Display Order</Label>
              <Input
                id="brand-order"
                type="number"
                value={form.display_order}
                onChange={(e) => updateField("display_order", e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3">
              <div>
                <Label htmlFor="brand-active">Active</Label>
                <p className="text-xs text-muted-foreground">Show this brand on the website</p>
              </div>
              <Switch
                id="brand-active"
                checked={form.is_active}
                onCheckedChange={(value) => updateField("is_active", value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="brand-description">Description</Label>
              <Textarea
                id="brand-description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Short description shown on brand cards."
                rows={3}
              />
            </div>

            <div className="space-y-3 sm:col-span-2">
              <Label htmlFor="brand-image-url">Brand Image</Label>
              <div className="grid gap-3 sm:grid-cols-[160px_1fr]">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border bg-muted">
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Brand preview"
                      className="h-full w-full object-contain bg-white p-2"
                    />
                  ) : (
                    <Tags className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-3">
                  <Input
                    id="brand-image-url"
                    value={form.image_url}
                    onChange={(e) => updateField("image_url", e.target.value)}
                    placeholder="Upload an image or paste an image URL"
                  />
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" disabled={uploading || loading}>
                      <label
                        htmlFor="brand-image-upload"
                        className="flex cursor-pointer items-center gap-2"
                      >
                        {uploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ImagePlus className="h-4 w-4" />
                        )}
                        {uploading ? "Uploading..." : "Upload Image"}
                      </label>
                    </Button>
                    {form.image_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => updateField("image_url", "")}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <input
                    id="brand-image-upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || uploading}>
              {loading ? "Saving..." : brand ? "Update Brand" : "Add Brand"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
