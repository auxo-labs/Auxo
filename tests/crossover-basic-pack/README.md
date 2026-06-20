# CareWorkspace Clinic Portal: System Overview & North Star

## 1. Product Thesis & Vision
CareWorkspace is a multi-tenant B2B healthcare CRM and clinic management platform. It offers clinical teams secure workspace segregation for managing patients, appointments, and HIPAA-compliant care logs.

### The Core Problem It Solves:
Healthcare clinics struggle to manage multi-tenant practitioner workspaces while maintaining strict data isolation and clinical security. CareWorkspace provides a secure, zero-latency clinical CRM.

---

## 2. Core Functional Pillars
To protect the product scope, the application is strictly bound to these launch execution vectors:
* **Multi-Tenant Clinical Portal:** Secure, workspace-isolated dashboard for clinic staff and medical practitioners.
* **Patient & Care CRM Pipeline:** A visual CRM pipeline for patient intake, scheduling, and clinician assignments.
* **HIPAA Activity Sandbox:** Encrypted patient data sandbox with real-time collaborative clinical chat.

---

## 3. Ubiquitous Domain Vocabulary
To ensure consistent naming conventions across components and services, you must strictly adhere to this domain terminology:

| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Workspace ID** | `tenantId` / `organizationId` | The unique partition key isolating clinic workspaces. |
| **Patient Record** | `patientRecordId` | Safe medical record key linking patient metadata. |
| **NHS / SSN ID** | `encryptedNationalId` | Securely encrypted patient identification key. |
| **Clinic Staff** | `practitionerId` | Identifier for the active clinical user. |

---

## 4. Context Matrix Directory Map
For operational execution, do not dump system configs here. Navigate directly to these highly scoped files:
- **Global Developer Constraints & Constitution:** Check `./AGENTS.md`
- **Local CLI Runtime & Build Command Flags:** Check `./CLAUDE.md`
- **Target Feature Roadmaps & Phase Checklists:** Check `./docs/phases.md`
- **System Overview & North Star:** Check `./README.md`
