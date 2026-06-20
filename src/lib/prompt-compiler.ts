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
export async function compilePromptPack(
  rawMarkdown: string, 
  techSignatures: TechSignature[] = [],
  forceBasic = false
): Promise<CompiledPack> {
  const openAIKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (!forceBasic && openAIKey) {
    return await callOpenAI(openAIKey, rawMarkdown, techSignatures);
  } else if (!forceBasic && anthropicKey) {
    return await callAnthropic(anthropicKey, rawMarkdown, techSignatures);
  } else {
    return localMockCompile(rawMarkdown, techSignatures);
  }
}

function generateSystemPrompt(techSignatures: TechSignature[]): string {
  const signaturesText = techSignatures.length > 0
    ? techSignatures.map(sig => `- **${sig.packageName} (v${sig.latestVersion})**: ${sig.architecturalInvariant}`).join('\n')
    : '- Maintain standard baseline conventions.';

  return `You are an expert prompt architect and context compiler for 2026 AI IDEs.
Your job is to take raw, chaotic software specifications and compile them into a prompt-optimized context matrix.

You MUST structure your response as a single unified Markdown text stream. You will write the contents of multiple files sequentially. Every file MUST be opened with a start marker and closed with an end marker. Do NOT wrap your output in a JSON object or use quotes.

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

### Specific Instructions for "README.md" (The System North Star):
- Establish the business domain and user context.
- **Section 1: Product Thesis & Vision**: Outline the high-level application vision, why this project exists, and the core problem it solves (derived from the notes).
- **Section 2: Core Functional Pillars**: List the launch execution vectors (pillars) to protect product scope boundaries.
- **Section 3: Ubiquitous Domain Vocabulary**: A markdown table mapping Human Term | Code Property (standardized camelCase) | Context Definition to ensure naming uniformity across the codebase (e.g. mapping human term "Ticker" to code property "ticker", "Average Cost" to "averagePrice", etc. depending on notes).
- **Section 4: Context Matrix Directory Map**: Direct pointers to scoped context files (e.g., AGENTS.md for constitutions, CLAUDE.md for CLI flags, docs/phases.md for checking tasks, and README.md for System North Star). **DO NOT** list the whole file directory tree here.

### Specific Instructions for "AGENTS.md" (The Constitution):
- Focus strictly on high-level stack declarations, global constraints, coding philosophies (e.g. Karpathy simplicity guidelines), and absolute constraints (e.g. no clerk auth, no database write permissions).
- **DO NOT** dump database schemas or TypeScript types here—agents read the files directly.

### Specific Instructions for "CLAUDE.md" (CLI Runtime Executive):
- List explicit safe commands for starting the dev server, building, linting, and testing.

### Specific Instructions for "phases.md" (The State Roadmap):
- Create a clean 5-phase project roadmap. Use checkboxes (\`- [ ]\`). Do not pre-check any checkboxes by default.

### Specific Instructions for Path-Scoped Rules under "cursorRules" (The Context Scalpels):
- **.cursor/rules/ui-theme.mdc:**
  - Description: Start with YAML frontmatter with \`description: Enforces the UI theme, aesthetics, and layout parameters\` and \`globs: ["src/components/**/*", "src/app/**/*.tsx"]\`.
  - Content: Define aesthetic constraints based on the notes (e.g. true-black Bloomberg terminal for finance notes; clean sterile layouts with banners for medical; green earthy layouts for agriculture). Include a strict rule: "Never write calculation/business logic in UI components; delegate to service layers."
- **.cursor/rules/logic-api.mdc (Rename filename in starter/end markers if appropriate, e.g. ".cursor/rules/finance-api.mdc", ".cursor/rules/ledger-rules.mdc", ".cursor/rules/systems-api.mdc"):**
  - Description: Start with YAML frontmatter with \`description: Logic validation for services and API routing layers\` and \`globs: ["src/lib/services/**/*", "src/app/api/**/*"]\`.
  - Content: Define core system logic invariants (e.g. mock swappability checking \`NEXT_PUBLIC_USE_MOCK_DATA\`, calculations precision, external service boundaries, database protocols).

### Strict Coding Style Rules to AUTO-INJECT into AGENTS.md and MDC files:
1. **DRY (Don't Repeat Yourself) & KISS (Keep It Simple, Stupid):** Explicitly command the agent to prefer "vanilla over clever." Forbid premature optimization, deeply nested conditional structures, duplicate helper logic, and unnecessary abstractions. Maintain extreme readability.
2. **SOLID Design Principles:** Enforce functional, single-responsibility modules, open-closed behavior where applicable, interface separation, and dependency inversion.
3. **YAGNI (You Aren't Gonna Need It):** Prohibit writing speculative boilerplate code or future-proofing implementations that are not requested by the current specifications.
4. **JSDoc Parameter Documentation:** Command the agent to maintain detailed JSDoc parameter, return type, and description comments on all helper functions and exported utility modules.
5. **Context Budgets:** Force task scoping: "If a task requires modifying more than 3 modules or 60 seconds of manual context navigation, halt and demand user clarification."
6. **No Placeholders:** Strictly prohibit leaving commented placeholders, stub functions, incomplete implementations, or TODO lines in any generated code.

### Frontmatter Rules:
- All values in ".cursor/rules/*.mdc" files MUST start with YAML frontmatter specifying "description", "globs", and "alwaysApply".`;
}

