'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, X, Check, Loader2, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = 'magic-link' | 'password';
type PasswordSubMode = 'login' | 'signup';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = React.useState<AuthMode>('password');
  const [passwordMode, setPasswordMode] = React.useState<PasswordSubMode>('login');
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');

  if (!isOpen) return null;

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
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
      setSuccessMsg(`We've sent a magic login link to ${email}. Check your inbox to complete signing in.`);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Magic link request failed:', err);
      setErrorMsg(message || 'Failed to send Magic Link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || isLoading) return;

    try {
      setIsLoading(true);
      setErrorMsg(null);

      if (passwordMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // If confirm email is off, Supabase logs user in immediately or they can log in
        if (data.session) {
          setSuccessMsg('Account created successfully! Logging you in...');
          setSuccess(true);
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setSuccessMsg('Account created successfully! You can now log in.');
          setPasswordMode('login');
          setPassword('');
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        onClose();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Password auth failed:', err);
      setErrorMsg(message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider: 'github') => {
    if (isOAuthLoading) return;
    try {
      setIsOAuthLoading(true);
      setErrorMsg(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.href,
        },
      });

      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('OAuth sign in failed:', err);
      setErrorMsg(message || 'Failed to initialize social sign in.');
      setIsOAuthLoading(false);
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
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-mono text-sm font-semibold tracking-wide text-zinc-200">
                UNLOCK PREMIUM AGENT PACKS
              </h3>
              <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
                Choose your preferred authentication route. Authenticating saves your sandboxes and enables deep AI compilations.
              </p>
            </div>

            {/* Auth Mode Switcher */}
            <div className="flex border-b border-white/5">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password');
                  setErrorMsg(null);
                }}
                className={`flex-1 pb-2 text-center font-mono text-[10px] font-bold tracking-wider cursor-pointer transition-colors ${
                  authMode === 'password'
                    ? 'border-b border-zinc-200 text-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                PASSWORD
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('magic-link');
                  setErrorMsg(null);
                }}
                className={`flex-1 pb-2 text-center font-mono text-[10px] font-bold tracking-wider cursor-pointer transition-colors ${
                  authMode === 'magic-link'
                    ? 'border-b border-zinc-200 text-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                MAGIC LINK
              </button>
            </div>

            {/* Password Auth Form */}
            {authMode === 'password' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-3">
                {/* Submode Switcher */}
                <div className="flex justify-end gap-3 text-[10px] font-mono">
                  <button
                    type="button"
                    onClick={() => setPasswordMode('login')}
                    className={`cursor-pointer ${passwordMode === 'login' ? 'text-zinc-200 font-bold' : 'text-zinc-500'}`}
                  >
                    LOG IN
                  </button>
                  <span className="text-zinc-700">|</span>
                  <button
                    type="button"
                    onClick={() => setPasswordMode('signup')}
                    className={`cursor-pointer ${passwordMode === 'signup' ? 'text-zinc-200 font-bold' : 'text-zinc-500'}`}
                  >
                    SIGN UP
                  </button>
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

                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-9 pl-9 pr-4 rounded bg-white/[0.02] border border-white/5 text-zinc-200 text-xs font-mono placeholder-zinc-600 focus:outline-none focus:border-white/10 transition-colors"
                    disabled={isLoading}
                  />
                </div>

                {errorMsg && (
                  <p className="text-[10px] font-mono text-rose-500 leading-relaxed">
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
                    passwordMode === 'login' ? 'LOG IN' : 'CREATE ACCOUNT'
                  )}
                </button>
              </form>
            )}

            {/* Magic Link Form */}
            {authMode === 'magic-link' && (
              <form onSubmit={handleMagicLinkSubmit} className="space-y-3">
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
                  <p className="text-[10px] font-mono text-rose-500 leading-relaxed">
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
            )}

            {/* OAuth Separator */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[9px] font-mono text-zinc-600 tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* OAuth Login Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('github')}
                disabled={isOAuthLoading}
                className="flex items-center justify-center gap-2 w-full h-9 rounded bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-zinc-200 font-mono text-xs font-semibold tracking-wider transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isOAuthLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <GithubIcon className="w-4 h-4 text-zinc-200" />
                    CONTINUE WITH GITHUB
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400">
              <Check className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-mono text-sm font-semibold tracking-wide text-zinc-200">
                SUCCESS
              </h3>
              <p className="text-[10px] font-mono text-zinc-400 leading-relaxed max-w-[240px]">
                {successMsg}
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
