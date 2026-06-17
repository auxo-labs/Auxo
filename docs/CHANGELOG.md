# CHANGELOG.md - Auxo Playground

All notable changes to the **Auxo** project are documented here.

## [1.0.0] - 2026-06-17

### Added
- **Landing Page UI:** Sleek, grid-based dark mode layout featuring high-contrast editorial serif typography (`Playfair_Display`) and aesthetic Bento grids.
- **Routing & Sessions:** Zero-auth ephemeral workspace generation using browser-level UUIDs (`/room/[uuid]`).
- **Real-time Synchronization:** Multi-builder text broadcast and user presence trackers powered by Supabase Realtime (transient channels ensuring zero database logs).
- **Text Area Preservation:** Cursor selection points are tracked and restored during network broadcasts to avoid typing jumps.
- **LLM Prompt Compiler:** Server Action integration connecting OpenAI, Anthropic, and a smart regex-based fallback compiler.
- **Pack Exporter:** Client-side zip packager using `JSZip` to compile and trigger automatic downloads of root-level `AGENTS.md`, `CLAUDE.md`, and nested Cursor directory rules (`.cursor/rules/api.mdc` and `ui.mdc`).
- **Workspace Explorer:** Professional VS Code-style panel showing tree indentation lines, a line-number gutter, and one-click prompt copy helpers.
