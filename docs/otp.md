# Phone OTP / Verification (options)

If you want to prevent fraudulent multiple reviews and ensure a person can claim rewards, consider one of the following approaches:

1. Supabase Auth (recommended)
   - Use Supabase's phone auth to send OTP SMS (no need for Twilio). Users sign in with a code and you can then link the review to the `user.id`.
   - Good privacy: Supabase can be configured to not expose phone to other users, and you can store only the user id in `reviews`.

2. Custom OTP with an SMS provider (Twilio)
   - Server-side endpoint to send OTP to number; store a short-lived token in a server-side table.
   - On verification, mark the phone as verified and insert review.

Privacy tips:
- Store phone hashes (sha256) or encrypt phone numbers server-side using a key not checked into source (we added `REVIEW_PHONE_SECRET`).
- Only store the data you need to contact winners. Mask or remove PII from public exports.

Implementation notes:
- If you use Supabase Auth phone flow, `SUPABASE_SERVICE_ROLE_KEY` is recommended for server operations like looking up users.
- Consider rate-limiting verification attempts and adding reCAPTCHA if you see automated abuse.
