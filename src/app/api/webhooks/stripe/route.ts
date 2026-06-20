import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const sig = request.headers.get('stripe-signature') || '';

    let event: Stripe.Event;

    // Verify webhook signature in production if secret is configured
    if (webhookSecret) {
      try {
        event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Stripe webhook signature verification failed:', errorMessage);
        return NextResponse.json({ error: `Webhook Error: ${errorMessage}` }, { status: 400 });
      }
    } else {
      // In development / fallback: parse directly
      console.warn('STRIPE_WEBHOOK_SECRET is missing. Parsing webhook payload directly without verification.');
      event = JSON.parse(payload);
    }

    // Handle checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const userId = session.client_reference_id;
      const tier = session.metadata?.tier;

      if (!userId) {
        console.error('No userId (client_reference_id) found in checkout session completion event.');
        return NextResponse.json({ error: 'Missing client_reference_id' }, { status: 400 });
      }

      if (!supabaseAdmin) {
        console.error('Supabase admin client not initialized on webhook route.');
        return NextResponse.json({ error: 'Internal Server Error: Database admin unavailable' }, { status: 500 });
      }

      // Fetch user profile
      const { data: profile, error: fetchError } = await supabaseAdmin
        .from('profiles')
        .select('credits, is_lifetime')
        .eq('id', userId)
        .single();

      if (fetchError || !profile) {
        console.error(`User profile not found for ID ${userId}:`, fetchError);
        return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
      }

      // Update user credits or lifetime access
      if (tier === 'lifetime') {
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ is_lifetime: true })
          .eq('id', userId);

        if (updateError) {
          console.error('Failed to update lifetime status:', updateError);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
        console.log(`Successfully activated Lifetime Pro pass for user ${userId}`);
      } else {
        // Default to adding 3 credits
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ credits: profile.credits + 3 })
          .eq('id', userId);

        if (updateError) {
          console.error('Failed to increment user credits:', updateError);
          return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
        }
        console.log(`Successfully credited 3 compiles to user ${userId} (New Balance: ${profile.credits + 3})`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Webhook handler crashed:', errorMessage);
    return NextResponse.json({ error: errorMessage || 'Webhook crashed' }, { status: 500 });
  }
}
