import { useEffect, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { adminApi } from "@/lib/admin-api";
import type { BlogFormData, BlogPost } from "@/lib/admin-types";

const emptyForm: BlogFormData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  image_url: "",
  author: "Diabetics King",
  is_published: true,
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AdminBlogForm({
  post,
  open,
  onClose,
  onSubmit,
  loading,
}: {
  post?: BlogPost | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: BlogFormData) => void;
  loading?: boolean;
}) {
  const [form, setForm] = useState<BlogFormData>(emptyForm);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (post) {
      setForm({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        image_url: post.image_url || "",
        author: post.author,
        is_published: post.is_published,
      });
    } else {
      setForm(emptyForm);
    }
  }, [post, open]);

  function updateField(field: keyof BlogFormData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Blog title is required.");
      return;
    }
    if (!form.content.trim()) {
      toast.error("Blog content is required.");
      return;
    }
    onSubmit({ ...form, slug: form.slug.trim() || slugify(form.title) });
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
        description: result.error?.message ?? "Could not upload blog image",
      });
      return;
    }

    updateField("image_url", result.data.url);
    toast.success("Blog image uploaded");
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{post ? "Edit Blog Article" : "Add Blog Article"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-2 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-title">Title</Label>
              <Input
                id="blog-title"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-slug">Slug</Label>
              <Input
                id="blog-slug"
                value={form.slug}
                onChange={(e) => updateField("slug", e.target.value)}
                placeholder="auto-generated-from-title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="blog-author">Author</Label>
              <Input
                id="blog-author"
                value={form.author}
                onChange={(e) => updateField("author", e.target.value)}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-excerpt">Short Excerpt</Label>
              <Textarea
                id="blog-excerpt"
                value={form.excerpt}
                onChange={(e) => updateField("excerpt", e.target.value)}
                rows={3}
                placeholder="Optional short summary"
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-content">Article Content</Label>
              <Textarea
                id="blog-content"
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                rows={10}
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="blog-image">Image URL</Label>
              <div className="flex gap-2">
                <Input
                  id="blog-image"
                  value={form.image_url}
                  onChange={(e) => updateField("image_url", e.target.value)}
                  placeholder="Optional image URL"
                />
                <Button type="button" variant="outline" disabled={uploading || loading}>
                  <label htmlFor="blog-image-upload" className="flex cursor-pointer items-center gap-2">
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                    Upload
                  </label>
                </Button>
              </div>
              <input
                id="blog-image-upload"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading || loading}
              />
            </div>

            <div className="flex items-center gap-3 sm:col-span-2">
              <Switch
                checked={form.is_published}
                onCheckedChange={(checked) => updateField("is_published", checked)}
              />
              <Label>Published and visible on the public blog</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : post ? "Update Article" : "Add Article"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
