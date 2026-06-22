# CHANGELOG.md - Auxo Playground

All notable changes to the **Auxo** project are documented here.

## [1.9.4] - 2026-06-22

### Added

- **Next.js 16 Dynamic Sitemap and Robots**: Added custom dynamic `sitemap.ts` and `robots.ts` configurations to improve indexing for search engines and AI web crawlers (GPTBot, Gemini, Perplexity).
- **Social Preview & Metadata Optimization**: Injected rich Open Graph and Twitter Card tags to the main application layout (`layout.tsx`) for professional preview cards on platforms like X.com.

### Changed

- **Next.js 16 Proxy Migration**: Replaced the deprecated `middleware.ts` naming and function convention with the recommended `proxy.ts` convention to address build deprecation warnings.

## [1.9.3] - 2026-06-22

### Added

- **GitHub and Google OAuth Integrations**: Embedded side-by-side social OAuth buttons in the workspace login modal. Built a multi-colored Google brand icon using SVG paths.
- **Phase 32 security-hardening plan**: Added a new security-hardening phase to `phases.md` outlining IP-based compile rate-limiting and anonymous sandbox creation limits.

### Changed

- **Streamlined Workspace Authentication Modal**: Simplified the dialog UI by removing the redundant Magic Link tabs and making standard Email/Password (Login/Signup toggles) and OAuth the core access flows.

### Fixed

- **React Cascading Render Hook Error**: Fixed a `react-hooks/set-state-in-effect` linting error on the Room Page component by wrapping `setSidebarOpen(true)` in `queueMicrotask`.
- **Pricing Page Unused Variable Warnings**: Resolved compilation lint warning flags on `/pricing` by cleaning up `Loader2` import and annotating disabled checkout handlers with eslint ignores.

## [1.9.2] - 2026-06-21

### Added

- **Symmetric XOR Mask Visual Block**: Embedded a visual mathematical representation of the client-side Bring Your Own Key (BYOK) XOR mask-array obfuscation logic in the technical optimality specifications page.
- **Supabase Realtime & Custom Monogram Logo Responsive Scale**: Optimized custom brand logo and viewport-specific metadata to preserve layout constraints and aspect ratios between local development servers and production host platforms.

### Changed

- **Marketing and Spec Page Mobile Responsiveness**: Redesigned `/` (landing), `/pricing`, and `/optimality` routes to scale and fit viewports down to 320px (iPhone SE). Implemented mobile navigation bar layouts, stacked grids below `md` breakpoint boundaries, and responsive padding constraints to prevent horizontal layout breakages.
- **Spec Summary Table Matrix Scopes**: Wrapped the context optimization metrics matrix inside dynamic horizontal overflow wrappers with a minimum width restriction, ensuring text readability on mobile phone devices.
- **Optimality Citation Rigour**: Corrected the "Lost in the Middle" empirical context-window paper citations to list Nelson F. Liu et al. (2024) as the true author list, and updated the Anthropic Prompt Caching developer guides reference bibliography tags.

### Fixed

- **Basic Compiler Registry Grounding Flow**: Resolved the NPM dependency lookup logic in the basic compiler engine where local queries bypassed live framework version registry checks. Dynamic version lookups now resolve accurately for all compilation paths.
- **ESLint JSX Comment Text Node Violations**: Wrapped raw `//` comment indicators inside JSX text elements in `{""}` curly brackets in `src/app/optimality/page.tsx` to fix build and compilation lint rules blocks.

## [1.9.1] - 2026-06-21

### Added

- **Realtime Connection Persistence**: Moved the Supabase Realtime synchronization, broadcast, and presence subscriptions from the `<Editor>` component lifecycle into the persistent `useRoomSync` hook. This keeps connection status active and displaying correctly as `SYNCED` even when the Editor panel is unmounted (e.g. when fullscreening the agent pack preview).

### Changed

