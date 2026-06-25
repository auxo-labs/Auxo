'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, Sparkles, Key, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AuthModal } from '@/components/auth-modal';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export function PricingClient() {
  const router = useRouter();

  // Auth & Profile State
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [profile, setProfile] = React.useState<{ credits: number; is_lifetime: boolean } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [purchasingTier, setPurchasingTier] = React.useState<'credits' | 'lifetime' | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Sync auth state and load profile credits
  React.useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('credits, is_lifetime')
          .eq('id', userId)
          .single();
        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Failed to load user profile credits:', err);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        fetchUserProfile(activeUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleCreateRoom = () => {
    const roomId = crypto.randomUUID();
    router.push(`/room/${roomId}`);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePurchase = async (tier: 'credits' | 'lifetime') => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    try {
      setPurchasingTier(tier);
      setErrorMsg(null);

      // Generate a temporary workspace UUID to hold the checkout reference session
      const tempRoomId = crypto.randomUUID();

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: tempRoomId,
          userId: user.id,
          tier
        })
      });

      if (!response.ok) {
        throw new Error('Failed to establish Stripe Checkout session.');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Checkout creation error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Checkout redirection failed. Please try again.');
    } finally {
      setPurchasingTier(null);
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-hidden selection:bg-zinc-800 selection:text-zinc-100">
      {/* Fine-dot background grid */}
      <div className="absolute inset-0 dot-bg dot-mask pointer-events-none" />

      {/* Background glow highlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-glow-radial rounded-full pointer-events-none blur-3xl opacity-60" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-glow-teal rounded-full pointer-events-none blur-3xl opacity-40" />

      {/* Navigation Header */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 h-16 border-b border-white/[0.03] bg-background/30 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center justify-center w-7 h-7 rounded border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all text-zinc-400 hover:text-zinc-200 cursor-pointer"
            title="Back to Landing Page"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm tracking-wider font-semibold text-zinc-200">AUXO</span>
            <span className="h-4 w-px bg-white/10" />
            <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">PRICING</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 h-8 px-2.5 rounded border border-white/5 bg-white/[0.01] text-[10px] font-mono tracking-wider text-zinc-300">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-zinc-400 font-semibold max-w-[60px] sm:max-w-[100px] truncate">{user.email?.split('@')[0].toUpperCase()}</span>
              <span className="h-3 w-px bg-white/10" />
              {profile?.is_lifetime ? (
                <span className="text-[9px] font-bold text-amber-400 font-mono">LIFETIME PRO</span>
              ) : (
                <span className="text-[9px] font-semibold text-zinc-400 font-mono">
                  {profile?.credits ?? 0} {profile?.credits === 1 ? 'CREDIT' : 'CREDITS'}
                </span>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] text-[10px] font-mono font-semibold tracking-wider text-zinc-300 transition-colors cursor-pointer"
            >
              SIGN IN
            </button>
          )}
        </div>
      </nav>

      {/* Main Pricing Contents */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-center w-full">
        
        {/* Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight text-zinc-100 max-w-3xl leading-[1.1] selection:bg-zinc-800 font-serif">
          Compiler Access Plans
        </h1>
        <p className="max-w-xl mx-auto mt-4 text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
          Route your deep LLM compilations through our high-speed hosted keys or bring your own API keys for free unlimited runs.
        </p>

        {errorMsg && (
          <div className="w-full max-w-md p-3.5 mt-8 bg-rose-950/40 border border-rose-500/20 text-rose-300 text-xs font-mono rounded-lg animate-fade-in text-left">
            {errorMsg}
          </div>
        )}

        {/* 3-Tier Bento Selection Cards Grid */}
        <div className="grid gap-6 mt-12 md:grid-cols-3 w-full">
          
          {/* Tier 1: BYOK (Free) */}
          <div className="flex flex-col p-5 sm:p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all relative overflow-hidden group text-left h-full">
            <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-zinc-700 font-bold group-hover:text-zinc-600 transition-colors">
              TIER 01 // FREE
            </div>
            
            <div className="flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/[0.02] text-zinc-400 mb-6">
              <Key className="w-4 h-4" />
            </div>

            <h3 className="text-xs font-mono tracking-widest text-zinc-200 uppercase font-bold">Bring Your Own Key</h3>
            
            <div className="my-4">
              <span className="font-serif text-3xl text-zinc-100 font-normal">£0</span>
              <span className="text-[10px] font-mono text-zinc-500 tracking-wider"> / FREE FOREVER</span>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans flex-grow">
              Enter your own Gemini, OpenAI, or Anthropic API keys directly inside the room workspace settings. Keys are encrypted and saved securely inside local storage.
            </p>

            <ul className="mt-6 space-y-2.5 text-[10px] font-mono text-zinc-500 border-t border-white/5 pt-4 flex-shrink-0">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Unlimited compilations</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Direct client routing</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>30,000 character limit</span>
              </li>
            </ul>

            <button
              onClick={handleCreateRoom}
              className="mt-6 w-full h-9 rounded bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-[10px] font-mono font-semibold tracking-wider text-zinc-300 transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <span>LAUNCH FREE SANDBOX</span>
              <ArrowRight className="w-3 h-3 text-zinc-500" />
            </button>
          </div>

          {/* Tier 2: PAYG Credits */}
          <div className="flex flex-col p-5 sm:p-6 rounded-lg border border-white/5 bg-white/[0.005] opacity-40 relative overflow-hidden text-left h-full select-none">
            <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-zinc-500 font-bold">
              TIER 02 // COMING SOON
            </div>
            
            <div className="flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/[0.02] text-zinc-500 mb-6">
              <Sparkles className="w-4 h-4" />
            </div>

            <h3 className="text-xs font-mono tracking-widest text-zinc-400 uppercase font-bold">20x Cloud Compiles</h3>
            
            <div className="my-4">
              <span className="font-serif text-3xl text-zinc-500 font-normal">£9.99</span>
              <span className="text-[10px] font-mono text-zinc-600 tracking-wider"> / ONE-TIME</span>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans flex-grow">
              Secure hosted compilations running on our premium cloud cluster keys. Ideal for quick setups without handling private keys or API billing structures.
            </p>

            <ul className="mt-6 space-y-2.5 text-[10px] font-mono text-zinc-600 border-t border-white/5 pt-4 flex-shrink-0">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-zinc-600 shrink-0" />
                <span>20 deep AI compile credits</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-zinc-600 shrink-0" />
                <span>15,000 character limit</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-zinc-600 shrink-0" />
                <span>Claude Sonnet 4.6 processing</span>
              </li>
            </ul>

            <button
              disabled
              className="mt-6 w-full h-9 rounded bg-white/5 border border-white/5 text-[10px] font-mono font-semibold tracking-wider text-zinc-500 cursor-not-allowed flex items-center justify-center gap-2"
            >
              COMING SOON
            </button>
          </div>

          {/* Tier 3: Developer Pack */}
          <div className="flex flex-col p-5 sm:p-6 rounded-lg border border-white/5 bg-white/[0.005] opacity-40 relative overflow-hidden text-left h-full select-none">
            <div className="absolute top-0 right-0 p-4 text-[10px] font-mono text-zinc-500 font-bold">
              TIER 03 // COMING SOON
            </div>
            
            <div className="flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/[0.02] text-zinc-500 mb-6">
              <Sparkles className="w-4 h-4 text-zinc-500" />
            </div>

            <h3 className="text-xs font-mono tracking-widest text-zinc-400 uppercase font-bold">Founder / Developer Pack</h3>
            
            <div className="my-4">
              <span className="font-serif text-3xl text-zinc-500 font-normal">£24.99</span>
              <span className="text-[10px] font-mono text-zinc-600 tracking-wider"> / ONE-TIME</span>
            </div>

            <p className="text-[11px] text-zinc-500 leading-relaxed font-sans flex-grow">
              75 premium cloud compilations. Complete high-priority access to our hosted high-speed LLM keys for all your workspace rooms, with no setup required.
            </p>

            <ul className="mt-6 space-y-2.5 text-[10px] font-mono text-zinc-600 border-t border-white/5 pt-4 flex-shrink-0">
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-zinc-600 shrink-0" />
                <span>75 deep AI compile credits</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-zinc-600 shrink-0" />
                <span>30,000 character limit</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-3 h-3 text-zinc-600 shrink-0" />
                <span>Highest priority generation queue</span>
              </li>
            </ul>

            <button
              disabled
              className="mt-6 w-full h-9 rounded bg-white/5 border border-white/5 text-[10px] font-mono font-semibold tracking-wider text-zinc-500 cursor-not-allowed flex items-center justify-center gap-2"
            >
              COMING SOON
            </button>
          </div>

        </div>

        {/* Feature Comparison Matrix */}
        <section className="w-full mt-16 sm:mt-24 text-left border border-white/5 bg-zinc-950/20 rounded-lg p-4 sm:p-6 font-mono text-xs select-none">
          <h4 className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold mb-4">Feature Matrix Comparison</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-zinc-400 min-w-[600px]">
              <thead>
                <tr className="border-b border-white/5 text-zinc-500 text-[10px] tracking-wider">
                  <th className="pb-3 text-left font-semibold">CAPABILITY</th>
                  <th className="pb-3 text-left font-semibold">BYOK FREE</th>
                  <th className="pb-3 text-left font-semibold">BUILDER PACK</th>
                  <th className="pb-3 text-left font-semibold">FOUNDER/DEV PACK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                <tr>
                  <td className="py-3 text-zinc-300">Model Engine Choices</td>
                  <td className="py-3">Gemini, Claude, GPT</td>
                  <td className="py-3">Claude Sonnet 4.6</td>
                  <td className="py-3">Claude Sonnet 4.6</td>
                </tr>
                <tr>
                  <td className="py-3 text-zinc-300">Compilation Limits</td>
                  <td className="py-3">Infinite</td>
                  <td className="py-3">20 Credits</td>
                  <td className="py-3">75 Credits</td>
                </tr>
                <tr>
                  <td className="py-3 text-zinc-300">Scratchpad Limit</td>
                  <td className="py-3">30,000 chars</td>
                  <td className="py-3">15,000 chars</td>
                  <td className="py-3">30,000 chars</td>
                </tr>
                <tr>
                  <td className="py-3 text-zinc-300">Key Configurations</td>
                  <td className="py-3 text-amber-500">Requires Personal Key</td>
                  <td className="py-3 text-emerald-500">No Key Required</td>
                  <td className="py-3 text-emerald-500">No Key Required</td>
                </tr>
                <tr>
                  <td className="py-3 text-zinc-300">Billing Setup</td>
                  <td className="py-3">Via your API provider</td>
                  <td className="py-3">Stateless Checkout</td>
                  <td className="py-3">One-time payment</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/[0.03] mt-auto flex flex-col gap-2.5 px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6 font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/optimality" className="hover:text-zinc-300 transition-colors">Optimality Specs</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/faq" className="hover:text-zinc-300 transition-colors">FAQ</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Specs</Link>
        </div>
        <span className="font-mono text-[8px] sm:text-[9px] text-zinc-600 tracking-wider sm:tracking-widest uppercase">
          &copy; 2026 AUXO INTELLECTUAL PROPERTY LABS. ALL RIGHTS RELEASED.
        </span>
      </footer>

      {isAuthOpen && (
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      )}
    </div>
  );
}
