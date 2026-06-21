import { describe, it, expect, vi } from 'vitest';
import { cleanMdcRuleContent, parseMarkdownStream } from '../src/lib/prompt-compiler/parser';
import { resolveTechStack } from '../src/lib/tech-resolver';
import { obfuscateKey, deobfuscateKey } from '../src/lib/encryption';

// Mock the global fetch object for registry.npmjs.org lookups in resolveTechStack tests
global.fetch = vi.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ version: '16.2.9' }),
  })
);

describe('Batch 1: Unit Tests', () => {
  
  describe('cleanMdcRuleContent()', () => {
    it('should strip markdown ```yaml wrapper fences from the frontmatter', () => {
      const input = `\`\`\`yaml
---
description: Custom test rule
globs: ["src/**/*"]
alwaysApply: true
---
# Rules content
\`\`\``;
      const result = cleanMdcRuleContent(input);
      expect(result).not.toContain('```yaml');
      expect(result).not.toContain('```');
      expect(result).toContain('alwaysApply: false'); // Enforces alwaysApply to be false
    });

    it('should inject standard frontmatter block if missing entirely', () => {
      const input = `# Only Markdown Header
Some basic logic guidelines.`;
      const result = cleanMdcRuleContent(input);
      expect(result).toContain('description: Cursor rules');
      expect(result).toContain('alwaysApply: false');
      expect(result).toContain('# Only Markdown Header');
    });

    it('should enforce alwaysApply to be false even if initially set to true', () => {
      const input = `---
description: Some rule
globs: ["*"]
alwaysApply: true
---
# Title`;
      const result = cleanMdcRuleContent(input);
      expect(result).toContain('alwaysApply: false');
      expect(result).not.toContain('alwaysApply: true');
    });
  });

  describe('parseMarkdownStream()', () => {
    it('should parse standard START and END file marker blocks correctly', () => {
      const input = `--- START FILE: README.md ---
Welcome to Auxo.
--- END FILE: README.md ---
--- START FILE: CLAUDE.md ---
npm run dev
--- END FILE: CLAUDE.md ---`;
      
      const pack = parseMarkdownStream(input);
      expect(pack.readmeMd).toBe('Welcome to Auxo.');
      expect(pack.claudeMd).toBe('npm run dev');
    });

    it('should recover and save active files if end marker is truncated or missing', () => {
      const input = `--- START FILE: README.md ---
Welcome to Auxo.`;
      
      const pack = parseMarkdownStream(input);
      expect(pack.readmeMd).toBe('Welcome to Auxo.');
    });
  });

  describe('resolveTechStack()', () => {
    it('should match keywords from raw notes and return correct invariants', async () => {
      const input = `I want to build a site using next with tailwindcss and supabase.`;
      const result = await resolveTechStack(input);

      expect(result).toHaveLength(3);
      expect(result.map(r => r.packageName)).toContain('next');
      expect(result.map(r => r.packageName)).toContain('tailwindcss');
      expect(result.map(r => r.packageName)).toContain('@supabase/supabase-js');
    });

    it('should return empty tech signature array if no packages match keywords', async () => {
      const input = `A pure python worker script doing background task pipelines.`;
      const result = await resolveTechStack(input);
      expect(result).toHaveLength(0);
    });
  });

  describe('LocalStorage Key Encryption (SEC-08)', () => {

    it('should encrypt keys to a non-plain-text representation', () => {
      const rawKey = 'sk-ant-test-key-12345';
      const obfuscated = obfuscateKey(rawKey);
      expect(obfuscated).not.toBe(rawKey);
      expect(obfuscated).not.toContain('sk-ant');
    });

    it('should correctly decrypt obfuscated keys back to plain-text', () => {
      const rawKey = 'sk-or-gemini-key-999';
      const obfuscated = obfuscateKey(rawKey);
      const decrypted = deobfuscateKey(obfuscated);
      expect(decrypted).toBe(rawKey);
    });

    it('should fall back to raw string if decrypting legacy/un-obfuscated keys', () => {
      const legacyKey = 'sk-legacy-unencrypted-key';
      const decrypted = deobfuscateKey(legacyKey);
      expect(decrypted).toBe(legacyKey);
    });
  });

});
