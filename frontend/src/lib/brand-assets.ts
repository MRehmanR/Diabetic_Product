const brandAssetModules = import.meta.glob<string>("../assets/brands/*.{svg,png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

export type BrandAsset = {
  name: string;
  slug: string;
  src: string;
};

const slugBrand = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const titleBrand = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const brandAssetList = Object.entries(brandAssetModules)
  .map(([path, url]) => {
    const filename = path.split("/").pop() ?? "";
    const name = filename.replace(/\.[^.]+$/, "");
    const slug = slugBrand(name);

    return {
      name: titleBrand(name),
      slug,
      src: url,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const brandAssets = new Map(brandAssetList.map((asset) => [asset.slug, asset]));

export function getBrandAsset(name: string, aliases: string[] = []) {
  for (const value of [name, ...aliases]) {
    const asset = brandAssets.get(slugBrand(value));
    if (asset) return asset.src;
  }

  return null;
}

export function getBrandAssetRecord(name: string, aliases: string[] = []) {
  for (const value of [name, ...aliases]) {
    const asset = brandAssets.get(slugBrand(value));
    if (asset) return asset;
  }

  return null;
}

export function getBrandAssetRecords() {
  return brandAssetList;
}
