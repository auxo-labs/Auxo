# CHANGELOG.md - Auxo Playground

All notable changes to the **Auxo** project are documented here.

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
