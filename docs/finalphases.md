# Auxo: Pre-Flight Production Checklist & Release Roadmap

This document outlines the final steps to transition Auxo from a free, unlimited client-side BYOK sandbox into a paid platform (billing credits and account-gated compiles) when you are ready.

---

## 1. Supabase Production Deployment (Completed)

The core database schemas, triggers, RLS policies, and redirect wildcards have been successfully established in the Supabase console:
- [x] **Database Schema:** `profiles` and `projects` tables are provisioned.
- [x] **Profile Auto-Creation Trigger:** `on_auth_user_created` trigger is deployed to auto-provision profile rows on sign-up.
- [x] **Row-Level Security (RLS):** Strict read-only policies for `profiles` and owner-scoped write permissions for `projects` are enabled.
- [x] **Allowed Redirect URLs:** Redirect wildcards (e.g. `https://<domain>/room/*`) are configured in Supabase.

---

## 2. Stripe Production Setup

Refer to [`docs/stripe.md`](file:///Users/danwooster/1. DEV/auxo/docs/stripe.md) for the complete, step-by-step setup guides for:
- [ ] Product & Price registration in the Stripe Dashboard.
- [ ] Webhook Endpoint configuration.
- [ ] Local simulation via Stripe CLI.

---

## 3. Production Environment Variables (Vercel)

Configure the following variables in your hosting provider (e.g. Vercel dashboard):

| Environment Variable | Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Shared | Supabase project API URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Shared | Anon client key (runs under RLS rules). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Public / Shared | Stripe publishable key (`pk_live_...`). |
| `STRIPE_SECRET_KEY` | Server-only | Stripe secret API key (`sk_live_...`). |
| `STRIPE_WEBHOOK_SECRET` | Server-only | Webhook signing secret (`whsec_...`). |

> [!WARNING]
> **Security Guard (SUPABASE_SERVICE_ROLE_KEY):**
> Do **NOT** add the `SUPABASE_SERVICE_ROLE_KEY` to Vercel environment variables. This key bypasses all Row-Level Security (RLS) rules and poses a major security hazard if leaked or accessed through serverless exploits.
> 
> **Secure Alternative:**
> When integrating Stripe webhooks, do not route the database updates through `/api/webhooks/stripe` on Vercel. Instead, deploy the webhook handler as a **Supabase Edge Function** directly inside your Supabase project dashboard. Supabase Edge Functions can safely update the `profiles` table locally without exposing the admin key to your Vercel hosting environment.

---

## 4. Codebase Activation Checklist

To un-grey the pricing options and connect them to checkout redirections:

### A. Pricing Page UI Upgrades
In [`src/app/pricing/page.tsx`](file:///Users/danwooster/1. DEV/auxo/src/app/pricing/page.tsx):
- [ ] **Un-grey Containers:** Remove the classes `opacity-40` and `select-none` from the Tier 2 and Tier 3 cards (around lines 220 and 264).
- [ ] **Update Top-Right Badges:**
  - Change Tier 2 badge from `TIER 02 // COMING SOON` to `TIER 02 // PAYG` (styled with `text-cyan-500`).
  - Change Tier 3 badge from `TIER 03 // COMING SOON` to `TIER 03 // PRO` (styled with `text-zinc-400`).
- [ ] **Re-enable Action Buttons:**
  - Replace the Tier 2 "COMING SOON" button with:
    ```tsx
    <button
      onClick={() => handlePurchase('credits')}
      disabled={purchasingTier !== null}
      className="mt-6 w-full h-9 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-[10px] font-mono font-semibold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {purchasingTier === 'credits' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'BUY BUILDER PACK'}
    </button>
    ```
  - Replace the Tier 3 "COMING SOON" button with:
    ```tsx
    <button
      onClick={() => handlePurchase('lifetime')}
      disabled={purchasingTier !== null}
      className="mt-6 w-full h-9 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-[10px] font-mono font-semibold tracking-wider text-zinc-300 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
    >
      {purchasingTier === 'lifetime' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'BUY DEVELOPER PACK'}
    </button>
    ```
- [ ] **Restore Imports:** Import `Loader2` from `'lucide-react'` at the top of the file, and remove any `eslint-disable` comments above the state hooks.
