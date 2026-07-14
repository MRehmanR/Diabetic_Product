export interface Category {
  slug: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  backendId: string;
  name: string;
  description: string;
  fullDescription: string;
  features: string[];
  requirements: string[];
  acceptedModels: string[];
  category: string;
  brand: string;
  payoutMin: number | null;
  payoutMax: number | null;
  image: string | null;
  status: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface SupplyResponse {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description?: string;
  category: string;
  payout_min?: number | null;
  payout_max?: number | null;
  requirements?: string[];
  models?: string[];
  accepted_models?: string[];
  image_url?: string | null;
  features?: string[];
  is_active?: boolean;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface OrderDetails {
  name: string;
  email: string;
  phone: string;
  city: string;
  quantity: string;
  condition: string;
  monthsLeft: string;
  expiryDate: string;
  notes: string;
}

export interface OfferPayload {
  product: Product;
  details: OrderDetails;
}

export interface ProductsLoadResult {
  products: Product[];
  error: string | null;
}

export interface ProductLoadResult {
  product: Product | null;
  error: string | null;
}

const DEFAULT_BUSINESS_PHONE = "+16786580698";
const businessPhone = import.meta.env.VITE_BUSINESS_PHONE?.trim() || DEFAULT_BUSINESS_PHONE;
const businessWhatsapp = businessPhone.replace(/\D/g, "") || DEFAULT_BUSINESS_PHONE.replace(/\D/g, "");

export const BUSINESS = {
  name: "Diabetics King",
  tagline: "Turn unused diabetic supplies into a fair, friendly offer",
  whatsapp: businessWhatsapp,
  phone: businessPhone,
  email: "info@diabaticking.com",
  facebook: "https://www.facebook.com/profile.php?id=61590383957242",
  city: "United States",
};

export const categoryIcons: Record<string, string> = {
  "glucose-meters": "Activity",
  "test-strips": "TestTube",
  lancets: "Syringe",
  "insulin-supplies": "Droplet",
  "sugar-free-foods": "Apple",
  "medicine-accessories": "Pill",
  "foot-care": "Footprints",
  "bp-monitors": "HeartPulse",
  supplements: "Leaf",
  "medical-equipment": "Stethoscope",
};

const PUBLIC_API_URL = import.meta.env.VITE_API_URL?.trim() || "http://localhost:8000/api";
const INTERNAL_API_URL = import.meta.env.VITE_INTERNAL_API_URL?.trim();

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const resolveApiUrl = () => {
  if (typeof window === "undefined" && PUBLIC_API_URL.startsWith("/")) {
    return trimTrailingSlash(INTERNAL_API_URL || `http://127.0.0.1:8000${PUBLIC_API_URL}`);
  }

  return trimTrailingSlash(PUBLIC_API_URL);
};

const API_URL = resolveApiUrl();

const toTitle = (value: string) =>
  value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const knownBrands = [
  "FreeStyle Libre",
  "FreeStyle",
  "Dexcom",
  "Omnipod",
  "One Touch",
  "OneTouch",
  "Accu-Chek",
  "Contour",
  "Bayer",
  "Medtronic",
  "Tandem",
  "Abbott",
];

const inferBrand = (name: string) => {
  const normalized = name.toLowerCase();
  const matched = knownBrands.find((brand) => normalized.includes(brand.toLowerCase()));
  return matched || name.split(/\s+/).slice(0, 2).join(" ");
};

const getErrorMessage = async (response: Response, fallback: string) => {
  const payload = await response.json().catch(() => null);
  return payload?.detail || fallback;
};

const supplyToProduct = (supply: SupplyResponse): Product => ({
  id: supply.slug,
  backendId: supply.id,
  name: supply.name,
  description: supply.short_description || supply.full_description || "",
  fullDescription: supply.full_description || supply.short_description || "",
  features: supply.features || [],
  requirements: supply.requirements || [],
  acceptedModels: supply.accepted_models || supply.models || [],
  category: supply.category,
  brand: inferBrand(supply.name),
  payoutMin: supply.payout_min ?? null,
  payoutMax: supply.payout_max ?? null,
  image: supply.image_url || null,
  status: supply.status || "active",
  isActive: supply.is_active !== false && supply.status !== "inactive",
  createdAt: supply.created_at,
  updatedAt: supply.updated_at,
});

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${API_URL}/supplies`);
  if (!response.ok) throw new Error(await getErrorMessage(response, "Could not load products"));
  const supplies = (await response.json()) as SupplyResponse[];
  if (!Array.isArray(supplies)) throw new Error("Invalid products response");
  return supplies.map(supplyToProduct);
}

export async function loadProducts(): Promise<ProductsLoadResult> {
  try {
    return { products: await fetchProducts(), error: null };
  } catch (error) {
    return {
      products: [],
      error: error instanceof Error ? error.message : "Could not connect to the backend",
    };
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  const response = await fetch(`${API_URL}/supplies/${encodeURIComponent(id)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await getErrorMessage(response, "Could not load product"));
  return supplyToProduct((await response.json()) as SupplyResponse);
}

export async function loadProduct(id: string): Promise<ProductLoadResult> {
  try {
    return { product: await fetchProduct(id), error: null };
  } catch (error) {
    return {
      product: null,
      error: error instanceof Error ? error.message : "Could not connect to the backend",
    };
  }
}

export async function submitOffer({ product, details }: OfferPayload) {
  const notes = [
    details.city ? `City: ${details.city}` : "",
    details.monthsLeft ? `Months left: ${details.monthsLeft}` : "",
    details.notes ? `Notes: ${details.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`${API_URL}/offers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      supply_id: product.backendId,
      name: details.name,
      full_name: details.name,
      email: details.email.trim() || null,
      phone: details.phone,
      supply_type: product.name,
      product_name: product.name,
      brand_model: product.brand,
      quantity: Number(details.quantity) || 1,
      expiration_date: details.expiryDate || null,
      condition_description: details.condition,
      box_condition: details.condition,
      notes,
    }),
  });

  if (!response.ok) throw new Error(await getErrorMessage(response, "Could not submit your offer"));
  return response.json();
}

export function categoriesFromProducts(items: Product[]) {
  return Array.from(new Set(items.map((product) => product.category)))
    .filter(Boolean)
    .map((slug) => ({ slug, name: categoryName(slug), icon: categoryIcons[slug] || "Package" }));
}

export function brandsFromProducts(items: Product[]) {
  return Array.from(new Set(items.map((product) => product.brand)))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export const categoryName = (slug: string) => toTitle(slug);

export function buildWhatsappLink(
  p: Product,
  productUrl: string,
  details: OrderDetails,
) {
  const message = `Hello ${BUSINESS.name},

I would like to offer the following product.

Product: ${p.name}
Category: ${categoryName(p.category)}
Brand: ${p.brand}

Name: ${details.name}
${details.email ? `Email: ${details.email}\n` : ""}WhatsApp: ${details.phone}
${details.city ? `City: ${details.city}\n` : ""}Quantity: ${details.quantity}
Condition: ${details.condition}
Months left: ${details.monthsLeft}
Expiry date: ${details.expiryDate || "N/A"}
${details.notes ? `Notes: ${details.notes}\n` : ""}

Product Link:
${productUrl}

Thank you.`;
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}
