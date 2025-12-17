-- Create reviews table for customer reviews

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  customer_name text,
  phone_hash text,
  phone_encrypted text,
  dob date,
  review_text text,
  rating int CHECK (rating BETWEEN 1 AND 5),
  google_review_url text,
  score numeric,
  purchase_id text,
  metadata jsonb,
  submitted_from_qr boolean DEFAULT true,
  rewarded boolean DEFAULT false
);

-- Indexes for quick lookup
CREATE INDEX IF NOT EXISTS idx_reviews_phone_hash ON reviews(phone_hash);
-- Enforce one review per purchase if purchase_id provided
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_unique_purchase ON reviews(purchase_id) WHERE purchase_id IS NOT NULL;

-- Add a simple policy later (recommended) to control insert/update access
