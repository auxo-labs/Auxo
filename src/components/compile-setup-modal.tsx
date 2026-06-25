'use client';

import * as React from 'react';
import { X, Eye, EyeOff, Zap, Key, Sparkles, ArrowRight } from 'lucide-react';
import { UserConfig } from '@/lib/prompt-compiler';
import { obfuscateKey } from '@/lib/encryption';
import Link from 'next/link';

interface CompileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Called when the user saves a BYOK key and wants to immediately compile.
   * The parent passes an overrideConfig so the compile sees the new key
   * immediately without waiting for React state to settle.
   *
   * @param config - The resolved BYOK UserConfig to use for the compile run.
   */
  onConfigureAndCompile: (config: UserConfig) => void;
}

type BYOKProvider = 'gemini' | 'anthropic' | 'openai';

const PROVIDER_DEFAULTS: Record<BYOKProvider, { model: string; placeholder: string; label: string }> = {
  gemini: {
    model: 'gemini-2.5-flash',
    placeholder: 'AIzaSy...',
    label: 'Gemini API Key',
  },
  anthropic: {
    model: 'claude-sonnet-4-6',
    placeholder: 'sk-ant-...',
    label: 'Anthropic API Key',
  },
  openai: {
    model: 'gpt-4o-mini',
    placeholder: 'sk-...',
    label: 'OpenAI API Key',
  },
};

/**
 * Gate modal shown when a user attempts to compile without any compilation
 * route configured (no BYOK key, no cloud credits).
 *
 * Cloud Credits is the primary, prominently featured option.
 * BYOK is presented as a collapsible secondary alternative.
 */
export function CompileSetupModal({ isOpen, onClose, onConfigureAndCompile }: CompileSetupModalProps) {
  const [provider, setProvider] = React.useState<BYOKProvider>('gemini');
  const [apiKey, setApiKey] = React.useState('');
  const [showKey, setShowKey] = React.useState(false);
  const [keyError, setKeyError] = React.useState<string | null>(null);
  const [byokExpanded, setByokExpanded] = React.useState(false);

  if (!isOpen) return null;

  const currentDefaults = PROVIDER_DEFAULTS[provider];

  const handleConfigureAndCompile = () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setKeyError('API key is required to compile.');
      return;
    }

    // Persist key to localStorage using the same schema as SettingsModal
    localStorage.setItem('auxo-settings-provider', provider);
    localStorage.setItem(`auxo-settings-${provider}-key`, obfuscateKey(trimmedKey));
    localStorage.setItem(`auxo-settings-${provider}-model`, currentDefaults.model);

    onConfigureAndCompile({
      provider,
      apiKey: trimmedKey,
      model: currentDefaults.model,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-lg border border-white/5 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-md">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-4">

          {/* Header */}
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h3 className="font-mono text-sm font-semibold tracking-wide text-zinc-200">
              COMPILE WITH AI
            </h3>
          </div>

          <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">
            Choose how to power your compilation.
          </p>

          {/* ── Option 1: Cloud Credits (PRIMARY) ─────────────────────────── */}
          <Link
            href="/pricing"
            onClick={onClose}
            className="group flex flex-col gap-2 w-full p-4 rounded-lg border border-cyan-500/25 bg-cyan-950/10 hover:border-cyan-500/40 hover:bg-cyan-950/20 transition-all shadow-[0_0_20px_rgba(6,182,212,0.04)] hover:shadow-[0_0_24px_rgba(6,182,212,0.08)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="font-mono text-xs font-bold tracking-wide text-zinc-100">
                  CLOUD CREDITS
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                RECOMMENDED
              </span>
            </div>
            <p className="text-[10px] font-sans text-zinc-400 leading-relaxed">
              No key setup. Compile instantly through our hosted Claude Sonnet 4.6 infrastructure.
            </p>
            <div className="flex items-center gap-1 mt-0.5 text-[10px] font-mono font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors">
              <span>View credit plans</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </Link>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-mono text-zinc-600 tracking-wider">OR USE YOUR OWN KEY</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* ── Option 2: BYOK (SECONDARY, collapsible) ───────────────────── */}
          <div className="rounded-lg border border-white/5 bg-white/[0.01] overflow-hidden">
            <button
              type="button"
              onClick={() => setByokExpanded(!byokExpanded)}
              className="flex items-center justify-between w-full px-3.5 py-2.5 text-left transition-colors hover:bg-white/[0.02] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Key className="w-3 h-3 text-zinc-500" />
                <span className="font-mono text-[10px] font-semibold tracking-wider text-zinc-400">
                  BRING YOUR OWN KEY (BYOK)
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/15">
                  FREE
                </span>
              </div>
              <span className={`text-zinc-600 text-[10px] font-mono transition-transform duration-200 ${byokExpanded ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </button>

            {byokExpanded && (
              <div className="px-3.5 pb-3.5 space-y-3 border-t border-white/5 pt-3 animate-fade-in">

                {/* Provider Tabs */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono text-zinc-500 tracking-wider">
                    SELECT PROVIDER
                  </label>
                  <div className="flex gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded">
                    {(['gemini', 'anthropic', 'openai'] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setProvider(p);
                          setApiKey('');
                          setKeyError(null);
                        }}
                        className={`flex-1 py-1 text-[9px] font-mono font-bold uppercase rounded tracking-wider transition-all cursor-pointer ${
                          provider === p
                            ? 'bg-white/10 text-zinc-100 shadow'
                            : 'text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                {/* API Key Input */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-mono text-zinc-500 tracking-wider">
                    {currentDefaults.label.toUpperCase()}
                  </label>
                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value);
                        if (keyError) setKeyError(null);
                      }}
                      placeholder={currentDefaults.placeholder}
                      className="w-full h-8 pl-3 pr-8 rounded bg-white/[0.02] border border-white/5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-white/10 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      aria-label={showKey ? 'Hide key' : 'Show key'}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {keyError && (
                    <p className="text-[9px] font-mono text-rose-400 animate-fade-in">{keyError}</p>
                  )}
                  <p className="text-[9px] font-sans text-zinc-600 leading-relaxed">
                    XOR-encrypted in your browser. Never logged on our servers.
                  </p>
                </div>

                {/* BYOK Compile Button */}
                <button
                  onClick={handleConfigureAndCompile}
                  className="w-full h-8 rounded border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-[10px] font-mono font-semibold tracking-wider text-zinc-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3 h-3 text-amber-400" />
                  COMPILE WITH BYOK KEY
                </button>

              </div>
            )}
          </div>

          {/* Cancel */}
          <button
            onClick={onClose}
            className="w-full h-8 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-zinc-400 font-mono text-[10px] font-medium tracking-wider transition-colors cursor-pointer"
          >
            CANCEL
          </button>

        </div>
      </div>
    </div>
  );
}
