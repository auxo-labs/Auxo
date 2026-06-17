# Auxo Prompt Compiler Test Suite

This document defines standardized test cases used to evaluate the accuracy, token efficiency, and formatting of the compiled agent packs.

---

## Scenario A: Full-Stack React & Next.js Application (Standard Path)
* **Goal:** Verify that the tech-resolver accurately resolves package versions (Next.js 16/15, Tailwind v4, Supabase) and injects the corresponding architectural constraints.
* **Input Raw Notes:**
```markdown
# Project SignalSignal

Build a real-time portfolio tracker for crypto and stock positions.
We are using Next.js for routing and pages.
Styling is done via tailwindcss.
Database connection and subscription sync will be handled by @supabase/supabase-js.

Requirements:
- Left sidebar for navigating between Dashboard, Research, and Settings.
- Home dashboard with a Bento layout showing portfolio statistics and recent activities.
- Supabase Realtime Presence to show cursor tracking and collaborative notes in the portfolio research shared rooms.
```

---

## Scenario B: Non-JavaScript Backend Service (Fallback Path)
* **Goal:** Verify that the compiler behaves gracefully with languages/frameworks outside the primary Node package registry resolver.
* **Input Raw Notes:**
```markdown
# DataPipeline Service

A high-performance backend worker for processing large parquet datasets.
Written in Python using pandas for dataframe manipulations and FastStream for Kafka event streams.
It reads from a PostgreSQL DB and writes aggregated stats to ClickHouse.

Requirements:
- Must run as a background cron worker.
- Never write frontend or React components.
- Standard typing using mypy and strict JSDoc-style comments (using Sphinx docstrings for Python).
- Include standard logging and error tracking setup.
```

---

## Scenario C: Frontend Dashboard with Strict Architectural Constraints
* **Goal:** Verify that absolute constraints (e.g. no database writes, strict DRY/SOLID, zero auth) are correctly isolated and mapped to constraints lists.
* **Input Raw Notes:**
```markdown
# Auxo Client Playground

An ephemeral client-only drafting tool.
We want to keep this extremely minimal.
Absolutely NO backend databases, NO external authentication systems (like Clerk or Auth0).
All data must persist solely in the user's LocalStorage.

Constraints:
- We must enforce strict SOLID principles.
- Code must be lightweight, no bloated libraries.
- React components must be functional, client-declared, and use native Tailwind layout variables.
```