- **Code Preview Pane Gutter**: Refactored the preview code viewer container layout to use a unified scroll wrapper (`overflow-auto`) with a `sticky left-0` gutter column to keep lines and numbers perfectly scroll-synchronized, preventing horizontal scroll clipping and height mismatches.
- **Custom Browser Favicon Metadata**: Configured layout metadata to point to `/logo-nobg.png` as the default icon, shortcut icon, and apple-touch-icon, and instructed the removal of the default Next.js `favicon.ico` to prevent browser cache conflicts.
- **Pricing Page Paid Tiers Gated**: Greyed out the 20x Cloud Compiles (Tier 2) and Founder/Developer Pack (Tier 3) cards on the pricing page. Disabled purchase interaction triggers and marked the checkout actions as "COMING SOON" to support the free/unlimited BYOK hosting model.

## [1.9.0] - 2026-06-21

### Added

- **Phase 24 projects sidebar history integration**: Added a collapsible left sidebar displaying logged-in user projects, synced in real-time via Supabase realtime triggers. Integrated `localStorage` compile caching to prevent workspace disappearance when navigating home.
- **Concentric progress loader**: Mounted a premium concentric rotating progress spinner with ambient glow vectors in the preview pane during compiling states.
- **Phase 25 BYOK privacy modal upgrades**: Added the "Your Key. Your Privacy." trust banner callout inside [settings-modal.tsx](../src/components/settings-modal.tsx) detailing client-side storage and transient Edge header transit.
- **XOR key obfuscation documentation**: Documented symmetric XOR client-side key storage and edge transient HTTPS headers transit inside the technical optimality specs page [page.tsx](../src/app/optimality/page.tsx).
- **Phase 26 prompt pack optimality analysis report**: Completed a full quality audit on generated files and created the research report [prompt_analysis.md](prompt_analysis.md) summarizing token and context window findings.
- **Minimalist Brand Logo Integration**: Mounted custom transparent geometric monogram `logo-nobg.png` inside the landing page and room workspace header bars with aspect-fill scaling to preserve original proportions.
- **Supabase Authentication redirects configuration**: Set up redirect parameters and wildcard links (`https://auxo.wo0.dev/room/*`) inside the Supabase Auth console.

### Changed

- **Flipped compilation order**: Reordered the template instructing sequential file streams in [system-prompt.ts](../src/lib/prompt-compiler/system-prompt.ts) so that `.cursor/rules/*.mdc` rules files are generated first.
- **Stripped style redundancy**: Command strict coding style rules ONLY inside `AGENTS.md` and explicitly forbid copying them into scoped `.mdc` files, recovering 18.4% context token overhead.
- **CLI Runner Commands Consolidation**: Restructured `CLAUDE.md` instructions to output only `npm` runner commands, cleaning up `yarn`/`pnpm` command bloat.
- **Raised Token Limits**: Raised maximum compile tokens limit to 8,000 tokens across OpenAI, Anthropic, and Gemini compiler endpoints in [clients.ts](../src/lib/prompt-compiler/clients.ts).
- **Decluttered Top Navbar**: Removed the redundant green `PRIVATE BYOK` status badge block from [page.tsx](../src/app/room/[id]/page.tsx) to resolve layout clutter.

### Fixed

- **CRLF Carriage Return Matcher Bug**: Trimmed line matches during parser loops inside [parser.ts](../src/lib/prompt-compiler/parser.ts) to cleanly discard trailing `\r` and ensure standard `.mdc` file markers are parsed without dropouts.
- **Resilient Filename/Path Sanitizer**: Stripped outer quotes/backticks and prefix directories (e.g. `/cursor/rules/`) from compiled rule paths to avoid zip export path collisions.
- **React State Cascading render fixes**: Lazily initialized `sidebarOpen` and `compiledFiles` states and wrapped resets in `queueMicrotask` to eliminate React-hooks cascading renders.

## [1.8.0] - 2026-06-21

### Added

