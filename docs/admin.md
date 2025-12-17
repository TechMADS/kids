# Admin usage

Set an environment variable in your deployment (or `.env.local`) called `ADMIN_KEY` to a strong value.

Example `.env.local`:

```
ADMIN_KEY=some-strong-key
```

Visit `/admin` in your app, enter the admin key, and click "Fetch Reviews". From there you can mark reviews as rewarded.

Security note: For production use, consider a proper auth flow (NextAuth, Supabase Auth) and server-side rendering with session cookies rather than passing an admin key from the browser for each request.
