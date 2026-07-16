const brandAssetModules = import.meta.glob<string>("../assets/brands/*.{svg,png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
});

const slugBrand = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const brandAssets = new Map(
  Object.entries(brandAssetModules).map(([path, url]) => {
    const filename = path.split("/").pop() ?? "";
    const name = filename.replace(/\.[^.]+$/, "");
    return [slugBrand(name), url];
  }),
);

export function getBrandAsset(name: string, aliases: string[] = []) {
  for (const value of [name, ...aliases]) {
    const asset = brandAssets.get(slugBrand(value));
    if (asset) return asset;
  }

  return null;
}
