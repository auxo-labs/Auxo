'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, X, Check, Loader2, Lock } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PasswordSubMode = 'login' | 'signup';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [passwordMode, setPasswordMode] = React.useState<PasswordSubMode>('login');
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  const [isLoading, setIsLoading] = React.useState(false);
  const [isOAuthLoading, setIsOAuthLoading] = React.useState(false);
  const [activeOAuthProvider, setActiveOAuthProvider] = React.useState<'github' | 'google' | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState('');

  if (!isOpen) return null;

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

        if (data.session) {
          setSuccessMsg('Account created successfully! Logging you in...');
          setSuccess(true);
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setSuccessMsg('Verification email sent! Please check your inbox and click the confirmation link before logging in.');
          setSuccess(true);
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

  const handleOAuthSignIn = async (provider: 'github' | 'google') => {
    if (isOAuthLoading) return;
    try {
      setIsOAuthLoading(true);
      setActiveOAuthProvider(provider);
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
      setActiveOAuthProvider(null);
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
                Log in or sign up to save sandboxes and enable deep AI compilations.
              </p>
            </div>

            {/* Auth Mode Toggle Tabs (Log In vs Sign Up) */}
            <div className="flex border-b border-white/5">
              <button
                type="button"
                onClick={() => {
                  setPasswordMode('login');
                  setErrorMsg(null);
                }}
                className={`flex-1 pb-2 text-center font-mono text-[10px] font-bold tracking-wider cursor-pointer transition-colors ${
                  passwordMode === 'login'
                    ? 'border-b border-zinc-200 text-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                LOG IN
              </button>
              <button
                type="button"
                onClick={() => {
                  setPasswordMode('signup');
                  setErrorMsg(null);
                }}
                className={`flex-1 pb-2 text-center font-mono text-[10px] font-bold tracking-wider cursor-pointer transition-colors ${
                  passwordMode === 'signup'
                    ? 'border-b border-zinc-200 text-zinc-200'
                    : 'text-zinc-500 hover:text-zinc-400'
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* Password Auth Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
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

            {/* OAuth Separator */}
            <div className="relative flex py-1.5 items-center">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[9px] font-mono text-zinc-600 tracking-widest">
                OR
              </span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            {/* OAuth Login Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleOAuthSignIn('github')}
                disabled={isOAuthLoading}
                className="flex items-center justify-center gap-1.5 h-9 rounded bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-zinc-200 font-mono text-[10px] font-semibold tracking-wider transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isOAuthLoading && activeOAuthProvider === 'github' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <GithubIcon className="w-3.5 h-3.5 text-zinc-200" />
                    GITHUB
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleOAuthSignIn('google')}
                disabled={isOAuthLoading}
                className="flex items-center justify-center gap-1.5 h-9 rounded bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 text-zinc-200 font-mono text-[10px] font-semibold tracking-wider transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isOAuthLoading && activeOAuthProvider === 'google' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <GoogleIcon className="w-3.5 h-3.5 text-zinc-200" />
                    GOOGLE
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
