'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, X, Check, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);



  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isLoading) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.href, // redirects directly back to this workspace room
        },
      });

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Magic link request failed:', err);
      setErrorMsg(message || 'Failed to send Magic Link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-lg border border-white/5 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-md">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-mono text-sm font-semibold tracking-wide text-zinc-200">
                UNLOCK PREMIUM AGENT PACKS
              </h3>
              <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
                Enter your email. We&apos;ll send you a passwordless Magic Link to sign in and activate your account.
              </p>
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@domain.com"
                className="w-full h-9 pl-9 pr-4 rounded bg-white/[0.02] border border-white/5 text-zinc-200 text-xs font-mono placeholder-zinc-600 focus:outline-none focus:border-white/10 transition-colors"
                disabled={isLoading}
              />
            </div>

            {errorMsg && (
              <p className="text-[10px] font-mono text-rose-500">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center w-full h-9 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-semibold tracking-wider transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                'SEND MAGIC LINK'
              )}
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400">
              <Check className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-mono text-sm font-semibold tracking-wide text-zinc-200">
                LINK SENT
              </h3>
              <p className="text-[10px] font-mono text-zinc-400 leading-relaxed max-w-[240px]">
                We&apos;ve sent a magic login link to <strong className="text-zinc-200">{email}</strong>. Check your inbox to complete signing in.
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-8 px-4 rounded border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] font-mono text-[10px] font-semibold tracking-wider text-zinc-300 transition-colors cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
