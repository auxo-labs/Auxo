# Project Phases: Auxo

## Phase 1: Planning, Setup & Scaffolding

- [x] **Step 1.1:** Write the phase plan to `phases.md` and outline the architecture. (Current Step)
- [x] **Step 1.2:** Scaffold the Next.js project.
- [x] **Step 1.3:** Setup global CSS, Tailwind config, and premium dark-mode theme structure.
- [x] **Step 1.4:** Initialize Supabase client helpers (without auth) for real-time text sync.

## Phase 2: Core Routing & Landing Page

- [x] **Step 2.1:** Build the landing page (`src/app/page.tsx`) with a minimalist premium dark-mode CTA to generate a Room UUID and route to `/room/[id]`.
- [x] **Step 2.2:** Build the static skeleton layout of the Room page (`src/app/room/[id]/page.tsx`) with a side-by-side split view (Left Editor / Right Preview).

## Phase 3: Collaborative Editor & Real-time Sync

- [x] **Step 3.1:** Set up Supabase Realtime channel logic (using Broadcast and Presence) to sync text changes instantly.
- [x] **Step 3.2:** Build the collaborative text editor component (`src/components/editor.tsx`) with a markdown textarea.
- [x] **Step 3.3:** Add multi-user cursor presence or visual cues showing concurrent editors in the room.

## Phase 4: Folder Preview & LLM Compiler

