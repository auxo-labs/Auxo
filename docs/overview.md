auxo/
├── src/
│ ├── app/
│ │ ├── layout.tsx
│ │ ├── page.tsx <-- Sleek landing page with "Create Room" CTA
│ │ └── room/
│ │ └── [id]/
│ │ └── page.tsx <-- The main live collaborative workspace
│ ├── components/
│ │ ├── editor.tsx <-- Real-time rich text / markdown node
│ │ ├── preview.tsx <-- Interactive folder tree of generated files
│ │ └── ui/ <-- Bare minimum button & input styles
│ └── lib/
│ ├── supabase.ts <-- Simple real-time channel setup
│ └── prompt-compiler.ts <-- The LLM structuring logic
