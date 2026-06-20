# Agent Constitution: SignalSignal Project

This document outlines the fundamental principles, technological stack, and absolute constraints governing the SignalSignal project. Adherence to these guidelines is paramount for all development agents.

## 1. Core Stack Declarations

*   **Framework**: Next.js `v16.2.9`
    *   **Default Behavior**: Server Components are the default. Explicitly avoid `"use client"` directives unless client-side state (e.g., `useState`, `useEffect`) is an absolute necessity.
    *   **Data Fetching**: Leverage React.use(Promise) or `await` for unwrapping route params (which are Promises in Next.js v16+).
*   **Styling**: Tailwind CSS `v4.3.1`
    *   **Configuration**: Tailwind v4 is CSS-native. Strictly prohibit the creation of `tailwind.config.js`. All theme tokens MUST be defined within `src/app/globals.css` using the `@theme` directive block.
*   **Backend & Realtime**: Supabase `@supabase/supabase-js v2.108.2`
    *   **Realtime Focus**: Utilize transient Realtime Broadcast or Presence channels for low-latency synchronization (e.g., cursor tracking, collaborative notes).
    *   **Database Access**: Limit direct database connections or stateful writes unless explicitly outlined in service layers. Prioritize Supabase Realtime over direct CRUD for interactive data.

## 2. Global Constraints & Coding Philosophies

*   **DRY (Don't Repeat Yourself) & KISS (Keep It Simple, Stupid)**
    *   **Principle**: Prefer vanilla implementations over overly clever or complex solutions.
    *   **Prohibitions**: Forbid premature optimization, deeply nested conditional structures, duplicate helper logic, and unnecessary abstractions. Code must be extremely readable and maintainable.
*   **SOLID Design Principles**
    *   **Guidance**: Adhere to Single Responsibility Principle (SRP) for modules, Open/Closed Principle (OCP) where applicable for extensibility without modification, Liskov Substitution Principle (LSP), Interface Segregation Principle (ISP), and Dependency Inversion Principle (DIP) to promote modular, testable, and maintainable codebases.
*   **YAGNI (You Aren't Gonna Need It)**
    *   **Prohibition**: Strictly prohibit writing speculative boilerplate code or future-proofing implementations that are not explicitly requested by the current specifications. Focus on immediate requirements.
*   **JSDoc Parameter Documentation**
    *   **Requirement**: All helper functions and exported utility modules MUST include detailed JSDoc comments for parameters, return types, and a clear description of their purpose.
*   **Context Budgets for Task Scoping**
    *   **Constraint**: If a given task requires modifying more than 3 distinct modules or demands more than 60 seconds of manual context navigation, the agent MUST halt execution and demand user clarification before proceeding. Break down complex tasks.
*   **No Placeholders**
    *   **Prohibition**: Absolutely no commented placeholders, stub functions, incomplete implementations, or TODO lines are permitted in any generated or modified code. Deliver complete, functional solutions.

## 3. Security & Access Boundaries

*   **Authentication**: No Clerk authentication is to be integrated or assumed. User authentication will be handled via Supabase Auth or left implicit if not specified.
*   **Database Write Permissions**: Agents do NOT have direct, unmediated write permissions to the database. All writes and sensitive operations MUST be channeled through designated server-side service layers or Supabase functions, ensuring proper validation and authorization.