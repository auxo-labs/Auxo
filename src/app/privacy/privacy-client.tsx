'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export function PrivacyClient() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col min-h-screen bg-background overflow-hidden selection:bg-zinc-800 selection:text-zinc-100 font-sans text-zinc-300">
      {/* Fine-dot backdrop & gradient mask */}
      <div className="absolute inset-0 dot-bg dot-mask pointer-events-none" />

      {/* Soft background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-glow-radial rounded-full pointer-events-none blur-3xl opacity-75" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-glow-teal rounded-full pointer-events-none blur-3xl opacity-50" />

      {/* Minimal Navigation Bar */}
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

      {/* Privacy Content Section */}
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

        {/* Core Principles */}
        <div className="p-5 sm:p-6 rounded-lg border border-white/5 bg-white/[0.01] mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-[9px] font-mono text-zinc-700 font-bold uppercase">
            Data Architecture
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed font-sans">
            Auxo operates on a strict <strong>Privacy-by-Design</strong> model. All code plans, stack structures, and outline documents are treated as transient developer metadata. We enforce isolation, zero persistent telemetry, and client-side encryption of keys to secure your intellectual property.
          </p>
        </div>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            1. Zero-Telemetry Cloud Compilations
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            For users running <strong>Deep AI Compiles</strong> using Auxo Cloud credits:
          </p>
          <ul className="list-disc pl-5 font-mono text-[11px] text-zinc-400 space-y-2">
            <li><strong>In-Memory Processing:</strong> Workspace outlines are processed transiently in-memory on our edge compiler nodes. No compilation payload is logged or written to disk.</li>
            <li><strong>Immediate Purging:</strong> Requests are deleted from edge runtime memory immediately after the LLM returns the structured response.</li>
            <li><strong>Authorised Access:</strong> Auth sessions and credit counts are queried securely from Supabase using PostgreSQL Row-Level Security (RLS) policies.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            2. Bring Your Own Key (BYOK) Security
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            When configuring personal API keys (OpenAI, Anthropic, or Gemini):
          </p>
          <ul className="list-disc pl-5 font-mono text-[11px] text-zinc-400 space-y-2">
            <li><strong>Client-Side Encryption:</strong> Keys are obfuscated in browser memory using a symmetric XOR-based mask array combined with Base64 encoding before writing to `localStorage` (SEC-08), preventing cleartext cookie-scraping.</li>
            <li><strong>Transient Payloads:</strong> Decrypted keys are sent strictly over TLS-encrypted HTTPS connections within the body of compile request payloads. Keys are never saved or cached by our backend.</li>
            <li><strong>Routing Bypass:</strong> BYOK compilation requests completely bypass credits checks, payment verification, and cloud database operations.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            3. Ephemeral Synchronisation Channels
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            Real-time typing updates and editor synchronisation run over transient Supabase Broadcast and Presence WebSocket channels. Keystrokes are mirrored in-memory between active collaborators and are never persisted to a database.
          </p>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            4. LocalStorage &amp; Local Exporter
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            Scratchpad data is mirrored in your browser&apos;s `localStorage` (keyed by Room UUID) to prevent accidental loss from browser crashes. Zipping is handled entirely in-memory on the client browser using JSZip.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            5. Google API Services User Data Policy
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            When you sign in to Auxo using your Google Account (Google OAuth credentials), or utilise Google services (such as Gemini in BYOK mode), we handle your data in strict compliance with the Google API Services User Data Policy:
          </p>
          <ul className="list-disc pl-5 font-mono text-[11px] text-zinc-400 space-y-3">
            <li>
              <strong>Data Accessed:</strong> Through Google OAuth, we access your basic profile information (specifically: your email address, full name, and profile picture avatar URL). If you configure your personal Google Gemini API key (BYOK mode), your key is processed strictly in-memory to execute the compilation request to Googles API endpoints. We do not store, log, or save your API key on our servers, and we do not access any other Google account data or services.
            </li>
            <li>
              <strong>Data Usage:</strong> We process your Google profile data solely to authenticate your identity, create your unique user account on Auxo, secure collaborative rooms you belong to, and associate your cloud compilation credit balances with your identity. We do not use this data for any advertising, marketing, or profile-building activities.
            </li>
            <li>
              <strong>Data Sharing:</strong> We do not sell, trade, or share your Google user data with any third parties except for our core infrastructure database provider (Supabase) to securely host your profile record, and our payment processor (Stripe) to map credit purchases to your email. We do not share Google user data with any AI model providers.
            </li>
            <li>
              <strong>Data Storage &amp; Protection:</strong> Your profile data is stored in our database hosted on Supabase, protected by Row-Level Security (RLS) policies. Access is strictly encrypted via SSL/TLS. Any user-supplied API keys (including Gemini API keys) are XOR-obfuscated and stored exclusively in your local browser storage, never sent to or stored on our servers.
            </li>
            <li>
              <strong>Data Retention &amp; Deletion:</strong> We retain your profile data as long as your account remains active. You can request the permanent deletion of your account and all associated Google user data at any time by contacting our support team at <a href="mailto:woo9ine@gmail.com" className="text-accent underline">woo9ine@gmail.com</a>. We will process and fulfill all deletion requests within 30 days of receipt, in compliance with GDPR and other data protection regulations.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            6. Your Rights Under GDPR
          </h2>
          <p className="text-xs leading-relaxed mb-4 text-zinc-400">
            If you reside in the European Economic Area (EEA), the United Kingdom, or jurisdictions with similar privacy laws, you possess the following rights regarding your personal data under the General Data Protection Regulation (GDPR):
          </p>
          <ul className="list-disc pl-5 font-mono text-[11px] text-zinc-400 space-y-2">
            <li><strong>Right of Access &amp; Portability:</strong> You have the right to request copies of the personal data we hold about you and request its transfer to another service.</li>
            <li><strong>Right to Rectification:</strong> You can request that we correct any inaccurate or incomplete personal data.</li>
            <li><strong>Right to Erasure (Deletion):</strong> You can request that we erase your personal data. As stated above, we will fulfill erasure requests within 30 days of receipt.</li>
            <li><strong>Right to Restrict or Object:</strong> You have the right to object to, or request that we restrict, the processing of your personal data under certain conditions.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            7. Children&apos;s Privacy
          </h2>
          <p className="text-xs leading-relaxed text-zinc-400">
            Auxo is a utility tool designed strictly for developers and is not directed at children under the age of 13 (or under the age of 16 in the European Union). We do not knowingly collect or solicit personal data from children. If we discover we have collected data from a child under these limits, we will delete it immediately.
          </p>
        </section>

        {/* Section 8 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            8. International Data Transfers
          </h2>
          <p className="text-xs leading-relaxed text-zinc-400">
            We store and process your data using trusted third-party providers (Supabase and Stripe) whose servers may be located outside of your home country, including in the United States. Where personal data is transferred internationally, we ensure that appropriate safeguards (such as Standard Contractual Clauses) are in place with our processors to protect your information.
          </p>
        </section>

        {/* Section 9 */}
        <section className="mb-10">
          <h2 className="text-lg font-mono text-zinc-200 uppercase tracking-widest mb-4 border-b border-white/[0.03] pb-2">
            9. Contact &amp; Controller Identity
          </h2>
          <p className="text-xs leading-relaxed text-zinc-400">
            The data controller for Auxo is <strong>Auxo Intellectual Property Labs</strong>. If you have any questions about these specifications, or wish to exercise any of your data protection rights, please contact us at <a href="mailto:woo9ine@gmail.com" className="text-accent underline">woo9ine@gmail.com</a>. We will update the &quot;Published&quot; date at the top of this document whenever updates are made to our privacy practices.
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
                  <td className="py-2.5 font-bold text-zinc-300">Scratchpad Content</td>
                  <td className="py-2.5">Client LocalStorage / In-memory Edge</td>
                  <td className="py-2.5 text-accent">Discarded immediately on Edge response</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Private API Keys (BYOK)</td>
                  <td className="py-2.5">Client LocalStorage (XOR Obfuscated)</td>
                  <td className="py-2.5 text-accent">Retained locally until cleared by user</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Sync Keystrokes</td>
                  <td className="py-2.5">Transient WebSockets (Supabase Broadcast)</td>
                  <td className="py-2.5 text-accent">Zero retention (No database logs)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Stripe Billing Session</td>
                  <td className="py-2.5">Stripe Dashboard / Postgres Accounts</td>
                  <td className="py-2.5 text-accent">Permanent (For auditing and credits)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Saved Projects</td>
                  <td className="py-2.5">Postgres DB (RLS Protected)</td>
                  <td className="py-2.5 text-accent">Persistent (Deletable by user)</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-zinc-300">Google OAuth Profile</td>
                  <td className="py-2.5">Postgres DB (RLS Protected)</td>
                  <td className="py-2.5 text-accent">Persistent (Deletable on request)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 text-center border-t border-white/[0.03] mt-auto flex flex-col gap-2.5 px-4">
        <div className="flex items-center justify-center gap-4 sm:gap-6 font-mono text-[9px] sm:text-[10px] text-zinc-500 uppercase tracking-widest">
          <Link href="/" className="hover:text-zinc-300 transition-colors">Home</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/optimality" className="hover:text-zinc-300 transition-colors">Optimality Specs</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/faq" className="hover:text-zinc-300 transition-colors">FAQ</Link>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <Link href="/privacy" className="hover:text-zinc-300 transition-colors text-zinc-300">Privacy Specs</Link>
        </div>
        <span className="font-mono text-[8px] sm:text-[9px] text-zinc-600 tracking-wider sm:tracking-widest uppercase">
          &copy; 2026 AUXO INTELLECTUAL PROPERTY LABS. ALL RIGHTS RELEASED.
        </span>
      </footer>
    </div>
  );
}
