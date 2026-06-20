'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ArrowLeft, Copy, Check, Play, Users, Download, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { CompiledPack, UserConfig } from '@/lib/prompt-compiler';
import JSZip from 'jszip';
import { supabase } from '@/lib/supabase';
import { AuthModal } from '@/components/auth-modal';
import { SettingsModal } from '@/components/settings-modal';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
  const [activeFile, setActiveFile] = React.useState<string>('README.md');
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [isCompiling, setIsCompiling] = React.useState(false);
  const [compileError, setCompileError] = React.useState<string | null>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isMac, setIsMac] = React.useState(true);
  const [usersCount, setUsersCount] = React.useState<number>(1);
  const [connectionStatus, setConnectionStatus] = React.useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [expandedPanel, setExpandedPanel] = React.useState<'none' | 'editor' | 'preview'>('none');
  const [user, setUser] = React.useState<SupabaseUser | null>(null);
  const [profile, setProfile] = React.useState<{ credits: number; is_lifetime: boolean } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = React.useState(false);
  const [userConfig, setUserConfig] = React.useState<UserConfig>(() => {
    if (typeof window !== 'undefined') {
      const provider = (localStorage.getItem('auxo-settings-provider') || 'premium') as UserConfig['provider'];
      let apiKey = undefined;
      let model = undefined;

      if (provider === 'openai') {
        apiKey = localStorage.getItem('auxo-settings-openai-key') || '';
        model = localStorage.getItem('auxo-settings-openai-model') || 'gpt-4o-mini';
      } else if (provider === 'anthropic') {
        apiKey = localStorage.getItem('auxo-settings-anthropic-key') || '';
        model = localStorage.getItem('auxo-settings-anthropic-model') || 'claude-3-5-sonnet-20241022';
      } else if (provider === 'gemini') {
        apiKey = localStorage.getItem('auxo-settings-gemini-key') || '';
        model = localStorage.getItem('auxo-settings-gemini-model') || 'gemini-2.5-flash';
      }

      return { provider, apiKey, model };
    }
    return { provider: 'premium' };
  });
  const [lastCompileType, setLastCompileType] = React.useState<'basic' | 'premium'>('basic');
  const [compileMode, setCompileMode] = React.useState<'basic' | 'premium'>('basic');
  const [showCompileDropdown, setShowCompileDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const isMountedRef = React.useRef(false);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowCompileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // ── Simple mount effects ───────────────────────────────────────────────────

  // Detect OS for keyboard label renderings (⌘ vs Ctrl)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Listen to Supabase Auth state and session changes
  React.useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('credits, is_lifetime')
          .eq('id', userId)
          .single();
        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const activeUser = session?.user ?? null;
      setUser(activeUser);
      if (activeUser) {
        fetchUserProfile(activeUser.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Failed to sign out', err);
    }
  };

  // Restore scratchpad text from LocalStorage on mount
  React.useEffect(() => {
    const savedText = localStorage.getItem(`auxo-room-${roomId}`);
    if (savedText) {
      setTimeout(() => {
        setMarkdownText(savedText);
      }, 0);
    }
    const timer = setTimeout(() => {
      isMountedRef.current = true;
    }, 50);
    return () => clearTimeout(timer);
  }, [roomId]);

  // Mirror scratchpad changes to LocalStorage on every edit
  React.useEffect(() => {
    if (isMountedRef.current) {
      localStorage.setItem(`auxo-room-${roomId}`, markdownText);
    }
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

  const handleCompile = async (type: 'basic' | 'premium', forcedSessionId?: string): Promise<CompiledPack | undefined> => {
    if (isCompiling) return;
    try {
      setIsCompiling(true);
      setCompileError(null);
      setLastCompileType(type);

      const savedText = localStorage.getItem(`auxo-room-${roomId}`);
      const textToCompile = savedText || markdownText;

      if (type === 'basic') {
        const response = await fetch('/api/compile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ markdownText: textToCompile, roomId, compileType: 'basic' }),
        });
        if (!response.ok) {
          let errorMsg = `Compile route failed: ${response.statusText}`;
          try {
            const errData = await response.json();
            if (errData?.error) errorMsg = errData.error;
          } catch {}
          throw new Error(errorMsg);
        }
        const files: CompiledPack = await response.json();
        setCompiledFiles(files);
        setActiveFile('README.md');
        return files;
      }

      // Premium compile handling:
      const hasUserKey = userConfig && userConfig.provider !== 'premium' && userConfig.apiKey && userConfig.apiKey.trim() !== '';

      // 1. Must be authenticated (unless using BYOK custom keys)
      if (!hasUserKey && !user) {
        setIsAuthModalOpen(true);
        return;
      }

      const targetSessionId = forcedSessionId ?? searchParams.get('session_id');

      // 2. Must have credits or lifetime pass (unless using BYOK custom keys)
      if (!hasUserKey && !profile?.is_lifetime && (profile?.credits ?? 0) <= 0 && !targetSessionId) {
        if (!user) return;
        // Redirect to stripe checkout
        const checkoutRes = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ roomId, userId: user.id }),
        });
        if (!checkoutRes.ok) throw new Error('Failed to generate checkout session');
        const { url } = await checkoutRes.json();
        window.location.href = url;
        return;
      }

      // 3. Authenticated and has compilation rights
      // Get JWT token
      const session = (await supabase.auth.getSession()).data.session;
      const token = session?.access_token;

      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ 
          markdownText: textToCompile, 
          roomId, 
          sessionId: targetSessionId || undefined,
          compileType: 'premium',
          userConfig
        }),
      });

      if (!response.ok) {
        let errorMsg = `Compile route failed: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData?.error) errorMsg = errData.error;
        } catch {}
        throw new Error(errorMsg);
      }

      const files: CompiledPack = await response.json();
      setCompiledFiles(files);
      setActiveFile('README.md');
      
      // Refresh user profile in background to decrement credit balance
      if (user) {
        const { data: updatedProfile } = await supabase
          .from('profiles')
          .select('credits, is_lifetime')
          .eq('id', user.id)
          .single();
        if (updatedProfile) {
          setProfile(updatedProfile);
        }
      }
      return files;
    } catch (error) {
      console.error('Compilation failure:', error);
      setCompileError(error instanceof Error ? error.message : 'Failed to compile context blueprint.');
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
      zip.file('phases.md', targetFiles.phasesMd);
      zip.file('README.md', targetFiles.readmeMd);

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
      // Delay compilation slightly to let LocalStorage mount restoration complete
      setTimeout(async () => {
        if (user) {
          try {
            const { data } = await supabase
              .from('profiles')
              .select('credits, is_lifetime')
              .eq('id', user.id)
              .single();
            if (data) setProfile(data);
          } catch {}
        }
        await handleCompile('premium', querySessionId);
        // Strip session_id from URL to prevent re-triggering on refresh
        window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
      }, 100);
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
      if (isCmd && e.key === 'Enter') { e.preventDefault(); handleCompile(compileMode); return; }
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
  }, [router, compiledFiles, compileMode]);

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
            <span className="h-3 w-px bg-white/10 hidden sm:inline" />
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 border border-white/5 bg-white/[0.01] rounded font-mono text-[9px] text-zinc-500">
              <Users className="w-3.5 h-3.5 text-zinc-500" />
              <span>{usersCount} {usersCount === 1 ? 'BUILDER' : 'BUILDERS'}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {/* User Profile Widget */}
          {!user ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] text-[10px] font-mono font-semibold tracking-wider text-zinc-300 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-zinc-400" />
              <span>SIGN IN</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 h-8 px-2.5 rounded border border-white/5 bg-white/[0.01] text-[10px] font-mono tracking-wider text-zinc-300">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="text-zinc-400 font-semibold">{user.email?.split('@')[0].toUpperCase()}</span>
              <span className="h-3 w-px bg-white/10" />
              {profile?.is_lifetime ? (
                <span className="text-[9px] font-bold text-amber-400 font-mono">LIFETIME PRO</span>
              ) : (
                <span className="text-[9px] font-semibold text-zinc-400 font-mono">
                  {profile?.credits ?? 0} {profile?.credits === 1 ? 'CREDIT' : 'CREDITS'}
                </span>
              )}
              <button
                onClick={handleSignOut}
                className="ml-1 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Settings gear button */}
          <button
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] text-[10px] font-mono font-semibold tracking-wider text-zinc-300 transition-colors cursor-pointer"
            title="Compiler Settings"
          >
            <Settings className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden lg:inline">SETTINGS</span>
          </button>

          {/* Copy invite link */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] text-[10px] font-mono font-semibold tracking-wider text-zinc-300 transition-colors cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">LINK COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-zinc-400" />
                <span className="hidden lg:inline">INVITE</span>
                <span className="hidden xl:inline px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700/50 text-[8px] font-mono text-zinc-500 font-medium">
                  {isMac ? '⌘⇧C' : 'Ctrl+Shift+C'}
                </span>
              </>
            )}
          </button>

          {/* Split Compile Button */}
          <div className="relative flex items-center shrink-0" ref={dropdownRef}>
            <button
              onClick={() => handleCompile(compileMode)}
              disabled={isCompiling}
              className={`flex items-center gap-1.5 h-8 px-3 text-[10px] font-mono font-semibold tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 cursor-pointer rounded-l ${
                compileMode === 'basic'
                  ? 'border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] text-zinc-300'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-950'
              }`}
              title={compileMode === 'basic' ? "Compile standard prompt blueprint locally (Free)" : "Compile hyper-tailored 2026 AI Agent Pack (Requires Credits)"}
            >
              {isCompiling ? (
                <div className={`w-3 h-3 border border-t-transparent rounded-full animate-spin ${
                  compileMode === 'basic' ? 'border-zinc-300' : 'border-zinc-950'
                }`} />
              ) : (
                <>
                  <Play className={`w-2.5 h-2.5 fill-current ${
                    compileMode === 'basic' ? 'text-zinc-400' : 'text-zinc-950'
                  }`} />
                  <span>{compileMode === 'basic' ? 'COMPILE BASIC' : 'DEEP AI COMPILE'}</span>
                  {compileMode === 'basic' && (
                    <span className="hidden md:inline px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700/50 text-[8px] font-mono text-zinc-500 font-medium">
                      {isMac ? '⌘↵' : 'Ctrl+↵'}
                    </span>
                  )}
                </>
              )}
            </button>

            <button
              onClick={() => setShowCompileDropdown(!showCompileDropdown)}
              disabled={isCompiling}
              className={`flex items-center justify-center h-8 w-6 rounded-r transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer border-l ${
                compileMode === 'basic'
                  ? 'border border-white/5 border-l-white/10 bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/10 text-zinc-300'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-950 border-l-zinc-300'
              }`}
              title="Change Compile Mode"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            {showCompileDropdown && (
              <div className="absolute top-full right-0 mt-2 w-64 rounded border border-white/5 bg-zinc-950/95 p-1.5 shadow-2xl backdrop-blur-md z-30 animate-fade-in">
                <button
                  onClick={() => {
                    setCompileMode('basic');
                    setShowCompileDropdown(false);
                  }}
                  className={`flex flex-col text-left w-full p-2 rounded transition-colors text-xs font-mono select-none ${
                    compileMode === 'basic'
                      ? 'bg-white/[0.03] text-zinc-100'
                      : 'hover:bg-white/[0.01] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="font-semibold text-[10px] tracking-wide">BASIC AGENT PACK</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5">Offline fallback parsing. Fast and free.</span>
                </button>
                <div className="h-px bg-white/[0.03] my-1" />
                <button
                  onClick={() => {
                    setCompileMode('premium');
                    setShowCompileDropdown(false);
                  }}
                  className={`flex flex-col text-left w-full p-2 rounded transition-colors text-xs font-mono select-none ${
                    compileMode === 'premium'
                      ? 'bg-white/[0.03] text-zinc-100'
                      : 'hover:bg-white/[0.01] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="font-semibold text-[10px] tracking-wide">DEEP AI COMPILE</span>
                  <span className="text-[9px] text-zinc-500 mt-0.5">Grounds details using OpenAI, Anthropic, or Gemini.</span>
                </button>
              </div>
            )}
          </div>

          {/* Download ZIP (visible only after compile) */}
          {compiledFiles && (
            <button
              onClick={() => handleDownload()}
              disabled={isDownloading}
              className="flex items-center justify-center gap-2 h-8 px-3 rounded border border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] text-[10px] font-mono font-semibold tracking-wider text-zinc-200 transition-all active:scale-95 cursor-pointer animate-fade-in shrink-0"
            >
              {isDownloading ? (
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden lg:inline">DOWNLOAD PACK</span>
                  <span className="hidden xl:inline px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700/50 text-[8px] font-mono text-zinc-500 font-medium">
                    {isMac ? '⌘S' : 'Ctrl+S'}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </header>

      {compileError && (
        <div className="flex items-center justify-between gap-4 px-6 py-2.5 bg-red-950/40 border-b border-red-500/20 backdrop-blur-md z-10 animate-fade-in">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-red-500/10 text-red-400 text-[10px] font-mono font-bold animate-pulse">
              !
            </div>
            <span className="text-xs font-mono text-red-200">
              {compileError}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCompile(lastCompileType)}
              className="px-2.5 py-1 text-[9px] font-mono font-semibold tracking-wide bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-200 rounded transition-colors active:scale-95 cursor-pointer"
            >
              RETRY
            </button>
            <button
              onClick={() => setCompileError(null)}
              className="px-2 py-1 text-[9px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      {/* Main split-panel layout */}
      <div className={`grid flex-1 overflow-hidden h-[calc(100vh-3.5rem)] ${
        expandedPanel === 'none' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
      }`}>

        {expandedPanel !== 'preview' && (
          <Editor
            roomId={roomId}
            value={markdownText}
            onChange={setMarkdownText}
            onUsersChange={setUsersCount}
            onStatusChange={setConnectionStatus}
            isExpanded={expandedPanel === 'editor'}
            onToggleExpand={() => setExpandedPanel(prev => prev === 'editor' ? 'none' : 'editor')}
          />
        )}

        {expandedPanel !== 'editor' && (
          <Preview
            compiledFiles={compiledFiles}
            activeFile={activeFile}
            onActiveFileChange={setActiveFile}
            isExpanded={expandedPanel === 'preview'}
            onToggleExpand={() => setExpandedPanel(prev => prev === 'preview' ? 'none' : 'preview')}
          />
        )}

      </div>

      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}

      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={setUserConfig}
        />
      )}
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