- **Support Fallback Modal**: Built a glassmorphic support modal on the landing page navbar with room UUID copying and mailto actions.
- **Automated Testing Suite (Vitest)**: Installed Vitest and configured test suites under `tests/unit.test.ts` (Batch 1 unit tests) and `tests/integration.test.ts` (Batch 2 integration tests).
- **Security Mapping & Test Plan**: Documented centralised safety controls (`docs/security.md`) and manual test procedures (`docs/TESTING.md`) covering Supabase RLS, input rate control, and LocalStorage corruption handlers.
- **Tiered Scratchpad Input Gating**: Enforced client-side character limits of 15,000 characters for standard compiles/free sandboxes and 30,000 characters for BYOK & Developer Pack tiers to mitigate payload spikes.
- **Pricing Matrix Upgrades**: Documented the tiered character limits on the pricing bento comparison cards and matrix columns.
- **LocalStorage Recovery Checks**: Implemented schema validation logic on startup configurations to purge corrupt settings keys dynamically.

### Fixed

- **Stripe Test Mock Constructor**: Refactored the Stripe library mock in integration tests to use a constructible ES6 class, resolving runtime instantiating failures.
- **Database Mock Method Chains**: Refactored the Supabase query mocks to support chained `.select().eq().single()` operations, allowing webhook tests to pass cleanly.

## [1.7.0] - 2026-06-21

### Added

- **Developer Pack (Tier 3)**: Implemented a bounded 50-credit Developer Pack for £9.99 (one-time) to prevent hosted API cost abuse while catering to heavy users.
- **PAYG Starter Pack (Tier 2)**: Configured a bounded 15-credit pack for £4.99 (one-time).
- **Interactive Pricing Route**: Created a premium dark-themed `/pricing` page comparing the three active compiler tiers (Free BYOK, £4.99 PAYG Pack, and £9.99 Developer Pack) with a detailed capability matrix.
- **Stripe Integration & Webhooks**: Integrated checkout triggers and Stripe webhook receivers to provision 15 and 50 credits respectively upon transaction completions.
- **Stripe Webhook E2E Verification**: Successfully configured Stripe CLI local forwarding to verify user credit provisioning dynamically via mock session completion triggers.
- **Claude 4.5 Sonnet Migration**: Migrated default hosted cloud compiler models and BYOK configuration recommendations to `claude-sonnet-4-5`.

### Changed

- **Settings Dialog Routing Relabel**: Changed compiler options tag label from "PAYG / LIFETIME" to "CLOUD CREDITS".

## [1.6.0] - 2026-06-21

### Added

- **Dynamic Routing Badges:** Added compiler route status indicators (`CLOUD` and `BYOK: [PROVIDER]`) inside the workspace room navbar settings button to immediately show active compilation states.
- **Redesigned Compiler Settings Dialog:** Rewrote the setup modal to present rich comparative column-like cards comparing Auxo Cloud (credits/lifetime pricing) and Bring Your Key (free tier details).

### Fixed

- **Hydration Mismatch Mitigation:** Deferred reading BYOK credentials from browser LocalStorage to client-side mount lifecycle effects, resolving Next.js hydration mismatches on secondary tabs.

## [1.5.0] - 2026-06-20

### Changed

- **Compiler Modularization:** Deconstructed the monolithic `prompt-compiler.ts` into a clean package under `src/lib/prompt-compiler/` comprising independent sub-modules for clients, prompt generation, parsing utilities, and deterministic mock templates.
- **Room State Custom Hooks:** Decoupled room state synchronization, local caching, and auth updates from the layout presentation into [useRoomSync.ts](../src/app/room/[id]/hooks/useRoomSync.ts).
- **Keyboard Shortcuts Hook:** Isolated global window event listeners for keybindings into [useShortcuts.ts](../src/app/room/[id]/hooks/useShortcuts.ts).
- **Zip Exporter Helper:** Moved JSZip compilation methods to a dedicated, stateless helper module [zip-exporter.ts](../src/lib/zip-exporter.ts).

## [1.4.1] - 2026-06-20

### Added

