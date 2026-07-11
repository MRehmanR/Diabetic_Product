-- Drop existing table and recreate for buy-back model
DROP TABLE IF EXISTS products CASCADE;

CREATE TABLE supplies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  category TEXT NOT NULL,
  -- Typical payout range (what WE pay)
  payout_min DECIMAL(10, 2),
  payout_max DECIMAL(10, 2),
  -- Requirements / condition notes
  requirements TEXT DEFAULT '[]',
  -- Specific models/variants we buy
  models TEXT DEFAULT '[]',
  image_url TEXT,
  features JSONB DEFAULT '[]',
  -- Is this category actively buying?
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE supplies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "select_supplies" ON supplies FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "insert_supplies" ON supplies FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_supplies" ON supplies FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_supplies" ON supplies FOR DELETE
  TO authenticated USING (true);

CREATE POLICY "public_select_supplies" ON supplies FOR SELECT
  TO anon USING (true);

-- Auto-update updated_at
CREATE TRIGGER supplies_updated_at
  BEFORE UPDATE ON supplies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Also create an offers table for quote requests
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  supply_id UUID REFERENCES supplies(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  supply_type TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  condition_description TEXT,
  expiration_date DATE,
  image_urls TEXT DEFAULT '[]',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'accepted', 'declined', 'completed')),
  quoted_amount DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_offers" ON offers FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "select_own_offers" ON offers FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "update_offers" ON offers FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Allow public (anon) to submit offers
CREATE POLICY "public_insert_offers" ON offers FOR INSERT
  TO anon WITH CHECK (true);

CREATE TRIGGER offers_updated_at
  BEFORE UPDATE ON offers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
