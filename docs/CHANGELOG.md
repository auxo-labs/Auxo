# CHANGELOG.md - Auxo Playground

All notable changes to the **Auxo** project are documented here.

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
