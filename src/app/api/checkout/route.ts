import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roomId } = body;

    if (!roomId || typeof roomId !== 'string') {
      return NextResponse.json(
        { error: 'roomId is required and must be a string' },
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Auxo Agent Context Pack',
              description: `Karpathy-style AI context blueprints (AGENTS.md, CLAUDE.md, .cursor/rules) for Room ${roomId.slice(0, 8)}`,
            },
            unit_amount: 900, // $9.00 USD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      client_reference_id: roomId,
      metadata: {
        roomId,
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