- [x] **Step 4.1:** Build the interactive file explorer/preview component (`src/components/preview.tsx`) to show the output folder structure.
- [x] **Step 4.2:** Implement the Server Action / route (`src/lib/prompt-compiler.ts`) using an LLM endpoint (zero-data retention) to compile chaotic notes into structured text.
- [x] **Step 4.3:** Set up a client-side `.zip` exporter (e.g. using `jszip`) to let users download the final files (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*.mdc`) in one click.

## Phase 5: Testing, Refactoring & Polish

- [x] **Step 5.1:** Set up manual test cases and verify them (updating `TESTING.md`).
- [x] **Step 5.2:** Add final micro-animations, glassmorphic UI accents, and error boundaries.
- [x] **Step 5.3:** Finalize walkthrough and check off the project lifecycle.

## Phase 6: Karpathy-Inspired Prompt Compiler Implementation

- [x] **Step 6.1:** Update the Prompt Compiler schema and local mock compiler inside `src/lib/prompt-compiler.ts`.
- [x] **Step 6.2:** Create the API Route handler at `src/app/api/compile/route.ts`.
- [x] **Step 6.3:** Integrate the new API route and JSZip generator in `src/app/room/[id]/page.tsx` and `src/components/preview.tsx`.
- [x] **Step 6.4:** Perform manual verification of the compiler outputs.

## Phase 7: Implied Conventions & Live Tech-Stack Search

- [x] **Step 7.1:** Update the system instructions in `src/lib/prompt-compiler.ts` to automatically inject Software Engineering taste invariants (DRY, SOLID, JSDoc styles, typescript safety, clean error thresholds) into `AGENTS.md`.
- [x] **Step 7.2:** Create a helper at `src/lib/tech-resolver.ts` to query keyless developer APIs (NPM Registry for versions, and a free web search/documentation query).
- [x] **Step 7.3:** Integrate the tech resolver into `src/app/api/compile/route.ts` to inject live registry resolutions and conventions into the LLM prompt.
- [x] **Step 7.4:** Verify compiled outputs to confirm that latest versions and strict software engineering contracts are auto-injected.

## Phase 8: Workspace Usability Enhancements

- [x] **Step 8.1:** Set up a global keyboard listener (for both Mac `Meta + Enter` and Windows `Ctrl + Enter`) in `src/app/room/[id]/page.tsx` to compile the notes from the scratchpad without manual mouse clicks.
- [x] **Step 8.2:** Update the `handleCompile` logic in `src/app/room/[id]/page.tsx` to only call the `/api/compile` API and update the preview UI state (removing the automatic `.zip` trigger).
- [x] **Step 8.3:** Add an "Export ZIP" (Download Pack) button inside the header bar, which is enabled only after a compilation has run.
- [x] **Step 8.4:** Verify the shortcut triggers compilation and the separate download operates correctly, and document the completion.
- [x] **Step 8.5:** Integrate OS-specific keyboard shortcut badges inside action buttons and map full workspace keyboard navigation (Cmd+S, Cmd+Shift+C, Escape).

## Phase 9: Zero-Auth Monetization (Stripe & Ephemeral Safety)

- [x] **Step 9.1:** Implement LocalStorage mirroring inside the workspace editor so that scratchpad content is cached locally by room ID and restored on accidental refreshes.
- [x] **Step 9.2:** Set up a Stripe Checkout API endpoint (`/api/checkout`) to initialize Checkout Sessions with the active Room UUID embedded as `client_reference_id`.
- [x] **Step 9.3:** Connect the "Compile" action in the UI to redirect to Stripe Checkout when no verified `session_id` is present; post-payment redirect auto-compiles and triggers ZIP download.

## Phase 10: Context Optimality & Fine-Tuning the Compiled Agent Pack (Active Phase)

- [x] **Step 10.1 (Optimality Page):** Review, complete, and format the Technical Research Whitepaper under `/optimality` (`src/app/optimality/page.tsx`).
- [x] **Step 10.2 (Optimality Links):** Ensure the links in the landing page navbar and room header toolbar correctly target `/optimality` and open in the same tab.
- [x] **Step 10.3 (Fine-tuning Compiler):** Fine-tune compiler output format in `src/lib/prompt-compiler.ts` (ensuring correct JSDoc templates, clean comments, DRY/SOLID instructions, and strict token budget bounds are strictly followed by the AI generator).
- [x] **Step 10.4 (Optimality/Compiler Validation):** Run local mock compilations and check generated file structure outputs against linter checks (`npm run lint` and `npm run build`).

## Phase 11: Testing & Quality Verification

- [x] **Step 11.1:** Define three distinct test inputs representing different developer requirements in `docs/test_cases.md`.
- [x] **Step 11.2:** Run the local mock compiler on these inputs to verify mock packaging.
- [x] **Step 11.3 (Optional):** Add a temporary `OPENAI_API_KEY` to `.env.local` to run actual LLM compilations, capturing and analyzing the output quality of `AGENTS.md` and `.cursor/rules/*.mdc`.

## Phase 12: Account-Gated Premium Compiles & Supabase Auth

- [x] **Step 12.1 (Planning and Database Design):** Design and run migrations for profiles table in Supabase tracking compilation credits (GBP £15 for 3 credits) and lifetime access flags (£99).
- [x] **Step 12.2 (Supabase Auth Integration):** Set up `@supabase/supabase-js` anonymous/admin clients, create the glassmorphic passwordless Magic Link `AuthModal`, and add navbar indicators.
- [x] **Step 12.3 (Workspace Segregation):** Decouple compile actions in the UI: free `"Basic Agent Pack"` vs premium `"Deep AI Compile"` using token gating and Stripe redirects.
- [x] **Step 12.4 (Stripe Webhook & API Gating):** Map checkout sessions using `client_reference_id`, build the secure `webhooks/stripe` POST route to credit accounts, and update the API compilation handler to authenticate and decrement credits.
- [x] **Step 12.5 (Polish & Verification):** Fix asynchronous server action exports, parameter mismatches, compile retry type-safeties, and verify standard builds.

## Phase 13: Bring Your Own Key (BYOK) & Multi-Model Integration

- [x] **Step 13.1 (Gemini REST Client):** Implement `callGemini` using native fetch requests to the Google Gen AI REST API (`generativelanguage.googleapis.com`) inside `src/lib/prompt-compiler.ts`.
- [x] **Step 13.2 (Engine Key & Model Customization):** Refactor `compilePromptPack` to accept custom, optional API keys and models for OpenAI, Anthropic, and Gemini.
- [x] **Step 13.3 (Route Gating Bypass):** Update `src/app/api/compile/route.ts` to extract user keys/model preferences and bypass the database/Stripe payment validation if a custom API key is supplied.
- [x] **Step 13.4 (Settings Modal UI):** Design a premium glassmorphic `src/components/settings-modal.tsx` component allowing toggles between Premium (Stripe-backed) and BYOK modes, input fields for API keys (with show/hide visibility), and model configuration options.
- [x] **Step 13.5 (Workspace Integration & LocalStorage):** Mount the settings toggle gear inside the room navbar, hook it to client-side `localStorage`, and serialize the configurations into active compile requests.

## Phase 14: Navbar Spacing & UI Formatting

- [x] **Step 14.1:** Redesign the top toolbar of the workspace ([room/page.tsx]) to resolve horizontal squishing by grouping compile actions and applying responsive classes.
- [x] **Step 14.2:** Test layout boundaries on multiple screens.

## Phase 15: Parser Prompt Tuning & Output Analysis

- [x] **Step 15.1:** Fine-tune system instructions inside [prompt-compiler.ts] to output clean, YAML-frontmatter-compliant `.mdc` file blocks and support crossover domains.
- [x] **Step 15.2:** Generate a compiled pack using the local fallback compiler (COMPILE BASIC) on crossover specs and analyze its structure.
- [x] **Step 15.3:** Generate a compiled pack using the LLM-driven compiler (DEEP AI COMPILE with Gemini) on the same specifications.
- [x] **Step 15.4:** Perform a comprehensive output analysis of both generated matrices to check YAML compliance, frontmatter structure, software engineering taste constraints, and zero-placeholder rule compliance.
- [x] **Step 15.5:** Refine prompting rules inside `prompt-compiler.ts` based on findings and re-run compilation.
- [x] **Step 15.6:** Validate the final workspace integrity by running `npm run lint` and `npm run build`.

## Phase 16: Code Architecture Refactoring (God Modules Cleanup)

- [x] **Step 16.1:** Refactor [prompt-compiler.ts](../src/lib/prompt-compiler.ts) by modularizing LLM clients, system prompts, mock templates, and parser sanitizers under `src/lib/prompt-compiler/`.
- [x] **Step 16.2:** Refactor the Room Page [page.tsx](../src/app/room/[id]/page.tsx) by isolating state listeners into custom hooks (`useRoomSync`, `useShortcuts`) and splitting header/editor rendering.
- [x] **Step 16.3:** Move client-side JSZip exporter operations from the Room Page component layer into a dedicated utility helper file `src/lib/zip-exporter.ts`.
- [x] **Step 16.4:** Validate that all refactored modular files build successfully and pass linter guidelines using `npm run lint` and `npm run build`.

## Phase 17: BYOK vs. Cloud Compiles UI Clarity Upgrades

- [x] **Step 17.1:** Redesign the settings button in the room navbar to clearly state "KEYS & ROUTING" or similar, adding a visual indicator badge of the active compiler route (e.g. `[CLOUD]` or `[BYOK: GEMINI]`).
- [x] **Step 17.2:** Enhance the Settings Modal to make the comparison between Auxo Cloud Tiers and the free BYOK tier visually obvious with highlighted features and explicit pricing contrasts.
- [x] **Step 17.3:** Run build and linter validation to ensure visual stability.

## Phase 18: Landing Page & Marketing Enhancements

- [x] **Step 18.1:** Update `src/app/page.tsx` hero subtitles and bento cards to clearly feature the free Bring Your Own Key (BYOK) compile tier.
- [x] **Step 18.2:** Add a prominent "Pricing" link in the landing page navbar and footer, directing to the new pricing route.

## Phase 19: Pricing Page & Developer Pack Implementation

- [x] **Step 19.1:** Design and implement a premium dark-themed `/pricing` page (`src/app/pricing/page.tsx`) with dynamic bento-style tier selection grid (Free BYOK, PAYG Compile, Developer Pack).
- [x] **Step 19.2:** Link Stripe Checkout triggers to the selected Cloud tiers (credits vs developer pack) with proper checkout session payloads.
- [x] **Step 19.3:** Verify redirects, webhook handlers, and auth indicator updates after purchase completion (using Stripe CLI locally to trigger mock `checkout.session.completed` events and verify user credits incrementing).
- [x] **Step 19.4:** Build an ultra-lean "Contact/Support" fallback mailto: link/button on the workspace room toolbar for compile failures or credit bugs.

## Phase 20: Pre-Flight Checklist & Security Hardening

- [x] **Step 20.1 (Security):** Enable strict Row Level Security (RLS) policies on `public.profiles` table in Supabase so users can only view their own row.
- [x] **Step 20.2 (Security):** Implement and enforce Stripe webhook signature verification (`stripe-signature`) using the Webhook secret in `src/app/api/webhooks/stripe/route.ts`.
- [x] **Step 20.3 (Edge Cases):** Add client-side character limit validation to the scratchpad textarea to avoid expensive payload spikes or timeouts on massive text compiles.
- [x] **Step 20.4 (Edge Cases):** Validate that local storage hydration logic clears any malformed/corrupt keys from previous app iterations rather than causing room viewport layout crashes.
- [x] **Step 20.5:** Update the core manual test matrix in `docs/TESTING.md` with new test scenarios `TC-11` to `TC-15` covering safety policies and limits.
- [x] **Step 20.6:** Establish a centralized security mapping document `docs/security.md` tracking risk controls `SEC-01` to `SEC-11` for developer reviews.

## Phase 21: Automated Testing Suite Setup & Implementations

- [x] **Step 21.1:** Scaffold test framework by installing `vitest` and adding the `"test"` run script inside `package.json`.
- [x] **Step 21.2:** Write Batch 1 unit tests validating local compiler parsers and NPM version resolutions.
- [x] **Step 21.3:** Write Batch 2 integration tests targeting Stripe webhooks and API routing compilers.

## Phase 22: Monetisation Upgrade & Security Hardening (Completed)

- [x] **Step 22.1:** Refactor Stripe checkout API and UI prices/tier descriptions (Tier 2: £9.99 for 20 compiles; Tier 3: £24.99 for 75 compiles).
- [x] **Step 22.2:** Update Stripe Webhook handler and API Compile route to credit 20 compiles and 75 compiles respectively on Stripe webhook checkout completions.
- [x] **Step 22.3:** Implement SEC-08: Encrypt/obfuscate client-side BYOK keys stored in `localStorage` to protect against script-injection key scraping.
- [x] **Step 22.4:** Implement SEC-07: Integrate basic IP/user-based compilation rate limiting for `/api/compile` to protect against automated spamming.
- [x] **Step 22.5:** Update unit and integration tests to cover new pricing balances, rate-limits, and encryption, and run verify builds.

## Phase 23: Landing Page Pitch & Visual Upgrades (Completed)

- [x] **Step 23.1:** Update hero subtitle and bento descriptions in `page.tsx` for clearer context matrix pitch.
- [x] **Step 23.2:** Design and implement the "Compatible AI IDEs & Editors" section in `page.tsx`.
- [x] **Step 23.3:** Run build and verify changes.
- [x] **Step 23.4:** Update homepage UI - overhaul, add IDE logos etc. Also while user is waiting for deep AI compile - add some sort of scrolling wheel or bar so they can see the progress of the compilation.

## Phase 24: Previous Projects Sidebar (Logged-In Users)

- [x] **Step 24.1:** Create a `projects` table in Supabase linked to `auth.users` with columns `id`, `user_id`, `room_id`, `title`, `preview_text`, `created_at`, and `updated_at`. Enable a `UNIQUE(user_id, room_id)` constraint and configure RLS policies allowing select/insert/update/delete operations restricted to `auth.uid() = user_id`.
- [x] **Step 24.2:** On each successful compilation inside the room, if the user is authenticated, upsert a project record targeting the `(user_id, room_id)` key, updating `title` (derived from the first line of the scratchpad), `preview_text` (snippet of scratchpad), and `updated_at`.
- [x] **Step 24.3:** Build a collapsible left sidebar panel in the room viewport (`src/app/room/[id]/page.tsx`) that fetches and displays the user's project history sorted by `updated_at DESC`.
- [x] **Step 24.4:** Allow users to delete saved projects directly from the sidebar via a Trash icon trigger, executing a Supabase database deletion and updating client state.
- [x] **Step 24.5:** Hide the sidebar entirely for anonymous users. For logged-in users with empty project lists, render a clean empty-state guidance card with a button to trigger a new sandbox.
- [x] **Step 24.6:** Run build and lint verification checks.
- get rid of Auxo Architecture Group • Published June 2026 • Status: Verified in optimality page

## Phase 25: BYOK Privacy & Trust Messaging

This phase focuses on surfacing the privacy and security guarantees of BYOK mode clearly to users, so they understand exactly what Auxo stores (nothing) vs. what stays on their device (everything).

- [x] **Step 25.1:** Add a prominent **"Your Key. Your Privacy."** trust callout panel inside the Settings Modal. It must explain that keys are stored client-side in LocalStorage using XOR + Base64 encryption, and transit to the Next.js compile API securely via HTTPS strictly as a transient header (never logged, cached, or stored on disk) due to browser CORS policies.
- [x] **Step 25.2:** Add (and subsequently remove to resolve top navbar clutter) a green-glowing **"PRIVATE BYOK" compiler indicator badge** in the room navbar when BYOK is active, indicating that compilation requests bypass credit checks and database storage.
- [x] **Step 25.3:** Document the XOR encryption mechanism and security profile on the technical optimality specs page (`/optimality`).
- [x] **Step 25.4:** Update the landing page BYOK bento card copy to highlight the secure HTTPS transient transit and client-side encryption guarantees.
- [x] **Step 25.5:** Run build and lint verification checks.

## Phase 26: Prompt Context Pack Quality & Optimality Analysis

This phase focuses on performing a comprehensive technical audit on the generated Compiled Agent Pack to identify areas to improve token efficiency, context window optimality, and code compilation functionality.

- [x] **Step 26.1:** Analyze `AGENTS.md` and `.windsurfrules` syntax for instructions efficiency and token density.
- [x] **Step 26.2:** Analyze `CLAUDE.md` safe commands triggers and runtime constraints.
- [x] **Step 26.3:** Audit generated `.cursor/rules/*.mdc` files (`ui-theme.mdc`, `esrs-compliance.mdc`) to ensure the frontmatter structures, path globs, and internal logic guidelines are fully optimized for attention retention and prevent lost-in-the-middle issues.
- [x] **Step 26.4:** Benchmark compiled templates size against token thresholds and refine default compiler configurations in `system-prompt.ts`.

## Phase 27: Supabase Production & Branding Setup (Completed)

This phase focuses on configuring PostgreSQL schema migrations, authentication redirect rules, and custom branding assets.

- [x] **Step 27.1:** Execute SQL database schema migrations (profiles, projects, triggers, RLS policies) in the Supabase SQL editor.
- [x] **Step 27.2:** Configure Redirect URLs and site domain settings in the Supabase Authentication console.
- [x] **Step 27.3:** Design, transparentise, and integrate the custom minimalist geometric brand logo inside the landing page and room workspace headers.

## Phase 28: UI Cleanup & Solo-Mode Focus (Completed)

- [x] **Step 28.1 (Invite Button):** Removed the "INVITE" / copy-link button from the room toolbar header. The `handleCopyLink` handler and `Cmd+Shift+C` keyboard shortcut remain intact. Button JSX preserved via `{false && (...)}` in `src/app/room/[id]/page.tsx` — re-activate for the collaboration phase.
- [x] **Step 28.2 (Presence Badge):** Removed the active user count badge ("X BUILDERS") from the room header to avoid implying collaboration while single-user mode is the primary focus. Badge JSX preserved via `{false && (...)}` in `src/app/room/[id]/page.tsx`.
- [x] **Step 28.3 (Preview Header):** Removed the `Eye` icon and `02 //` panel-index prefix from the compiled agent pack preview header (`src/components/preview.tsx`). Simplified to a clean `COMPILED AGENT PACK` label.
- [x] **Step 28.4 (Preview Gutter Scroll Fix):** Fixed scroll bug in the compiled agent pack code viewer where vertical scrolling allowed scrolling past the text content leaving phantom line numbers in the gutter. Redesigned the container using an unified `overflow-auto` layout with a `sticky` gutter column to keep scroll bounds and line numbers perfectly synchronized.
- [x] **Step 28.5 (Copy / SSR):** Fixed hydration mismatch on the room page caused by `compiledFiles` being initialised from `localStorage` inside a lazy `useState`. Moved localStorage reads into a `useEffect` so server and client HTML match on first render.
- [x] **Step 28.6 (Homepage Copy):** Refreshed homepage — removed "ALIGNED WITH 2026 AI DEVELOPER SPECIFICATIONS" badge; headline updated to "Turn Ideas into Precision Agent Context."; subtitle tightened; CTA simplified to "NEW SANDBOX"; micro-copy updated to "No Account Required · Free BYOK Tier · One-Click Export".
- [x] **Step 28.7 (Settings Modal):** Fixed outdated "Claude 3.5 Sonnet" model reference → "Claude Sonnet 4.5"; corrected reversed Anthropic model display name (`claude-4.5-sonnet` → `claude-sonnet-4-5`); simplified tier label to "CHOOSE COMPILATION ROUTE".
- [x] **Step 28.8 (Optimality Page):** Removed fabricated `Auxo Architecture Group • Published June 2026 • Status: Verified` meta line. Replaced with plain `Published June 2026`.
- [x] **Step 28.9 (Realtime Connection Persistence):** Moved the Supabase Realtime synchronization, broadcast, and presence subscription hooks from the `<Editor>` component into the persistent `useRoomSync` hook. This keeps the network channel connection alive and connection status correctly synchronized as `SYNCED` even when the Editor panel is unmounted (e.g., when the Preview agent pack panel is expanded to fullscreen).
- [x] **Step 28.10 (Disable Paid Tiers for Free Deployments):** Greyed out Tier 2 (PAYG Credits) and Tier 3 (Developer Pack) cards on the pricing page and disabled their checkout buttons with a "COMING SOON" label to lock cloud payments for the free/unlimited BYOK hosting model.

## Phase 29: Mobile Responsiveness (Marketing & Docs Routes) (Completed)

Optimize layouts for mobile devices on all marketing, informational, and documentation views (specifically excluding the desktop-first Sandbox workspace room).

- [x] **Step 29.1 (Landing Page Mobile):** Audit and optimize the landing page (`src/app/page.tsx`) layout. Ensure the Hero typography, Bento Grid blocks, and Compatible IDE logo grids wrap, stack, and scale down smoothly on mobile screen viewports.
- [x] **Step 29.2 (Pricing Page Mobile):** Audit and optimize the pricing page (`src/app/pricing/page.tsx`) layout. Ensure the pricing cards stack vertically, text sizing wraps gracefully, and the capability comparison matrix supports clean horizontal overflow scrolling on narrow viewports.
- [x] **Step 29.3 (Optimality Page Mobile):** Audit and optimize the technical optimality paper page (`src/app/optimality/page.tsx`) layout. Ensure the mathematical equations, typography, code block highlights, and layout grids scale elegantly without horizontal layout breakage.

## Phase 30: Robust Authentication Options (Email/Password & Social OAuth)

Introduce alternative sign-in options to bypass Supabase's default rate limits on magic link email dispatches (which are heavily restricted on free-tier SMTP configurations).

- [x] **Step 30.1 (Auth Strategy):** Enable standard Email & Password credentials authentication alongside Magic Links in the Supabase Auth project console.
- [x] **Step 30.2 (Auth Modal Upgrades):** Update the workspace login dialog (`src/components/auth-modal.tsx`) to provide toggle tabs between "Magic Link" and "Password" auth modes, complete with email/password input validation.
- [x] **Step 30.3 (OAuth Integrations):** Setup Google or GitHub OAuth credentials, configure redirect domains in the Supabase dashboard, and mount "Continue with GitHub/Google" buttons in the authentication dialog.
- [x] **Step 30.4 (Session Redirection Verification):** Validate post-OAuth callback redirects and verify that user profile credentials and credit records load correctly after social authentication loops.

## Phase 31: Resizable Split-Pane Layouts (VS Code Style)

Implement drag-to-resize divider boundaries between the Sidebar, Editor, and Preview panels to emulate a premium desktop IDE workspace.

- [x] **Step 31.1 (Resize Hook):** Create a custom `useResizable` hooks system to track mouse drag/touch coordinates and compute dynamic, percentage-based section widths.
- [x] **Step 31.2 (Interactive Splitter Handle):** Build a draggable splitter boundary handle component with styling transitions (ambient hover highlights) and maximum/minimum panel constraint boundaries.
- [x] **Step 31.3 (Sandbox UI Integration):** Bind the resize handles between the Sidebar, Editor, and Preview panes, supporting layout state preservation in `localStorage` and double-click triggers to reset layouts to defaults.

## Phase 32: Rate Limiting & Bot Protection (Security Hardening)

Implement request rate limiting and protection against automated bot traffic for database queries, room creations, and API compilations.

- [x] **Step 32.1 (API Rate Limiting Middleware):** Implement strict rate-limiting middleware (e.g. Upstash Redis, or memory-based Token Bucket) on endpoints like `/api/compile` and `/api/checkout`.
- [x] **Step 32.2 (Anonymous Room Creation Limit):** Rate-limit anonymous room generation to prevent automated scripts from flooding the Supabase database with empty rooms.
- [x] **Step 32.3 (Bot/Spam Detection):** Add lightweight protection (like Cloudflare Turnstile or simple cryptographic proof-of-work challenges) for anonymous sandbox creations.

- [x] **Step 32.4 (Privacy Page):** Set up privacy page, relatively simple but include all the correct legal copy about data handling, user rights, AI usage, etc.

## Phase 33: Search & Generative Engine Optimization (SEO/GEO) (Completed)

- [x] **Step 33.1:** Create dynamic sitemap generator at `src/app/sitemap.ts` covering static landing, pricing, optimality, and privacy pages.
- [x] **Step 33.2:** Create custom `robots.ts` permitting search engine crawlers and AI bots (GPTBot, Google-Extended, PerplexityBot) while excluding backend API endpoints.
- [x] **Step 33.3:** Inject rich Open Graph (OG) and Twitter Card tags in `src/app/layout.tsx` metadata for link previews on social platforms.
- [x] **Step 33.4:** Perform a production build and verify sitemap/robots paths compile successfully.

# potential future phases

## Phase F1: Student & Academic Compilation Support

- [ ] **Step F1.1:** Add keyword detection and local academic templates in `mock-compiler.ts` (e.g. thesis, essay, computer science homework, lab reports).
- [ ] **Step F1.2:** Update `system-prompt.ts` with AI compiler guidelines for academic tone, citation compliance (APA/MLA/IEEE), and plagiarism prevention.
- [ ] **Step F1.3:** Write unit tests in `tests/unit.test.ts` to validate student compilation outcomes.
- [ ] **Step F1.4:** Verify full test execution and build checks.

## Phase F2: Enterprise / Team Pack

- [ ] **Step F2.1:** Implement uncapped hosted compilation endpoints for enterprise accounts.
- [ ] **Step F2.2:** Build team shared room workspace folders and persistent history explorers.
- [ ] **Step F2.3:** Integrate team unified billing management console and monthly Stripe subscriptions.
