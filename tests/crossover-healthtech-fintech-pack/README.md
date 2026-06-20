# ClaimFlow Medical Billing: System Overview & North Star

## 1. Product Thesis & Vision
ClaimFlow is a HIPAA-compliant medical billing and insurance claims ledger engine. It integrates secure patient visit verification with PCI-DSS compliant payment processing for clinics and providers.

### The Core Problem It Solves:
Processing clinical bills requires absolute patient record secrecy alongside strict ledger audits, exposing clinics to compliance leaks. ClaimFlow merges double-entry accounting with encrypted healthcare records.

---

## 2. Core Functional Pillars
To protect the product scope, the application is strictly bound to these launch execution vectors:
* **Clinical Ledger Audit:** Atomic, double-entry ledger tracing of claims and collections.
* **HIPAA Claim Sandbox:** Secure claims preparation dashboard isolating patient health data.
* **PCI-Compliant Gateway:** Gated invoice execution bypassing local logs.

---

## 3. Ubiquitous Domain Vocabulary
To ensure consistent naming conventions across components and services, you must strictly adhere to this domain terminology:

| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Claim Record** | `claimId` | Primary identifier linking billing claim metadata. |
| **Patient ID** | `encryptedPatientId` | Encrypted key mapping patient health profile. |
| **Transaction Value** | `amountCents` | Integer value of financial transaction in cents. |
| **Audit Ledger Key** | `ledgerHash` | Cryptographic validation hash of ledger entry. |

---

## 4. Context Matrix Directory Map
For operational execution, do not dump system configs here. Navigate directly to these highly scoped files:
- **Global Developer Constraints & Constitution:** Check `./AGENTS.md`
- **Local CLI Runtime & Build Command Flags:** Check `./CLAUDE.md`
- **Target Feature Roadmaps & Phase Checklists:** Check `./docs/phases.md`
- **System Overview & North Star:** Check `./README.md`
