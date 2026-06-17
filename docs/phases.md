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
