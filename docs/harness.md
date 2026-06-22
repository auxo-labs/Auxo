# Harness Engineering: Multi-Agent Context Compilation

This document outlines the architectural blueprints, technical rationale, and implementation plans to transition **Auxo** from a single-agent developer playground into a **Multi-Agent Harness Compiler**. 

---

## 1. What is Harness Engineering?

In modern AI-driven software development (such as 2026 cognitive IDE environments), developers are moving away from monolithic single-agent chat panels. Instead, they deploy a **Multi-Agent Harness**—an orchestration framework that runs multiple specialized sub-agents (e.g., UI Architect, Database Modeler, Test Runner, Security Auditor) working concurrently or sequentially on a single codebase.

The "harness" coordinates these agents by:
* Assigning specific tasks to scoped roles.
* Restricting what directories and code paths each sub-agent can view and modify.
* Defining transition hooks and handoff requirements between agents.
* Automatically running lint/test hooks to validate modifications before merging.

---

## 2. Why It Matters (The Core Problems)

When multiple sub-agents are deployed inside a codebase configured for only a single agent, developers encounter three primary failure vectors:

1. **Context Bloat & Token Waste:** Loading a single, massive global instruction file (like a monolithic `AGENTS.md`) forces every sub-agent to consume unnecessary tokens. A UI sub-agent does not need to load database transactions guidelines, and a test-runner does not need to parse CSS variable structures.
2. **Instruction Conflict (State Collision):** Concurrently running agents can enter circular overwriting loops or introduce architectural conflicts if their boundaries and authority levels are not explicitly declared.
3. **Circular Handoff Loops:** Sub-agents lack a structured, lightweight protocol to request dependencies, describe changes, or coordinate API schema changes, causing tasks to stall or crash.

---

## 3. Auxo's Tactical Shift: The Harness Matrix

To address these challenges, Auxo will introduce a **Multi-Agent Compilation Mode** that transforms the compiled package from a single-agent structure into a prompt-optimized **Harness Matrix**:

```text
compiled-harness-pack/
├── HARNESS.md                  # Global coordination constitution for the router
├── TASK_HANDOFF.md             # Standardized message schema for inter-agent tasks
├── agents/                     # Scoped sub-agent role profiles
│   ├── ui_specialist.md        # CSS tokens, Tailwind v4, and React UI layout guidelines
│   ├── db_modeler.md           # RLS rules, schema limits, and transaction safety
│   └── qa_tester.md            # Vitest running directives and test coverage requirements
└── .cursor/rules/              # Role-restricted path-scoped rules
    ├── ui.mdc                  # Globs: src/components/**/* (UI-Agent scope only)
    └── api.mdc                 # Globs: src/app/api/**/* (DB-Agent scope only)
```

---

## 4. Core Pillars of Harness Compilation

### Pillar 1: Orchestration Constitutions (`HARNESS.md`)
The `HARNESS.md` file serves as the main router's blueprint. It declares:
* **Coordination Protocol:** The workflow loop detailing how tasks are delegated, approved, and verified (e.g., *Router $\rightarrow$ UI Specialist $\rightarrow$ DB Modeler $\rightarrow$ QA Auditor $\rightarrow$ Merge*).
* **Workspace Isolation:** Rules prohibiting agents from editing paths outside their defined role boundaries.
* **Pre-Merge Validation:** Instructions for the router to execute automated test validation suites before marking a task as complete.

### Pillar 2: Scoped Sub-Agent Profiles (`agents/`)
Specialized system prompts generated for each sub-agent:
* **High Density, Scoped Context:** Injects only the specific tech resolutions, libraries, and coding guidelines relevant to that agent's role (e.g., only exporting Next.js 16 layouts to the UI Agent).
* **Execution Policies:** Defines authority levels (e.g., only the `db_modeler` can run migrations, only the `qa_tester` can run test commands).

### Pillar 3: Structural Handoff Registers (`TASK_HANDOFF.md`)
A central coordination file where sub-agents communicate:
* **API Handshake:** If the UI Agent requires a new database-backed API endpoint, it documents the request payload and target path here, triggering the router to activate the DB agent.
* **Progress Logging:** Keeps a linear log of which sub-agent touched what files, preventing conflicts.

### Pillar 4: Scoped Glob Routing (Role-Gated MDC Rules)
Enhances `.cursor/rules/*.mdc` files by adding an `allowedAgents` header. This prevents the cognitive IDE from loading database rules when the UI Agent is editing CSS variables:
```yaml
---
description: Database connection pooling and transaction constraints
globs: ["src/lib/db/**/*", "src/app/api/**/*"]
alwaysApply: false
allowedAgents: ["db_modeler", "harness_router"]
---
```

---

## 5. Implementation Roadmap in Auxo

To integrate Harness compilation, the following updates are planned:

1. **System Prompt Expansion (`system-prompt.ts`):** 
   Update the LLM compiler instructions to output multiple sub-agent markdown documents under start/end delimiters (e.g., `--- START FILE: agents/ui_specialist.md ---`).
2. **ZIP Pack Restructuring (`zip-exporter.ts`):** 
   Update client-side zipping to support nesting files inside subfolders (like `agents/` and `.cursor/rules/`).
3. **UI Integration (`preview.tsx`):** 
   Expand the workspace file tree to render the `agents/` folder and display the role-scoped documents in the editor.
4. **Harness Gating Toggle (`settings-modal.tsx`):** 
   Mount a compilation toggle to switch the output structure between standard "Basic/Deep AI Compile" and "Multi-Agent Harness Compile".