async function callOpenAI(apiKey: string, markdown: string, techSignatures: TechSignature[]): Promise<CompiledPack> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
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
    throw new Error(`OpenAI compilation failed: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return parseMarkdownStream(content);
}

async function callAnthropic(apiKey: string, markdown: string, techSignatures: TechSignature[]): Promise<CompiledPack> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
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
    throw new Error(`Anthropic compilation failed: ${response.statusText}`);
  }

  const data = await response.json();
  const text = data.content[0].text;
  return parseMarkdownStream(text);
}

function localMockCompile(rawMarkdown: string, techSignatures: TechSignature[]): CompiledPack {
  const titleMatch = rawMarkdown.match(/^#\s+(.+)$/m);
  const projectName = titleMatch ? titleMatch[1].trim() : 'Project Auxo';


  const signaturesText = techSignatures.length > 0
    ? techSignatures.map(sig => `- **${sig.packageName} (v${sig.latestVersion})**: ${sig.architecturalInvariant}`).join('\n')
    : '- Default framework rules apply.';

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

  const rawLower = rawMarkdown.toLowerCase();

  // Dynamic path rules based on persona/niche context
  let uiThemeRules = '';
  let logicRules = '';
  let logicFileName = 'logic-api.mdc';

  if (/crypto|stock|portfolio|trade|finance|wealth|broker/i.test(rawLower)) {
    logicFileName = 'finance-api.mdc';
    uiThemeRules = `---
description: Enforces the high-density Bloomberg Terminal aesthetic for frontend components
globs: ["src/components/**/*", "src/app/**/*.tsx"]
---
# Bloomberg UI Styling Rules
- **Theme:** Strict true-black layout (#000000). Never use slate or zinc grays.
- **Accents:** Neon green (#10B981) for positive tickers, neon amber (#F59E0B) for warnings/neutral.
- **Typography:** Strictly monospaced layout elements, high-density HTML data tables.
- **Rule:** Never write business/calculation logic inside these components. Use services instead.`;

    logicRules = `---
description: Logic validation for data mapping and asset management API layers
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
---
# Financial Engineering Rules
- **Mock Enforcement:** Respect the \`NEXT_PUBLIC_USE_MOCK_DATA\` flag. If true, bypass external network requests and fetch mock structures instantly.
- **Calculation Integrity:** Always double-check floating-point arithmetic. Wrap currency and percentage deltas through \`src/lib/utils/formatters.ts\`.
- **Database Boundary:** Supabase connections must remain transient via Realtime Broadcast/Presence channels. No persistent stateful writes unless explicit.`;
  } else if (/account|billing|invoice|ledger|audit|tax/i.test(rawLower)) {
    logicFileName = 'ledger-rules.mdc';
    uiThemeRules = `---
description: Sober, high-contrast accounting layouts and spreadsheet grids
globs: ["src/components/**/*", "src/app/**/*.tsx"]
---
# Accounting UI Grid Rules
- **Grid Layout:** Strict column alignment, clear tabular ledger sheets.
- **Accents:** Muted colors. Unpaid is red, paid is dark emerald.
- **Rule:** Never write double-entry or ledger balancing logic inside these views. Use services.`;

    logicRules = `---
description: Double-entry auditability and balancing ledger rules
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
---
# Double-Entry Ledger Rules
- **Balance Invariant:** Debits and Credits must balance to zero before transaction commits.
- **Auditability:** Transactions can only be appended, never deleted or updated. Restorations require reversing transactions.`;
  } else if (/pipeline|kafka|parquet|cron|worker|postgres|clickhouse|backend/i.test(rawLower)) {
    logicFileName = 'systems-api.mdc';
    uiThemeRules = `---
description: System telemetry latency graphs and execution parameter aesthetics
globs: ["src/components/**/*", "src/app/**/*.tsx"]
---
# Telemetry Dashboard UI Rules
- **Visuals:** Command-line status logs, latency indicators, gauge visuals.
- **Contrast:** High contrast, clear indicators for failed worker channels.`;

    logicRules = `---
description: Kafka batching and stream-processing rules
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
---
# Ingestion Stream Rules
- **Zero Client Components:** Strict prohibition of writing frontend/React files.
- **Batching Commits:** Ingestion events must pool and batch commit to ClickHouse in thresholds of 1000 records or 5 seconds.`;
  } else if (/medical|health|patient|clinic|doctor|pharmacy/i.test(rawLower)) {
    logicFileName = 'clinical-rules.mdc';
    uiThemeRules = `---
description: Medical patient tracker safety banners and clean typography layouts
globs: ["src/components/**/*", "src/app/**/*.tsx"]
---
# Patient Safety UI Rules
- **Banners:** Patient emergency banners must be highly visible and color-coded.
- **Typography:** Highly readable sans-serif layout systems for clinical settings.`;

    logicRules = `---
description: HIPAA auditing and data encryption policies
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
---
# Clinical Data Rules
- **HIPAA Logging:** Every read access to patient records must append to the HIPAA audit logs.
- **Encryption at Rest:** Patient identity strings must always be parsed via encryptor functions.`;
  } else if (/farm|agriculture|crop|plant|soil|weather/i.test(rawLower)) {
    logicFileName = 'agriculture-rules.mdc';
    uiThemeRules = `---
description: Earthy UI theme layout parameters and sensor dials
globs: ["src/components/**/*", "src/app/**/*.tsx"]
---
# Telemetry Dashboard UI Rules
- **Theme:** Earthy tones, weather-sensitive indicators, soil moisture scales.`;

    logicRules = `---
description: Telemetry calculations and weather mappings
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
---
# Agricultural Telemetry Rules
- **Sensor Fallback:** Sensor telemetry data must fall back to moving averages if sensor heartbeat is missing.
- **Decimal Precision:** Soil metrics must maintain float rounding values (precisions up to 2 decimal spaces).`;
  } else {
    // Default general rules
    uiThemeRules = `---
description: Standard UI component styling and responsive layouts
globs: ["src/components/**/*", "src/app/**/*.tsx"]
---
# UI Component Invariants
- Layout: Use CSS-first layout rules using Tailwind CSS variables.
- Accessibility: Apply standard semantic tags and ARIA descriptors.
- Error Boundaries: Ensure user interfaces wrap client nodes in local error catch modules.`;

    logicRules = `---
description: API response standards and standard db boundaries
globs: ["src/lib/services/**/*", "src/app/api/**/*"]
---
# Logic and API Invariants
- Every API endpoint must return a structured JSON response.
- Do not use custom query wrappers; write raw database client primitives.
- **Verification Rule:** Every endpoint must pass local linter execution (\`npm run lint\`) before committing.`;
  }

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

  if (/account|billing|invoice|ledger|audit|tax/i.test(rawLower)) {
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

  const cursorRules: Record<string, string> = {
    'ui-theme.mdc': uiThemeRules,
    [logicFileName]: logicRules
  };

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
    pack.cursorRules[ruleName] = content;
  } else {
    pack.cursorRules[filename] = content;
  }
}
