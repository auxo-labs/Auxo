'use server';

import { TechSignature } from './tech-resolver';

export interface CompiledPack {
  agentsMd: string;      // root AGENTS.md: Global taste guardrails
  claudeMd: string;      // root CLAUDE.md: CLI execution and shortcuts
  promptMd: string;      // root prompt.md: Karpathy-style AI system prompt instructing the agent to adopt a context-specific persona (e.g. Senior Software Architect & Investment Banker/Accountant/etc.) and outlining the overall project plan.
  phasesMd: string;      // root phases.md: Structured breakdown of the project plan into multiple logical phases (e.g. Planning, Scaffold, Feature implementation, Verification) with specific sub-steps.
  cursorRules: Record<string, string>; // .cursor/rules/[filename].mdc
}

/**
 * Compiles raw markdown notes into a structured CompiledPack.
 * Enforces Software 3.0 constraints, implied conventions, and resolved tech-stack signatures.
 */
export async function compilePromptPack(
  rawMarkdown: string, 
  techSignatures: TechSignature[] = []
): Promise<CompiledPack> {
  const openAIKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  try {
    if (openAIKey) {
      return await callOpenAI(openAIKey, rawMarkdown, techSignatures);
    } else if (anthropicKey) {
      return await callAnthropic(anthropicKey, rawMarkdown, techSignatures);
    } else {
      return localMockCompile(rawMarkdown, techSignatures);
    }
  } catch (error) {
    console.error('LLM Prompt compilation failed, reverting to local compiler:', error);
    return localMockCompile(rawMarkdown, techSignatures);
  }
}

