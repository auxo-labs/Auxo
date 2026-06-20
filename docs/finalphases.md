# Auxo: Future Phases & Scaling Roadmap

## Phase A: Scale & Expansion (Auth & Persistent Database Storage)

- [ ] **Step B.1:** Define a structured database schema in Supabase for user profiles, workspace rooms, and historical prompt compiles.
- [ ] **Step B.2:** Integrate Supabase Auth on the client side, introducing a minimalist glassmorphic Login/Signup modal to allow users to authenticate.
- [ ] **Step B.3:** Refactor the Supabase client helpers to associate compiled prompt matrices and scratchpad histories with the authenticated user ID.
- [ ] **Step B.4:** Implement a premium sidebar or room dashboard explorer to allow users to view, search, and restore their historical compiled blueprints.
- [ ] **Step B.5:** Configure strict Supabase Row-Level Security (RLS) policies to protect proprietary developer blueprints and database queries.

## Phase B: Zero-Auth Stripe Webhooks & Email Delivery

- [ ] **Step A.1:** Create a Stripe Webhook receiver (`src/app/api/webhooks/stripe/route.ts`) to listen for `checkout.session.completed` events.
- [ ] **Step A.2:** Integrate Resend/SendGrid to extract the user's billing email from the Stripe session and automatically email the compiled `.zip` file.
- [ ] **Step A.3:** Perform end-to-end verification using the Stripe CLI to trigger mock payments and confirm email delivery.
