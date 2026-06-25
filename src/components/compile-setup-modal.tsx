'use client';

import * as React from 'react';
import { X, Eye, EyeOff, Zap, Key, ArrowRight } from 'lucide-react';
import { UserConfig } from '@/lib/prompt-compiler';
import { obfuscateKey } from '@/lib/encryption';
import Link from 'next/link';

interface CompileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  /**
   * Called when the user saves a BYOK key and wants to immediately compile.
   * The parent should persist this config and trigger handleCompile with it.
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
 * Lightweight gate modal shown when a user attempts to compile without
 * any compilation route configured (no BYOK key, no cloud credits).
 * Offers a quick BYOK key setup or a redirect to the pricing page.
 */
export function CompileSetupModal({ isOpen, onClose, onConfigureAndCompile }: CompileSetupModalProps) {
  const [provider, setProvider] = React.useState<BYOKProvider>('gemini');
  const [apiKey, setApiKey] = React.useState('');
  const [showKey, setShowKey] = React.useState(false);
  const [keyError, setKeyError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const currentDefaults = PROVIDER_DEFAULTS[provider];

  const handleConfigureAndCompile = () => {
    const trimmedKey = apiKey.trim();
    if (!trimmedKey) {
      setKeyError('API key is required to compile.');
      return;
    }

    // Persist key to localStorage using the same keys as SettingsModal
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
              CONFIGURE TO COMPILE
            </h3>
          </div>

          <p className="text-[11px] font-sans text-zinc-400 leading-relaxed">
            Add a free API key to run unlimited AI compilations, or purchase cloud credits for keyless access.
          </p>

          {/* Provider Tabs */}
          <div className="space-y-2">
            <label className="block text-[10px] font-mono text-zinc-400 tracking-wider">
              <Key className="w-3 h-3 inline mr-1" />
              FREE BYOK — SELECT PROVIDER
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
              Stored locally in your browser. Never sent to our servers outside compile requests.
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-white/5" />
            <span className="text-[9px] font-mono text-zinc-600 tracking-wider">OR</span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Cloud Credits CTA */}
          <Link
            href="/pricing"
            onClick={onClose}
            className="flex items-center justify-between w-full px-3 py-2.5 rounded border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all group"
          >
            <span className="text-[10px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
              Get cloud compile credits
            </span>
            <ArrowRight className="w-3 h-3 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </Link>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onClose}
              className="flex-1 h-9 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-zinc-300 font-mono text-xs font-medium transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleConfigureAndCompile}
              className="flex-1 h-9 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-semibold tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Zap className="w-3 h-3" />
              COMPILE
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
