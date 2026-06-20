/**
 * Represents the structured multi-file matrix designed to keep agent context windows highly scoped.
 */
export interface CompiledPack {
  /**
   * Root AGENTS.md: Global senior software developer guidelines and compliance directives.
   */
  agentsMd: string;

  /**
   * Root CLAUDE.md: Claude Code native runtime CLI execution and rules.
   */
  claudeMd: string;

  /**
   * Root phases.md: Development roadmap phases and checks.
   */
  phasesMd: string;

  /**
   * Root README.md: Product thesis, vocabulary table, and directory map index.
   */
  readmeMd: string;

  /**
   * Map of filename keys (e.g. "ui-theme.mdc") to their Markdown Frontmatter contents.
   */
  cursorRules: Record<string, string>;
}

/**
 * Configuration preferences for Bring Your Own Key (BYOK) compile requests.
 */
export interface UserConfig {
  /**
   * The targeted model provider.
   */
  provider: 'premium' | 'openai' | 'anthropic' | 'gemini';

  /**
   * The specific API model identifier (e.g. gpt-4o-mini).
   */
  model?: string;

  /**
   * The client-side private API key.
   */
  apiKey?: string;
}
