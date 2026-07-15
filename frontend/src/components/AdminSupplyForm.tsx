import { useEffect, useState } from "react";
import { ImagePlus, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { adminApi } from "@/lib/admin-api";
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
import type { Supply, SupplyFormData } from "@/lib/admin-types";

const emptyForm: SupplyFormData = {
  name: "",
  brand: "",
  short_description: "",
  image_url: "",
  is_active: true,
};

const brandOptions = [
  "DEXCOM",
  "OMNIPOD",
  "FREESTYLE",
  "ONE TOUCH",
  "MEDTRONIC",
  "ACCU-CHEK",
  "CONTOUR NEXT",
];

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
        brand: supply.brand || "",
        short_description: supply.short_description,
        image_url: supply.image_url || "",
        is_active: supply.is_active,
      });
    } else {
      setForm(emptyForm);
    }
  }, [supply, open]);

  function updateField(field: keyof SupplyFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image_url.trim()) {
      toast.error("Product image is required.");
      return;
    }
    if (!form.brand.trim()) {
      toast.error("Please select a brand.");
      return;
    }
    onSubmit(form);
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
              <Label htmlFor="brand">Brand</Label>
              <Select value={form.brand} onValueChange={(value) => updateField("brand", value)}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brandOptions.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="short_description">Short Description</Label>
              <Input
                id="short_description"
                value={form.short_description}
                onChange={(e) => updateField("short_description", e.target.value)}
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
