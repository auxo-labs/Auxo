import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId, userId, tier } = body;

    if (!roomId || typeof roomId !== 'string') {
      return NextResponse.json(
        { error: 'roomId is required and must be a string' },
        { status: 400 }
      );
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { error: 'userId is required and must be a string' },
        { status: 400 }
      );
    }

    // Dev environment fallback if Stripe secret keys are not configured
    if (!process.env.STRIPE_SECRET_KEY) {
      const host = request.headers.get('host') || 'localhost:3000';
      const protocol = request.headers.get('x-forwarded-proto') || 'http';
      const origin = `${protocol}://${host}`;
      console.warn('STRIPE_SECRET_KEY is missing. Returning local mock success redirect.');
      return NextResponse.json({ url: `${origin}/room/${roomId}?session_id=mock-stripe-session` });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const origin = `${protocol}://${host}`;

    // Select pricing structure based on tier selection
    const isDeveloperPack = tier === 'lifetime' || tier === 'pro';
    const priceAmount = isDeveloperPack ? 1299 : 499; // £12.99 GBP vs £4.99 GBP
    const productName = isDeveloperPack ? 'Auxo Developer Pack' : 'Auxo 20x AI Compile Credit Pack';
    const productDesc = isDeveloperPack
      ? '75 premium deep LLM compiles grounded in live package registry metadata.'
      : '20 premium deep LLM compiles grounded in live package registry metadata.';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: productName,
              description: productDesc,
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: userId,
      metadata: {
        roomId,
        userId,
        tier: isDeveloperPack ? 'lifetime' : 'credits',
      },
      success_url: `${origin}/room/${roomId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/room/${roomId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session. Inspect server logs.' },
      { status: 500 }
    );
  }
}
