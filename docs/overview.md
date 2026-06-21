# Auxo Architecture & System Overview

Auxo is a zero-auth, collaborative prompt engineering workspace built with Next.js 16 (App Router) and Tailwind CSS v4. It parses unstructured brainstorming notes into structured, prompt-optimized context files (`AGENTS.md`, `CLAUDE.md`, `.windsurfrules`, and `.cursor/rules/`) for 2026 AI coding agents.

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
│   │           ├── hooks/
│   │           │   ├── useRoomSync.ts  <-- Room state sync & storage handler
│   │           │   └── useShortcuts.ts <-- Keyboard shortcut listener hook
│   │           └── page.tsx    <-- Collaborative workspace viewport
│   ├── components/
│   │   ├── editor.tsx          <-- Collaborative text scratchpad (Realtime Sync)
│   │   └── preview.tsx         <-- VS Code-style file tree and code viewer
│   └── lib/
│       ├── prompt-compiler/    <-- Modular compiler package
│       │   ├── clients.ts      <-- OpenAI, Anthropic, Gemini client callers
│       │   ├── mock-compiler.ts <-- Deterministic offline mock templates
│       │   ├── parser.ts       <-- Rule block parsers & CRLF sanitizers
│       │   └── system-prompt.ts <-- System guidelines & compiler instructions
│       ├── supabase.ts         <-- Safe Supabase client configuration
│       ├── tech-resolver.ts    <-- Live tech stack package resolver
│       └── zip-exporter.ts     <-- Client-side ZIP compilation helpers
```

## 2. Core Functional Pillars

*   **Premium Obsidian Design:** Built with high-contrast serif typography (`Playfair_Display`) and grid patterns (`dot-bg`), inspired by Aceternity and Refero Design.
*   **Real-time Collaboration & Sync:** Syncs markdown keystrokes and builder presence in real-time using **Supabase Broadcast & Presence**, maintaining an ephemeral collaborative canvas.
*   **Software 3.0 Context Matrix:** Processes raw notes into a multi-file matrix designed to keep agent context windows highly scoped, preventing "lost-in-the-middle" attention degradation.
*   **Client-Side ZIP Bundling:** Uses `JSZip` to compile the generated context structure and initiate downloads of the exact file structure required by Antigravity, Cursor, Claude Code, VS Code, and Windsurf (including `.windsurfrules`).
*   **Hybrid Cloud & Bring Your Own Key (BYOK) Tiers:** Deep compilations can run via our hosted cloud infrastructure (gated by Supabase Auth and Stripe credit packs or a Lifetime Access Pass in GBP) or completely for free via BYOK. BYOK keys for Google Gemini, Anthropic, or OpenAI are stored strictly in client-side `localStorage` and bypass all authentication and payment checks.
*   **LocalStorage Crash Safety:** Scratchpad content is continuously mirrored to `localStorage` by Room UUID, restoring the user's work automatically on refresh or accidental tab close.
*   **Context Optimality Specs:** An interactive technical whitepaper hosted at `/optimality` detailing compiler scope boundaries, token efficiencies, and attention maps.

## 3. LLM Architecture & Rate Limiting Strategy

Auxo orchestrates calls to advanced LLMs (OpenAI's `gpt-4o-mini`, Anthropic's `claude-3-5-sonnet`, or Google's `gemini-2.5-flash`) to parse unstructured developer notes into structured prompt configurations. To ensure reliability, speed, and cost efficiency, the following strategies are implemented:

*   **Multi-Tier Fallback & BYOK Engine:**
    1. For hosted premium runs, if `OPENAI_API_KEY` is configured, it defaults to `gpt-4o-mini`. If missing/failed, it falls back to `claude-3-5-sonnet` (if `ANTHROPIC_API_KEY` is configured). Local offline builds fall back to `localMockCompile`.
    2. For BYOK configurations, requests are routed directly to the client-provided key and model (e.g. Gemini 2.5 Flash, Claude 3.7/4.5, GPT-4o), bypassing hosted database accounting.
*   **Token-Gating as a Rate-Limiter:** For hosted cloud runs, requiring accounts and decrementing credit balances prevents endpoint abuse. For BYOK runs, API usage costs are borne directly by the developer's own API subscription.
*   **Keyless Registry Caching:** The live `tech-resolver.ts` queries NPM Registry metadata via `fetch` using Next.js route caching (`next: { revalidate: 3600 }`). This caches NPM requests for 1 hour, protecting the registry API from rate-limiting penalties while keeping stack resolutions live.
*   **Client-Side Throttling:** The compilation actions inside the room UI disable the triggers (`isCompiling` state) and block concurrent compilations during an active request.
