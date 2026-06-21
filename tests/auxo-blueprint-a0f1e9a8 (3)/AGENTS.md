# AGENT CONSTITUTION & GLOBAL CONSTRAINTS

## High-Level Stack Declarations
*   **Frontend:** React (Next.js for SSR/routing), TypeScript.
*   **Backend (API):** Node.js (with Express.js or Next.js API Routes) or Python (with FastAPI/Flask) for the document parsing and EFRAG conversion engine. The choice depends on specific library needs for document parsing and data processing. For MVP, assume Next.js API routes or a simple Node.js microservice.
*   **Data Storage:** Ephemeral/in-memory for session-based processing. No persistent database for user data in the MVP. EFRAG conversion tables may be static JSON, CSV, or a read-only lookup service.
*   **Deployment:** Serverless functions or containerized services for scalability of the parsing engine.

## Global Architectural Constraints & Philosophies
1.  **Stateless First:** The application's core "Atomic Engine" (document parser and conversion) must be entirely stateless. No persistent user data or historical records will be stored on the server side for the MVP.
2.  **Single Utility Focus:** Strictly adhere to the "single-utility calculation ledger" scope. Reject any features extending into multi-user enterprise sub-accounts, persistent historical analytics charts, or automated live integration plugins into customer ERPs.
3.  **EFRAG Exclusivity:** The system's compliance logic is exclusively limited to the newly published 2026 voluntary EFRAG baseline reporting templates. Avoid implementing custom, multi-framework corporate carbon accounting tools.
4.  **Security by Design:** All data handling, especially file uploads and API interactions, must prioritize security. Implement robust input validation, secure file handling practices (e.g., temporary storage with strict lifecycle management), and secure API endpoints.
5.  **Karpathy-style Simplicity:** Prioritize straightforward, explicit, and easy-to-understand code. Avoid premature optimization, complex abstractions, or highly generalized solutions unless absolutely necessary. The goal is a highly readable and maintainable codebase.

## Compliance Guardrails (Non-Negotiable)
1.  **SOC2 Compliance Directives (B2B/SaaS):**
    *   **No Internal Stack Traces:** Absolutely no internal stack traces or sensitive system information shall be exposed in public-facing error messages or API responses. Generic error messages must be used, with detailed logging reserved for secure backend systems.
    *   **Audit Logging:** Critical user actions (e.g., file uploads, report generation, export requests) must be logged for auditability (e.g., timestamp, user ID, action type, outcome). These logs must be stored securely and be inaccessible from the public internet.
    *   **Data Minimization:** Only collect and process data strictly necessary for generating the VSME+ Data Pack. Avoid collecting personally identifiable information (PII) beyond what is essential for basic transactional purposes.
2.  **PCI-DSS Directives (Transactional Finance Implication):**
    *   **No Raw Card/Token Storage:** The system SHALL NOT, under any circumstances, store raw payment card data, tokens, or any sensitive financial credentials in logs, databases, or application memory. All payment processing must be delegated to PCI-compliant third-party payment gateways (e.g., Stripe, PayPal).
    *   **Secure Communication:** All communication involving payment information or sensitive compliance data must use strong encryption (TLS 1.2+).
    *   **Access Control:** Implement strict role-based access control for any administrative interfaces, ensuring only authorized personnel can access sensitive operational data or audit logs.

## General Coding Style Rules (Auto-Injected)
*   **DRY (Don't Repeat Yourself) & KISS (Keep It Simple, Stupid):** Prefer vanilla implementations over overly clever or complex solutions. Forbid premature optimization, deeply nested conditional structures, duplicate helper logic, and unnecessary abstractions. Strive for extreme readability.
*   **SOLID Design Principles:** Adhere to functional, single-responsibility modules, open-closed behavior where applicable, interface separation, and dependency inversion.
*   **YAGNI (You Aren't Gonna Need It):** Prohibit writing speculative boilerplate code or future-proofing implementations not explicitly requested by current specifications.
*   **JSDoc Parameter Documentation:** Maintain detailed JSDoc comments including `@param`, `@returns`, and `@description` for all helper functions and exported utility modules.
*   **Context Budgets:** If a task requires modifying more than 3 modules or 60 seconds of manual context navigation to understand, halt and demand user clarification. Break down large tasks into smaller, manageable sub-tasks.
*   **No Placeholders:** Strictly prohibit leaving commented placeholders, stub functions, incomplete implementations, or TODO lines in any generated code. All outputs must represent complete, implementable codebase scaffolding files.