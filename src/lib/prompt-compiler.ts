'use server';

import { TechSignature } from './tech-resolver';

export interface CompiledPack {
  agentsMd: string;      // root AGENTS.md: Global taste guardrails
  claudeMd: string;      // root CLAUDE.md: CLI execution and shortcuts
  phasesMd: string;      // root phases.md: Structured breakdown of the project plan into multiple logical phases (e.g. Planning, Scaffold, Feature implementation, Verification) with specific sub-steps.
  readmeMd: string;      // root README.md: AI-optimized README / System North Star
  cursorRules: Record<string, string>; // .cursor/rules/[filename].mdc
}

/**
 * Compiles raw markdown notes into a structured CompiledPack.
 * Enforces Software 3.0 constraints, implied conventions, and resolved tech-stack signatures.
 */
export interface UserConfig {
  provider: 'premium' | 'openai' | 'anthropic' | 'gemini';
  model?: string;
  apiKey?: string;
}

export async function compilePromptPack(
  rawMarkdown: string, 
  techSignatures: TechSignature[] = [],
  forceBasic = false,
  userConfig?: UserConfig
): Promise<CompiledPack> {
  if (!forceBasic && userConfig && userConfig.provider !== 'premium' && userConfig.apiKey) {
    const { provider, model, apiKey } = userConfig;
    if (provider === 'openai') {
      return await callOpenAI(apiKey, model || 'gpt-4o-mini', rawMarkdown, techSignatures);
    } else if (provider === 'anthropic') {
      return await callAnthropic(apiKey, model || 'claude-3-5-sonnet-20241022', rawMarkdown, techSignatures);
    } else if (provider === 'gemini') {
      return await callGemini(apiKey, model || 'gemini-2.5-flash', rawMarkdown, techSignatures);
    }
  }

  const openAIKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!forceBasic && openAIKey) {
    return await callOpenAI(openAIKey, 'gpt-4o-mini', rawMarkdown, techSignatures);
  } else if (!forceBasic && anthropicKey) {
    return await callAnthropic(anthropicKey, 'claude-3-5-sonnet-20241022', rawMarkdown, techSignatures);
  } else {
    return localMockCompile(rawMarkdown, techSignatures);
  }
}

