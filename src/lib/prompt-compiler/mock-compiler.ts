import { TechSignature } from '../tech-resolver';
import { CompiledPack } from './types';

/**
 * Deterministically generates mock package stubs based on key patterns found in the project notes.
 *
 * @param rawMarkdown - Raw description notes inputted by the user.
 * @param techSignatures - Invariant versions resolved from npm registry.
 * @returns Static mock compiled pack blueprint.
 */
export function localMockCompile(rawMarkdown: string, techSignatures: TechSignature[]): CompiledPack {
  const titleMatch = rawMarkdown.match(/^#\s+(.+)$/m);
  const projectName = titleMatch ? titleMatch[1].trim() : 'Project Auxo';

  const signaturesText = techSignatures.length > 0
    ? techSignatures.map(sig => `- **${sig.packageName} (v${sig.latestVersion})**: ${sig.architecturalInvariant}`).join('\n')
    : '- Default framework rules apply.';

  const rawLower = rawMarkdown.toLowerCase();

  // Category match keywords
  const isB2BCrm = /crm|ats|pipeline|tenant|workspace|b2b|hr|lead|customer/i.test(rawLower);
  const isAIWrapper = /openai|anthropic|gemini|llm|vector|rag|embedding|pinecone|agent/i.test(rawLower);
  const isMarketplace = /marketplace|directory|booking|job board|hire|vendor|renter|platform/i.test(rawLower);
  const isFintech = /invoice|billing|ledger|crypto|wallet|accounting|tax|payout/i.test(rawLower);
  const isDevTool = /analytics|telemetry|api|webhook|logging|sdk|monitoring|clickhouse/i.test(rawLower);
  const isHealthTech = /medical|patient|health|clinic|hipaa|therapy|doctor/i.test(rawLower);
  const isContentEngine = /cms|blog|newsletter|markdown|course|education|subscribers/i.test(rawLower);
  const isLocalSync = /offline|local-first|pwa|indexeddb|sync|tauri|electron/i.test(rawLower);

  let complianceGuardrails = '';
  if (isB2BCrm) {
    complianceGuardrails += `- **SOC2 Compliance Guidelines:** All API responses must explicitly omit internal stack traces and database transaction details to prevent information disclosure. Enforce TLS-only transport constraints.\n`;
  }
  if (isHealthTech) {
    complianceGuardrails += `- **HIPAA Security Rule Standards:** Database operations processing PHI data must pass through the audit-logging broker to capture user access vectors. Ensure zero storage of raw patient data in unencrypted logs.\n`;
  }
  if (isFintech) {
    complianceGuardrails += `- **PCI-DSS Directives:** Never pass or store raw credit card numbers, CVVs, or payment token identifiers directly in application state logs, database logs, or diagnostic payloads.\n`;
  }

  const agentsMd = `# AGENTS.md

## System Overview
- **Project Name:** ${projectName}
- **Source:** Compiled via Auxo.

## Core Directives (Senior Software Developer Guardrails)
1. **DRY & KISS (Keep It Simple, Stupid):** Prefer "vanilla over clever." Forbid premature optimization, deeply nested conditions, and excessive abstractions. Keep code clean and readable.
2. **SOLID Principles:** Enforce functional, single-responsibility modules.
3. **YAGNI (You Aren't Gonna Need It):** Never build speculative boilerplate features or write code that isn't requested in the current spec.
4. **JSDoc Documentation:** Every exported function and utility module must have complete JSDoc parameter and return descriptions.
5. **CONTEXT BUDGETS:** If a task requires modifying more than 3 modules or 60 seconds of manual context navigation, halt immediately and ask the user for clarification.
6. **NO PLACEHOLDERS:** Commented stubs, incomplete functions, or TODO markers are strictly prohibited in the final source.
7. **EXPLICIT CONTRAST:** Prioritize using existing styling tokens, CSS variables, and layout primitives instead of inventing new component styles.
${complianceGuardrails ? `\n## Security & Compliance Guardrails\n${complianceGuardrails}` : ''}
## Resolved Tech Stack & Invariants
${signaturesText}

## Build & Test Commands
- Build Command: \`npm run build\`
- Dev Command: \`npm run dev\`
- Test Command: \`npm test\``;

  const claudeMd = `# CLAUDE.md

## Context Rules
- Refer to @AGENTS.md for global directory structures and Simplicity Contracts.

## Command Policies
- **Dev Server:** \`npm run dev\`
- **Build Verification:** \`npm run build\`
- **Local Testing:** \`npm test\`
- **Linter Checks:** \`npm run lint\``;

  const cursorRules: Record<string, string> = {};

  let uiThemeRulesContent = `---
description: General UI layout parameters and styling theme guidelines
globs: ["src/components/**/*", "src/app/**/*.tsx"]
alwaysApply: false
---
# UI Theme Guidelines
- Layout: Use CSS-first layout rules using Tailwind CSS variables.
- Accessibility: Apply standard semantic tags and ARIA descriptors.
- Error Boundaries: Ensure user interfaces wrap client nodes in local error catch modules.`;

  if (isB2BCrm) {
    cursorRules['tenant-rules.mdc'] = `---
description: Workspace segregation and row-level security (RLS) constraints for B2B CRM
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
alwaysApply: false
---
# B2B Multi-Tenant Rules
- **Workspace Isolation:** Every data query MUST filter by workspace separation keys (e.g., \`tenant_id\` or \`organization_id\`).
- **Row-Level Security:** Enforce strict team-based RLS constraints on all database operations.
- **Tenant Management:** Validate user organization membership inside route middleware before serving data.`;
  }

  if (isAIWrapper) {
    cursorRules['ai-vector-rules.mdc'] = `---
description: Prompts tracking, cost auditing, and vector stream-handling
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
alwaysApply: false
---
# AI Vector Engineering Rules
- **Prompt Auditing:** Maintain prompt-logging tables tracking input/output tokens and cost metrics.
- **Cost Tracking:** Apply cost-tracking middleware to intercept LLM provider integrations.
- **Streaming Handlers:** Handle OpenAI/Gemini streams cleanly, returning chunks to stream-handling UI components.`;
  }

  if (isMarketplace) {
    cursorRules['marketplace-rules.mdc'] = `---
description: State flow and location queries for two-sided marketplaces
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
alwaysApply: false
---
# Two-Sided Marketplace Rules
- **Role Invariant:** Maintain explicit isolation between Buyer and Seller state flows and profiles.
- **Location Queries:** Apply geo-query filters to limit local search listings (within defined radius).
- **Public Profile Routing:** Enforce structured profile slug validation.`;
  }

  if (isFintech) {
    uiThemeRulesContent += `\n- **Theme:** Strict true-black terminal layout (#000000). Never use slate or zinc grays.\n- **Accents:** Neon green (#10B981) for positive tickers, neon amber (#F59E0B) for warnings/neutral.\n- **Typography:** Strictly monospaced layout elements, high-density HTML data tables.`;
    cursorRules['ledger-rules.mdc'] = `---
description: Double-entry financial audit logs and math guidelines
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
alwaysApply: false
---
# Ledger Billing Rules
- **Double-Entry Balance:** Financial entries must balance to zero before commit execution.
- **Audit Trails:** Save all transactions to append-only financial audit logs. No updates or deletes.
- **Math Guidelines:** All calculations must enforce exact scaling rules. Forbid floating-point issues; utilize integer cents.`;
  }

  if (isDevTool) {
    cursorRules['ingestion-rules.mdc'] = `---
description: Fast ingestion indexing patterns and validation routes
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
alwaysApply: false
---
# Developer Tool Ingestion Rules
- **Fast-Ingest Pipeline:** Batch commits to ClickHouse in pools of 1000 items or 5 seconds.
- **Request Validation:** Route validation middleware must intercept and discard corrupt JSON payloads instantly.
- **Indexing Patterns:** Keep index columns highly optimized for time-series querying.`;
  }

  if (isHealthTech) {
    uiThemeRulesContent += `\n- **Safety Banner:** Clinical emergency banners must be highly visible and display top-level patient alerts.`;
    cursorRules['hipaa-rules.mdc'] = `---
description: HIPAA encrypted datastore protocols and audit trails
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
alwaysApply: false
---
# HIPAA Clinical Data Rules
- **Encrypted Storage:** Enforce encryption abstractions on all patient identity records.
- **Activity Logging:** Maintain strict audit tables recording every query access to clinical logs.
- **Zero Cache:** Zero-cached client state patterns on all patient telemetry views.`;
  }

  if (isContentEngine) {
    cursorRules['cms-rules.mdc'] = `---
description: Headless CMS caching paths and newsletter mailing queries
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
alwaysApply: false
---
# Headless CMS Rules
- **Caching Paths:** Enforce Static Site Generation (SSG) caching paths for markdown content.
- **Email Queues:** Newsletter subscriptions must pool in an email queue table for transactional dispatch.
- **Content Parsing:** Implement secure rich-text markdown parsing layers.`;
  }

  if (isLocalSync) {
    cursorRules['sync-rules.mdc'] = `---
description: Local CRDT resolution rules and network state bindings
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
alwaysApply: false
---
# Local-First Sync Rules
- **CRDT Synchronization:** Conflict-Free Replicated Data Type (CRDT) stubs must resolve local vs remote client states.
- **Local Mirroring:** Sync and mirror databases to IndexedDB schemas on the client.
- **State Listeners:** Setup online-offline network listeners to queue pending sync changes.`;
  }

  if (Object.keys(cursorRules).length === 0) {
    cursorRules['logic-api.mdc'] = `---
description: API response standards and standard db boundaries
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
alwaysApply: false
---
# Logic and API Invariants
- Every API endpoint must return a structured JSON response.
- Do not use custom query wrappers; write raw database client primitives.
- **Verification Rule:** Every endpoint must pass local linter execution (\`npm run lint\`) before committing.`;
  }

  cursorRules['ui-theme.mdc'] = uiThemeRulesContent;

  let prdThesis = 'SignalSignal is a high-density, real-time portfolio tracker and analytical canvas built for sovereign crypto and stock investors. It bridges the gap between chaotic retail trading interfaces and institutional-grade tooling, delivering split-second multi-asset portfolio visibility.';
  let prdProblem = 'Retail investors lose alpha because their data is fragmented across multiple exchanges, wallets, and slow, click-heavy web UIs. SignalSignal provides a unified, zero-latency "command center" layout.';
  let prdPillars = `* **The Bloomberg Dashboard (Bento Layout):** A single-view, keyboard-navigable dashboard rendering live asset metrics, total PnL allocation charts, and historical performance tables.
* **The Research Sandbox (Shared Rooms):** Real-time collaborative workspaces utilizing transient state streams where co-investors can overlay macro charts, share text nodes, and analyze vectors simultaneously.
* **The Terminal Feed:** A high-density, monospaced HTML data stream aggregating volatile tickers and execution actions without nested pagination loops.`;
  let prdVocab = `| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Ticker/Symbol** | \`ticker\` | Standardized market identifier (e.g., \`BTC\`, \`AAPL\`). |
| **Average Fill Price** | \`averagePrice\` | The weighted average cost basis of an accumulated position. |
| **Current Market Value** | \`totalValue\` | \`quantity\` multiplied by the live asset \`currentPrice\`. |
| **Unrealized Gain/Loss** | \`pnlValue\` / \`pnlPercent\` | Net financial delta between cost basis and live valuation. |`;

  if (isB2BCrm && isHealthTech) {
    prdThesis = 'CareWorkspace is a multi-tenant B2B healthcare CRM and clinic management platform. It offers clinical teams secure workspace segregation for managing patients, appointments, and HIPAA-compliant care logs.';
    prdProblem = 'Healthcare clinics struggle to manage multi-tenant practitioner workspaces while maintaining strict data isolation and clinical security. CareWorkspace provides a secure, zero-latency clinical CRM.';
    prdPillars = `* **Multi-Tenant Clinical Portal:** Secure, workspace-isolated dashboard for clinic staff and medical practitioners.
* **Patient & Care CRM Pipeline:** A visual CRM pipeline for patient intake, scheduling, and clinician assignments.
* **HIPAA Activity Sandbox:** Encrypted patient data sandbox with real-time collaborative clinical chat.`;
    prdVocab = `| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Workspace ID** | \`tenantId\` / \`organizationId\` | The unique partition key isolating clinic workspaces. |
| **Patient Record** | \`patientRecordId\` | Safe medical record key linking patient metadata. |
| **NHS / SSN ID** | \`encryptedNationalId\` | Securely encrypted patient identification key. |
| **Clinic Staff** | \`practitionerId\` | Identifier for the active clinical user. |`;
  } else if (isHealthTech && isFintech) {
    prdThesis = 'ClaimFlow is a HIPAA-compliant medical billing and insurance claims ledger engine. It integrates secure patient visit verification with PCI-DSS compliant payment processing for clinics and providers.';
    prdProblem = 'Processing clinical bills requires absolute patient record secrecy alongside strict ledger audits, exposing clinics to compliance leaks. ClaimFlow merges double-entry accounting with encrypted healthcare records.';
    prdPillars = `* **Clinical Ledger Audit:** Atomic, double-entry ledger tracing of claims and collections.
* **HIPAA Claim Sandbox:** Secure claims preparation dashboard isolating patient health data.
* **PCI-Compliant Gateway:** Gated invoice execution bypassing local logs.`;
    prdVocab = `| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Claim Record** | \`claimId\` | Primary identifier linking billing claim metadata. |
| **Patient ID** | \`encryptedPatientId\` | Encrypted key mapping patient health profile. |
| **Transaction Value** | \`amountCents\` | Integer value of financial transaction in cents. |
| **Audit Ledger Key** | \`ledgerHash\` | Cryptographic validation hash of ledger entry. |`;
  } else if (isB2BCrm && isFintech) {
    prdThesis = 'BizLedger is a multi-tenant B2B billing and ledger engine. It provides organizations with segregated workspaces, atomic double-entry bookkeeping, and audited invoicing.';
    prdProblem = 'Enterprises require reliable bookkeeping across multiple business units without cross-tenant ledger leaks. BizLedger guarantees secure workspace RLS and strict audit trails.';
    prdPillars = `* **Multi-Tenant Invoicing:** Grouped client billing reports.
* **Double-Entry Journal:** Immutable audit trail records.
* **Tenant Stripe webhook:** Scoped billing dispatch queues.`;
    prdVocab = `| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Workspace Key** | \`tenantId\` | Partition identifier for corporate organizations. |
| **Ledger Balance** | \`balance\` | Account balance tracking in integer cents. |
| **Invoice Record** | \`invoiceId\` | Unique billing transaction key. |`;
  } else if (isFintech) {
    prdThesis = 'LedgerCore is a high-integrity, double-entry audit bookkeeping engine designed for financial operations, bookkeeping, and cash flow tracing.';
    prdProblem = 'Manual bookkeeping is prone to credit/debit mismatch and tampering. LedgerCore enforces atomic ledger accounting and immutable audits.';
    prdPillars = `* **Ledger Books View:** Tabular layout representing journal entries.
* **Audit Trails logging:** Appending hash-chained transactions.
* **Invoicing status monitor:** Quick dashboard showing paid vs overdue cash flows.`;
    prdVocab = `| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Entry Type** | \`type\` | Direction of bookkeeping mutation (\`DEBIT\` or \`CREDIT\`). |
| **Asset Code** | \`code\` | Standardized account identifier. |
| **Net Balance** | \`balance\` | Total accumulated balance of the ledger. |`;
  } else if (/pipeline|kafka|parquet|cron|worker|postgres|clickhouse|backend/i.test(rawLower)) {
    prdThesis = 'DataPipeline is a stream-processing worker built for high-performance ingestion of parquet datasets into ClickHouse and PostgreSQL.';
    prdProblem = 'Data loss occurs under high-volume streaming spikes. DataPipeline pools Kafka events and guarantees batching commits.';
    prdPillars = `* **Stream Consumer:** Zero-client backend worker consuming Kafka partitions.
* **Batch Ingest Engine:** Parallel insertion blocks to ClickHouse.
* **Telemetry Logs Monitor:** Monospaced terminal indicators monitoring partition offset lag.`;
    prdVocab = `| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Job Status** | \`status\` | State of the pipeline worker execution. |
| **Record Count** | \`recordsProcessed\` | Number of events committed to databases. |
| **Stream Offset** | \`offset\` | Position indicator in Kafka topic partition. |`;
  } else if (/medical|health|patient|clinic|doctor|pharmacy/i.test(rawLower)) {
    prdThesis = 'MedTrack is a clinical patient tracker and allergy monitor built to provide clinical teams with instant patient history visibility.';
    prdProblem = 'Delayed records access in emergency settings leads to medical errors. MedTrack ensures instant data retrieval with local caching.';
    prdPillars = `* **Clinical Banner View:** Patient emergency metrics.
* **Allergy Alert alerts:** Live notifications showing medical triggers.
* **HIPAA Audit logging:** Immutable patient record access history tracking.`;
    prdVocab = `| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **NHS Number** | \`encryptedNhsNo\` | Encrypted patient health identity key. |
| **Medical Trigger** | \`allergies\` | List of severe patient allergen factors. |
| **Audit Action** | \`action\` | Operational tag tracking patient history access. |`;
  } else if (/farm|agriculture|crop|plant|soil|weather/i.test(rawLower)) {
    prdThesis = 'FieldSync is an IoT field sensor telemetry monitor and harvest prediction analyzer.';
    prdProblem = 'Fragmented crop analytics lead to delayed hydration and harvest risk. FieldSync pools sensor feeds into soil metrics maps.';
    prdPillars = `* **Field Telemetry Table:** Telemetry metrics (soil moisture, nitrogen levels).
* **Harvest Projection engine:** Predictive engine resolving crop yield targets.
* **Sensor Heartbeat alerts:** Latency tracking dials showing active fields.`;
    prdVocab = `| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Moisture Value** | \`soilMoisturePercent\` | Volumetric soil water content delta. |
| **Yield Projection** | \`projectedHarvestTons\` | Expected harvest output size in tons. |
| **Sensor Timestamp** | \`recordedAt\` | Date-time indicator of IoT sensor heartbeat. |`;
  } else if (!/crypto|stock|portfolio|trade|finance|wealth|broker/i.test(rawLower)) {
    prdThesis = 'AppCore is a simplicity-aligned workspace for managing standard business records.';
    prdProblem = 'Redundant boilerplate code slows down standard application development.';
    prdPillars = `* **Records Grid:** A clean dashboard showing database metrics.
* **Collaboration room:** Real-time presence rooms for sync.
* **ZIP Export canvas:** One-click local downloads of context packs.`;
    prdVocab = `| Human Term | Code Property | Context Definition |
| :--- | :--- | :--- |
| **Record ID** | \`id\` | Standard unique database key. |
| **Name Value** | \`name\` | Human-readable title property. |
| **Creation Stamp** | \`createdAt\` | ISO timestamp of record insertion. |`;
  }

  const readmeMd = `# ${projectName}: System Overview & North Star

## 1. Product Thesis & Vision
${prdThesis}

### The Core Problem It Solves:
${prdProblem}

---

## 2. Core Functional Pillars
To protect the product scope, the application is strictly bound to these launch execution vectors:
${prdPillars}

---

## 3. Ubiquitous Domain Vocabulary
To ensure consistent naming conventions across components and services, you must strictly adhere to this domain terminology:

${prdVocab}

---

## 4. Context Matrix Directory Map
For operational execution, do not dump system configs here. Navigate directly to these highly scoped files:
- **Global Developer Constraints & Constitution:** Check \`./AGENTS.md\`
- **Local CLI Runtime & Build Command Flags:** Check \`./CLAUDE.md\`
- **Target Feature Roadmaps & Phase Checklists:** Check \`./docs/phases.md\`
- **System Overview & North Star:** Check \`./README.md\`
`;

  const phasesMd = `# ${projectName} — Development Phases

## Phase 1: Planning and Setup
- [ ] Create project documentation (\`docs/\` folder).
- [ ] Scaffold Next.js application workspace.
- [ ] Configure tailwindcss \`@theme\` design variables.
- [ ] Create \`.env.local\` with credentials placeholders.

## Phase 2: Core UI Scaffold & Theming
- [ ] Create core layout panels (Sidebar, Header, Main view).
- [ ] Connect providers and theme context wrappers.
- [ ] Build stub routes for main sub-directories.

## Phase 3: State Management & Mock Prototype Logic
- [ ] Define core TypeScript types in \`src/types/\`.
- [ ] Implement Zustand mock datastores and action handlers.
- [ ] Build UI base primitives (Badge, Data table grid).

## Phase 4: Core Implementation & Real Data Integration
- [ ] Implement real database/API query services in \`src/lib/services/\`.
- [ ] Connect API Route Handlers under \`src/app/api/\`.
- [ ] Connect TanStack Query query/mutation hooks.

## Phase 5: Verification, Polish & Stability
- [ ] Run typescript type checking validation tests.
- [ ] Audit linter code constraints using \`npm run lint\`.
- [ ] Apply smooth micro-animations.`;

  return {
    agentsMd,
    claudeMd,
    phasesMd,
    readmeMd,
    cursorRules: cursorRules
  };
}
