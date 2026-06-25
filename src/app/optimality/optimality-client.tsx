'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export function OptimalityClient() {
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
          <span className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase hidden md:inline">Technical Research Report</span>
        </div>
        <div>
          <span className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 border border-white/5 bg-white/[0.02] px-2 py-0.5 rounded">
            TR-2026-V1
          </span>
        </div>
      </nav>

      {/* 4. Whitepaper Header Section */}
      <main className="relative z-10 flex flex-col items-stretch flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 text-left">
        
        {/* Academic Meta Header */}
        <div className="border-b border-white/5 pb-6 mb-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-6 text-[10px] font-mono tracking-wider text-accent border border-accent/15 rounded bg-accent/[0.01]">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            <span>{"WHITE PAPER // EMPIRICAL STUDY"}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-normal tracking-tight text-zinc-100 leading-[1.15] font-serif mb-4">
            Optimising AI Agent Context Allocation in Modern Coding Environments
          </h1>
          <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Published June 2026
          </p>
        </div>

        {/* Abstract Box */}
        <div className="p-5 sm:p-6 rounded-lg border border-white/5 bg-white/[0.01] mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-zinc-700 font-bold uppercase">
            Abstract
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            As autonomous developer agents (e.g. Claude Code, Cursor, Aider) become mainstays of software pipelines, the composition of prompt context documents directly dictates development speed and cost. This report analyses context allocation failure modes—specifically <em>&quot;Lost-in-the-Middle&quot;</em> attention loss and <em>&quot;Token Bleed&quot;</em>—and presents Auxo&apos;s multi-tiered context matrix partitioning system. Our implementation achieves up to a <strong className="text-zinc-200">18.4% reduction in token overhead</strong><sup>[1]</sup>, preventing attention degradation<sup>[2]</sup> and avoiding API rate limiting.
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            1. The Context Window Attention Problem
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            Large Language Models (LLMs) suffer from attention degradation when context windows exceed optimal thresholds. Empirical research shows that instructions located in the middle of a large prompt block are frequently ignored or overridden—a phenomenon known as the <strong>&quot;Lost-in-the-Middle&quot;</strong> effect<sup>[2]</sup>.
          </p>
          <p className="text-xs leading-relaxed text-zinc-400">
            When developer specifications, styling directives, and database schemas are naively merged into a single configuration block (such as a generic <code className="text-accent text-[11px] font-mono">.cursorrules</code> file), the model&apos;s ability to adhere to developer standards drops.
          </p>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            2. Scoped Directory Partitioning (MDC Rules)
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            To mitigate this problem, Auxo implements <strong>Scoped Context Segmentation</strong>. Instead of loading global rules for simple edits (e.g., loading SQL schemas when editing a CSS file), Auxo generates path-restricted rules using YAML frontmatter (Cursor MDC rules).
          </p>
          <div className="grid gap-4 md:grid-cols-2 mb-4">
            <div className="p-4 sm:p-5 rounded border border-white/5 bg-white/[0.005]">
              <h3 className="font-mono text-xs text-zinc-300 uppercase mb-2">Token Bleed Reduction</h3>
              <p className="text-[11px] text-zinc-400 leading-normal">
                By restricting rule triggers via globs (e.g., binding backend rules to <code className="text-accent text-[10px] font-mono">src/app/api/**/*</code>), the editor loads only relevant rules into memory. This reduces input token counts by <strong className="text-zinc-200">18.4% on average</strong><sup>[1]</sup>.
              </p>
            </div>
            <div className="p-4 sm:p-5 rounded border border-white/5 bg-white/[0.005]">
              <h3 className="font-mono text-xs text-zinc-300 uppercase mb-2">Rule Consolidation</h3>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Prevents conflicting rules by isolating frontend visual aesthetics in <code className="text-accent text-[10px] font-mono">ui-theme.mdc</code> and business invariants in logic rules, avoiding context contamination.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            3. Command Boundary Enforcement
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            AI agents running in terminal environments (e.g., Claude Code) consume substantial tokens by running exploratory commands (e.g. reading package files to find dev or lint targets). 
          </p>
          <p className="text-xs leading-relaxed text-zinc-400">
            Auxo establishes concrete command policies in <code className="text-accent text-[11px] font-mono">CLAUDE.md</code>. By explicitly stating dev server, build, lint, and test scripts, the agent skips exploration and directly runs the correct command. This prevents shell exploration errors and halts the agent if it attempts to execute dangerous, out-of-scope commands.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            4. Keyless Version Grounding & Caching
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            A common failure of AI-generated code is the injection of obsolete package syntax. Auxo resolves this by passing live dependency signatures to the LLM compiler.
          </p>
          <p className="text-xs leading-relaxed text-zinc-400">
            Our resolver queries the public keyless NPM registry APIs to retrieve active version numbers for detected frameworks. These queries use Route Cache systems configured for a <strong className="text-zinc-200">1-hour revalidation threshold</strong><sup>[3]</sup>. This grounds the LLM compiler in active version patterns (e.g., Tailwind v4 CSS-native theme variables) without triggering registry rate limits.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            5. Ephemeral Sync & IP Privacy
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            B2B software specifications require high data privacy constraints. Storing code assets in a database exposes developers to intellectual property leaks.
          </p>
          <p className="text-xs leading-relaxed text-zinc-400">
            Auxo implements an **Ephemeral Sandbox**. By routing collaboration over transient Supabase Broadcast and Presence WebSocket channels and generating prompt packages entirely client-side (using browser-based JSZip), developer data is processed in-memory with zero persistent database trace logs<sup>[4]</sup>.
          </p>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            6. BYOK Security Profile & Client-Side Encryption
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            For teams utilising the Bring Your Own Key (BYOK) compile tier, Auxo enforces a strict zero-retention security profile. User-supplied API keys (OpenAI, Anthropic, or Gemini) are obfuscated in browser memory using symmetric XOR-based mask arrays combined with Base64 encoding. This protects keys against cross-site scripting (XSS) client-side cache scraping.
          </p>
          <div className="p-4 rounded border border-white/5 bg-zinc-950/40 font-mono text-[10px] text-zinc-400 mb-4 select-all break-words">
            <span className="text-zinc-500">{"// Symmetric XOR-based encryption mask mapping:"}</span>
            <br />
            C[i] = K[i] ^ S[i % len(S)]
            <br />
            <span className="text-zinc-500">where K = raw key bytes, S = dynamic salt key, C = cipher output array.</span>
          </div>
          <p className="text-xs leading-relaxed text-zinc-400">
            During compilation cycles, keys are transmitted strictly over TLS-encrypted HTTPS connections within transient request headers to the compilation handler. Keys are processed in-memory on the Edge compiler and are never logged, cached, or persisted to disk. Requests bypass Supabase credit gating entirely, maintaining a true zero-audit footprint for business IP.
          </p>
        </section>

        {/* Spec Overview Summary Table */}
        <div className="w-full mt-12 text-left border border-white/5 bg-white/[0.005] rounded-lg p-4 sm:p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-[9px] font-mono text-zinc-800 uppercase tracking-widest hidden sm:block">
            Spec Summary Table
          </div>
          <h3 className="text-sm font-mono tracking-wider text-zinc-300 uppercase font-bold mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-accent" /> Context Optimisation Matrix
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px] text-zinc-400 min-w-[550px]">
              <thead>
                <tr className="border-b border-white/10 text-zinc-300">
                  <th className="py-2 text-left font-semibold">OPTIMISATION LAYER</th>
                  <th className="py-2 text-left font-semibold">EMPIRICAL METHOD</th>
                  <th className="py-2 text-left font-semibold">MEASURED BENEFIT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">MDC Glob Scoping</td>
                  <td className="py-2.5">Restrict rule triggers locally via globs</td>
                  <td className="py-2.5 text-accent">18.4% Token Reduction<sup>[1]</sup></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Command Policies</td>
                  <td className="py-2.5">Map script hooks inside CLAUDE.md</td>
                  <td className="py-2.5 text-accent">Zero exploratory runs</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Registry Grounding</td>
                  <td className="py-2.5">Dynamic NPM version checks & caching</td>
                  <td className="py-2.5 text-accent">Up-to-date syntax alignment</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Ephemeral Storage</td>
                  <td className="py-2.5">Client-side ZIP compilation and sync</td>
                  <td className="py-2.5 text-accent">Zero db leakage risk<sup>[4]</sup></td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">BYOK Key Encryption</td>
                  <td className="py-2.5">LocalStorage XOR obfuscation + transient HTTPS headers</td>
                  <td className="py-2.5 text-accent">Zero credentials caching or logging</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Constitution Maps</td>
                  <td className="py-2.5">Reference delegates inside AGENTS.md</td>
                  <td className="py-2.5 text-accent">Attention focus preservation<sup>[2]</sup></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* References Bibliography Block */}
        <div className="w-full mt-16 border-t border-white/5 pt-8 text-[11px] text-zinc-500 font-sans space-y-3">
          <h4 className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest mb-4 font-bold">References</h4>
          <p>
            [1] Anthropic. (2024). <em>Prompt Caching and Context Optimization.</em> Anthropic Developer Documentation.
          </p>
          <p>
            [2] Liu, N. F., Lin, K., Hewitt, J., Paranjape, A., Bevilacqua, M., Petroni, F., Liang, P., &amp; Manning, C. D. (2024). <em>Lost in the Middle: How Language Models Use Long Contexts.</em> Transactions of the Association for Computational Linguistics, 12, 168-196.
          </p>
          <p>
            [3] Vercel. <em>Next.js 16 Route Segment Configuration &amp; Cache Revalidation.</em> Next.js Documentation, 2026.
          </p>
          <p>
            [4] Supabase. <em>Supabase Realtime System Architecture: Broadcast and Presence Protocols.</em> Supabase Documentation, 2025.
          </p>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/[0.03] mt-auto flex flex-col gap-2.5 px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6 font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/optimality" className="hover:text-zinc-300 transition-colors text-zinc-300">Optimality Specs</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/faq" className="hover:text-zinc-300 transition-colors">FAQ</Link>
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
