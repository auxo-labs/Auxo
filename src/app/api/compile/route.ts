import { NextRequest, NextResponse } from 'next/server';
import { compilePromptPack } from '@/lib/prompt-compiler';
import { resolveTechStack } from '@/lib/tech-resolver';

/**
 * API route to compile raw markdown notes into a structured Software 3.0 context pack.
 * POST /api/compile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markdownText } = body;

    if (!markdownText || typeof markdownText !== 'string') {
      return NextResponse.json(
        { error: 'markdownText is required and must be a string' },
        { status: 400 }
      );
    }

    // 1. Run live tech-stack lookup on detected packages
    const techSignatures = await resolveTechStack(markdownText);

    // 2. Compile final prompt context matrices using signatures as grounding data
    const compiledPack = await compilePromptPack(markdownText, techSignatures);
    
    return NextResponse.json(compiledPack);

  } catch (error) {
    console.error('API compile route failure:', error);
    return NextResponse.json(
      { error: 'Failed to compile prompt pack. Inspect server logs.' },
      { status: 500 }
    );
  }
}
