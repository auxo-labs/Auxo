import { CompiledPack } from './types';

/**
 * Sanitizes and formats the raw MDC Cursor rules, guaranteeing standard YAML frontmatter tags.
 *
 * @param content - Parsed raw markdown rules segment.
 * @returns Re-formatted Cursor rules string.
 */
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

/**
 * Maps single file segments parsed from the markdown stream back into the target CompiledPack object.
 *
 * @param pack - Accumulating CompiledPack instance.
 * @param filename - Parsed destination filename.
 * @param content - Extracted textual content.
 */
export function saveFileContent(pack: CompiledPack, filename: string, content: string): void {
  // Clean filename: trim, remove leading slashes/spaces, and strip wrapping quotes or backticks
  const cleanName = filename.trim()
    .replace(/^[\/\\\s]+/, '')
    .replace(/^["'`]|["'`]$/g, '')
    .trim();

  if (cleanName === 'AGENTS.md') {
    pack.agentsMd = content;
  } else if (cleanName === 'CLAUDE.md') {
    pack.claudeMd = content;
  } else if (cleanName === 'phases.md') {
    pack.phasesMd = content;
  } else if (cleanName === 'README.md') {
    pack.readmeMd = content;
  } else if (cleanName.includes('rules/')) {
    // Resilient extract of ruleName to support .cursor/rules/, cursor/rules/, or rules/
    const ruleName = cleanName.split('rules/').pop() || cleanName;
    pack.cursorRules[ruleName.trim()] = cleanMdcRuleContent(content);
  } else {
    pack.cursorRules[cleanName] = cleanMdcRuleContent(content);
  }
}

/**
 * Parses sequential Markdown blocks using START/END filename boundaries markers.
 *
 * @param stream - Full text return stream from LLM response.
 * @returns Clean parsed CompiledPack files list.
 */
export function parseMarkdownStream(stream: string): CompiledPack {
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
    const trimmedLine = line.trim();
    const startMatch = trimmedLine.match(/^---\s*START\s*FILE:\s*(.+?)\s*---$/i);
    const endMatch = trimmedLine.match(/^---\s*END\s*FILE:\s*(.+?)\s*---$/i);

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
        // Strip trailing carriage returns to support standard CRLF lines
        fileLines.push(line.replace(/\r$/, ''));
      }
    }
  }

  // Handle case where stream ended before final end marker (e.g. truncated)
  if (currentFile && fileLines.length > 0) {
    saveFileContent(pack, currentFile, fileLines.join('\n').trim());
  }

  return pack;
}
