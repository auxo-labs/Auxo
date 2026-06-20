import { compilePromptPack, cleanMdcRuleContent } from '../src/lib/prompt-compiler';
import { resolveTechStack } from '../src/lib/tech-resolver';
import * as fs from 'fs';
import * as path from 'path';

const crossoverNotes = `# CareWorkspace Clinic Portal
A B2B HIPAA compliant patient portal with tenant workspace isolation and medical doctor logging.
We are using next and tailwindcss and @supabase/supabase-js.

Requirements:
- Tenant separation using tenant_id.
- Clinic workspace dashboards.
- Patient history tracking.
`;

async function run() {
  console.log("Running compilation tests...");

  // Resolve signatures
  const signatures = await resolveTechStack(crossoverNotes);
  console.log("Resolved Signatures:", signatures);

  // Compile basic
  const basicPack = await compilePromptPack(crossoverNotes, signatures, true);
  console.log("Basic Pack Compiled!");

  // Output directories
  const outDir = path.join(__dirname, 'crossover-basic-pack');
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

  // Clear rules directory first to remove old ones
  const files = fs.readdirSync(rulesDir);
  for (const file of files) {
    fs.unlinkSync(path.join(rulesDir, file));
  }

  for (const [name, content] of Object.entries(basicPack.cursorRules)) {
    fs.writeFileSync(path.join(rulesDir, name), content);
  }

  console.log(`Basic Pack files written to tests/crossover-basic-pack/`);

  // Try to load env variables from .env.local manually if not present
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

  if (geminiKey) {
    console.log("Running Gemini compile...");
    const userConfig = {
      provider: 'gemini' as const,
      model: 'gemini-2.5-flash',
      apiKey: geminiKey
    };

    try {
      const llmPack = await compilePromptPack(crossoverNotes, signatures, false, userConfig);
      console.log("LLM Pack Compiled successfully!");

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

      // Clear old rules
      const llmFiles = fs.readdirSync(llmRulesDir);
      for (const file of llmFiles) {
        fs.unlinkSync(path.join(llmRulesDir, file));
      }

      for (const [name, content] of Object.entries(llmPack.cursorRules)) {
        fs.writeFileSync(path.join(llmRulesDir, name), content);
      }
      console.log(`LLM Pack files written to tests/crossover-llm-pack/`);
    } catch (err) {
      console.error("Gemini compilation failed:", err);
    }
  } else if (openAIKey) {
    console.log("Running OpenAI compile...");
    const userConfig = {
      provider: 'openai' as const,
      model: 'gpt-4o-mini',
      apiKey: openAIKey
    };

    try {
      const llmPack = await compilePromptPack(crossoverNotes, signatures, false, userConfig);
      console.log("LLM Pack Compiled successfully!");

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

      // Clear old rules
      const llmFiles = fs.readdirSync(llmRulesDir);
      for (const file of llmFiles) {
        fs.unlinkSync(path.join(llmRulesDir, file));
      }

      for (const [name, content] of Object.entries(llmPack.cursorRules)) {
        fs.writeFileSync(path.join(llmRulesDir, name), content);
      }
      console.log(`LLM Pack files written to tests/crossover-llm-pack/`);
    } catch (err) {
      console.error("OpenAI compilation failed:", err);
    }
  } else {
    console.log("No GEMINI_API_KEY or OPENAI_API_KEY found in process environment or .env.local. Skipping LLM compile.");
  }

  // Run Sanitizer Test on LLM-pack-1 rules
  console.log("Running sanitizer verification tests...");
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
          console.log(`Sanitized: ${file} written to tests/sanitized-LLM-pack-1/.cursor/rules/`);
        }
      }
    }
  } else {
    console.log("LLM-pack-1 folder not found, skipping sanitizer check.");
  }
}

run().catch(console.error);
