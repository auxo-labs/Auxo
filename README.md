# Auxo

Auxo turns rough brainstorming notes into production-ready AI context files. You open a room, paste your project ideas in plain markdown, hit Compile, and get back a structured pack containing `AGENTS.md`, `CLAUDE.md`, and a set of `.cursor/rules` files — the exact inputs that modern AI coding agents like Claude Code and Cursor expect.

The compile step queries live NPM registry data to inject the correct versions and conventions for whatever stack you mentioned, so the output is grounded in what actually exists today rather than what the model was trained on.

## What it produces

- `AGENTS.md` — agent-facing project context with stack conventions, DRY/SOLID contracts, and explicit scope boundaries
- `CLAUDE.md` — Claude Code configuration file
- `.cursor/rules/*.mdc` — Cursor workspace rules, one file per concern

These are bundled into a single ZIP file you download and drop into the root of your project.

## Environment variables

Create a `.env.local` file at the project root. None of these are required to run locally in dev mode, but Stripe and an LLM key are needed for the full production experience.

```bash
# Stripe (required in production)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# LLM provider (used by the prompt compiler)
OPENAI_API_KEY=...

# Supabase (used for real-time multi-user sync)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## Payment flow

The compile endpoint is gated behind a one-time Stripe payment. When `STRIPE_SECRET_KEY` is set:

1. Clicking Compile redirects the user to a Stripe Checkout page
2. After payment, Stripe redirects back to `/room/[id]?session_id=...`
3. The compile endpoint verifies the session is paid and that the room ID matches before running
4. The compiled files appear in the preview panel; the user downloads the ZIP manually

When `STRIPE_SECRET_KEY` is not present (local development), the checkout route returns a mock session and the compile runs without any payment step.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- Tailwind CSS v4
- Supabase Realtime (broadcast and presence, no database writes)
- Stripe Checkout
- JSZip

## Project structure

```
src/
  app/
    api/
      checkout/route.ts   — creates a Stripe Checkout Session
      compile/route.ts    — verifies payment and runs the prompt compiler
    page.tsx              — landing page
    room/[id]/page.tsx    — collaborative workspace
  components/
    editor.tsx            — markdown scratchpad with real-time sync
    preview.tsx           — VS Code-style output file viewer
  lib/
    prompt-compiler.ts    — three-pass compiler that produces the context pack
    tech-resolver.ts      — queries NPM registry for live package versions
    supabase.ts           — Supabase client setup
docs/
  phases.md               — project phase checklist
  overview.md             — architecture notes
  CHANGELOG.md            — version history
  TESTING.md              — manual test cases
```

## Local Stripe testing

To test the real payment flow locally, add your Stripe test keys to `.env.local` and restart the dev server. Use the standard Stripe test card (`4242 4242 4242 4242`, any future expiry, any CVC). After completing checkout, Stripe will redirect you back to the room and the compile will run automatically.

To test without Stripe at all, simply leave `STRIPE_SECRET_KEY` out of your `.env.local`. The mock session kicks in and the full UI flow — redirect, compile, preview, download — works identically.
