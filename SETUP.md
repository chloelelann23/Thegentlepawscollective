# The Gentle Paws Collective — Setup Guide

## 1. Create the Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project**, give it a name (e.g. `gentle-paws-collective`)
3. Choose a region close to your users
4. Once created, go to **Settings > API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

5. Go to **SQL Editor** and paste the entire contents of `lib/supabase/schema.sql`
6. Click **Run** — this creates all tables, RLS policies, the auth trigger, and seeds default badges

7. Go to **Authentication > Providers** and enable:
   - **Email** (enabled by default)
   - **Google** — follow the [Google OAuth setup guide](https://supabase.com/docs/guides/auth/social-login/auth-google)

---

## 2. Set Up Google Drive Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use an existing one)
3. Enable the **Google Drive API** for the project
4. Go to **IAM & Admin > Service Accounts** and create a new service account
5. Give it a name like `gentle-paws-drive-reader`
6. Click **Create Key**, choose JSON format, and download the file
7. From the JSON file, copy:
   - `client_email` → `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` (keep the `\n` newlines)

8. In Google Drive, open the folder at ID `1ZFjbSpmoaRZWDBU96s4XN5pjLpxAaphg`
9. Click **Share**, add the service account email, and give it **Viewer** access

10. Create the following folder structure inside the Drive folder:
    ```
    /logos/
      gentle-paws-logo.png
      hot-girls-rescue-animals.png
    /events/
      /upcoming/
        [event-slug].jpg  (cover images named by event slug)
      /recaps/
        /[event-slug]/    (photo galleries per past event)
    /blog/
      [post-slug].jpg     (blog cover images)
    /assets/
      /illustrations/     (SVG or PNG animal motif assets)
    ```

---

## 3. Set Up Stripe

1. Create a free account at [stripe.com](https://stripe.com)
2. Go to **Developers > API Keys** and copy:
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

3. For the webhook (needed for donation recording):
   - Deploy the app first (Step 5), then come back
   - Go to **Developers > Webhooks > Add endpoint**
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events to listen for: `checkout.session.completed`, `customer.subscription.deleted`, `customer.subscription.updated`
   - Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

4. For local testing, use the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

---

## 4. Set Up Brevo (Newsletter & Email)

Brevo powers the newsletter signup widget in the footer and transactional emails. It's optional — the app degrades gracefully if the API key isn't set.

1. Create a free account at [brevo.com](https://brevo.com)
2. Go to **Account > SMTP & API > API Keys** and create a key → `BREVO_API_KEY`
3. Go to **Contacts > Lists**, create a list called "Newsletter" → copy the numeric list ID → `BREVO_LIST_ID`
4. Optionally configure a verified sender email at **Senders & IP > Senders** to match `hello@thegentlepawscollective.com`

New members are automatically subscribed when they sign up with the newsletter checkbox checked.

---

## 5. Get Instagram Basic Display API Access Token

1. Go to [Meta for Developers](https://developers.facebook.com)
2. Create an app with **Instagram Basic Display** product
3. Add your Instagram account as a test user
4. Generate a **User Access Token**, then exchange it for a **Long-Lived Token** (valid for 60 days; refresh periodically)
5. Get your **Instagram User ID** from the API
6. Set:
   - `INSTAGRAM_ACCESS_TOKEN`
   - `INSTAGRAM_USER_ID`

**Note:** If you don't set these, the app gracefully falls back to placeholder posts so everything still works.

---

## 6. Deploy to Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Set all environment variables from `.env.local.example` under **Project > Settings > Environment Variables**
4. Deploy!

5. Set `NEXT_PUBLIC_APP_URL` to your actual Vercel URL (e.g. `https://thegentlepawscollective.vercel.app`)
6. After getting your Stripe webhook URL, complete Step 3 above

---

## 7. Add a Custom Domain (When Ready)

1. In Vercel, go to **Project > Settings > Domains**
2. Add your domain (e.g. `thegentlepawscollective.com`)
3. Update your DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to the new domain
5. Update the Stripe webhook URL to the new domain
6. Update the Instagram app callback URL if needed

---

## 8. Managing Content Going Forward

### Adding Events
- Option A: Use the Admin Panel at `/admin` (requires admin role in database)
- Option B: Insert directly in Supabase Dashboard > Table Editor > `events`
- Cover images: Upload to Google Drive at `/events/upcoming/[event-slug].jpg`
- For past events, move their recap photos to `/events/recaps/[event-slug]/`

### Publishing Blog Posts
- Use the Admin Panel at `/admin` > Blog tab
- Cover images: Upload to Google Drive at `/blog/[post-slug].jpg`
- Content supports Markdown formatting

### Adding Charities
- Use the Admin Panel at `/admin` > Charities tab
- Update raised amounts manually or they update automatically via Stripe webhooks

### Updating the Logo
- Replace `/logos/gentle-paws-logo.png` in Google Drive
- The CSS variable `--pink` can be updated in `styles/globals.css` once the final brand color is confirmed

### Approving Ambassadors
- Applications appear in Admin Panel > Ambassadors tab
- Approving automatically sets the user's role to `ambassador` and awards the Ambassador badge

### Setting Someone as Admin
- In Supabase Dashboard > Table Editor > `users`
- Find the user and update their `role` column to `admin`

### Refreshing Instagram Token
- Long-lived Instagram tokens expire after 60 days
- Set a calendar reminder to refresh the token using the Basic Display API
- Update `INSTAGRAM_ACCESS_TOKEN` in Vercel environment variables

---

### Approving Rescue Stories
- Stories submitted by members appear in Admin Panel > Stories tab
- Review and approve/reject from there
- Approved stories are published to `/community/rescue-stories` instantly

---

## 9. Local Development

```bash
# Install dependencies
npm install

# Copy env file
cp .env.local.example .env.local
# Fill in all values

# Run development server
npm run dev
```

The app will be at `http://localhost:3000`.

For the Stripe webhook locally, use the Stripe CLI (see Step 3 above).

---

## Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth (Email + Google OAuth) |
| Storage / Media | Google Drive API v3 (Service Account) |
| Payments | Stripe Checkout |
| Deployment | Vercel |
| Styling | Tailwind CSS + Custom CSS Variables |
| Animations | Framer Motion |
| Fonts | Cormorant Garamond + Jost (Google Fonts) |
| Social | Instagram Basic Display API + TikTok oEmbed |
