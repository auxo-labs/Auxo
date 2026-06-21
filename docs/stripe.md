# Stripe Local Testing & Production Integration Guide

This guide details the steps taken to configure and verify Stripe checkout integrations in local development, as well as the remaining action items needed in both the IDE and the Stripe dashboard to fully implement payments for live environments.

---

## 1. Local Development Setup & CLI Verification

To test the checkout webhooks locally without deploying to a public domain, we leveraged the **Stripe CLI** as a local webhook proxy.

### Steps Done:
1. **Installed the Stripe CLI** via Homebrew:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```
2. **Authenticated the CLI** with a mock Stripe account:
   ```bash
   stripe login
   ```
   *(Authorized the terminal via the Stripe browser link to map CLI commands to your Stripe Developer account).*
3. **Started Webhook Listening**:
   Launched a forwarding tunnel to route Stripe events directly to your local Next.js API endpoint at [src/app/api/webhooks/stripe/route.ts](../src/app/api/webhooks/stripe/route.ts):
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   *This outputted a signing secret starting with `whsec_...`.*
4. **Configured Environment Variables**:
   Saved the webhook secret inside `.env.local` to allow the route handler to decrypt and authenticate signatures from Stripe:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
5. **Simulated E2E Checkout Event**:
   Obtained your logged-in Supabase user UUID (`client_reference_id`) and ran the mock trigger command:
   ```bash
   stripe trigger checkout.session.completed \
     --override checkout_session:client_reference_id="YOUR_USER_ID_HERE" \
     --override checkout_session:metadata.tier="credits"
   ```
   *Result:* Next.js logs confirmed that 20 compiles were successfully credited to your profiles row in Supabase.

---

## 2. Next Steps: IDE Implementations & Adjustments

Before launching, complete the following adjustments in your code and environment configuration:

### A. Environment Configuration (`.env.local`)
Replace the local mock values with your actual Stripe developer keys (under Stripe Dashboard -> Developers -> API keys):
```env
# Stripe Keys (Developer Test Mode)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### B. Fallback Support & Error Handling (Phase 19.4)
* Implement a clear fallback support button or mailto links in the room header/nav bar. If the Stripe redirect is delayed or an API key fails, users need a direct way to contact support.

---

## 3. Next Steps: Stripe Dashboard Configuration (Production Go-Live)

When migrating from testing to a live production environment, complete these steps in your Stripe dashboard:

### A. Product and Pricing Configuration
You must create the corresponding product records in your Stripe Dashboard to map checkout sessions correctly:
1. Go to your **Stripe Dashboard -> Products**.
2. **Create Product 1 (Builder Pack):**
   * Name: `Auxo 20x AI Compile Credit Pack`
   * Pricing: `£9.99` (One-time fee)
3. **Create Product 2 (Founder/Developer Pack):**
   * Name: `Auxo Developer Pack`
   * Pricing: `£24.99` (One-time fee)

### B. Production Webhook Setup
Once your application is deployed to your live URL (e.g. Vercel or custom domain):
1. Go to **Stripe Dashboard -> Developers -> Webhooks**.
2. Click **Add Endpoint**.
3. Set the **Endpoint URL** to:
   ```text
   https://yourdomain.com/api/webhooks/stripe
   ```
4. Under **Select events to listen to**, select:
   * `checkout.session.completed`
5. Save the endpoint.
6. Click **Reveal signing secret** (`whsec_...`). Copy this secret and set it as `STRIPE_WEBHOOK_SECRET` in your production hosting platform (e.g. Vercel environment variables).

### C. Live Mode Activation
* Once you have verified the checkout flow using Stripe Test Mode keys (`sk_test_...` and `pk_test_...`), toggle the **Live Mode** switch on your Stripe Dashboard.
* Replace your project environment variables with your live production keys (`sk_live_...` and `pk_live_...`) to begin accepting real credit card payments.
