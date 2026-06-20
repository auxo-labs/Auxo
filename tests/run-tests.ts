import { compilePromptPack, cleanMdcRuleContent } from '../src/lib/prompt-compiler';
import { resolveTechStack } from '../src/lib/tech-resolver';
import * as fs from 'fs';
import * as path from 'path';

const b2bHealthTechNotes = `# CareWorkspace Clinic Portal
A B2B HIPAA compliant patient portal with tenant workspace isolation and medical doctor logging.
We are using next and tailwindcss and @supabase/supabase-js.

Requirements:
- Tenant separation using tenant_id.
- Clinic workspace dashboards.
- Patient history tracking.
`;

const healthTechFinTechNotes = `# ClaimFlow Medical Billing
A HIPAA compliant medical billing system and claims ledger for doctors.
Enforces strict accounting audits and card processing checks.
We are using next and tailwindcss.

Requirements:
- PHI data isolation.
- Ledger ledger balance checks.
- Invoice credit card billing validations.
`;

const b2bFinTechNotes = `# BizLedger Enterprise Gateway
A B2B multi-tenant enterprise billing and double-entry ledger platform.
We are using next and tailwindcss and @supabase/supabase-js.

Requirements:
- Tenant workspace isolation.
- Double-entry balance zero-sum check.
- SOC2 compliant invoicing.
`;

async function compileAndWriteBasic(scenarioName: string, notes: string, folderName: string) {
  console.log(`\n--- Compiling basic pack for: ${scenarioName} ---`);
  const signatures = await resolveTechStack(notes);
  const basicPack = await compilePromptPack(notes, signatures, true);

  const outDir = path.join(__dirname, folderName);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  fs.writeFileSync(path.join(outDir, 'README.md'), basicPack.readmeMd);
  fs.writeFileSync(path.join(outDir, 'AGENTS.md'), basicPack.agentsMd);
  fs.writeFileSync(path.join(outDir, 'CLAUDE.md'), basicPack.claudeMd);
  fs.writeFileSync(path.join(outDir, 'phases.md'), basicPack.phasesMd);

  const rulesDir = path.join(outDir, '.cursor', 'rules');
  if (!fs.existsSync(rulesDir)) {
    fs.mkdirSync(rulesDir, { recursive: true });
  }

  // Clear old rules
  if (fs.existsSync(rulesDir)) {
    const files = fs.readdirSync(rulesDir);
    for (const file of files) {
      fs.unlinkSync(path.join(rulesDir, file));
    }
  }

  for (const [name, content] of Object.entries(basicPack.cursorRules)) {
    fs.writeFileSync(path.join(rulesDir, name), content);
    console.log(`  Rule created: ${name} (${content.length} bytes)`);
  }
  console.log(`Saved to tests/${folderName}/`);
}

async function run() {
  console.log("Running compliance and crossover compilation tests...");

  // Run the three basic crossover compiles
  await compileAndWriteBasic("B2B + HealthTech (CareWorkspace)", b2bHealthTechNotes, "crossover-b2b-healthtech-pack");
  await compileAndWriteBasic("HealthTech + FinTech (ClaimFlow)", healthTechFinTechNotes, "crossover-healthtech-fintech-pack");
  await compileAndWriteBasic("B2B + FinTech (BizLedger)", b2bFinTechNotes, "crossover-b2b-fintech-pack");

  // Load env variables if present
  if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY && fs.existsSync(path.join(__dirname, '../.env.local'))) {
    const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
    const matches = envContent.matchAll(/^([A-Z0-9_]+)\s*=\s*(.+)$/gm);
    for (const match of matches) {
      const key = match[1].trim();
      const val = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openAIKey = process.env.OPENAI_API_KEY;

  if (geminiKey || openAIKey) {
    const key = geminiKey || openAIKey;
    const provider = geminiKey ? 'gemini' as const : 'openai' as const;
    const model = geminiKey ? 'gemini-2.5-flash' : 'gpt-4o-mini';

    console.log(`\n--- Running Live LLM compile (${provider}) on B2B HealthTech ---`);
    const signatures = await resolveTechStack(b2bHealthTechNotes);
    const userConfig = { provider, model, apiKey: key };

    try {
      const llmPack = await compilePromptPack(b2bHealthTechNotes, signatures, false, userConfig);
      const llmOutDir = path.join(__dirname, 'crossover-llm-pack');
      if (!fs.existsSync(llmOutDir)) {
        fs.mkdirSync(llmOutDir, { recursive: true });
      }

      fs.writeFileSync(path.join(llmOutDir, 'README.md'), llmPack.readmeMd);
      fs.writeFileSync(path.join(llmOutDir, 'AGENTS.md'), llmPack.agentsMd);
      fs.writeFileSync(path.join(llmOutDir, 'CLAUDE.md'), llmPack.claudeMd);
      fs.writeFileSync(path.join(llmOutDir, 'phases.md'), llmPack.phasesMd);

      const llmRulesDir = path.join(llmOutDir, '.cursor', 'rules');
      if (!fs.existsSync(llmRulesDir)) {
        fs.mkdirSync(llmRulesDir, { recursive: true });
      }

      const files = fs.readdirSync(llmRulesDir);
      for (const file of files) {
        fs.unlinkSync(path.join(llmRulesDir, file));
      }

      for (const [name, content] of Object.entries(llmPack.cursorRules)) {
        fs.writeFileSync(path.join(llmRulesDir, name), content);
      }
      console.log("LLM Pack Compiled successfully and written to tests/crossover-llm-pack/");
    } catch (err) {
      console.error("LLM compile failed:", err);
    }
  } else {
    console.log("\nSkipping Live LLM compile (no keys found).");
  }

  // Run Sanitizer Test on LLM-pack-1 rules
  console.log("\nRunning sanitizer verification tests on LLM-pack-1...");
  const llmPack1Dir = path.join(__dirname, 'LLM-pack-1');
  const sanitizedOutDir = path.join(__dirname, 'sanitized-LLM-pack-1');
  
  if (fs.existsSync(llmPack1Dir)) {
    const rulesSourceDir = path.join(llmPack1Dir, '.cursor', 'rules');
    if (fs.existsSync(rulesSourceDir)) {
      const sanitizedRulesDir = path.join(sanitizedOutDir, '.cursor', 'rules');
      if (!fs.existsSync(sanitizedRulesDir)) {
        fs.mkdirSync(sanitizedRulesDir, { recursive: true });
      }
      
      const ruleFiles = fs.readdirSync(rulesSourceDir);
      for (const file of ruleFiles) {
        if (file.endsWith('.mdc')) {
          const rawContent = fs.readFileSync(path.join(rulesSourceDir, file), 'utf-8');
          const cleanedContent = cleanMdcRuleContent(rawContent);
          
          fs.writeFileSync(path.join(sanitizedRulesDir, file), cleanedContent);
          console.log(`  Sanitized: ${file}`);
        }
      }
    }
  } else {
    console.log("LLM-pack-1 folder not found, skipping sanitizer check.");
  }
}

run().catch(console.error);
