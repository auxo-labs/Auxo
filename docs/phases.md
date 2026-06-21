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

- [x] **Step 16.1:** Refactor [prompt-compiler.ts](file:///Users/danwooster/1.%20DEV/auxo/src/lib/prompt-compiler.ts) by modularizing LLM clients, system prompts, mock templates, and parser sanitizers under `src/lib/prompt-compiler/`.
- [x] **Step 16.2:** Refactor the Room Page [page.tsx](file:///Users/danwooster/1.%20DEV/auxo/src/app/room/[id]/page.tsx) by isolating state listeners into custom hooks (`useRoomSync`, `useShortcuts`) and splitting header/editor rendering.
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

## Phase 22: Monetisation Upgrade & Security Hardening (Active Phase)

- [ ] **Step 22.1:** Refactor Stripe checkout API and UI prices/tier descriptions (Tier 2: £9.99 for 20 compiles; Tier 3: £24.99 for 75 compiles).
- [ ] **Step 22.2:** Update Stripe Webhook handler and API Compile route to credit 20 compiles and 75 compiles respectively on Stripe webhook checkout completions.
- [ ] **Step 22.3:** Implement SEC-08: Encrypt/obfuscate client-side BYOK keys stored in `localStorage` to protect against script-injection key scraping.
- [ ] **Step 22.4:** Implement SEC-07: Integrate basic IP/user-based compilation rate limiting for `/api/compile` to protect against automated spamming.
- [ ] **Step 22.5:** Update unit and integration tests to cover new pricing balances, rate-limits, and encryption, and run verify builds.

## Future Phases & Stretch Goals (DEFERRED - ABSOLUTE FEATURE FREEZE ENFORCED)

- [ ] **Scratchpad & Real-Time Collaboration Upgrades:**
  - Upgrade the editor UI from a plain `<textarea>` to a more creative visual area - flashcards, notes etc.
  - Add real-time collaboration features.

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