function generateSystemPrompt(techSignatures: TechSignature[]): string {
  const signaturesText = techSignatures.length > 0
    ? techSignatures.map(sig => `- **${sig.packageName} (v${sig.latestVersion})**: ${sig.architecturalInvariant}`).join('\n')
    : '- Maintain standard baseline conventions.';

  return `You are an expert prompt architect and context compiler for 2026 AI IDEs.
Your job is to take raw, chaotic software specifications and compile them into a prompt-optimized context matrix (the Compiled Agent Pack).

You MUST structure your response as a single unified Markdown text stream. You will write the contents of multiple files sequentially. Every file MUST be opened with a start marker and closed with an end marker. Do NOT wrap your output in a JSON object, use quotes, or include markdown wrapper fences around the overall stream.

Use the exact format shown below for the markers (the path names must match exactly):

--- START FILE: AGENTS.md ---
(Content for AGENTS.md)
--- END FILE: AGENTS.md ---

--- START FILE: CLAUDE.md ---
(Content for CLAUDE.md)
--- END FILE: CLAUDE.md ---

--- START FILE: phases.md ---
(Content for phases.md)
--- END FILE: phases.md ---

--- START FILE: README.md ---
(Content for README.md)
--- END FILE: README.md ---

--- START FILE: .cursor/rules/ui-theme.mdc ---
(Content for the ui-theme.mdc rule)
--- END FILE: .cursor/rules/ui-theme.mdc ---

--- START FILE: .cursor/rules/logic-api.mdc ---
(Content for the logic-api.mdc rule)
--- END FILE: .cursor/rules/logic-api.mdc ---

### Ground Truth Grounding Data (Live Tech Resolutions):
${signaturesText}

### Strict YAML Frontmatter Rules for ".cursor/rules/*.mdc" files:
1. Every \`.mdc\` file MUST start with a raw YAML frontmatter block delimited by triple dashes \`---\`.
2. Do NOT wrap the YAML block or the document in markdown code block fences (e.g. do not write \`\`\`yaml or \`\`\`). Triple dashes must be the absolute first characters on line 1.
3. The frontmatter block must contain exactly these three fields:
   - \`description\`: A clear, descriptive string explaining when the rule applies.
   - \`globs\`: An array of glob string patterns mapping the rule to targeted directory paths.
   - \`alwaysApply\`: Set to \`false\`.
4. Example structure:
---
description: Enforces the UI theme, aesthetics, and layout parameters
globs: ["src/components/**/*", "src/app/**/*.tsx"]
alwaysApply: false
---
# React UI rules...
5. **Crossover Domain Rule Files:** If the specification describes a system combining multiple SaaS archetypes or business domains (e.g., a B2B HealthTech clinic portal, or an AI-powered Fintech ledger), you MUST generate separate, dedicated, and scoped \`.mdc\` files for each domain (e.g., both \`.cursor/rules/tenant-rules.mdc\` and \`.cursor/rules/hipaa-rules.mdc\` for a B2B HealthTech CRM), each using its own targeted file path patterns in the \`globs\` array.

### Specific Instructions for "README.md" (The System North Star):
- Establish the business domain and user context.
- **Section 1: Product Thesis & Vision**: Outline the high-level application vision, why this project exists, and the core problem it solves (derived from the notes).
- **Section 2: Core Functional Pillars**: List the launch execution vectors (pillars) to protect product scope boundaries.
- **Section 3: Ubiquitous Domain Vocabulary**: A markdown table mapping Human Term | Code Property (standardized camelCase) | Context Definition to ensure naming uniformity across the codebase (e.g. mapping human term "Ticker" to code property "ticker", "Average Cost" to "averagePrice", etc. depending on notes).
- **Section 4: Context Matrix Directory Map**: Direct pointers to scoped context files (e.g., AGENTS.md for constitutions, CLAUDE.md for CLI flags, docs/phases.md for checking tasks, and README.md for System North Star). **DO NOT** list the whole file directory tree here.
- **Crossover Alignment:** If the project is a crossover (e.g., B2B HealthTech), synthesize a cohesive thesis and vocabulary that reflects both domains (e.g., including both clinical/patient domain terms and tenant/billing/workspace domain terms in the vocabulary table).

### Specific Instructions for "AGENTS.md" (The Constitution):
- Focus strictly on high-level stack declarations, global constraints, coding philosophies (e.g. Karpathy simplicity guidelines), and absolute constraints (e.g. no clerk auth, no database write permissions).
- **DO NOT** dump database schemas or TypeScript types here—agents read the files directly.
- **Compliance Guardrails:** Auto-inject authoritative compliance directives based on the application domain. For B2B/SaaS, include SOC2 rules (omitting internal stack traces from responses). For HealthTech, include HIPAA Security Rules (routing PHI through audit-logging brokers). For FinTech, include PCI-DSS Directives (prohibiting raw card or token storage in logs).

### Specific Instructions for "CLAUDE.md" (CLI Runtime Executive):
- List explicit safe commands for starting the dev server, building, linting, and testing.

### Specific Instructions for "phases.md" (The State Roadmap):
- Create a clean 5-phase project roadmap. Use checkboxes (\`- [ ]\`). Do not pre-check any checkboxes by default.

### Specific Instructions for Path-Scoped Rules under "cursorRules" (The Context Scalpels):
- **.cursor/rules/ui-theme.mdc:**
  - Content: Define aesthetic constraints based on the notes (e.g. true-black Bloomberg terminal for finance notes; clean sterile layouts with banners for medical; green earthy layouts for agriculture). Include a strict rule: "Never write calculation/business logic in UI components; delegate to service layers."
- **.cursor/rules/logic-api.mdc (Rename filename in starter/end markers if appropriate, e.g. ".cursor/rules/finance-api.mdc", ".cursor/rules/ledger-rules.mdc", ".cursor/rules/systems-api.mdc"):**
  - Content: Define core system logic invariants (e.g. mock swappability checking \`NEXT_PUBLIC_USE_MOCK_DATA\`, calculations precision, external service boundaries, database protocols).

### Strict Coding Style Rules to AUTO-INJECT into AGENTS.md and MDC files:
1. **DRY (Don't Repeat Yourself) & KISS (Keep It Simple, Stupid):** Explicitly command the agent to prefer "vanilla over clever." Forbid premature optimization, deeply nested conditional structures, duplicate helper logic, and unnecessary abstractions. Maintain extreme readability.
2. **SOLID Design Principles:** Enforce functional, single-responsibility modules, open-closed behavior where applicable, interface separation, and dependency inversion.
3. **YAGNI (You Aren't Gonna Need It):** Prohibit writing speculative boilerplate code or future-proofing implementations that are not requested by the current specifications.
4. **JSDoc Parameter Documentation:** Command the agent to maintain detailed JSDoc parameter, return type, and description comments on all helper functions and exported utility modules.
5. **Context Budgets:** Force task scoping: "If a task requires modifying more than 3 modules or 60 seconds of manual context navigation, halt and demand user clarification."
6. **No Placeholders:** Strictly prohibit leaving commented placeholders, stub functions, incomplete implementations, or TODO lines in any generated code. All outputs must represent complete, implementable codebase scaffolding files.`;
}