- **Pre-Baked Compliance Invariants:** Automatically injects authoritative compliance guidelines into `AGENTS.md` based on active archetypes (SOC2 guidelines for B2B/SaaS, HIPAA security rule standards for HealthTech, and PCI-DSS payment directives for FinTech).
- **Crossover Multi-Domain Templates:** Added dedicated local compiler templates for multi-domain crossovers: **ClaimFlow** (HealthTech + FinTech for audited, HIPAA-compliant claims billing) and **BizLedger** (B2B + FinTech for multi-tenant billing ledgers).
- **Crossover Rule Merging:** Improved keyword checks and file arrays in the local compiler to gracefully combine rule files (e.g. generating `ledger-rules.mdc` + `hipaa-rules.mdc` + `ui-theme.mdc` simultaneously) without collisions.
- **Generative Compliance Instructions:** Added instructions inside `generateSystemPrompt` for the LLM to auto-inject matching SOC2, HIPAA, and PCI-DSS compliance directives based on domain keywords.

### Fixed

- **Compiler Syntax Error:** Resolved a duplicate declaration of `cursorRules` in `localMockCompile` that was referencing undefined variables (`uiThemeRules`, `logicFileName`, and `logicRules`).

## [1.4.0] - 2026-06-20

### Added

- **Service Flow & System Architecture Documentation:** Created `docs/service_flow.md` mapping out complete sequence diagrams for Auth sessions, Stripe checkout gating, and the server-bypass BYOK pipeline.
- **Split Compile Button Dropdown:** Merged the basic and premium compile triggers inside the workspace header into a unified split dropdown button, saving horizontal toolbar space.

### Changed

- **Responsive Workspace Header Spacing:** Relocated the `Builder count` status badge to the left-hand meta grouping. Removed the center shield indicator and the `Optimality` link to provide breathing room.
- **Import Optimizations:** Cleaned up unused import values (`Compass`, `ShieldAlert`, `Link`) from the Room Component layer.
- **YAML Frontmatter & Parser Strictness:** Restructured compilation prompts in `prompt-compiler.ts` to demand strict YAML syntax in generated Cursor `.mdc` rules and prevent placeholders in outputs.

### Fixed

- **Template Literal Compilation Error:** Correctly backslash-escaped inner markdown code fences inside the `generateSystemPrompt` template literal in `prompt-compiler.ts` to prevent ESLint AST syntax parsing issues.

## [1.3.0] - 2026-06-20

### Added

- **Supabase Auth & Magic Link Integration:** Integrated passwordless login flow using Supabase email OTPs and custom glassmorphic `AuthModal`.
- **Account-Gating & Compilation Credits:** Gated premium compiler endpoints using credits (£15 for 3 compiles) and lifetime access pass (£99). Added profile tracking metadata in the room navbar.
- **Stripe Webhook Endpoint:** Added `/api/webhooks/stripe` POST route to capture completed checkout sessions, credit user balances in GBP, and apply lifetime passes.
- **Workspace Segregation:** Separated compiling options into free local fallback compiling ("Basic Agent Pack") and premium compilations ("Deep AI Compile").
- **Retry Logic State Tracking:** Added stateful tracking of `lastCompileType` to guarantee that compile retries from UI error banners preserve the target execution path.
- **Bring Your Own Key (BYOK) Configuration:** Added a settings gear panel allowing developers to input custom OpenAI, Anthropic, or Gemini keys saved in local storage.
- **Google Gemini Integration:** Added native REST endpoint client `callGemini` inside `prompt-compiler.ts` using `systemInstruction` structure supporting Gemini 2.5/2.0 Flash.
- **Gating Bypass Flow:** Configured client and server routes to automatically bypass Stripe checks, account creation, and profile billing if custom keys are present.

### Changed

- **Server Action Constraints:** Cleaned up server-side exports in `prompt-compiler.ts` to strictly adhere to async regulations of Next.js Server Actions.

### Fixed