function generateSystemPrompt(techSignatures: TechSignature[]): string {
  const signaturesText = techSignatures.length > 0
    ? techSignatures.map(sig => `- **${sig.packageName} (v${sig.latestVersion})**: ${sig.architecturalInvariant}`).join('\n')
    : '- Maintain standard baseline conventions.';

  return `You are an expert prompt architect and context compiler for 2026 AI IDEs.
Your job is to take raw, chaotic software specifications and compile them into a prompt-optimized context matrix.

You must return a raw JSON object matching this TypeScript interface:
{
  "agentsMd": string,  // Root AGENTS.md: Enforces simplicity, taste, contrast, context budgets
  "claudeMd": string,  // Root CLAUDE.md: Claude Code CLI permissions, tests, builds
  "promptMd": string,  // Root prompt.md: A Karpathy-style AI system prompt detailing the project's overall context, architectural decisions, and an expert persona instruction.
  "phasesMd": string,  // Root phases.md: A detailed development roadmap outlining phases and sub-steps with checkboxes.
  "cursorRules": {
    "tech-stack.mdc": string, // Scoped rule for all files (*). Defines tech stack invariants
    "api.mdc": string,       // Scoped rule for src/app/api/**/*
    "ui.mdc": string        // Scoped rule for components/styles src/components/**/*
  }
}

### Ground Truth Grounding Data (Live Tech Resolutions):
${signaturesText}

### Instructions for generating "prompt.md" (AI Session Context):
- Must start with a header block notice:
  "> Share this file at the start of every new AI session. It contains everything needed to write correct code immediately.
  > For full detail, reference the other docs in \`/docs/\` only when needed for a specific task."
- Section "What This App Is": Describe the application goals, target users, and UI style (e.g., dense terminal grids, monospaced fonts, dark aesthetics, or standard elegant flows based on notes).
- Section "AI System Persona & Role": Analyze the niche/domain of the project from the notes (e.g. stock portfolio/trading/crypto/ledgers -> "Senior Software Architect & Investment Banker", accounting/ledgers/billing/tax -> "Senior Software Architect & Accountant", farming/crop/livestock -> "Senior Software Architect & Agricultural Operations Analyst", medical/patient/clinical/hipaa -> "Senior Software Architect & Clinical Informatics Specialist", default -> "Senior Software Architect & System Designer"). Explicitly instruct the AI agent to adopt this persona, thinking like an expert in that specific industry sector, ensuring calculations are mathematically verified and compliant with industry practices.
- Section "Current Phase": Set to "Phase 1: Planning and Setup".
- Section "Tech Stack (Decisions are Final)": List resolved NPM packages, framework details, state management, and CSS configurations.
- Section "Pages & Routes": A markdown table of page paths and their purpose.
- Section "TypeScript Types (Source of Truth)": Standard baseline TypeScript types/interfaces representing the core domain models derived from raw notes.
- Section "Key File Locations": Tree representation of directories and files.
- Section "Architectural Rules (Must Follow)": Explicit lists of codebase architecture boundaries (e.g., "No business logic in components", "All types live in types/", "All API calls go through services/").
- Section "Key Environment Variables": Bash block of required environment variables.
- Section "Reference Docs": Markdown table linking files (e.g., docs/phases.md, docs/api_contracts.md, etc.) and when to read them.

### Instructions for generating "phases.md" (Development Phases):
- Standardized multi-phase format using checkboxes.
- Must include:
  - **Phase 1: Planning and Setup** (with sub-steps for docs, dependencies, config)
  - **Phase 2: Core UI Scaffold & Theming** (with layout, provider, and navigation sub-steps)
  - **Phase 3: State Management & Mock Prototype Logic** (with types, stores, mock data, primitives sub-steps)
  - **Phase 4: Core Implementation & Real Data Integration** (with API services, endpoints, integration sub-steps)
  - **Phase 5: Verification, Polish & Stability** (with testing, fixing edge-cases, linter audits)
- Mark completed initial steps as complete (e.g., with ✅ COMPLETE or [x] checkboxes for Step 1.1 / Phase 1 setup if they were already described in raw notes, or leave as [ ] if they are future work).

### Strict Coding Style Rules to AUTO-INJECT into AGENTS.md and MDC files:
1. **DRY & KISS:** Explicitly command the agent to prefer "vanilla over clever." Forbid premature optimization, deeply nested conditions, and excessive abstractions.
2. **SOLID Conventions:** Require functional, single-responsibility modules.
3. **JSDoc Documentation:** Command the agent to maintain clean JSDoc parameter documentation on all utility exports.
4. **Context Budgets:** Force task scoping: "If a task requires modifying more than 3 modules or 60 seconds of manual context navigation, halt and demand clarification."
5. **No Placeholders:** Prohibit leaving commented placeholders, incomplete functions, or TODO notes in generated code.

### Frontmatter Rules:
- All values in "cursorRules" MUST start with YAML frontmatter specifying "description" and "globs".
- "tech-stack.mdc" should target globs: "*".
- "api.mdc" should target globs: "src/app/api/**/*".
- "ui.mdc" should target globs: "src/components/**/*".`;
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
      response_format: { type: 'json_object' },
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
  return JSON.parse(content);
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
      system: `${generateSystemPrompt(techSignatures)}
Do not wrap your response in markdown code blocks like \`\`\`json, return only raw JSON.`,
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
  const cleanJsonText = text.replace(/^[^{]*/, '').replace(/[^}]*$/, '');
  return JSON.parse(cleanJsonText);
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

## Core Directives (Karpathy Simplicity Guardrails)
1. **ENFORCE SIMPLICITY:** Prefer "vanilla over clever." Forbid premature optimization, deeply nested conditions, and excessive abstractions. Keep it readable.
2. **EXPLICIT CONTRAST:** Prioritize using existing styling tokens, CSS classes, and UI primitives instead of inventing new component layouts.
3. **CONTEXT BUDGETS:** Force task scoping. If a task requires modifying more than 3 modules or 60 seconds of manual context navigation, halt and demand clarification.
4. **CODE QUALITY STANDARDS:** Adhere to DRY, SOLID principles. All exports must feature clean JSDoc parameter documentation. No incomplete placeholders or TODO comments are allowed.

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

  // Determine industry context/persona based on rawMarkdown keywords
  let persona = 'Senior Software Architect & System Designer';
  let targetIndustry = 'General Web Application';
  let projectGoal = 'Build a scalable, robust, and simplicity-aligned application workspace.';
  let uiStyle = 'Minimalist modern workspace, clean visual layout components, typography styling.';
  let envCode = `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key`;
  let typesCode = `interface DataModel {
  id: string;
  name: string;
  createdAt: string;
}`;
  let fileTreeCode = `src/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── ui/
│       └── Button.tsx
├── lib/
│   └── utils/
│       └── cn.ts
└── types/
    └── index.ts`;
  let rulesCode = `1. **No business logic in components.** Maintain pure rendering modules.
2. **All types live in \`src/types/\`.** Avoid inline typescript declarations.
3. **No Placeholders.** Ensure code generation is complete.`;

  const rawLower = rawMarkdown.toLowerCase();
  if (/crypto|stock|portfolio|trade|finance|wealth|broker/i.test(rawLower)) {
    persona = 'Senior Software Architect & Investment Banker';
    targetIndustry = 'Financial Technology & Asset Management';
    projectGoal = 'Build a real-time Bloomberg-terminal-style portfolio tracker and analytical canvas for crypto and stocks.';
    uiStyle = 'High-density Bloomberg Terminal aesthetic: true-black theme, neon accents (#10B981 green, #F59E0B amber), monospaced fonts, dense HTML data tables.';
    envCode = `NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_USE_MOCK_DATA=true`;
    typesCode = `interface Holding {
  ticker: string;
  name: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  pnlValue: number;
  pnlPercent: number;
  totalValue: number;
}

interface MarketSnapshot {
  symbol: string;
  label: string;
  price: number;
  change: number;
  changePercent: number;
  asOf: string;
}`;
    fileTreeCode = `src/
├── app/
│   ├── layout.tsx
│   └── dashboard/
│       └── page.tsx
├── components/
│   ├── dashboard/
│   │   ├── HoldingsTable.tsx
│   │   └── MacroPillars.tsx
│   └── ui/
│       ├── Table.tsx
│       └── Badge.tsx
├── lib/
│   ├── services/
│   │   └── yahooFinance.service.ts
│   └── utils/
│       └── formatters.ts
└── types/
    └── holdings.ts`;
    rulesCode = `1. **No business logic in components.** Components render data; parsing and calculation reside in services.
2. **True-black theme.** Styling must adhere strictly to dense, dark, monospaced layout contracts.
3. **Mock Switch.** positions and rates must honor NEXT_PUBLIC_USE_MOCK_DATA flags.`;
  } else if (/account|billing|invoice|ledger|audit|tax/i.test(rawLower)) {
    persona = 'Senior Software Architect & Certified Public Accountant';
    targetIndustry = 'Accounting, Invoicing & Financial Operations';
    projectGoal = 'Build a high-integrity ledger system enforcing auditability, double-entry safety, and transaction logging.';
    uiStyle = 'Sober, high-contrast grid layouts. Clear tabular ledger books, strict alignment, distinct status colors for unpaid/overdue.';
    envCode = `DATABASE_URL=postgres://...
ENCRYPTION_SECRET=your_key`;
    typesCode = `interface TransactionEntry {
  id: string;
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  description: string;
}

interface LedgerAccount {
  id: string;
  code: string;
  name: string;
  balance: number;
}`;
    fileTreeCode = `src/
├── app/
│   ├── layout.tsx
│   └── ledger/
│       └── page.tsx
├── components/
│   ├── ledger/
│   │   └── LedgerGrid.tsx
│   └── ui/
│       └── Table.tsx
├── lib/
│   └── ledger-engine/
│       └── doubleEntry.ts
└── types/
    └── ledger.ts`;
    rulesCode = `1. **Double-Entry Integrity.** Debits and Credits must balance to zero before transaction commits.
2. **Immutable Entries.** Transactions can only be appended, never deleted or updated. Restorations require reversing transactions.`;
  } else if (/pipeline|kafka|parquet|cron|worker|postgres|clickhouse|backend/i.test(rawLower)) {
    persona = 'Senior Systems Architect & Principal Database Engineer';
    targetIndustry = 'High-Performance Backend Data Systems';
    projectGoal = 'Build an optimized backend ingestion engine with stream-processing safety and ClickHouse caching.';
    uiStyle = 'Command-line execution parameters, status logs, database latency charts, performance monitoring gauges.';
    envCode = `POSTGRES_PRISMA_URL=...
CLICKHOUSE_HOST=...
KAFKA_BROKERS=...`;
    typesCode = `interface DataPipelineJob {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  recordsProcessed: number;
  startedAt: string;
}

interface IngestionEvent {
  topic: string;
  partition: number;
  offset: number;
  payload: string;
}`;
    fileTreeCode = `src/
├── bin/
│   └── worker.ts
├── lib/
│   ├── database/
│   │   ├── clickhouse.ts
│   │   └── postgres.ts
│   └── streams/
│       └── kafka.ts
└── types/
    └── pipeline.ts`;
    rulesCode = `1. **Zero Client Components.** Strict prohibition of writing frontend/React files.
    2. **Batching Commits.** Ingestion events must pool and batch commit to ClickHouse in thresholds of 1000 records or 5 seconds.`;
  } else if (/medical|health|patient|clinic|doctor|pharmacy/i.test(rawLower)) {
    persona = 'Senior Software Architect & Medical Software Consultant';
    targetIndustry = 'Healthcare & Patient Management Systems';
    projectGoal = 'Build a HIPAA-compliant medical patient tracking workspace prioritizing data privacy and secure session tracking.';
    uiStyle = 'Clean, distraction-free medical aesthetics. High contrast, readable sans-serif typography, patient emergency banners.';
    envCode = `PATIENT_ENCRYPTION_KEY=...
HIPAA_AUDIT_LOG_URL=...`;
    typesCode = `interface PatientRecord {
  id: string;
  encryptedNhsNo: string;
  name: string;
  dob: string;
  allergies: string[];
}

interface AuditLog {
  userId: string;
  action: 'READ' | 'WRITE' | 'EXPORT';
  timestamp: string;
}`;
    fileTreeCode = `src/
├── app/
│   └── patients/
│       └── page.tsx
├── components/
│   └── PatientBanner.tsx
├── lib/
│   ├── security/
│   │   └── encryptor.ts
│   └── services/
│       └── patient.service.ts
└── types/
    └── clinical.ts`;
    rulesCode = `1. **HIPAA Logging.** Every read access to patient records must append to the HIPAA audit logs.
2. **Encryption at Rest.** Patient identity strings must always be parsed via encryptor functions.`;
  } else if (/farm|agriculture|crop|plant|soil|weather/i.test(rawLower)) {
    persona = 'Senior Software Architect & Agricultural Operations Analyst';
    targetIndustry = 'Agricultural Operations & Sensor Analytics';
    projectGoal = 'Build an IoT agricultural field sensor monitor and harvest prediction analyzer.';
    uiStyle = 'Earthy tones, dense field telemetry tables, weather-sensitive indicators, crop moisture indicators.';
    envCode = `IOT_SENSOR_API_KEY=...
WEATHER_SERVICE_URL=...`;
    typesCode = `interface FieldTelemetry {
  fieldId: string;
  soilMoisturePercent: number;
  ambientTempCelsius: number;
  nitrogenLevel: number;
  recordedAt: string;
}

interface CropYieldProjection {
  cropType: string;
  projectedHarvestTons: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}`;
    fileTreeCode = `src/
├── app/
│   └── fields/
│       └── page.tsx
├── components/
│   └── SensorGrid.tsx
├── lib/
│   └── analytics/
│       └── harvestEngine.ts
└── types/
    └── agriculture.ts`;
    rulesCode = `1. **Sensor Fallback.** Sensor telemetry data must fall back to moving averages if sensor heartbeat is missing.
2. **Decimal Precision.** Soil metrics must maintain float rounding values (precisions up to 2 decimal spaces).`;
  }

  const promptMd = `# ${projectName} — AI Session Context

> Share this file at the start of every new AI session. It contains everything needed to write correct code immediately.
> For full detail, reference the other docs in \`/docs/\` only when needed for a specific task.

---

## What This App Is
A zero-auth, real-time workspace focused on the following domain logic:
${projectGoal}

The interface aesthetic matches:
- **UI Styling:** ${uiStyle}

---

## AI System Persona & Role
- **Role:** You are acting as a **${persona}**.
- **Industry Context:** ${targetIndustry}
- **Mindset:** You write production-grade, highly optimized code. You understand the business implications, regulatory requirements, and engineering taste required for ${targetIndustry}. Always double-check calculations and safety bounds.

---

## Current Phase
Phase 1 (Planning and Setup)

---

## Tech Stack (Decisions are Final)
- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS v4 configured natively inside global stylesheets
- **State**: Zustand / local storage indicators
- **Sync**: Supabase Transient Realtime (Broadcast and Presence)

---

## Pages & Routes
| Route | Purpose |
| :--- | :--- |
| \`/\` | Main entry point / dashboard layout |
| \`/room/[id]\` | Sub-niche workspace viewport |

---

## TypeScript Types (Source of Truth)
\`\`\`typescript
${typesCode}
\`\`\`

---

## Key File Locations
\`\`\`text
${fileTreeCode}
\`\`\`

---

## Architectural Rules (Must Follow)
${rulesCode}

---

## Key Environment Variables
\`\`\`bash
${envCode}
\`\`\`

---

## Reference Docs
| File | Read When... |
| :--- | :--- |
| \`docs/phases.md\` | Planning next steps or checking what's done |
| \`docs/overview.md\` | Reviewing the core architecture guidelines |`;

  const phasesMd = `# ${projectName} — Development Phases

## Phase 1: Planning and Setup ✅ COMPLETE
- [x] Create project documentation (\`docs/\` folder).
- [x] Scaffold Next.js application workspace.
- [x] Configure tailwindcss \`@theme\` design variables.
- [x] Create \`.env.local\` with credentials placeholders.

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
    'tech-stack.mdc': `---
description: Global architectural invariants and taste guidelines for the stack
globs: *
---
# Global Tech Invariants

- Language: TypeScript. Prefer clear, explicit type interfaces.
- Styles: Tailwind CSS v4 using global theme values.
- Dependency rule: Do not introduce external npm packages unless verified for security and size.`,

    'api.mdc': `---
description: Rules for modifying or creating API endpoints under api/
globs: src/app/api/**/*
---
# API Architecture Invariants

- Every API endpoint must return a structured JSON response.
- Do not use custom query wrappers; write raw database client primitives.
- **Verification Rule:** Every endpoint must pass local linter execution (\`npm run lint\`) before committing.`,

    'ui.mdc': `---
description: Scoped styling and component layouts
globs: src/components/**/*, src/app/**/*.tsx
---
# UI Component Invariants

- Layout: Use CSS-first layout rules using Tailwind CSS variables.
- Accessibility: Apply standard semantic tags and ARIA descriptors.
- Error Boundaries: Ensure user interfaces wrap client nodes in local error catch modules.`
  };

  return {
    agentsMd,
    claudeMd,
    promptMd,
    phasesMd,
    cursorRules
  };
}
