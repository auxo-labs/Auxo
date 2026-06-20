# CareWorkspace Clinic Portal - Agent Constitution

This document outlines the foundational principles, architectural constraints, and operational philosophies for developing the CareWorkspace Clinic Portal. All AI agents, during any task execution, must strictly adhere to these guidelines.

## 1. High-Level Stack Declarations

*   **Next.js (v16.2.9):** Leverage Server Components by default. Avoid `"use client"` directives unless client-side state (useState/useEffect) is an absolute, unavoidable requirement. Route parameters are Promises; unwrap them using `React.use(params)` or `await params` within Server Components.
*   **Tailwind CSS (v4.3.1):** Use Tailwind CSS v4, which is CSS-native. Absolutely prohibit the creation of `tailwind.config.js`. All theme tokens, custom utilities, and design system elements *must* reside within `src/app/globals.css` using the `@theme` directive block.
*   **Supabase (@supabase/supabase-js v2.108.2):** Prioritize transient Realtime Broadcast or Presence channels for low-latency synchronization of ephemeral UI state. Limit direct database connections or stateful write operations to explicit, isolated service layers. All Supabase interactions must be encapsulated and follow principle of least privilege.

## 2. Global Constraints & Coding Philosophies

*   **DRY (Don't Repeat Yourself) & KISS (Keep It Simple, Stupid):** Prefer "vanilla over clever." Forbid premature optimization, deeply nested conditional structures (max 3 levels), duplicate helper logic, and unnecessary abstractions. Maintain extreme readability and directness in implementation.
*   **SOLID Design Principles:** Enforce functional, single-responsibility modules. Implement open-closed behavior where applicable, ensuring modules are open for extension but closed for modification. Practice interface segregation for clearer API contracts and dependency inversion to decouple high-level modules from low-level implementations.
*   **YAGNI (You Aren't Gonna Need It):** Prohibit writing speculative boilerplate code or future-proofing implementations that are not explicitly requested by the current specifications. Focus solely on delivering current requirements.
*   **JSDoc Parameter Documentation:** Maintain detailed JSDoc comments including `@param`, `@returns`, and `@description` for all helper functions, exported utility modules, and API endpoints. This is critical for maintainability and AI agent understanding.
*   **Context Budgets:** If a task requires modifying more than 3 modules or 60 seconds of manual context navigation, halt the task and demand user clarification. Break down complex tasks into smaller, manageable units.
*   **No Placeholders:** Strictly prohibit leaving commented placeholders, stub functions, incomplete implementations, or TODO lines in any generated code. All outputs must represent complete, implementable codebase scaffolding files.

## 3. Compliance Guardrails

As a B2B HIPAA-compliant patient portal, the following compliance directives are paramount:

*   **HIPAA Security Rules:**
    *   **Protected Health Information (PHI):** PHI must *never* be stored in logs, URLs, or directly exposed in client-side code. All PHI must be routed through audit-logging brokers before storage or transmission.
    *   **Data Encryption:** Ensure all PHI is encrypted both at rest and in transit (TLS 1.2+).
    *   **Access Controls:** Implement robust role-based access controls (RBAC) ensuring only authorized personnel (e.g., medical doctors with specific `tenant_id`) can access relevant PHI.
    *   **Audit Trails:** Maintain comprehensive audit logs for all access to and modifications of PHI, including user identity, timestamp, and action performed.
    *   **Breach Notification:** Implement mechanisms for rapid identification and notification of security breaches involving PHI.
*   **SOC2 Directives (for B2B SaaS):**
    *   **Data Isolation:** Strictly enforce tenant data isolation. Each `tenant_id` must have its data securely segregated, preventing cross-tenant data leakage.
    *   **Logging:** Avoid including internal stack traces, system configurations, or sensitive tenant data in publicly accessible logs or error responses. All logs must be securely stored and reviewed.
    *   **Security:** Implement security best practices to protect against unauthorized access, disclosure, and data manipulation.