async function callOpenAI(apiKey: string, model: string, markdown: string, techSignatures: TechSignature[]): Promise<CompiledPack> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: 'system',
          content: generateSystemPrompt(techSignatures)
        },
        {
          role: 'user',
          content: `Compile these raw specs into the Karpathy-style Software 3.0 context matrix:\n\n${markdown}`
        }
      ]
    })
  });

  if (!response.ok) {
    let errorText = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorText = errJson.error.message;
      }
    } catch {}
    throw new Error(`OpenAI compilation failed: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned an empty response');
  }
  return parseMarkdownStream(content);
}

async function callAnthropic(apiKey: string, model: string, markdown: string, techSignatures: TechSignature[]): Promise<CompiledPack> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 4000,
      system: generateSystemPrompt(techSignatures),
      messages: [
        {
          role: 'user',
          content: `Compile these raw specs into the Karpathy-style Software 3.0 context matrix:\n\n${markdown}`
        }
      ]
    })
  });

  if (!response.ok) {
    let errorText = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorText = errJson.error.message;
      }
    } catch {}
    throw new Error(`Anthropic compilation failed: ${errorText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) {
    throw new Error('Anthropic returned an empty response');
  }
  return parseMarkdownStream(text);
}

async function callGemini(apiKey: string, model: string, markdown: string, techSignatures: TechSignature[]): Promise<CompiledPack> {
  const systemPrompt = generateSystemPrompt(techSignatures);
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Compile these raw specs into the Karpathy-style Software 3.0 context matrix:\n\n${markdown}`
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          {
            text: systemPrompt
          }
        ]
      },
      generationConfig: {
        responseMimeType: 'text/plain'
      }
    })
  });

  if (!response.ok) {
    let errorText = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorText = errJson.error.message;
      }
    } catch {}
    throw new Error(`Gemini compilation failed: ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return parseMarkdownStream(text);
}

function localMockCompile(rawMarkdown: string, techSignatures: TechSignature[]): CompiledPack {
  const titleMatch = rawMarkdown.match(/^#\s+(.+)$/m);
  const projectName = titleMatch ? titleMatch[1].trim() : 'Project Auxo';


  const signaturesText = techSignatures.length > 0
    ? techSignatures.map(sig => `- **${sig.packageName} (v${sig.latestVersion})**: ${sig.architecturalInvariant}`).join('\n')
    : '- Default framework rules apply.';

  const rawLower = rawMarkdown.toLowerCase();

  // 1. B2B Multi-Tenant CRUD / CRM / ATS
  const isB2BCrm = /crm|ats|pipeline|tenant|workspace|b2b|hr|lead|customer/i.test(rawLower);
  // 2. AI Wrapper / Vector Search / LLM Tool
  const isAIWrapper = /openai|anthropic|gemini|llm|vector|rag|embedding|pinecone|agent/i.test(rawLower);
  // 3. Two-Sided Marketplace / Directory
  const isMarketplace = /marketplace|directory|booking|job board|hire|vendor|renter|platform/i.test(rawLower);
  // 4. FinTech / Micro-Billing / Ledger Engine
  const isFintech = /invoice|billing|ledger|crypto|wallet|accounting|tax|payout/i.test(rawLower);
  // 5. Developer Tool / API Service / High-Volume Analytics
  const isDevTool = /analytics|telemetry|api|webhook|logging|sdk|monitoring|clickhouse/i.test(rawLower);
  // 6. HealthTech / Patient / Client Portal
  const isHealthTech = /medical|patient|health|clinic|hipaa|therapy|doctor/i.test(rawLower);
  // 7. Content Engine / Headless CMS / Newsletter Platform
  const isContentEngine = /cms|blog|newsletter|markdown|course|education|subscribers/i.test(rawLower);
  // 8. Multi-Device Local-First App / Sync Engine
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

  // Standard base UI rules frontmatter
  let uiThemeRulesContent = `---
description: General UI layout parameters and styling theme guidelines
globs: ["src/components/**/*", "src/app/**/*.tsx"]
alwaysApply: false
---
# UI Theme Guidelines
- Layout: Use CSS-first layout rules using Tailwind CSS variables.
- Accessibility: Apply standard semantic tags and ARIA descriptors.
- Error Boundaries: Ensure user interfaces wrap client nodes in local error catch modules.`;

  // Define dynamic logic rules targeting crossovers:
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

  // If no specific logic rule matched, add the generic default rule file:
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

  // Save compiled UI theme content
  cursorRules['ui-theme.mdc'] = uiThemeRulesContent;

  // Configure AI-Optimized README / System North Star dynamic content
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
    // General default
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
    cursorRules
  };
}

