# Project Phases: Auxo (PromptOps Blueprint)

## Phase 1: Planning, Setup & Scaffolding
- [x] **Step 1.1:** Write the phase plan to `phases.md` and outline the architecture. (Current Step)
- [ ] **Step 1.2:** Scaffold the Next.js project.
- [ ] **Step 1.3:** Setup global CSS, Tailwind config, and premium dark-mode theme structure.
- [ ] **Step 1.4:** Initialize Supabase client helpers (without auth) for real-time text sync.

## Phase 2: Core Routing & Landing Page
- [ ] **Step 2.1:** Build the landing page (`src/app/page.tsx`) with a minimalist premium dark-mode CTA to generate a Room UUID and route to `/room/[id]`.
- [ ] **Step 2.2:** Build the static skeleton layout of the Room page (`src/app/room/[id]/page.tsx`) with a side-by-side split view (Left Editor / Right Preview).

## Phase 3: Collaborative Editor & Real-time Sync
- [ ] **Step 3.1:** Set up Supabase Realtime channel logic (using Broadcast and Presence) to sync text changes instantly.
- [ ] **Step 3.2:** Build the collaborative text editor component (`src/components/editor.tsx`) with a markdown textarea.
- [ ] **Step 3.3:** Add multi-user cursor presence or visual cues showing concurrent editors in the room.

## Phase 4: Folder Preview & LLM Compiler
- [ ] **Step 4.1:** Build the interactive file explorer/preview component (`src/components/preview.tsx`) to show the output folder structure.
- [ ] **Step 4.2:** Implement the Server Action / route (`src/lib/prompt-compiler.ts`) using an LLM endpoint (zero-data retention) to compile chaotic notes into structured text.
- [ ] **Step 4.3:** Set up a client-side `.zip` exporter (e.g. using `jszip`) to let users download the final files (`AGENTS.md`, `CLAUDE.md`, `.cursor/rules/*.mdc`) in one click.

## Phase 5: Testing, Refactoring & Polish
- [ ] **Step 5.1:** Set up manual test cases and verify them (updating `TESTING.md`).
- [ ] **Step 5.2:** Add final micro-animations, glassmorphic UI accents, and error boundaries.
- [ ] **Step 5.3:** Finalize walkthrough and check off the project lifecycle.
