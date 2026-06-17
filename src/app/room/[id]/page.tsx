'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft, Copy, Check, Play, ShieldAlert, Users, Download } from 'lucide-react';
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { CompiledPack } from '@/lib/prompt-compiler';
import JSZip from 'jszip';

interface PageProps {
  params: Promise<{ id: string }>;
}

function RoomContent({ roomId }: { roomId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── State ─────────────────────────────────────────────────────────────────
  const [markdownText, setMarkdownText] = React.useState<string>(
    `# Project Auxo\n\n` +
    `## Stack\n- Next.js (App Router)\n- TailwindCSS\n- Supabase (Realtime)\n\n` +
    `## Goals\nBuild a zero-auth real-time markdown playground for founders to collaborate.`
  );
  const [compiledFiles, setCompiledFiles] = React.useState<CompiledPack | null>(null);
  const [activeFile, setActiveFile] = React.useState<string>('AGENTS.md');
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [isCompiling, setIsCompiling] = React.useState(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isMac, setIsMac] = React.useState(true);
  const [usersCount, setUsersCount] = React.useState<number>(1);
  const [connectionStatus, setConnectionStatus] = React.useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  // ── Simple mount effects ───────────────────────────────────────────────────

  // Detect OS for keyboard label renderings (⌘ vs Ctrl)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Restore scratchpad text from LocalStorage on mount
  React.useEffect(() => {
    const savedText = localStorage.getItem(`auxo-room-${roomId}`);
    if (savedText) {
      setTimeout(() => setMarkdownText(savedText), 0);
    }
  }, [roomId]);

  // Mirror scratchpad changes to LocalStorage on every edit
  React.useEffect(() => {
    localStorage.setItem(`auxo-room-${roomId}`, markdownText);
  }, [roomId, markdownText]);

  // ── Handlers (all declared before any effects that reference them) ─────────

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleCompile = async (forcedSessionId?: string): Promise<CompiledPack | undefined> => {
    if (isCompiling) return;
    try {
      setIsCompiling(true);
      const targetSessionId = forcedSessionId ?? searchParams.get('session_id');

      if (!targetSessionId) {
        // No paid session → redirect user to Stripe Checkout
        const checkoutRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId }),
        });
        if (!checkoutRes.ok) throw new Error('Failed to generate checkout session');
        const { url } = await checkoutRes.json();
        window.location.href = url;
        return;
      }

      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markdownText, roomId, sessionId: targetSessionId }),
      });
      if (!response.ok) throw new Error(`Compile route failed: ${response.statusText}`);

      const files: CompiledPack = await response.json();
      setCompiledFiles(files);
      setActiveFile('AGENTS.md');
      return files;
    } catch (error) {
      console.error('Compilation failure:', error);
      alert('Failed to compile context blueprint. Inspect server logs.');
    } finally {
      setIsCompiling(false);
    }
  };

  const handleDownload = async (filesToDownload?: CompiledPack) => {
    const targetFiles = filesToDownload ?? compiledFiles;
    if (!targetFiles || isDownloading) return;
    try {
      setIsDownloading(true);
      const zip = new JSZip();
      zip.file('AGENTS.md', targetFiles.agentsMd);
      zip.file('CLAUDE.md', targetFiles.claudeMd);

      const cursorFolder = zip.folder('.cursor');
      if (cursorFolder) {
        const rulesFolder = cursorFolder.folder('rules');
        if (rulesFolder) {
          Object.entries(targetFiles.cursorRules).forEach(([name, content]) => {
            rulesFolder.file(name, content);
          });
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `auxo-blueprint-${roomId.slice(0, 8)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Zipping failed:', error);
      alert('Failed to generate ZIP download.');
    } finally {
      setIsDownloading(false);
    }
  };

  // ── Effects that depend on handlers (declared after handlers) ─────────────

  // Auto-compile + download after a successful Stripe checkout redirect
  React.useEffect(() => {
    const querySessionId = searchParams.get('session_id');
    if (!querySessionId || compiledFiles || isCompiling) return;

    const autoRun = async () => {
      await handleCompile(querySessionId);
      // Strip session_id from URL to prevent re-triggering on refresh
      window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
      // Download is intentionally NOT triggered here — the user clicks "Download Pack" manually.
    };

    autoRun();
  // We intentionally omit handleCompile/handleDownload from deps here.
  // They are stable plain functions; adding them would cause an infinite loop
  // because they close over state that changes during the autoRun itself.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Global keyboard shortcuts — re-registers whenever compiledFiles changes
  // so the ⌘S guard is always fresh.
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key === 'Enter') { e.preventDefault(); handleCompile(); return; }
      if (isCmd && e.key === 's' && compiledFiles) { e.preventDefault(); handleDownload(); return; }
      if (isCmd && e.shiftKey && e.key.toLowerCase() === 'c') { e.preventDefault(); handleCopyLink(); return; }
      if (e.key === 'Escape') {
        const el = document.activeElement;
        if (el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT')) return;
        e.preventDefault();
        router.push('/');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  // handleCompile/handleDownload/handleCopyLink are plain functions defined
  // in render scope — the React Compiler will handle stabilisation.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, compiledFiles]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':   return <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />;
      case 'connecting':  return <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />;
      default:            return <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':  return 'SYNCED';
      case 'connecting': return 'CONNECTING';
      default:           return 'OFFLINE';
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-background font-sans selection:bg-zinc-800">

      {/* Header Toolbar */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-white/[0.03] bg-zinc-950/20 backdrop-blur-md z-20">

        {/* Brand & Connection */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-7 h-7 rounded border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all text-zinc-400 hover:text-zinc-200 cursor-pointer"
            title="Go to landing page (Esc)"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-semibold tracking-tight text-zinc-300">AUXO // BLUEPRINT</span>
            <span className="h-3 w-px bg-white/10" />
            <div className="flex items-center gap-1.5 px-2 py-0.5 border border-white/5 bg-white/[0.01] rounded">
              <span className="font-mono text-[9px] text-zinc-500 tracking-wider">ROOM:</span>
              <span className="font-mono text-[9px] text-zinc-300 font-semibold">{roomId.slice(0, 8)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {getConnectionIcon()}
              <span className="font-mono text-[8px] tracking-wider text-zinc-500 font-bold">{getConnectionText()}</span>
            </div>
          </div>
        </div>

        {/* Center badge */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono tracking-wider text-amber-500/80 bg-amber-500/[0.02] border border-amber-500/10 px-3 py-1 rounded">
          <ShieldAlert className="w-3 h-3 text-amber-500" />
          <span>ZERO-DATA RETENTION PREVENTATIVE IP SHELTER ACTIVE</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Builder count */}
          <div className="flex items-center gap-2 px-2.5 py-1 border border-white/5 rounded bg-white/[0.01] text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <Users className="w-3 h-3 text-zinc-500" />
            <span>{usersCount} {usersCount === 1 ? 'BUILDER' : 'BUILDERS'}</span>
          </div>

          {/* Copy invite link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 h-8 px-3 rounded border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] text-[10px] font-mono font-semibold tracking-wider text-zinc-300 transition-colors cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">LINK COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span>INVITE</span>
                <span className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700/50 text-[8px] font-mono text-zinc-500 font-medium">
                  {isMac ? '⌘⇧C' : 'Ctrl+Shift+C'}
                </span>
              </>
            )}
          </button>

          {/* Compile */}
          <button
            onClick={() => handleCompile()}
            disabled={isCompiling}
            className="flex items-center justify-center gap-2 h-8 px-4 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-[10px] font-mono font-semibold tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 shadow-sm cursor-pointer"
            title="Compile markdown"
          >
            {isCompiling ? (
              <div className="w-3 h-3 border border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>COMPILE</span>
                <span className="px-1 py-0.5 rounded bg-zinc-200 border border-zinc-300 text-[8px] font-mono text-zinc-600 font-medium">
                  {isMac ? '⌘↵' : 'Ctrl+↵'}
                </span>
              </>
            )}
          </button>

          {/* Download ZIP (visible only after compile) */}
          {compiledFiles && (
            <button
              onClick={() => handleDownload()}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 h-8 px-3 rounded border border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] text-[10px] font-mono font-semibold tracking-wider text-zinc-200 transition-all active:scale-95 cursor-pointer animate-fade-in"
            >
              {isDownloading ? (
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span>DOWNLOAD PACK</span>
                  <span className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700/50 text-[8px] font-mono text-zinc-500 font-medium">
                    {isMac ? '⌘S' : 'Ctrl+S'}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main split-panel layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">

        <Editor
          roomId={roomId}
          value={markdownText}
          onChange={setMarkdownText}
          onUsersChange={setUsersCount}
          onStatusChange={setConnectionStatus}
        />

        <Preview
          compiledFiles={compiledFiles}
          activeFile={activeFile}
          onActiveFileChange={setActiveFile}
        />

      </div>
    </div>
  );
}

export default function RoomPage({ params }: PageProps) {
  const { id: roomId } = React.use(params);
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background text-zinc-500 font-mono text-xs animate-pulse">
        Loading sandbox workspace...
      </div>
    }>
      <RoomContent roomId={roomId} />
    </Suspense>
  );
}
