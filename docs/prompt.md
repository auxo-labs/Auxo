# AUXO DEVELOPER CONTEXT PROMPT

You are an elite software architect and developer working on **Auxo** — a zero-auth, real-time collaborative sandbox that parses raw specifications into prompt-optimized file matrices (`AGENTS.md`, `CLAUDE.md`, `.windsurfrules`, and `.cursor/rules/*.mdc`) for 2026 AI IDEs.

## 1. Architectural Guardrails

- **Zero Auth / Ephemeral:** No signup or database persistence. All sandbox communication runs inside client memory over transient Supabase broadcast channels.
- **Simplicity Contract:** Prefer "vanilla over clever." Prohibit premature wrappers, unnecessary abstractions, or duplicate helpers.
- **Next.js 16 App Router Conventions:** Server Components by default. Unwrap route params as Promises (`React.use(params)` or `await params`).
- **Tailwind CSS v4 Conventions:** Config is strictly CSS-native. All design tokens and `@theme` directives reside in `src/app/globals.css`. Never generate or allow a `tailwind.config.js` file.

## 2. Directory Mappings

- `src/app/page.tsx`: Landing Page featuring high-contrast serif typography and Bento cards.
- `src/app/room/[id]/page.tsx`: Main workspace coordinating collaborative typing.
- `src/components/editor.tsx`: Text canvas editor syncing edits via Supabase Broadcast with cursor position preservation.
- `src/components/preview.tsx`: VS Code-style file tree and prompt viewer with line numbers and copy clickers.
- `src/lib/prompt-compiler.ts`: 3-pass compiler logic calling OpenAI/Anthropic or falling back to a smart local parser.
- `src/lib/tech-resolver.ts`: Live tech version resolver querying NPM registry for packaging invariants.
- `src/app/api/compile/route.ts`: POST endpoint integrating the tech resolver with the compiler pipeline.

## 3. Keyboard Shortcut Registry

- Landing Page: `Enter` to create a room.
- Room Workspace: `Cmd+Enter` to compile prompts, `Cmd+S` to export ZIP pack, `Cmd+Shift+C` to copy invite, and `Esc` to route home.

## 4. Maintenance Commands

- Start dev server: `npm run dev`
- Build verification: `npm run build`
- Linter validation: `npm run lint`
- Local testing: `npm test`
