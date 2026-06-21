# Scope3-Pulse Project Roadmap (MVP)

This document outlines the phased execution plan for the Scope3-Pulse Minimum Viable Product (MVP). Each phase focuses on delivering core functionality required to validate the product thesis.

## Phase 1: Core Document Parser Endpoint
- [ ] Establish secure API endpoint for document upload (`/api/parse-document`).
- [ ] Implement robust CSV parsing for utility/shipping logs.
- [ ] Implement basic text parsing for unorganized inventory records.
- [ ] Develop initial data extraction logic for fuel/electricity usages and shipping details.
- [ ] Implement comprehensive input validation and error handling for uploaded files.

## Phase 2: EFRAG Conversion Engine Integration
- [ ] Integrate official EFRAG risk-based conversion tables as static data or a lookup service.
- [ ] Develop the core calculation engine to convert extracted usage data into emission values.
- [ ] Ensure calculation precision adheres to EFRAG standards.
- [ ] Implement logic to apply EFRAG proxy parameters for secondary estimates.
- [ ] Implement `NEXT_PUBLIC_USE_MOCK_DATA` toggle for development.

## Phase 3: VSME+ Data Pack Generation
- [ ] Design the "VSME+ Data Pack" structure (single-page PDF/JSON output).
- [ ] Implement data rendering logic to populate the pack with calculated emission values.
- [ ] Integrate the mandatory legal disclaimer: "Calculated via standard EFRAG secondary value-chain proxies."
- [ ] Develop export functionality for downloading the PDF and/or JSON report.
- [ ] Create a review UI for users to verify auto-mapped emission values before export.

## Phase 4: Transactional Pricing Implementation
- [ ] Integrate a third-party payment gateway (e.g., Stripe, PayPal) for transactional payments.
- [ ] Implement "Pay-Per-Report" (`£49 / run`) pricing model.
- [ ] Develop secure payment flow and success/failure handling.
- [ ] Implement a basic user session management to track report generation for payment.
- [ ] Ensure PCI-DSS compliance for payment handling (no raw card data stored).

## Phase 5: User Acceptance Testing & Launch Prep
- [ ] Conduct comprehensive end-to-end testing of the entire user flow (upload, calculate, review, export, pay).
- [ ] Gather feedback from target users (small-to-medium suppliers) for UI/UX refinements.
- [ ] Optimize application performance and ensure scalability of the parsing engine.
- [ ] Finalize documentation and deployment scripts.
- [ ] Prepare for soft launch/validation week.