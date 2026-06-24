export interface Supply {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  category: string;
  payout_min: number | null;
  payout_max: number | null;
  requirements: string[];
  models: string[];
  image_url: string | null;
  features: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  supply_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  supply_type: string;
  quantity: number;
  condition_description: string | null;
  expiration_date: string | null;
  image_urls: string[];
  status: 'pending' | 'quoted' | 'accepted' | 'declined' | 'completed';
  quoted_amount: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupplyFormData {
  name: string;
  short_description: string;
  full_description: string;
  category: string;
  payout_min: number;
  payout_max: number;
  requirements: string;
  models: string;
  image_url: string;
  features: string;
  is_active: boolean;
}

export interface OfferFormData {
  name: string;
  email: string;
  phone: string;
  supply_type: string;
  quantity: number;
  condition_description: string;
  expiration_date: string;
}
