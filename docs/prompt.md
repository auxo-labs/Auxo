You are an elite product engineer. We are building "Auxo" — a 1-week B2B MVP for a collaborative scratchpad that converts messy text brain-dumps into optimized context files (.cursor/rules/, CLAUDE.md, AGENTS.md) for 2026 AI IDEs.

### Crucial Constraints (Scope Cut):

- ZERO AUTH: No login, no signups, no user profiles. - add later
- EPHEMERAL ROOMS: Rooms are accessed via generated UUID paths (e.g., /room/[id]).
- NO KANBAN PANELS: The interface is entirely text/markdown based.
- STACK: Next.js (App Router), TailwindCSS, Lucide Icons, and Supabase (for real-time text sync and basic transient data).

### Core Features to Build Now:

1. Landing Page: Minimalist, premium dark-mode interface with a single CTA button: "Create Anonymous Sandbox".
2. Real-time Room (/room/[id]): A split-screen interface:
   - Left Panel: Real-time collaborative text editor (Markdown scratchpad) where two users can type concurrently.
   - Right Panel: A preview window showing the generated AI Agent folder matrix.
3. The Compiler Button: A "Compile Agent Pack" button that calls an LLM endpoint (Anthropic/OpenAI) to parse the scratchpad markdown, separate it into structured files (AGENTS.md, CLAUDE.md, and a zipped .cursor/rules/ directory), and triggers an instant client-side .zip download.

Let's begin by generating the complete file structure and setting up the core landing page. Do not write any auth or long-term state management logic.
