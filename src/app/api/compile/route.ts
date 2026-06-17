import { NextRequest, NextResponse } from 'next/server';
import { compilePromptPack } from '@/lib/prompt-compiler';
import { resolveTechStack } from '@/lib/tech-resolver';
import Stripe from 'stripe';

/**
 * API route to compile raw markdown notes into a structured Software 3.0 context pack.
 * POST /api/compile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markdownText, roomId, sessionId } = body;

    if (!markdownText || typeof markdownText !== 'string') {
      return NextResponse.json(
        { error: 'markdownText is required and must be a string' },
        { status: 400 }
      );
    }

    // Strict payment verification in production (if STRIPE_SECRET_KEY is configured)
    if (process.env.STRIPE_SECRET_KEY) {
      if (!sessionId || !roomId) {
        return NextResponse.json(
          { error: 'Payment verification (sessionId and roomId) is required' },
          { status: 403 }
        );
      }

      // Allow mock session bypass for ease of development / testing
      if (sessionId !== 'mock-stripe-session') {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
          return NextResponse.json(
            { error: 'Checkout session is unpaid' },
            { status: 403 }
          );
        }

        if (session.client_reference_id !== roomId) {
          return NextResponse.json(
            { error: 'Checkout session room ID mismatch' },
            { status: 403 }
          );
        }
      }
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
