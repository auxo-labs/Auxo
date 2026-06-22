'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Shield, RefreshCw, Cpu, Layers, Terminal, Code, Compass, Sparkles, Laptop } from 'lucide-react';
import { SupportModal } from '@/components/support-modal';

function IdeLogo({ name, fallbackIcon: Icon, colorClass }: { name: string; fallbackIcon: React.ComponentType<{ className?: string }>; colorClass: string }) {
  const [hasError, setHasError] = useState(false);
  const logoPath = `/logos/${name.toLowerCase().replace(/\s+/g, '')}.png`;

  return (
    <div className="w-10 h-10 flex items-center justify-center rounded border border-white/10 bg-white/5 overflow-hidden">
      {hasError ? (
        <Icon className={`w-5 h-5 ${colorClass}`} />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={logoPath}
          alt={`${name} Logo`}
          className="w-6 h-6 object-contain animate-fade-in"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleCreateRoom = () => {
    if (isLoading) return;
    setIsLoading(true);
    const roomId = crypto.randomUUID();
    router.push(`/room/${roomId}`);
  };

  // Keyboard shortcut listener for Enter
  const handleCreateRoomRef = useRef(handleCreateRoom);
  useEffect(() => {
    handleCreateRoomRef.current = handleCreateRoom;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCreateRoomRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-hidden selection:bg-zinc-800 selection:text-zinc-100">
      {/* 1. Fine-dot backdrop & gradient mask (Framer style) */}
      <div className="absolute inset-0 dot-bg dot-mask pointer-events-none" />

      {/* 2. Soft background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-glow-radial rounded-full pointer-events-none blur-3xl opacity-75" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-glow-teal rounded-full pointer-events-none blur-3xl opacity-50" />

      {/* 3. Minimal Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 h-16 border-b border-white/[0.03] bg-background/30 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-nobg.png" alt="Auxo Logo" className="w-5 h-5 object-contain shrink-0" />
          <span className="font-mono text-sm tracking-wider font-semibold text-zinc-200">AUXO</span>
          <span className="h-4 w-px bg-white/10 hidden md:inline" />
          <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase hidden md:inline">Context Compiler</span>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-4">
          <Link
            href="/pricing"
            className="font-mono text-[9px] sm:text-[10px] text-zinc-400 hover:text-zinc-200 tracking-wider transition-colors uppercase"
          >
            Pricing
          </Link>
          <Link
            href="/optimality"
            className="font-mono text-[9px] sm:text-[10px] text-zinc-400 hover:text-zinc-200 tracking-wider transition-colors uppercase"
          >
            Optimality
          </Link>
          <Link
            href="/faq"
            className="font-mono text-[9px] sm:text-[10px] text-zinc-400 hover:text-zinc-200 tracking-wider transition-colors uppercase"
          >
            FAQ
          </Link>
          <button
            onClick={() => setIsSupportModalOpen(true)}
            className="font-mono text-[9px] sm:text-[10px] text-zinc-400 hover:text-zinc-200 tracking-wider transition-colors uppercase cursor-pointer"
          >
            Support
          </button>
          <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded">
            v1.0.0-beta
          </span>
        </div>
      </nav>

      {/* 4. Hero & Main Area */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        
        {/* Headline with high-contrast serif font (Refero style) */}
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-normal tracking-tight text-zinc-100 max-w-4xl leading-[1.08] selection:bg-zinc-800 font-serif">
          Turn Ideas into Precision Agent Context.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto mt-6 text-xs sm:text-base text-zinc-400 font-sans leading-relaxed">
          Auxo compiles raw specs, requirements, and tech stack notes into folder-scoped, prompt-optimised rule files for AI coding agents—preventing attention degradation while saving up to <strong className="text-zinc-200">18.4% in token overhead</strong><Link href="/optimality" className="text-accent hover:underline text-[9px] align-super ml-0.5" title="View Optimality Specs">[1]</Link>.
        </p>

        {/* Action Button Section with fine line borders */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="group relative flex items-center justify-center h-11 px-6 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-xs font-mono font-semibold tracking-wider transition-all duration-150 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <>
                <span>NEW SANDBOX</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-150 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 text-[9px] sm:text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1 max-w-xs sm:max-w-none">
            <span>No Account Required</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full hidden sm:inline" />
            <span>Free BYOK Tier</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full hidden sm:inline" />
            <span>One-Click Export</span>
          </div>
        </div>

        {/* Compatible AI IDEs & Editors Showcase */}
        <div className="mt-12 sm:mt-16 w-full max-w-4xl border-t border-b border-white/[0.03] py-5 px-2">
          <h2 className="font-mono text-[9px] text-zinc-500 uppercase tracking-[0.25em] mb-4">
            Compatible Cognitive IDEs & Editors
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-8 gap-y-3 sm:gap-y-4">
            
            {/* Antigravity */}
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-all duration-150 cursor-default">
              <IdeLogo name="Antigravity" fallbackIcon={Sparkles} colorClass="text-cyan-400" />
              <span className="font-mono text-xs text-zinc-300 tracking-wider">Antigravity</span>
            </div>

            {/* Cursor */}
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-all duration-150 cursor-default">
              <IdeLogo name="Cursor" fallbackIcon={Code} colorClass="text-purple-400" />
              <span className="font-mono text-xs text-zinc-300 tracking-wider">Cursor</span>
            </div>

            {/* Claude */}
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-all duration-150 cursor-default">
              <IdeLogo name="Claude" fallbackIcon={Terminal} colorClass="text-orange-400" />
              <span className="font-mono text-xs text-zinc-300 tracking-wider">Claude Code</span>
            </div>

            {/* VS Code */}
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-all duration-150 cursor-default">
              <IdeLogo name="VS Code" fallbackIcon={Laptop} colorClass="text-blue-400" />
              <span className="font-mono text-xs text-zinc-300 tracking-wider">VS Code</span>
            </div>

            {/* Windsurf */}
            <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-all duration-150 cursor-default">
              <IdeLogo name="Windsurf" fallbackIcon={Compass} colorClass="text-emerald-400" />
              <span className="font-mono text-xs text-zinc-300 tracking-wider">Windsurf</span>
            </div>

          </div>
        </div>

        {/* 5. Minimalist Bento Grid Section */}
        <div className="grid gap-4 mt-12 sm:mt-20 text-left md:grid-cols-3 w-full">
          
          {/* Card 1 */}
          <div className="p-5 sm:p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-150 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-zinc-700 font-bold group-hover:text-zinc-600 transition-colors">
              01 // BYOK PRIVACY
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/[0.02] text-zinc-400 mb-6">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono tracking-widest text-zinc-200 uppercase font-bold">Zero-Telemetry BYOK</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Compile prompts completely for free using private OpenAI, Anthropic, or Gemini keys. Keys are obfuscated in LocalStorage (XOR + Base64) and sent securely via transient HTTPS headers with zero persistent logging.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-5 sm:p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-150 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-zinc-700 font-bold group-hover:text-zinc-600 transition-colors">
              02 // OPTIMISE
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/[0.02] text-zinc-400 mb-6">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono tracking-widest text-zinc-200 uppercase font-bold">Context Sharding</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Halts lost-in-the-middle context drift. Automatically shards requirements into file-scoped rules so your AI assistant only loads context relevant to what is currently open.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-5 sm:p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-150 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-zinc-700 font-bold group-hover:text-zinc-600 transition-colors">
              03 // DELIVER
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/[0.02] text-zinc-400 mb-6">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono tracking-widest text-zinc-200 uppercase font-bold">Drop-in rule packages</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Download the exact file structure expected by your AI IDE in one click. Drop the compiled directory into your workspace root to immediately ground your agent.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/[0.03] mt-auto flex flex-col gap-2.5 px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6 font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest">
          <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
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

      {isSupportModalOpen && (
        <SupportModal
          isOpen={isSupportModalOpen}
          onClose={() => setIsSupportModalOpen(false)}
        />
      )}
    </div>
  );
}
