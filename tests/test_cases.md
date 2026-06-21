# Auxo Prompt Compiler Test Suite

This document defines standardized test cases used to evaluate the accuracy, token efficiency, and formatting of the compiled agent packs.

---

## big scenario 1:

1. The Atomic Killer Feature (The 1-Week MVP)The product is "Scope3-Pulse": An automated, single-utility calculation ledger that lets small-to-medium suppliers quickly generate an audit-ready sustainability information packet to satisfy corporate compliance demands from their enterprise buyers. The Atomic Engine: A secure document parser endpoint. The user uploads a single CSV of raw utility utility/shipping billing logs or pastes unorganized inventory records; the engine extracts fuel/electricity usages, runs them through the official EFRAG risk-based conversion tables, and spits out a compliant, single-page "VSME+ Data Pack". What to EXCLUDE:No persistent historical analytics charts, multi-user enterprise sub-accounts, or automated live integration plugins into customer ERP architectures. No custom, multi-framework corporate carbon accounting tools—restrict the scope exclusively to the newly published 2026 voluntary EFRAG baseline reporting templates. Primary User Flow:Drag and drop raw shipping or energy invoices into a stateless client parser. Review the auto-mapped emission values mapped via the risk-based EFRAG proxy parameters. Click Export Verified Pack to download a single, signable PDF/JSON compliance manifest built directly for corporate compliance officers. 2. Creative Monetization StrategyReject standard monthly subscription models during your validation week. Capitalize on immediate transactional pain: suppliers are filling this out because an enterprise account executive is threatening to pause their vendor contract. Pricing ArchetypeModel FormatPrice PointCore Value MetricTransactional / Usage-BasedPay-Per-Report£49 / runPay directly per individual verified VSME+ audit pack generated. Bypasses recurring monthly software overhead for micro-businesses.Value-Metric TieringSupplier Cap£149 / yearFree basic baseline calculation. Up to 3 active corporate client request streams with premium proxy data access adjustments.High-Ticket Pre-SalesThe Compliance Pass£299 one-timePermanent validation access + access to localized national transposition compliance update logs as they rollout.3. Tech & Regulatory Research BlueprintTo make this product fully authoritative inside your target space, you must weaponize the exact technical guardrails governing the March 2026 compliance landscape. Framework Architecture & Guidelines: The Omnibus I Omnibus Directive (March 18, 2026): Focus your system instructions on "Double Materiality" and the "Value-Chain Cap" rules. Large companies with over 1,000 employees are directly exposed to penalties up to 3% of net worldwide turnover for non-compliance, driving their aggressive push for proxy vendor parameters. EFRAG VSME Guidelines: Rely exclusively on the simplified European Sustainability Reporting Standards (ESRS) framework optimized to reduce data-point collections by up to 61% from legacy frameworks. Technical Edge Cases & "Gotchas": The Estimate Liability Loophole: The 2026 updates explicitly allow suppliers to use proxy data and secondary estimates rather than exhaustive direct tracking. Your app must include a prominent legal disclaimer badge in the JSON outputs indicating “Calculated via standard EFRAG secondary value-chain proxies” to insulate small businesses from audit liability. 4. The "Cemetery Checklist" (The Competitor Blindspot)CompetitorCore OfferingTheir Core Weakness / BlindspotThe "Why Not"Enterprise Carbon Engines (Normative, Watershed)Massive enterprise emissions visibility networks for Fortune 500 groups.Massively complex onboarding pipelines that cost thousands of pounds per setup. Completely inaccessible to mid-market suppliers who just need a one-time paper report.Their primary monetization loop relies on large enterprise contracts, meaning they lack any financial incentive to build transactional, self-service tools for micro-vendors.Standard Accounting Platforms (Xero, QuickBooks)Cloud-native financial accounting ledger software.Financial ledgers monitor transactions, not the underlying raw volumetric environmental data points needed to satisfy ESRS compliance.Rebuilding database schemas to track shipping weights and engine fuel combustion variants introduces massive platform risks for a highly localized EU directive change.5. Community Hunting & Validation StrategyLocate the exact forums where operations managers and B2B logistics coordinators are losing their minds over customer sustainability documentation requests. Advanced Search Operators:site:[reddit.com/r/logistics](https://reddit.com/r/logistics) "sustainability" OR "compliance" ("spreadsheet" OR "nightmare")site:[reddit.com/r/supplychain](https://reddit.com/r/supplychain) "CSRD" OR "Scope 3" "customer request"site:x.com "Omnibus" OR "ESRS" "supplier" ("fine" OR "turnover")Emotional Keywords to Track:"Our largest EU client is threatening to audit our shipping logs for carbon data.""I have to fill out a 400-row sustainability disclosure spreadsheet by Friday or our contract gets paused.""What standard are small non-EU suppliers actually supposed to use for reporting?"

## Scenario A: Full-Stack React & Next.js Application (Standard Path)

- **Goal:** Verify that the tech-resolver accurately resolves package versions (Next.js 16/15, Tailwind v4, Supabase) and injects the corresponding architectural constraints.
- **Input Raw Notes:**

```markdown
# Project SignalSignal

Build a real-time portfolio tracker for crypto and stock positions.
We are using Next.js for routing and pages.
Styling is done via tailwindcss.
Database connection and subscription sync will be handled by @supabase/supabase-js.

Requirements:

- Left sidebar for navigating between Dashboard, Research, and Settings.
- Home dashboard with a Bento layout showing portfolio statistics and recent activities.
- Supabase Realtime Presence to show cursor tracking and collaborative notes in the portfolio research shared rooms.
```

---

## Scenario B: Non-JavaScript Backend Service (Fallback Path)

- **Goal:** Verify that the compiler behaves gracefully with languages/frameworks outside the primary Node package registry resolver.
- **Input Raw Notes:**

```markdown
# DataPipeline Service

A high-performance backend worker for processing large parquet datasets.
Written in Python using pandas for dataframe manipulations and FastStream for Kafka event streams.
It reads from a PostgreSQL DB and writes aggregated stats to ClickHouse.

Requirements:

- Must run as a background cron worker.
- Never write frontend or React components.
- Standard typing using mypy and strict JSDoc-style comments (using Sphinx docstrings for Python).
- Include standard logging and error tracking setup.
```

---

## Scenario C: Frontend Dashboard with Strict Architectural Constraints

- **Goal:** Verify that absolute constraints (e.g. no database writes, strict DRY/SOLID, zero auth) are correctly isolated and mapped to constraints lists.
- **Input Raw Notes:**

```markdown
# Auxo Client Playground

An ephemeral client-only drafting tool.
We want to keep this extremely minimal.
Absolutely NO backend databases, NO external authentication systems (like Clerk or Auth0).
All data must persist solely in the user's LocalStorage.

Constraints:

- We must enforce strict SOLID principles.
- Code must be lightweight, no bloated libraries.
- React components must be functional, client-declared, and use native Tailwind layout variables.
```
