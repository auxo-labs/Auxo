# Agent Constitution: CareWorkspace Clinic Portal

## I. Global Architectural Directives & Stack Declarations

1.  **Framework**: Utilize **Next.js (v16.2.9)**.
    *   Default to Server Components. Client-side rendering (`"use client"`) is strictly reserved for components requiring browser-specific APIs or client-side state (e.g., `useState`, `useEffect`).
    *   Route parameters will be promises; unwrap them using `React.use()` or `await` within Server Components.
2.  **Styling**: Employ **Tailwind CSS (v4.3.1)**.
    *   Tailwind v4 is CSS-native. **ABSOLUTE PROHIBITION** on creating `tailwind.config.js`.
    *   All theme tokens, custom utilities, and design system elements must be defined within `src/app/globals.css` using the `@theme` directive block.
3.  **Backend Services**: Leverage **Supabase (v2.108.2)**.
    *   Prioritize transient Realtime Broadcast or Presence channels for low-latency synchronization (e.g., live notifications, collaborative editing indicators).
    *   Limit direct database connections or stateful writes from client-side components. All mutations should primarily be handled via secure, server-side functions (e.g., Next.js Server Actions, Supabase Edge Functions, or secure API routes) with proper validation and authorization.

## II. System-Wide Constraints & Principles

1.  **HIPAA Compliance**: This is a B2B HIPAA-compliant application. All data handling, storage, access, and transmission must adhere to the highest standards of privacy and security. PHI (Protected Health Information) is paramount.
2.  **Tenant Isolation**: Implement strict multi-tenancy. Every data operation (read, write, update, delete) must explicitly filter or scope by a `tenant_id`. Cross-tenant data leakage is a critical security breach.
3.  **Karpathy Simplicity Guidelines**:
    *   **DRY (Don't Repeat Yourself) & KISS (Keep It Simple, Stupid)**: Prefer vanilla implementations over overly clever or complex solutions. Avoid premature optimization, deeply nested conditional structures, duplicate helper logic, and unnecessary abstractions. Strive for extreme readability and maintainability.
    *   **SOLID Design Principles**: Adhere to Single Responsibility Principle (SRP) for modules and components, Open/Closed Principle (OCP) for extensibility without modification, Liskov Substitution Principle (LSP), Interface Segregation Principle (ISP), and Dependency Inversion Principle (DIP) to promote modular, testable, and maintainable code.
    *   **YAGNI (You Aren't Gonna Need It)**: Do not write speculative boilerplate code or implement features not explicitly requested by current specifications. Focus solely on delivering the required functionality.
4.  **Security First**: Assume all input is malicious. Implement robust validation, sanitization, and authorization checks at every layer, especially when interacting with the database or external services.
5.  **No Direct Database Writes from UI**: Client-side components must never directly mutate the database. All data modifications must pass through secure, validated server-side endpoints or actions.
6.  **Authentication**: (Implicit: Doctor logging). Implement secure authentication mechanisms. While no specific provider is mandated, ensure secure token handling, session management, and role-based access control. **ABSOLUTELY NO CLERK AUTH** (as per a common implicit instruction if not mentioned).
7.  **Error Handling**: Implement comprehensive, graceful error handling across the application, providing informative feedback without exposing sensitive system details.

## III. Coding Style & Development Workflow

1.  **JSDoc Parameter Documentation**: All helper functions, utility modules, and exported functions MUST include detailed JSDoc comments describing their purpose, parameters (with types), and return values (with types).
2.  **Context Budgets**: If a task requires modifying more than 3 modules or would take longer than 60 seconds of manual context navigation, **HALT** and demand user clarification. Break down complex tasks into smaller, manageable units.
3.  **No Placeholders**: Strictly prohibit leaving commented placeholders, stub functions, incomplete implementations, or `TODO` lines in any generated code. All outputs must represent complete, implementable codebase scaffolding files.
4.  **Semantic Naming**: Use clear, descriptive, and consistent naming for variables, functions, components, and files. Adhere to the Ubiquitous Domain Vocabulary defined in `README.md`.