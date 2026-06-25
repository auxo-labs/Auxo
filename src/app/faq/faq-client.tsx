'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, HelpCircle, Sparkles, Key, Lock, Layers, BookOpen, Terminal, Sliders } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
}

export function FaqClient() {
  const router = useRouter();
  const [expandedId, setExpandedId] = React.useState<string | null>('what-is-auxo');
  const [revealedIds, setRevealedIds] = React.useState<string[]>(['what-is-auxo']);

  const toggleItem = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
    if (!revealedIds.includes(id)) {
      setRevealedIds(prev => [...prev, id]);
    }
  };

  const faqItems: FaqItem[] = [
    {
      id: 'what-is-auxo',
      question: 'What is Auxo?',
      icon: Sparkles,
      answer: (
        <div className="space-y-2">
          <p>
            Auxo is a zero-auth, real-time collaborative workspace designed to translate raw developer brainstorming notes, stack lists, and requirements into a prompt-optimised context matrix.
          </p>
          <p>
            Instead of manually writing structured system instructions for AI coding assistants, you outline your application details in our editor, compile the pack, and download a single ZIP containing formatted context files (`AGENTS.md`, `CLAUDE.md`, `.windsurfrules`, and `.cursor/rules/*.mdc`) ready to drop into your repository root.
          </p>
        </div>
      )
    },
    {
      id: 'why-sharding',
      question: 'What is context sharding, and why does it save tokens?',
      icon: Layers,
      answer: (
        <div className="space-y-2">
          <p>
            Large Language Models (LLMs) suffer from attention degradation when prompt context windows grow too large. Instructions located in the middle of a massive configuration block (such as a bloated, single `.cursorrules` file) are frequently ignored or overridden—a phenomenon known as the <strong>&quot;Lost-in-the-Middle&quot;</strong> effect.
          </p>
          <p>
            Auxo solves this by <strong>sharding</strong> your guidelines. Global architectures live in `AGENTS.md`, CLI scripts live in `CLAUDE.md`, and specific logical rules are partitioned into individual `.mdc` files scoped by file path globs. Editors like Cursor load these rules into memory only when you edit matching files, reducing input token overhead by up to <strong>18.4% on average</strong>.
          </p>
        </div>
      )
    },
    {
      id: 'what-is-agents-md',
      question: 'What is AGENTS.md?',
      icon: BookOpen,
      answer: (
        <div className="space-y-2">
          <p>
            <code className="text-accent text-[11px] font-mono">AGENTS.md</code> acts as the universal system constitution read by over 30 coding assistants. It serves as your project&apos;s structural source of truth.
          </p>
          <p>
            It declares global technology stacks, architectural boundaries, coding philosophies (such as DRY, KISS, SOLID, YAGNI), and regulatory compliance directives (like HIPAA, SOC2, or PCI-DSS) without polluting individual rules with duplicate styling conventions.
          </p>
        </div>
      )
    },
    {
      id: 'what-is-claude-md',
      question: 'What is CLAUDE.md?',
      icon: Terminal,
      answer: (
        <div className="space-y-2">
          <p>
            <code className="text-accent text-[11px] font-mono">CLAUDE.md</code> is a specialised runtime instructions file parsed directly by Anthropic&apos;s Claude Code CLI.
          </p>
          <p>
            Because Claude Code loads this file at the start of every session, Auxo creates a condensed reference sheet registering the exact safe commands to run your development server, build pipeline, linters, and testing suites. It references <code className="text-zinc-300">@AGENTS.md</code> to keep tokens small and prevent expensive session initialisation overhead.
          </p>
        </div>
      )
    },
    {
      id: 'how-do-mdc-rules-work',
      question: 'How do .cursor/rules/*.mdc files work?',
      icon: Sliders,
      answer: (
        <div className="space-y-2">
          <p>
            Cursor rules use structured YAML frontmatter blocks containing path patterns (globs) to specify when they should be loaded.
          </p>
          <p>
            For example, Auxo will isolate frontend styling constraints to <code className="text-zinc-300">ui-theme.mdc</code> (bound to `src/components/**/*`), and database query schemas to a separate logic rule. This ensures the AI model only holds instructions relevant to the file it is actively modifying, avoiding rule contamination and token bloat.
          </p>
        </div>
      )
    },
    {
      id: 'is-my-key-safe',
      question: 'Is my private API key safe in BYOK mode?',
      icon: Lock,
      answer: (
        <div className="space-y-2">
          <p>
            Absolutely. We enforce a strict zero-retention security profile. When you use the Bring Your Own Key (BYOK) compile tier:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Your OpenAI, Anthropic, or Gemini keys are obfuscated client-side in LocalStorage using symmetric XOR mask arrays combined with Base64 encoding.</li>
            <li>Keys are transmitted exclusively over TLS-encrypted HTTPS connections within transient request headers.</li>
            <li>Requests bypass our hosted databases entirely. Keys are processed strictly in Edge memory during compilation and are never logged, cached, or written to disk.</li>
          </ul>
        </div>
      )
    },
    {
      id: 'is-auxo-free',
      question: 'Is Auxo free?',
      icon: Key,
      answer: (
        <div className="space-y-2">
          <p>
            Yes. Auxo is fully open-source and provides an unlimited **Free BYOK (Bring Your Own Key) Tier**. You can supply your own developer keys to run deep AI compilations completely for free.
          </p>
          <p>
            We also offer an offline fallback parser (COMPILE BASIC) which is completely free and requires no account. For users looking for convenience, we provide hosted Cloud Credits (Tier 2 and Tier 3) that utilise our internal API keys, though these integrations are currently locked as we focus on the free hosting model.
          </p>
        </div>
      )
    }
  ];

  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-hidden selection:bg-zinc-800 selection:text-zinc-100 font-sans text-zinc-300">
      {/* 1. Fine-dot backdrop & gradient mask */}
      <div className="absolute inset-0 dot-bg dot-mask pointer-events-none" />

      {/* 2. Soft background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-glow-radial rounded-full pointer-events-none blur-3xl opacity-75" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-glow-teal rounded-full pointer-events-none blur-3xl opacity-50" />

      {/* 3. Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-4 sm:px-8 h-16 border-b border-white/[0.03] bg-background/30 backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-7 h-7 rounded border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all text-zinc-400 hover:text-zinc-200 cursor-pointer"
            title="Go Home (Esc)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-sm tracking-wider font-semibold text-zinc-200">AUXO</span>
          <span className="h-4 w-px bg-white/10 hidden md:inline" />
          <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase hidden md:inline">Frequently Asked Questions</span>
        </div>
        <div>
          <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded">
            FAQ SPEC v1.0
          </span>
        </div>
      </nav>

      {/* 4. Main content container */}
      <main className="relative z-10 flex flex-col items-stretch flex-grow w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-left">
        
        {/* Header Section */}
        <div className="border-b border-white/5 pb-6 mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-6 text-[10px] font-mono tracking-wider text-accent border border-accent/15 rounded bg-accent/[0.01]">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>DEVELOPER KNOWLEDGE BASE</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-zinc-100 leading-[1.15] font-serif mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 font-mono tracking-wide leading-relaxed">
            Everything you need to know about prompt sharding, agent rules, and security profiles.
          </p>
        </div>

        {/* 5. FAQ Accordion Grid */}
        <div className="space-y-4">
          {faqItems.map(item => {
            const isExpanded = expandedId === item.id;
            const isRevealed = revealedIds.includes(item.id);
            const ActiveIcon = item.icon;
            return (
              <div 
                key={item.id}
                className={`group rounded-lg border transition-all duration-300 relative overflow-hidden ${
                  isExpanded 
                    ? 'border-white/10 bg-white/[0.02] shadow-[0_0_25px_rgba(255,255,255,0.01)]' 
                    : 'border-white/5 bg-white/[0.005] hover:border-white/10 hover:bg-white/[0.01]'
                }`}
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex items-center justify-between w-full p-5 text-left font-mono text-xs text-zinc-200 select-none cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3 pr-4">
                    {isRevealed ? (
                      <ActiveIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors shrink-0" />
                    )}
                    <span className="font-semibold tracking-wide group-hover:text-zinc-100 transition-colors">
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown 
                    className={`w-4 h-4 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-300 shrink-0 ${
                      isExpanded ? 'transform rotate-180 text-zinc-200' : ''
                    }`}
                  />
                </button>

                {/* Collapsible Content */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded ? 'max-h-[500px] border-t border-white/5' : 'max-h-0'
                  }`}
                >
                  <div className="p-5 font-sans text-xs text-zinc-400 leading-relaxed font-normal bg-zinc-950/20">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-t-white/[0.03] mt-auto flex flex-col gap-2.5 px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6 font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/optimality" className="hover:text-zinc-300 transition-colors">Optimality Specs</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/faq" className="hover:text-zinc-300 transition-colors text-zinc-300">FAQ</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Specs</Link>
        </div>
        <span className="font-mono text-[8px] sm:text-[9px] text-zinc-600 tracking-wider sm:tracking-widest uppercase">
          &copy; 2026 AUXO INTELLECTUAL PROPERTY LABS. ALL RIGHTS RELEASED.
        </span>
      </footer>
    </div>
  );
}
