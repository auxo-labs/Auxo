# CareWorkspace Clinic Portal: System North Star

## Section 1: Product Thesis & Vision

The CareWorkspace Clinic Portal is envisioned as a secure, HIPAA-compliant B2B patient portal designed to provide medical clinics with isolated, efficient workspaces for managing patient history, appointments, and doctor logs. Our core problem statement revolves around the chaotic, insecure, and siloed data management practices prevalent in many clinics. This portal aims to streamline clinic operations by offering a centralized, intuitive, and highly secure platform that adheres to the highest standards of data privacy and regulatory compliance, thereby enhancing patient care coordination and administrative efficiency for medical professionals.

## Section 2: Core Functional Pillars

To ensure a focused launch and maintain product scope, the CareWorkspace Clinic Portal will be built upon these four core functional pillars:

1.  **Secure Tenant Isolation**: Guaranteeing complete data separation and privacy for each distinct clinic (tenant) utilizing the platform.
2.  **Clinic Workspace Dashboards**: Providing comprehensive, at-a-glance overviews for doctors and administrative staff within their respective clinic environments.
3.  **Comprehensive Patient History Tracking**: Enabling detailed and chronological logging, viewing, and management of patient medical records.
4.  **Medical Doctor Logging & Role-Based Access**: Facilitating secure authentication for medical professionals and enforcing role-specific access controls to sensitive information and functionalities.

## Section 3: Ubiquitous Domain Vocabulary

This standardized vocabulary ensures consistent naming conventions and understanding across all aspects of the codebase and documentation.

| Human Term          | Code Property      | Context Definition                                                                                             |
| :------------------ | :----------------- | :------------------------------------------------------------------------------------------------------------- |
| Tenant              | `tenant`           | An independent clinic, medical group, or healthcare provider organization utilizing the portal, identified by `tenantId`. |
| Workspace           | `workspace`        | The isolated digital environment and data scope provided for a specific `tenant`.                              |
| Patient             | `patient`          | An individual receiving medical care, whose health data is managed securely within a `tenant`'s `workspace`. |
| Doctor              | `doctor`           | A licensed medical professional with authenticated access to a `tenant`'s `workspace` to manage `patient` data. |
| Medical Record      | `medicalRecord`    | The comprehensive electronic health history for a `patient`, including diagnoses, treatments, and appointments. |
| Appointment         | `appointment`      | A scheduled visit, consultation, or procedure for a `patient` with a `doctor` at a specific time.             |
| Protected Health Information | `phi`      | Any health information that is individually identifiable, subject to strict HIPAA regulations.                   |
| Tenant ID           | `tenantId`         | A unique identifier assigned to each `tenant` for data segregation and access control.                         |

## Section 4: Context Matrix Directory Map

This section provides direct pointers to essential context files that guide the development and understanding of the CareWorkspace Clinic Portal.

*   `README.md`: You are here. The System North Star, product vision, and core vocabulary.
*   `AGENTS.md`: The global architectural constitution, stack declarations, and overriding coding philosophies.
*   `CLAUDE.md`: The CLI Runtime Executive, detailing safe and explicit command-line operations.
*   `phases.md`: The State Roadmap, outlining the project's development phases and task breakdown.
*   `.cursor/rules/ui-theme.mdc`: Defines the aesthetic constraints, layout parameters, and UI interaction guidelines.
*   `.cursor/rules/logic-api.mdc`: Outlines general system logic invariants, external service boundaries, and mock data protocols.
*   `.cursor/rules/tenant-rules.mdc`: Specifies rules and logic for B2B tenant management and data isolation.
*   `.cursor/rules/hipaa-rules.mdc`: Details the strict requirements for HIPAA compliance and handling of Protected Health Information (PHI).