function parseMarkdownStream(stream: string): CompiledPack {
  const pack: CompiledPack = {
    agentsMd: '',
    claudeMd: '',
    phasesMd: '',
    readmeMd: '',
    cursorRules: {}
  };

  if (!stream) return pack;

  const lines = stream.split('\n');
  let currentFile: string | null = null;
  let fileLines: string[] = [];

  for (const line of lines) {
    const startMatch = line.match(/^---\s*START\s*FILE:\s*(.+?)\s*---$/i);
    const endMatch = line.match(/^---\s*END\s*FILE:\s*(.+?)\s*---$/i);

    if (startMatch) {
      if (currentFile && fileLines.length > 0) {
        // Save previously active file context if nested/cut-off start is hit
        saveFileContent(pack, currentFile, fileLines.join('\n').trim());
      }
      currentFile = startMatch[1].trim();
      fileLines = [];
    } else if (endMatch) {
      if (currentFile) {
        saveFileContent(pack, currentFile, fileLines.join('\n').trim());
      }
      currentFile = null;
      fileLines = [];
    } else {
      if (currentFile !== null) {
        fileLines.push(line);
      }
    }
  }

  // Handle case where stream ended before final end marker (e.g. truncated)
  if (currentFile && fileLines.length > 0) {
    saveFileContent(pack, currentFile, fileLines.join('\n').trim());
  }

  return pack;
}

export function cleanMdcRuleContent(content: string): string {
  let cleaned = content.trim();

  // Strip wrapping markdown code blocks if the entire content is wrapped
  if (cleaned.startsWith('```yaml')) {
    cleaned = cleaned.replace(/^```yaml\n/, '').replace(/\n```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n/, '').replace(/\n```$/, '').trim();
  }

  // Check if it starts with the frontmatter triple dashes
  if (!cleaned.startsWith('---')) {
    // If it doesn't start with ---, but contains a heading (#) later,
    // let's try to extract the YAML block and wrap it with ---.
    const headingIndex = cleaned.search(/^#/m);
    if (headingIndex > 0) {
      let yamlPart = cleaned.substring(0, headingIndex).trim();
      const markdownPart = cleaned.substring(headingIndex).trim();

      yamlPart = yamlPart.replace(/```yaml|```/g, '').trim();
      cleaned = `---\n${yamlPart}\n---\n\n${markdownPart}`;
    } else {
      cleaned = `---\ndescription: Cursor rules\nglobs: ["*"]\nalwaysApply: false\n---\n\n${cleaned}`;
    }
  }

  // Now ensure the first frontmatter block has alwaysApply: false
  const parts = cleaned.split('---');
  if (parts.length >= 3) {
    let frontmatter = parts[1];
    frontmatter = frontmatter.replace(/```yaml|```/g, '').trim();
    
    if (frontmatter.includes('alwaysApply:')) {
      frontmatter = frontmatter.replace(/alwaysApply\s*:\s*(true|false)/g, 'alwaysApply: false');
    } else {
      frontmatter += '\nalwaysApply: false';
    }

    const rest = parts.slice(2).join('---').trim();
    cleaned = `---\n${frontmatter}\n---\n\n${rest}`;
  }

  return cleaned;
}

function saveFileContent(pack: CompiledPack, filename: string, content: string) {
  if (filename === 'AGENTS.md') {
    pack.agentsMd = content;
  } else if (filename === 'CLAUDE.md') {
    pack.claudeMd = content;
  } else if (filename === 'phases.md') {
    pack.phasesMd = content;
  } else if (filename === 'README.md') {
    pack.readmeMd = content;
  } else if (filename.startsWith('.cursor/rules/')) {
    const ruleName = filename.replace('.cursor/rules/', '');
    pack.cursorRules[ruleName] = cleanMdcRuleContent(content);
  } else {
    pack.cursorRules[filename] = cleanMdcRuleContent(content);
  }
}
