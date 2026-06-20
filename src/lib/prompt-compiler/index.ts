import { TechSignature } from '../tech-resolver';
import { CompiledPack, UserConfig } from './types';
import { callOpenAI, callAnthropic, callGemini } from './clients';
import { localMockCompile } from './mock-compiler';

export type { CompiledPack, UserConfig };
export { cleanMdcRuleContent } from './parser';

/**
 * Main compilation entry point.
 * Coordinates resolving provider type, API key validations, and triggering either API callers or local mocks.
 *
 * @param rawMarkdown - Developer brainstorm specification text.
 * @param techSignatures - Invariants resolved from package definitions.
 * @param forceBasic - Toggle indicating basic fallback compilation.
 * @param userConfig - Settings configuration indicating private key configurations.
 * @returns A promise resolving to the final structured CompiledPack.
 */
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
