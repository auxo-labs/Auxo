'use server';

import { TechSignature } from './tech-resolver';

export interface CompiledPack {
  agentsMd: string;      // root AGENTS.md: Global taste guardrails
  claudeMd: string;      // root CLAUDE.md: CLI execution and shortcuts
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
  "agentsMd": string, // Root AGENTS.md: Enforces simplicity, taste, contrast, context budgets
  "claudeMd": string, // Root CLAUDE.md: Claude Code CLI permissions, tests, builds
  "cursorRules": {
    "tech-stack.mdc": string, // Scoped rule for all files (*). Defines tech stack invariants
    "api.mdc": string,       // Scoped rule for src/app/api/**/*
    "ui.mdc": string        // Scoped rule for components/styles src/components/**/*
  }
}

### Ground Truth Grounding Data (Live Tech Resolutions):
${signaturesText}

### Strict Coding Style Rules to AUTO-INJECT:
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

  const lines = rawMarkdown.split('\n');
  const bullets = lines
    .filter(l => l.trim().startsWith('-') || l.trim().startsWith('*'))
    .map(l => l.replace(/^[-*]\s*/, '').trim())
    .slice(0, 8);

  const bulletsText = bullets.length > 0 
    ? bullets.map(b => `- ${b}`).join('\n')
    : '- Collaborative real-time workspace\n- Custom prompt context engine';

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
    cursorRules
  };
}
