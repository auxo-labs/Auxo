'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-hidden selection:bg-zinc-800 selection:text-zinc-100 font-sans text-zinc-300">
      {/* 1. Fine-dot backdrop & gradient mask */}
      <div className="absolute inset-0 dot-bg dot-mask pointer-events-none" />

      {/* 2. Soft background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-glow-radial rounded-full pointer-events-none blur-3xl opacity-75" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-glow-teal rounded-full pointer-events-none blur-3xl opacity-50" />

      {/* 3. Minimal Navigation Bar */}
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
          <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase hidden md:inline">Privacy Specifications</span>
        </div>
        <div>
          <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded">
            SEC-2026-V1
          </span>
        </div>
      </nav>

      {/* 4. Privacy Content Section */}
      <main className="relative z-10 flex flex-col items-stretch flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-left">
        
        {/* Meta Header */}
        <div className="border-b border-white/5 pb-6 mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-6 text-[10px] font-mono tracking-wider text-accent border border-accent/15 rounded bg-accent/[0.01]">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span>{"PRIVACY SPECIFICATIONS // ZERO TRUST"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-zinc-100 leading-[1.15] font-serif mb-4">
            Security Profile &amp; Data Handling Guarantees
          </h1>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Published June 2026
          </p>
        </div>

        {/* Abstract Box */}
        <div className="p-5 sm:p-6 rounded-lg border border-white/5 bg-white/[0.01] mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-zinc-700 font-bold uppercase">
            Product Thesis
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Auxo is engineered under a strict <strong>Privacy-by-Design</strong> architecture. When using our sandbox environment, developer intellectual property (specifications, schemas, and source outlines) is treated as ephemeral data. We enforce absolute isolation, zero persistent telemetry, and client-side encryption of user secrets to ensure complete control of your workspace metadata.
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            1. Zero-Telemetry Cloud Compilations
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            For users executing <strong>Deep AI Compiles</strong> using Auxo Cloud credits, the system processes workspace outlines in-memory on our serverless API nodes.
          </p>
          <ul className="list-disc pl-5 font-mono text-[11px] text-zinc-400 space-y-2">
            <li><strong>Zero Storage:</strong> No compile payload (your source notes) is ever written to database tables, logs, caches, or persistent disk storage.</li>
            <li><strong>Edge Discard:</strong> Once compiler requests return from OpenAI, Anthropic, or Google, request payloads are immediately purged from edge server memory.</li>
            <li><strong>Audit Gating:</strong> Supabase auth records and credit packs are checked securely using PostgreSQL Row-Level Security (RLS) policies.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            2. Bring Your Own Key (BYOK) Security
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            When configuring personal API keys (OpenAI, Anthropic, or Gemini) inside the compiler setup, keys are managed with strict client-centric isolation:
          </p>
          <ul className="list-disc pl-5 font-mono text-[11px] text-zinc-400 space-y-2">
            <li><strong>XOR Obfuscation:</strong> Keys are obfuscated in browser memory using a dynamic symmetric XOR-based mask array combined with Base64 encoding before writing to `localStorage` (SEC-08). This deters browser-extension memory scraping.</li>
            <li><strong>Transient Request Transit:</strong> Keys are sent directly within transient HTTPS headers from your browser client to the Edge proxy routes. Keys are never cached or logged on intermediate routes.</li>
            <li><strong>Bypass Flow:</strong> BYOK request compile calls completely bypass Supabase transaction hooks, Stripe credit tracking, and hosted database calls.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            3. Ephemeral Synchronization Channels
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            Typing updates and cursor presence (when active) run over transient Supabase Broadcast and Presence channels.
          </p>
          <p className="text-xs leading-relaxed text-zinc-400">
            These channels operate as low-latency WebSocket connections designed to mirror typing changes in-memory between active collaborators. No room content changes, scratchpad keystrokes, or active presence IDs are logged to Postgres tables, protecting your source notes from passive database logging.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            4. LocalStorage &amp; Client-Side Exporter
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            To prevent data loss from browser crashes, the active scratchpad state is mirrored in `localStorage` keyed strictly by Room UUID.
          </p>
          <p className="text-xs leading-relaxed text-zinc-400">
            When click triggers initiate a &quot;Download Pack&quot; download, zipping is handled directly in-memory inside the browser sandbox using JSZip. Compiled agent packs are structured and compressed locally without routing code packages to third-party file compressors.
          </p>
        </section>

        {/* Security Summary Matrix */}
        <div className="w-full mt-12 text-left border border-white/5 bg-white/[0.005] rounded-lg p-4 sm:p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-[9px] font-mono text-zinc-800 uppercase tracking-widest hidden sm:block">
            Summary Table
          </div>
          <h3 className="text-sm font-mono tracking-wider text-zinc-300 uppercase font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent" /> Privacy Enforcement Rules
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px] text-zinc-400 min-w-[550px]">
              <thead>
                <tr className="border-b border-white/10 text-zinc-300">
                  <th className="py-2 text-left font-semibold">DATA TYPE</th>
                  <th className="py-2 text-left font-semibold">STORAGE METRIC</th>
                  <th className="py-2 text-left font-semibold">RETENTION WINDOW</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Scratchpad Specifications</td>
                  <td className="py-2.5">Client LocalStorage / In-memory Edge</td>
                  <td className="py-2.5 text-accent">Discarded immediately on Edge response</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Private API Keys (BYOK)</td>
                  <td className="py-2.5">Client LocalStorage (XOR Obfuscated)</td>
                  <td className="py-2.5 text-accent">Retained locally until cleared by user</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Collaborative Sync Keystrokes</td>
                  <td className="py-2.5">Transient WebSockets (Supabase Broadcast)</td>
                  <td className="py-2.5 text-accent">Zero retention (No db logs)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Stripe Billing Session</td>
                  <td className="py-2.5">Stripe Console / Postgres Accounts</td>
                  <td className="py-2.5 text-accent">Permanent (For billing & audit)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">User History Projects</td>
                  <td className="py-2.5">Postgres DB (RLS Protected)</td>
                  <td className="py-2.5 text-accent">Persistent (User can delete anytime)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/[0.03] mt-auto px-4">
        <span className="font-mono text-[8px] sm:text-[9px] text-zinc-600 tracking-wider sm:tracking-widest uppercase">
          &copy; 2026 AUXO INTELLECTUAL PROPERTY LABS. ALL RIGHTS RELEASED.
        </span>
      </footer>
    </div>
  );
}
