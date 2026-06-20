# BizLedger Enterprise Gateway: System Overview & North Star

## 1. Product Thesis & Vision
BizLedger is a multi-tenant B2B billing and ledger engine. It provides organizations with segregated workspaces, atomic double-entry bookkeeping, and audited invoicing.

### The Core Problem It Solves:
Enterprises require reliable bookkeeping across multiple business units without cross-tenant ledger leaks. BizLedger guarantees secure workspace RLS and strict audit trails.

---

## 2. Core Functional Pillars
To protect the product scope, the application is strictly bound to these launch execution vectors:
* **Multi-Tenant Invoicing:** Grouped client billing reports.
* **Double-Entry Journal:** Immutable audit trail records.
* **Tenant Stripe webhook:** Scoped billing dispatch queues.

---

## 3. Ubiquitous Domain Vocabulary
To ensure consistent naming conventions across components and services, you must strictly adhere to this domain terminology:

| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Workspace Key** | `tenantId` | Partition identifier for corporate organizations. |
| **Ledger Balance** | `balance` | Account balance tracking in integer cents. |
| **Invoice Record** | `invoiceId` | Unique billing transaction key. |

---

## 4. Context Matrix Directory Map
For operational execution, do not dump system configs here. Navigate directly to these highly scoped files:
- **Global Developer Constraints & Constitution:** Check `./AGENTS.md`
- **Local CLI Runtime & Build Command Flags:** Check `./CLAUDE.md`
- **Target Feature Roadmaps & Phase Checklists:** Check `./docs/phases.md`
- **System Overview & North Star:** Check `./README.md`