- **Type Checking Errors:** Resolved parameter count mismatches and build-breaking variable types in `page.tsx` handlers.
- **Silent Key Fallbacks:** Intercepted invalid/expired API key responses to report explicit auth failures in the UI settings dialog rather than silently falling back to local mocks.

## [1.2.0] - 2026-06-20

### Added

- **Optimality specs whitepaper:** Implemented `/optimality` route detailing prompt compilation scope maps, token budgeting, and mathematical limits of context decay.
- **Architectural documents:** Created `compiler_specs.md` detailing CAP architectures and LLM vs Local tradeoffs, and `finalphases.md` detailing Stripe Webhook and auth roadmap.
- **Compiler test suite:** Added Scenario A, B, and C standard inputs under `test_cases.md` to evaluate parser mapping correctness.

### Changed

- **Navigation flow:** Updated landing page and room workspace headers to open `/optimality` in the same tab instead of a new tab for seamless user experiences.
- **Compiler taste parameters:** Upgraded system prompts and local mock models inside `prompt-compiler.ts` to strictly inject DRY, KISS, SOLID, YAGNI, and no-placeholder rules into compiled packs.

## [1.1.0] - 2026-06-17

### Added

- **Stripe Checkout Integration:** New `POST /api/checkout` route creates a Stripe Checkout Session, embedding the active `roomId` as `client_reference_id` for stateless state handshake.
- **Payment-Gated Compilation:** `POST /api/compile` now verifies a Stripe `session_id` before running the prompt compiler. Unauthenticated compile requests redirect to Stripe Checkout.
- **Post-Payment Auto-Flow:** After a successful Stripe redirect, the workspace auto-compiles the scratchpad and triggers the ZIP download in a single uninterrupted flow. The `session_id` is then stripped from the URL to prevent re-triggering on refresh.
- **LocalStorage Scratchpad Mirroring:** Scratchpad content is now continuously mirrored to `localStorage` keyed by Room UUID. Content is restored automatically on page reload or accidental tab closure, preventing data loss before payment.
- **Marketing Copy Update:** Landing page reframed around "Instant Sandbox" and "Frictionless Design" positioning with "Accounts Coming Soon" callout, moving away from a "Zero-Data" boast.

### Changed

- **React Compiler Migration:** Removed all manual `useCallback` wrappers from `src/app/room/[id]/page.tsx`. The Next.js 16 React Compiler handles memoisation automatically; `useCallback` was conflicting with `react-hooks/immutability` rules.
- **Hook Ordering Fix:** All handler functions (`handleCompile`, `handleDownload`, `handleCopyLink`) are now declared before any `useEffect` hooks that reference them, resolving ESLint `react-hooks` ordering violations.
- **`stripe` Dependency Installed:** Added `stripe` npm package (was listed in `package.json` but not installed, causing build failures).

### Fixed

- **Build Failure:** Resolved `Module not found: Can't resolve 'stripe'` errors in both API routes by running `npm install stripe`.
- **Lint Errors:** Eliminated all `react-hooks/exhaustive-deps` and `react-hooks/immutability` violations in the room page component.

## [1.0.0] - 2026-06-17

### Added

