# Auxo: Pre-Flight Production Checklist & Release Roadmap

Before publishing the Auxo platform to a live production environment, the following infrastructure setups, console configurations, and environment variables must be established to transition from the local sandbox mode.

---

## 1. Supabase Production Deployment Checklist

### A. Database Schema & Policies
- [ ] **Database Migration:** Run migrations on the production Postgres database to create the `profiles` table matching the sandbox schema:
  ```sql
  create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    credits integer default 0 not null,
    is_lifetime boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
  ```
- [ ] **Profile Auto-Creation Trigger:** Install the trigger to auto-provision a profile row when a student/developer registers via Magic Link:
  ```sql
  create or replace function public.handle_new_user()
  returns trigger as $$
  begin
    insert into public.profiles (id, credits, is_lifetime)
    values (new.id, 0, false);
    return new;
  end;
  $$ language plpgsql security definer;

  create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
  ```
- [ ] **Row-Level Security (RLS):** Ensure RLS is enabled on `public.profiles` and configure the policy allowing read-only access where `auth.uid() = id` (no client-side direct writes).

### B. Authentication Console Configuration
- [ ] **Allowed Redirect URLs:** In **Supabase Console -> Authentication -> URL Configuration**, add your production URL (e.g. `https://auxo.dev/room/*`) to the Redirect URLs list so Magic Links forward users back to their rooms.
- [ ] **SMTP / Mail Provider Configuration:** (Optional but Recommended) Replace the default Supabase daily email rate limits with a custom SMTP provider (e.g. Resend) to guarantee reliable login link delivery.

---

## 2. Stripe Production Deployment Checklist

### A. Product Catalog Setup
- [ ] **Product 1 (PAYG Credit Pack):** Create a product in Stripe Dashboard named `Auxo 15x AI Compile Credit Pack` priced at `£4.99` (One-time, GBP).
- [ ] **Product 2 (Developer Pack):** Create a product named `Auxo Developer Pack` priced at `£9.99` (One-time, GBP).
- [ ] Verify that metadata keys `tier: "credits"` and `tier: "lifetime"` are correctly configured under each Stripe product if using Stripe dashboard-created price IDs (though `/api/checkout` dynamically generates product line items, matching Stripe products helps bookkeeping).

### B. Webhook Endpoint Registration
- [ ] Go to **Stripe Dashboard -> Developers -> Webhooks** and click **Add Endpoint**.
- [ ] Register the live webhook URL:
  ```text
  https://yourdomain.com/api/webhooks/stripe
  ```
- [ ] Select events to listen to: `checkout.session.completed`.
- [ ] Reveal and copy the webhook signing secret (`whsec_...`).

---

## 3. Production Environment Variables (Deployment UI)

Configure these keys inside your hosting provider (e.g. Vercel dashboard environment variables):

| Environment Variable | Description / Source |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Live Supabase project URL API endpoint. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anonymous key for database client operations under RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Backend service role key (bypasses RLS in Stripe webhook handler). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Production Stripe publishable key (`pk_live_...`). |
| `STRIPE_SECRET_KEY` | Production Stripe secret API key (`sk_live_...`). |
| `STRIPE_WEBHOOK_SECRET` | Production Webhook signing secret (`whsec_...`) used to verify signatures. |
| `OPENAI_API_KEY` | (Optional) Production fallback API key for cloud compilations. |
| `ANTHROPIC_API_KEY` | (Optional) Production fallback API key for cloud compilations. |

---

## 4. Pre-Flight Verification Scenarios
- [ ] Test Magic Link login using a real email; assert redirect succeeds.
- [ ] Initiate Checkout for both products; assert redirection is clean and secure.
- [ ] Simulate Stripe webhook callbacks; verify profile credits increment correctly.
