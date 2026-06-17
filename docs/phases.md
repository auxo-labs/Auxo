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
- [ ] **Step 9.4 (deferred):** Create a Stripe Webhook receiver (`/api/webhooks/stripe`) to listen for `checkout.session.completed` and email the `.zip` to the billing address via Resend/SendGrid — deferred until Phase 10 auth is in place.
- [ ] **Step 9.5 (deferred):** End-to-end Stripe CLI test + email delivery verification — to be completed alongside 9.4.

> ✅ **Build verified:** `npm run lint && npm run build` passing with zero errors as of 2026-06-17.

## Phase 10: Scale & Expansion (Auth & Persistent Database Storage)
- [ ] **Step 10.1:** Define a structured database schema using Supabase for user profiles, workspace rooms, and historical prompt compiles.
- [ ] **Step 10.2:** Integrate Supabase Auth on the client, introducing a minimalist glassmorphic Login/Signup modal to allow users to authenticate.
- [ ] **Step 10.3:** Refactor the Supabase client helpers to associate compiled prompt matrices and scratchpad histories with the authenticated user ID.
- [ ] **Step 10.4:** Implement a premium sidebar or room dashboard explorer to allow users to view, search, and restore their historical compiled blueprints.
- [ ] **Step 10.5:** Configure strict Supabase Row-Level Security (RLS) policies to protect proprietary developer blueprints and database queries.

## Phase 11: Testing & Quality Verification
- [x] **Step 11.1:** Define three distinct test inputs representing different developer requirements in `docs/test_cases.md`.
- [ ] **Step 11.2:** Run the local mock compiler on these inputs to verify mock packaging.
- [ ] **Step 11.3 (Optional):** Add a temporary `OPENAI_API_KEY` to `.env.local` to run actual LLM compilations, capturing and analyzing the output quality of `AGENTS.md` and `.cursor/rules/*.mdc`.

## Phase 12: Scratchpad & Real-Time Collaboration Upgrades
- [ ] **Step 12.1:** Upgrade the editor UI from a plain `<textarea>` to a premium code editor (e.g., integrating a lightweight Markdown editor like CodeMirror 6 or Monaco Editor).
- [ ] **Step 12.2:** Add visual line-number gutter and syntax highlighting for Markdown.
- [ ] **Step 12.3:** Enhance Supabase Real-time collaboration:
  - Implement active user avatars/names (presence state).
  - Show cursors and selection highlights of other active users inside the editor.
  - Add a live character/word count animation.