- **Landing Page UI:** Sleek, grid-based dark mode layout featuring high-contrast editorial serif typography (`Playfair_Display`) and aesthetic Bento grids.
- **Routing & Sessions:** Zero-auth ephemeral workspace generation using browser-level UUIDs (`/room/[uuid]`).
- **Real-time Synchronization:** Multi-builder text broadcast and user presence trackers powered by Supabase Realtime (transient channels ensuring zero database logs).
- **Text Area Preservation:** Cursor selection points are tracked and restored during network broadcasts to avoid typing jumps.
- **Live Tech Stack Resolver:** Queries public keyless NPM registry APIs dynamically to resolve package versions and extract 2026-specific invariants (e.g., Next.js 16 param Promise rules, CSS-native Tailwind v4 structures) as grounding data.
- **Prompt Compiler:** Server Action integration connecting OpenAI, Anthropic, and a smart local parser to auto-inject Software Engineering taste rules (DRY, SOLID, JSDoc comment requirements, and strict context budgets).
- **Compilation API Route:** Created `POST /api/compile` integrating the NPM version resolver with the compiler pipeline to return structured context files.
- **Workspace Explorer:** Professional VS Code-style panel showing tree indentation lines, a line-number gutter, and one-click prompt copy helpers.
- **Separated Workspace Workflow:** Decoupled prompt compiling (which instantly populates the file preview tree on-screen) from exporting ZIP folders (adds a dedicated `DOWNLOAD PACK` action button enabled once compiled).
- **Keyboard Shortcuts & Navigation:** Bound global shortcut listeners (`Cmd+Enter` or `Ctrl+Enter` to compile, `Cmd+S` or `Ctrl+S` to download ZIP, `Cmd+Shift+C` or `Ctrl+Shift+C` to copy invite link, and `Esc` to navigate home when input forms are inactive).
- **Nested Keyboard Indicators:** Appended OS-detected visual keycap badges (e.g. `⌘↵` or `Ctrl+↵`) directly inside workspace action buttons.
- **Defensive Rendering:** Wrapped preview panel file selectors in default string fallbacks to prevent client-side crashes during Fast Refresh hot-reloads.

---

## Appendix: Reverting Greyed-Out Pricing Tiers

If you need to re-enable the checkout flows and restore the original styling for Tier 2 (PAYG Credits) and Tier 3 (Developer Pack) inside `src/app/pricing/page.tsx`, follow these steps:

### 1. Restore the Card Containers
- For **Tier 2 (PAYG Credits)**, locate the container `div` and change it back to the original classes:
  ```tsx
  <div className="flex flex-col p-6 rounded-lg border border-cyan-500/20 bg-cyan-950/[0.01] hover:border-cyan-500/30 transition-all relative overflow-hidden group text-left h-full shadow-[0_0_20px_rgba(6,182,212,0.02)]">
  ```
- For **Tier 3 (Developer Pack)**, locate the container `div` and change it back to the original classes:
  ```tsx
  <div className="flex flex-col p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all relative overflow-hidden group text-left h-full">
  ```

### 2. Update Badges and Text Colors
- Restore the top-right badges:
  - Tier 2: `TIER 02 // PAYG`
  - Tier 3: `TIER 03 // PRO`
- Restore the header names:
  - Tier 2: `<h3 className="text-xs font-mono tracking-widest text-zinc-200 uppercase font-bold">20x Cloud Compiles</h3>`
  - Tier 3: `<h3 className="text-xs font-mono tracking-widest text-zinc-200 uppercase font-bold">Founder / Developer Pack</h3>`
- Restore list checkmarks and font styles:
  - In Tier 2 list, change text colors back to `text-cyan-500` for Check icons, and `text-zinc-500` for list items (removing `text-zinc-600`).
  - In Tier 3 list, change text colors back to `text-emerald-500` for Check icons, and `text-zinc-500` for list items (removing `text-zinc-600`).

### 3. Re-enable checkout buttons
- Locate the `<button>` at the bottom of the **Tier 2 card** and replace it with the original action:
  ```tsx
  <button
    onClick={() => handlePurchase('credits')}
    disabled={purchasingTier !== null}
    className="mt-6 w-full h-9 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-[10px] font-mono font-semibold tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
  >
    {purchasingTier === 'credits' ? (
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
    ) : (
      'BUY BUILDER PACK'
    )}
  </button>
  ```
- Locate the `<button>` at the bottom of the **Tier 3 card** and replace it with the original action:
  ```tsx
  <button
    onClick={() => handlePurchase('lifetime')}
    disabled={purchasingTier !== null}
    className="mt-6 w-full h-9 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-[10px] font-mono font-semibold tracking-wider text-zinc-300 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
  >
    {purchasingTier === 'lifetime' ? (
      <Loader2 className="w-3.5 h-3.5 animate-spin" />
    ) : (
      'BUY DEVELOPER PACK'
    )}
  </button>
  ```
