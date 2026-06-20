# Auxo Architecture & System Overview

Auxo is a zero-auth, collaborative prompt engineering workspace built with Next.js 16 (App Router) and Tailwind CSS v4. It parses unstructured brainstorming notes into structured, prompt-optimized context files (`AGENTS.md`, `CLAUDE.md`, and `.cursor/rules/`) for 2026 AI coding agents.

## 1. Directory Structure

```text
auxo/
├── docs/                       <-- Architectural blueprints & changelogs
│   ├── CHANGELOG.md            <-- Release history & feature tracking
│   ├── compiler_specs.md       <-- Compiler architecture flows & tradeoffs
│   ├── finalphases.md          <-- Future scaling roadmap (Stripe webhooks, auth)
│   ├── overview.md             <-- [CURRENT FILE] System architecture overview
│   ├── phases.md               <-- Phase progression checklist
│   ├── prompt.md               <-- Root prompt instructions for AI session context
│   ├── research.md             <-- Context matrix research findings
│   ├── test_cases.md           <-- Standardized compiler test scenarios
│   └── TESTING.md              <-- System validation test cases
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── checkout/
│   │   │   │   └── route.ts    <-- POST: creates a Stripe Checkout Session
│   │   │   └── compile/
│   │   │       └── route.ts    <-- POST: verifies payment & triggers prompt compiler
│   │   ├── layout.tsx          <-- Global typography and metadata layout
│   │   ├── optimality/
│   │   │   └── page.tsx        <-- Token savings & optimality whitepaper
│   │   ├── page.tsx            <-- Minimalist, premium grid landing page
│   │   └── room/
│   │       └── [id]/
│   │           └── page.tsx    <-- Collaborative workspace viewport
│   ├── components/
│   │   ├── editor.tsx          <-- Collaborative text scratchpad (Realtime Sync)
│   │   └── preview.tsx         <-- VS Code-style file tree and code viewer
│   └── lib/
│       ├── prompt-compiler.ts  <-- Software 3.0 3-pass compiler logic
│       ├── supabase.ts         <-- Safe Supabase client configuration
│       └── tech-resolver.ts    <-- Live tech stack package resolver
```

## 2. Core Functional Pillars

*   **Premium Obsidian Design:** Built with high-contrast serif typography (`Playfair_Display`) and grid patterns (`dot-bg`), inspired by Aceternity and Refero Design.
*   **Real-time Collaboration & Sync:** Syncs markdown keystrokes and builder presence in real-time using **Supabase Broadcast & Presence**, maintaining an ephemeral collaborative canvas.
*   **Software 3.0 Context Matrix:** Processes raw notes into a multi-file matrix designed to keep agent context windows highly scoped, preventing "lost-in-the-middle" attention degradation.
*   **Client-Side ZIP Bundling:** Uses `JSZip` to compile the generated context structure and initiate downloads of the exact file structure required by Cursor and Claude Code.
*   **Account-Gated Stripe Tiers:** Deep compilations are gated by Supabase Auth and Stripe payment tiers (£15 for 3 credits vs £99 for a Lifetime Access Pass in GBP). Features a direct Stripe session check on compilation callbacks to bypass webhook propagation delays.
*   **LocalStorage Crash Safety:** Scratchpad content is continuously mirrored to `localStorage` by Room UUID, restoring the user's work automatically on refresh or accidental tab close.
*   **Context Optimality Specs:** An interactive technical whitepaper hosted at `/optimality` detailing compiler scope boundaries, token efficiencies, and attention maps.

## 3. LLM Architecture & Rate Limiting Strategy

Auxo orchestrates calls to advanced LLMs (OpenAI's `gpt-4o-mini` or Anthropic's `claude-3-5-sonnet`) to parse unstructured developer notes into structured prompt configurations. To ensure reliability, speed, and cost efficiency, the following strategies are implemented:

*   **Double-Tier Fallback Engine:**
    1. If `OPENAI_API_KEY` is configured, it defaults to the fast, cost-effective `gpt-4o-mini` using the JSON object output format.
    2. If OpenAI fails or is missing, and `ANTHROPIC_API_KEY` is present, it fails over to `claude-3-5-sonnet-20241022` with pre-cleaned JSON blocks.
    3. If both external APIs fail (or keys are missing in local dev), it falls back to a smart `localMockCompile` template parser to ensure continuous availability.
*   **Token-Gating as a Rate-Limiter:** Since premium compile actions require authenticated user accounts and decrement their active credit balance (or require lifetime access), arbitrary spamming of the LLM endpoint is natively prevented in production.
*   **Keyless Registry Caching:** The live `tech-resolver.ts` queries NPM Registry metadata via `fetch` using Next.js route caching (`next: { revalidate: 3600 }`). This caches NPM requests for 1 hour, protecting the registry API from rate-limiting penalties while keeping stack resolutions live.
*   **Client-Side Throttling:** The compilation actions inside the room UI disable the triggers (`isCompiling` state) and block concurrent compilations during an active request.
