# Supabase Setup & Review Table

Run the SQL in `db/migrations/001_create_reviews.sql` in your Supabase SQL editor to create the `reviews` table.

.env variables (required for full functionality):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_anon_key
```

Optional (recommended for server operations and privacy):

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
REVIEW_PHONE_SECRET=optional_secret_to_encrypt_phone_numbers
```

Notes:
- The app is defensive when env vars are missing so the dev server doesn't crash; however API routes that need Supabase will error until you set them.
- Add these values to `.env.local` and restart the dev server. Do not commit secrets to git.

Notes:
- `purchase_id` enforces one-review-per-purchase (unique index exists, so inserts will fail if a review already exists for a purchase).
- The API stores `phone_hash` (sha256) and will optionally store `phone_encrypted` if `REVIEW_PHONE_SECRET` is set.
- To run the migration use Supabase SQL editor or your preferred migration tooling.
