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

- [ ] **Step 16.1:** Refactor [prompt-compiler.ts](file:///Users/danwooster/1.%20DEV/auxo/src/lib/prompt-compiler.ts) by modularizing LLM clients, system prompts, mock templates, and parser sanitizers under `src/lib/prompt-compiler/`.
- [ ] **Step 16.2:** Refactor the Room Page [page.tsx](file:///Users/danwooster/1.%20DEV/auxo/src/app/room/[id]/page.tsx) by isolating state listeners into custom hooks (`useRoomSync`, `useShortcuts`) and splitting header/editor rendering.
- [ ] **Step 16.3:** Move client-side JSZip exporter operations from the Room Page component layer into a dedicated utility helper file `src/lib/zip-exporter.ts`.
- [ ] **Step 16.4:** Validate that all refactored modular files build successfully and pass linter guidelines using `npm run lint` and `npm run build`.

## Future Phases & Stretch Goals (Deferred)

- [ ] **Scratchpad & Real-Time Collaboration Upgrades:**
  - Upgrade the editor UI from a plain `<textarea>` to a premium code editor (e.g., CodeMirror 6 or Monaco Editor).
  - Add visual line-number gutter and syntax highlighting for Markdown.
