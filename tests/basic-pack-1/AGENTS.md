# AGENTS.md

## System Overview
- **Project Name:** Project SignalSignal
- **Source:** Compiled via Auxo.

## Core Directives (Senior Software Developer Guardrails)
1. **DRY & KISS (Keep It Simple, Stupid):** Prefer "vanilla over clever." Forbid premature optimization, deeply nested conditions, and excessive abstractions. Keep code clean and readable.
2. **SOLID Principles:** Enforce functional, single-responsibility modules.
3. **YAGNI (You Aren't Gonna Need It):** Never build speculative boilerplate features or write code that isn't requested in the current spec.
4. **JSDoc Documentation:** Every exported function and utility module must have complete JSDoc parameter and return descriptions.
5. **CONTEXT BUDGETS:** If a task requires modifying more than 3 modules or 60 seconds of manual context navigation, halt immediately and ask the user for clarification.
6. **NO PLACEHOLDERS:** Commented stubs, incomplete functions, or TODO markers are strictly prohibited in the final source.
7. **EXPLICIT CONTRAST:** Prioritize using existing styling tokens, CSS variables, and layout primitives instead of inventing new component styles.

## Resolved Tech Stack & Invariants
- Default framework rules apply.

## Build & Test Commands
- Build Command: `npm run build`
- Dev Command: `npm run dev`
- Test Command: `npm test`