import { NextRequest, NextResponse } from 'next/server';
import { compilePromptPack } from '@/lib/prompt-compiler';
import { resolveTechStack } from '@/lib/tech-resolver';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { checkRateLimit } from '@/lib/rate-limiter';
import Stripe from 'stripe';

/**
 * API route to compile raw markdown notes into a structured Software 3.0 context pack.
 * POST /api/compile
 */
export async function POST(request: NextRequest) {
  try {
    // SEC-07: IP-Based Rate Limiting
    const ip = (request as NextRequest & { ip?: string }).ip || request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimit = checkRateLimit(ip);
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: `Too many compile requests. Please wait ${rateLimit.resetSeconds} seconds before compiling again.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { markdownText, roomId, sessionId, compileType, userConfig } = body;

    if (!markdownText || typeof markdownText !== 'string') {
      return NextResponse.json(
        { error: 'markdownText is required and must be a string' },
        { status: 400 }
      );
    }

    // 1. Basic Compile Flow (Free, Instant, Local offline fallback)
    if (compileType === 'basic') {
      if (markdownText.length > 15000) {
        return NextResponse.json(
          { error: 'Scratchpad content exceeds the 15,000 character limit for standard compiles.' },
          { status: 400 }
        );
      }
      const compiledPack = await compilePromptPack(markdownText, [], true);
      return NextResponse.json(compiledPack);
    }

    // 2. Premium Compile Flow (Auth & Payment Gated unless custom API key is present)
    const hasUserKey = userConfig && userConfig.provider !== 'premium' && userConfig.apiKey && userConfig.apiKey.trim() !== '';

    if (hasUserKey) {
      if (markdownText.length > 30000) {
        return NextResponse.json(
          { error: 'Scratchpad content exceeds the 30,000 character limit for BYOK compiles.' },
          { status: 400 }
        );
      }
    }

    if (!hasUserKey) {
      const authHeader = request.headers.get('Authorization');
      let userId: string | null = null;

      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
          return NextResponse.json({ error: 'Authentication token is invalid or expired' }, { status: 401 });
        }
        userId = user.id;
      }

      // If Stripe checks are active, verify compile eligibility
      if (process.env.STRIPE_SECRET_KEY) {
        if (userId) {
          // Authenticated flow: check credits or lifetime status
          if (!supabaseAdmin) {
            throw new Error('Supabase admin client not initialized on server');
          }

          let profileData = null;
          let hasAccess = false;

          try {
            const { data } = await supabaseAdmin
              .from('profiles')
              .select('credits, is_lifetime')
              .eq('id', userId)
              .single();
            if (data) {
              profileData = data;
              if (data.credits > 0) {
                hasAccess = true;
              }
            }
          } catch {}

          // Fallback: if they just checked out, check if the session is paid
          if (!hasAccess && sessionId) {
            try {
              const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
              const session = await stripe.checkout.sessions.retrieve(sessionId);
              if (session.payment_status === 'paid' && session.client_reference_id === userId) {
                hasAccess = true;
                const isDeveloperPack = session.metadata?.tier === 'lifetime' || session.metadata?.tier === 'pro';
                if (isDeveloperPack) {
                  // Grant remaining 74 credits (+75 total minus 1 consumed now)
                  await supabaseAdmin.from('profiles').update({ credits: (profileData?.credits || 0) + 74, is_lifetime: true }).eq('id', userId);
                } else {
                  // Grant remaining 19 credits (+20 total minus 1 consumed now)
                  await supabaseAdmin.from('profiles').update({ credits: (profileData?.credits || 0) + 19 }).eq('id', userId);
                }
              }
            } catch (err) {
              console.error('Stripe session verify failover error:', err);
            }
          }

          if (!hasAccess) {
            return NextResponse.json(
              { error: 'You have run out of credits. Please purchase a credit pack or lifetime pass.' },
              { status: 403 }
            );
          }

          // Enforce limit based on tier
          const limit = profileData?.is_lifetime ? 30000 : 15000;
          if (markdownText.length > limit) {
            return NextResponse.json(
              { error: `Scratchpad content exceeds the ${limit.toLocaleString()} character limit for your tier.` },
              { status: 400 }
            );
          }

          // Decrement credit count if user has credits remaining and this isn't a fresh checkout compile
          if (profileData && profileData.credits > 0 && !sessionId) {
            const { error: updateError } = await supabaseAdmin
              .from('profiles')
              .update({ credits: profileData.credits - 1 })
              .eq('id', userId);

            if (updateError) {
              console.error('Failed to decrement user credits:', updateError);
            }
          }
        } else {
          // Legacy zero-auth session check fallback (if user not signed in yet but session_id is passed)
          if (!sessionId || !roomId) {
            return NextResponse.json(
              { error: 'Authentication or Stripe payment verification is required' },
              { status: 403 }
            );
          }

          if (sessionId !== 'mock-stripe-session') {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status !== 'paid') {
              return NextResponse.json({ error: 'Stripe checkout session is unpaid' }, { status: 403 });
            }

            if (session.client_reference_id !== roomId) {
              return NextResponse.json({ error: 'Checkout session room ID mismatch' }, { status: 403 });
            }

            // Enforce limit based on Stripe session metadata tier
            const isDeveloperPack = session.metadata?.tier === 'lifetime' || session.metadata?.tier === 'pro';
            const limit = isDeveloperPack ? 30000 : 15000;
            if (markdownText.length > limit) {
              return NextResponse.json(
                { error: `Scratchpad content exceeds the ${limit.toLocaleString()} character limit for your tier.` },
                { status: 400 }
              );
            }
          } else {
            // fallback mock limit
            const limit = 15000;
            if (markdownText.length > limit) {
              return NextResponse.json(
                { error: `Scratchpad content exceeds the ${limit.toLocaleString()} character limit for your tier.` },
                { status: 400 }
              );
            }
          }
        }
      }
    }

    // Run premium deep compile with live package conventions and versions
    const techSignatures = await resolveTechStack(markdownText);
    const compiledPack = await compilePromptPack(markdownText, techSignatures, false, userConfig);
    
    return NextResponse.json(compiledPack);

  } catch (error) {
    console.error('API compile route failure:', error);
    const message = error instanceof Error ? error.message : 'An unexpected error occurred during prompt compilation.';
    
    // Check if the error looks like a custom key authentication failure
    const isAuthError = message.toLowerCase().includes('401') || 
                        message.toLowerCase().includes('unauthorized') || 
                        message.toLowerCase().includes('api key') ||
                        message.toLowerCase().includes('invalid key');

    return NextResponse.json(
      { error: message },
      { status: isAuthError ? 401 : 500 }
    );
  }
}
