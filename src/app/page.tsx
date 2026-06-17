'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Shield, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

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
      <nav className="relative z-10 flex items-center justify-between px-8 h-16 border-b border-white/[0.03] bg-background/30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm tracking-wider font-semibold text-zinc-200">AUXO</span>
          <span className="h-4 w-px bg-white/10" />
          <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase">Auxo Sandbox</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/optimality"
            className="font-mono text-[10px] text-zinc-400 hover:text-zinc-200 tracking-wider transition-colors mr-2 uppercase"
          >
            Optimality Specs
          </Link>
          <span className="font-mono text-[10px] text-zinc-500 border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded">
            v1.0.0-beta
          </span>
        </div>
      </nav>

      {/* 4. Hero & Main Area */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 max-w-5xl mx-auto px-6 py-20 text-center">
        
        {/* Subtle spec compliance badge */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-8 text-[10px] font-mono tracking-wider text-zinc-400 border border-white/5 rounded bg-white/[0.01]">
          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
          <span>ALIGNED WITH 2026 AI DEVELOPER SPECIFICATIONS</span>
        </div>

        {/* Headline with high-contrast serif font (Refero style) */}
        <h1 className="text-4xl font-normal tracking-tight sm:text-7xl text-zinc-100 max-w-4xl leading-[1.08] selection:bg-zinc-800 font-serif">
          Build Codebases Post-Scarcity.
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto mt-6 text-sm sm:text-base text-zinc-400 font-sans leading-relaxed">
          Turn chaotic, conversational product roadmaps into perfectly optimized context frameworks for 2026 AI IDEs (Cursor, Claude Code, Aider) in 60 seconds.
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
                <span>CREATE ANONYMOUS SANDBOX</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform duration-150 group-hover:translate-x-0.5" />
              </>
            )}
          </button>
          
          <div className="flex items-center gap-2.5 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
            <span>Instant Sandbox</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span>Frictionless Design</span>
            <span className="w-1 h-1 bg-zinc-700 rounded-full" />
            <span>Accounts Coming Soon</span>
          </div>
        </div>

        {/* 5. Minimalist Bento Grid Section */}
        <div className="grid gap-4 mt-24 text-left sm:grid-cols-3 w-full">
          
          {/* Card 1 */}
          <div className="p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-150 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-zinc-700 font-bold group-hover:text-zinc-600 transition-colors">
              01 // SPEED
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/[0.02] text-zinc-400 mb-6">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono tracking-widest text-zinc-200 uppercase font-bold">Frictionless Quick Start</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Start editing and compiling context packs instantly without jumping through account setup or email verification hoops. Save blueprints locally, with cloud workspace dashboards arriving in our next phase.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-150 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-zinc-700 font-bold group-hover:text-zinc-600 transition-colors">
              02 // ORCHESTRATE
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/[0.02] text-zinc-400 mb-6">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono tracking-widest text-zinc-200 uppercase font-bold">Multi-Agent Split parsing</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Avoids lost-in-the-middle context fragmentation. Splits goals, stack constraints, and pathing definitions into bite-sized scoped files.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-lg border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] transition-all duration-150 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-3 text-[10px] font-mono text-zinc-700 font-bold group-hover:text-zinc-600 transition-colors">
              03 // COMPILE
            </div>
            <div className="flex items-center justify-center w-8 h-8 rounded border border-white/10 bg-white/[0.02] text-zinc-400 mb-6">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-mono tracking-widest text-zinc-200 uppercase font-bold">Ready-to-Feed Zip</h3>
            <p className="mt-2 text-xs text-zinc-400 leading-relaxed font-sans">
              Press &quot;Compile Pack&quot; to download the exact file directory expected by Cursor, Aider, and Claude Code. Start coding with perfect context alignment.
            </p>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/[0.03] mt-auto">
        <span className="font-mono text-[9px] text-zinc-600 tracking-widest uppercase">
          &copy; 2026 AUXO INTELLECTUAL PROPERTY LABS. ALL RIGHTS RELEASED.
        </span>
      </footer>
    </div>
  );
}
