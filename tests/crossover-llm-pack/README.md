# CareWorkspace Clinic Portal - System North Star

## 1. Product Thesis & Vision

The CareWorkspace Clinic Portal is a secure, HIPAA-compliant B2B SaaS application designed to empower medical clinics with efficient patient management and robust tenant-isolated workspaces. Our vision is to streamline clinic operations by providing doctors with a centralized, real-time platform to track patient history, manage appointments, and log medical interactions, all while ensuring the highest standards of data security and privacy for Protected Health Information (PHI). This project exists to solve the challenges of fragmented patient data, manual record-keeping, and the stringent compliance requirements faced by modern healthcare providers.

## 2. Core Functional Pillars

To protect product scope boundaries and ensure a focused launch, the CareWorkspace Clinic Portal will be built upon these core functional pillars:

*   **Tenant Workspace Isolation:** Secure separation of clinic data, ensuring that each clinic (tenant) has its own protected environment and data cannot leak between tenants.
*   **Clinic Dashboard & Management:** A centralized, intuitive dashboard for medical staff to view essential clinic-wide information, manage schedules, and access quick overviews.
*   **Patient Records Management:** Comprehensive tracking and logging of patient medical history, including diagnoses, treatments, and notes, with strict access controls.
*   **Medical Doctor Logging & Audit:** Robust logging of all doctor interactions with patient data, providing an auditable trail for compliance and accountability.

## 3. Ubiquitous Domain Vocabulary

To ensure naming uniformity and clear communication across the codebase, the following standardized vocabulary will be used:

| Human Term          | Code Property         | Context Definition                                                               |
| :------------------ | :-------------------- | :------------------------------------------------------------------------------- |
| Tenant              | `tenantId`            | A unique identifier for a medical clinic instance. All data is scoped by this.   |
| Clinic              | `clinic`              | The specific medical practice or institution using the portal.                   |
| Patient             | `patient`             | An individual receiving medical care; their data is PHI.                         |
| Doctor              | `doctor`              | A medical professional authorized to access and manage patient data.             |
| Medical Record      | `medicalRecord`       | A collection of a patient's health information, including history and notes.     |
| Diagnosis           | `diagnosis`           | A determination of the nature of a disease or condition.                         |
| Treatment           | `treatment`           | The medical care given to a patient for an illness or injury.                    |
| Appointment         | `appointment`         | A scheduled meeting between a patient and a doctor.                              |
| Audit Log Entry     | `auditLogEntry`       | A record of a specific action taken within the system, especially involving PHI. |
| Workspace           | `workspace`           | The secure, personalized environment for a doctor or clinic within the portal.   |

## 4. Context Matrix Directory Map

This section provides direct pointers to critical scoped context files for architectural guidance and operational procedures:

*   **System North Star:** `README.md` (You are here)
*   **Agent Constitution & Global Directives:** `AGENTS.md`
*   **CLI Runtime Executive & Commands:** `CLAUDE.md`
*   **Project State Roadmap:** `phases.md`