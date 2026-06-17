'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Sparkles, Terminal, Users, Cpu, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = () => {
    setIsLoading(true);
    // Generate a secure UUID path on the client side
    const roomId = crypto.randomUUID();
    router.push(`/room/${roomId}`);
  };

  return (
    <div className="relative flex flex-col flex-1 items-center justify-center min-h-screen px-4 overflow-hidden bg-background">
      {/* Premium background grid & glow effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
      
      {/* Cybernetic ambient light glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/10 blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 rounded-full bg-accent/10 blur-[128px] pointer-events-none" />

      {/* Main Content Card */}
      <main className="relative z-10 w-full max-w-4xl px-6 py-16 text-center md:py-24">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-xs font-medium border rounded-full glass border-white/10 text-accent bg-accent/5 animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Aligned with 2026 AI Developer Standards</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
          PromptOps Blueprint
        </h1>
        <p className="mt-4 text-lg font-semibold tracking-wide uppercase bg-gradient-to-r from-primary via-purple-400 to-accent bg-clip-text text-transparent">
          by Auxo
        </p>

        {/* Subtext */}
        <p className="max-w-2xl mx-auto mt-6 text-base md:text-lg text-muted-foreground leading-relaxed">
          Zero-auth, real-time Markdown playground explicitly designed for founders and engineers to collaborate, dump raw software ideas, and output a structured, prompt-optimized file matrix for modern AI IDEs.
        </p>

        {/* Call to Action Card */}
        <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl glass-card glow-purple border border-white/5">
          <button
            onClick={handleCreateRoom}
            disabled={isLoading}
            className="group relative flex items-center justify-center w-full h-12 gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-primary to-accent font-semibold text-white shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_4px_30px_rgba(6,182,212,0.4)] transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create Anonymous Sandbox</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </>
            )}
          </button>
          <p className="mt-3.5 text-xs text-muted-foreground">
            No signup. Disposable room. Data wiped on close.
          </p>
        </div>

        {/* Grid Features */}
        <div className="grid gap-6 mt-16 text-left sm:grid-cols-3">
          {/* Feature 1 */}
          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 text-primary mb-4">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Real-time Synergy</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Two builders, one shared canvas. Copy the link and start brainstorming project details side-by-side with zero onboarding friction.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent mb-4">
              <Terminal className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Cross-Agent Specs</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Generates a structured target ZIP containing a root standard <code className="text-accent font-mono">AGENTS.md</code>, Anthropic-native <code className="text-primary font-mono">CLAUDE.md</code>, and scoped <code className="text-accent font-mono">.cursor/rules/</code>.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04] transition-all duration-300">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-foreground">Context Splitting</h3>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Avoids model attention degradation. Split-parsing maps rules, file matrices, constraints, and tasks into lightweight, bite-sized context maps.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-xs text-center text-muted-foreground border-t border-white/5 w-full max-w-4xl mt-auto">
        <p>&copy; 2026 Auxo. Built for rapid validation and optimal token efficiency.</p>
      </footer>
    </div>
  );
}
