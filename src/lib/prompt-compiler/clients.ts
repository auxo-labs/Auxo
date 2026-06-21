import { TechSignature } from '../tech-resolver';
import { CompiledPack } from './types';
import { generateSystemPrompt } from './system-prompt';
import { parseMarkdownStream } from './parser';

/**
 * Dispatches compilation query to OpenAI's completion endpoint using fetch.
 *
 * @param apiKey - Server secret or client provided OpenAI API key.
 * @param model - Target OpenAI model string.
 * @param markdown - Unstructured notes specifications.
 * @param techSignatures - Invariants resolved from package names.
 * @returns Complete CompiledPack object.
 */
export async function callOpenAI(
  apiKey: string,
  model: string,
  markdown: string,
  techSignatures: TechSignature[]
): Promise<CompiledPack> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 8000,
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
    let errorText = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorText = errJson.error.message;
      }
    } catch {}
    throw new Error(`OpenAI compilation failed: ${errorText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OpenAI returned an empty response');
  }
  return parseMarkdownStream(content);
}

/**
 * Dispatches compilation query to Anthropic's message endpoint using fetch.
 *
 * @param apiKey - Server secret or client provided Anthropic API key.
 * @param model - Target Anthropic model string.
 * @param markdown - Unstructured notes specifications.
 * @param techSignatures - Invariants resolved from package names.
 * @returns Complete CompiledPack object.
 */
export async function callAnthropic(
  apiKey: string,
  model: string,
  markdown: string,
  techSignatures: TechSignature[]
): Promise<CompiledPack> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model,
      max_tokens: 8000,
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
    let errorText = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorText = errJson.error.message;
      }
    } catch {}
    throw new Error(`Anthropic compilation failed: ${errorText}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text;
  if (!text) {
    throw new Error('Anthropic returned an empty response');
  }
  return parseMarkdownStream(text);
}

/**
 * Dispatches compilation query to Google Gemini's REST API endpoint using fetch.
 *
 * @param apiKey - Client provided Gemini API key.
 * @param model - Target Gemini model string.
 * @param markdown - Unstructured notes specifications.
 * @param techSignatures - Invariants resolved from package names.
 * @returns Complete CompiledPack object.
 */
export async function callGemini(
  apiKey: string,
  model: string,
  markdown: string,
  techSignatures: TechSignature[]
): Promise<CompiledPack> {
  const systemPrompt = generateSystemPrompt(techSignatures);
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Compile these raw specs into the Karpathy-style Software 3.0 context matrix:\n\n${markdown}`
            }
          ]
        }
      ],
      systemInstruction: {
        parts: [
          {
            text: systemPrompt
          }
        ]
      },
      generationConfig: {
        responseMimeType: 'text/plain',
        maxOutputTokens: 8000
      }
    })
  });

  if (!response.ok) {
    let errorText = response.statusText;
    try {
      const errJson = await response.json();
      if (errJson?.error?.message) {
        errorText = errJson.error.message;
      }
    } catch {}
    throw new Error(`Gemini compilation failed: ${errorText}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini returned an empty response');
  }

  return parseMarkdownStream(text);
}
