'use client';

import * as React from 'react';
import { X, Eye, EyeOff, Settings, Sparkles, Key, Shield } from 'lucide-react';
import { UserConfig } from '@/lib/prompt-compiler';
import { obfuscateKey, deobfuscateKey } from '@/lib/encryption';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (config: UserConfig) => void;
}

export function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  // Config state
  const [provider, setProvider] = React.useState<UserConfig['provider']>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('auxo-settings-provider');
      const valid = ['premium', 'openai', 'anthropic', 'gemini'];
      if (saved && valid.includes(saved)) {
        return saved as UserConfig['provider'];
      }
      localStorage.setItem('auxo-settings-provider', 'premium');
      return 'premium';
    }
    return 'premium';
  });
  
  // Model state by provider
  const [openaiModel, setOpenaiModel] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auxo-settings-openai-model') || 'gpt-4o-mini';
    }
    return 'gpt-4o-mini';
  });
  const [anthropicModel, setAnthropicModel] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auxo-settings-anthropic-model') || 'claude-sonnet-4-5';
    }
    return 'claude-sonnet-4-5';
  });
  const [geminiModel, setGeminiModel] = React.useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auxo-settings-gemini-model') || 'gemini-2.5-flash';
    }
    return 'gemini-2.5-flash';
  });

  // API keys state
  const [openaiKey, setOpenaiKey] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('auxo-settings-openai-key') || '';
      return deobfuscateKey(raw);
    }
    return '';
  });
  const [anthropicKey, setAnthropicKey] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('auxo-settings-anthropic-key') || '';
      return deobfuscateKey(raw);
    }
    return '';
  });
  const [geminiKey, setGeminiKey] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem('auxo-settings-gemini-key') || '';
      return deobfuscateKey(raw);
    }
    return '';
  });

  // UI States
  const [showOpenaiKey, setShowOpenaiKey] = React.useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = React.useState(false);
  const [showGeminiKey, setShowGeminiKey] = React.useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('auxo-settings-provider', provider);
    localStorage.setItem('auxo-settings-openai-key', obfuscateKey(openaiKey));
    localStorage.setItem('auxo-settings-openai-model', openaiModel);
    localStorage.setItem('auxo-settings-anthropic-key', obfuscateKey(anthropicKey));
    localStorage.setItem('auxo-settings-anthropic-model', anthropicModel);
    localStorage.setItem('auxo-settings-gemini-key', obfuscateKey(geminiKey));
    localStorage.setItem('auxo-settings-gemini-model', geminiModel);

    let apiKey = undefined;
    let model = undefined;

    if (provider === 'openai') {
      apiKey = openaiKey;
      model = openaiModel;
    } else if (provider === 'anthropic') {
      apiKey = anthropicKey;
      model = anthropicModel;
    } else if (provider === 'gemini') {
      apiKey = geminiKey;
      model = geminiModel;
    }

    onSave({
      provider,
      apiKey,
      model
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-lg border border-white/5 bg-zinc-950/95 p-6 shadow-2xl backdrop-blur-md">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-zinc-400" />
            <h3 className="font-mono text-sm font-semibold tracking-wide text-zinc-200">
              COMPILER CONFIGURATION
            </h3>
          </div>

          <div className="space-y-3">
            <label className="block text-[10px] font-mono text-zinc-400 tracking-wider">
              CHOOSE COMPILATION ROUTE
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              
              {/* Option 1: Auxo Cloud */}
              <button
                type="button"
                onClick={() => setProvider('premium')}
                className={`flex flex-col text-left p-3.5 rounded-lg border transition-all cursor-pointer group ${
                  provider === 'premium'
                    ? 'border-cyan-500/30 bg-cyan-950/10 text-zinc-100 shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                    : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-bold tracking-wide flex items-center gap-1.5 text-zinc-200">
                    <Sparkles className={`w-3.5 h-3.5 ${provider === 'premium' ? 'text-cyan-400 animate-pulse' : 'text-zinc-500'}`} />
                    AUXO CLOUD
                  </span>
                  <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded ${
                    provider === 'premium' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    CLOUD CREDITS
                  </span>
                </div>
                <p className="text-[10px] font-sans text-zinc-500 mt-1.5 leading-relaxed">
                  No keys needed. Secure, hosted compiles via Claude Sonnet 4.5. Requires cloud compile credits.
                </p>
              </button>

              {/* Option 2: Bring Your Own Key */}
              <button
                type="button"
                onClick={() => {
                  if (provider === 'premium') {
                    setProvider('gemini'); // Default back to gemini when moving to BYOK
                  }
                }}
                className={`flex flex-col text-left p-3.5 rounded-lg border transition-all cursor-pointer group ${
                  provider !== 'premium'
                    ? 'border-amber-500/30 bg-amber-950/10 text-zinc-100 shadow-[0_0_15px_rgba(245,158,11,0.05)]'
                    : 'border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] text-zinc-400'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-bold tracking-wide flex items-center gap-1.5 text-zinc-200">
                    <Key className={`w-3.5 h-3.5 ${provider !== 'premium' ? 'text-amber-400' : 'text-zinc-500'}`} />
                    BRING YOUR KEY (BYOK)
                  </span>
                  <span className={`font-mono text-[9px] font-bold px-2 py-0.5 rounded ${
                    provider !== 'premium' ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-800 text-zinc-500'
                  }`}>
                    £0 / FREE
                  </span>
                </div>
                <p className="text-[10px] font-sans text-zinc-500 mt-1.5 leading-relaxed">
                  Compile completely for free. Routes infinite runs directly through your own Gemini, Anthropic, or OpenAI API key. Stored safely in client memory.
                </p>
              </button>

            </div>
          </div>

          {/* BYOK Sub-sections */}
          {provider !== 'premium' && (
            <div className="space-y-4 pt-2 border-t border-white/5 animate-fade-in">
              {/* Trust Badge Callout */}
              <div className="p-3 rounded-lg border border-emerald-500/15 bg-emerald-950/10 text-zinc-300 text-[10px] leading-relaxed">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold uppercase tracking-wider mb-1">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  Your Key. Your Privacy.
                </div>
                <p className="text-zinc-400 font-sans">
                  API keys are obfuscated client-side in LocalStorage using XOR + Base64 encryption, and transit securely to the compile API strictly as a transient request header over HTTPS. Your credentials are never logged, cached, or stored on disk.
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] font-mono text-zinc-400 tracking-wider">
                  API PROVIDER
                </label>
                <div className="flex gap-1.5 p-1 bg-white/[0.02] border border-white/5 rounded">
                  {(['gemini', 'anthropic', 'openai'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProvider(p)}
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

              {/* Gemini configuration inputs */}
              {provider === 'gemini' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-zinc-500 tracking-wider">
                      GEMINI MODEL
                    </label>
                    <select
                      value={geminiModel}
                      onChange={(e) => setGeminiModel(e.target.value)}
                      className="w-full h-8 px-2 rounded bg-zinc-900 border border-white/5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-white/10"
                    >
                      <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended)</option>
                      <option value="gemini-2.0-flash">gemini-2.0-flash</option>
                      <option value="gemini-1.5-flash">gemini-1.5-flash</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-zinc-500 tracking-wider">
                      GEMINI API KEY
                    </label>
                    <div className="relative">
                      <input
                        type={showGeminiKey ? 'text' : 'password'}
                        value={geminiKey}
                        onChange={(e) => setGeminiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full h-8 pl-3 pr-8 rounded bg-white/[0.02] border border-white/5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-white/10 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGeminiKey(!showGeminiKey)}
                        className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      >
                        {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Anthropic configuration inputs */}
              {provider === 'anthropic' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-zinc-500 tracking-wider">
                      ANTHROPIC MODEL
                    </label>
                    <select
                      value={anthropicModel}
                      onChange={(e) => setAnthropicModel(e.target.value)}
                      className="w-full h-8 px-2 rounded bg-zinc-900 border border-white/5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-white/10"
                    >
                      <option value="claude-sonnet-4-5">claude-sonnet-4-5 (Recommended)</option>
                      <option value="claude-3-7-sonnet">claude-3.7-sonnet</option>
                      <option value="claude-3-5-sonnet-20241022">claude-3.5-sonnet</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-zinc-500 tracking-wider">
                      ANTHROPIC API KEY
                    </label>
                    <div className="relative">
                      <input
                        type={showAnthropicKey ? 'text' : 'password'}
                        value={anthropicKey}
                        onChange={(e) => setAnthropicKey(e.target.value)}
                        placeholder="sk-ant-..."
                        className="w-full h-8 pl-3 pr-8 rounded bg-white/[0.02] border border-white/5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-white/10 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAnthropicKey(!showAnthropicKey)}
                        className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      >
                        {showAnthropicKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* OpenAI configuration inputs */}
              {provider === 'openai' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-zinc-500 tracking-wider">
                      OPENAI MODEL
                    </label>
                    <select
                      value={openaiModel}
                      onChange={(e) => setOpenaiModel(e.target.value)}
                      className="w-full h-8 px-2 rounded bg-zinc-900 border border-white/5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-white/10"
                    >
                      <option value="gpt-4o-mini">gpt-4o-mini (Recommended)</option>
                      <option value="gpt-4o">gpt-4o</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[9px] font-mono text-zinc-500 tracking-wider">
                      OPENAI API KEY
                    </label>
                    <div className="relative">
                      <input
                        type={showOpenaiKey ? 'text' : 'password'}
                        value={openaiKey}
                        onChange={(e) => setOpenaiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full h-8 pl-3 pr-8 rounded bg-white/[0.02] border border-white/5 text-zinc-200 text-xs font-mono focus:outline-none focus:border-white/10 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                        className="absolute right-2.5 top-2 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                      >
                        {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}



          <div className="flex gap-2 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-9 rounded border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] text-zinc-300 font-mono text-xs font-medium transition-colors cursor-pointer"
            >
              CANCEL
            </button>
            <button
              onClick={handleSave}
              className="flex-1 h-9 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-xs font-semibold tracking-wider transition-colors cursor-pointer"
            >
              SAVE SETTINGS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
