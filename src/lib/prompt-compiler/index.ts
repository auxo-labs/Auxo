import { TechSignature } from '../tech-resolver';
import { CompiledPack, UserConfig } from './types';
import { callOpenAI, callAnthropic, callGemini } from './clients';

export type { CompiledPack, UserConfig };
export { cleanMdcRuleContent } from './parser';

/**
 * Main compilation entry point.
 * Coordinates resolving provider type, API key validations, and triggering API callers.
 *
 * @param rawMarkdown - Developer brainstorm specification text.
 * @param techSignatures - Invariants resolved from package definitions.
 * @param userConfig - Settings configuration indicating private key configurations.
 * @returns A promise resolving to the final structured CompiledPack.
 */
export async function compilePromptPack(
  rawMarkdown: string, 
  techSignatures: TechSignature[] = [],
  userConfig?: UserConfig
): Promise<CompiledPack> {
  if (userConfig && userConfig.provider !== 'premium' && userConfig.apiKey) {
    const { provider, model, apiKey } = userConfig;
    if (provider === 'openai') {
      return await callOpenAI(apiKey, model || 'gpt-4o-mini', rawMarkdown, techSignatures);
    } else if (provider === 'anthropic') {
      return await callAnthropic(apiKey, model || 'claude-sonnet-4-5', rawMarkdown, techSignatures);
    } else if (provider === 'gemini') {
      return await callGemini(apiKey, model || 'gemini-2.5-flash', rawMarkdown, techSignatures);
    }
  }

  const openAIKey = process.env.OPENAI_API_KEY;
  const anthropicKey = process.env.ANTHROPIC_API_KEY;

  if (openAIKey) {
    return await callOpenAI(openAIKey, 'gpt-4o-mini', rawMarkdown, techSignatures);
  } else if (anthropicKey) {
    return await callAnthropic(anthropicKey, 'claude-sonnet-4-5', rawMarkdown, techSignatures);
  } else {
    throw new Error('No API keys configured for hosted AI compilation.');
  }
}
