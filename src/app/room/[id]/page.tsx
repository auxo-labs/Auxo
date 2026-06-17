'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Copy, Check, Play, ShieldAlert, Users, Network, Wifi, WifiOff
} from 'lucide-react';
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RoomPage({ params }: PageProps) {
  const { id: roomId } = React.use(params);
  const router = useRouter();

  // Core Room State
  const [markdownText, setMarkdownText] = React.useState<string>(
    `# Project PromptOps Blueprint\n\n` +
    `## Stack\n- Next.js (App Router)\n- TailwindCSS\n- Supabase (Realtime)\n\n` +
    `## Goals\nBuild a zero-auth real-time markdown playground for founders to collaborate.`
  );
  
  const [compiledFiles, setCompiledFiles] = React.useState<Record<string, string> | null>(null);
  const [activeFile, setActiveFile] = React.useState<string>('AGENTS.md');
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [isCompiling, setIsCompiling] = React.useState(false);
  
  // Realtime Sync indicators
  const [usersCount, setUsersCount] = React.useState<number>(1);
  const [connectionStatus, setConnectionStatus] = React.useState<'connecting' | 'connected' | 'disconnected'>('connecting');

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const handleCompile = () => {
    setIsCompiling(true);
    // Simulate compilation delay for user feedback (Phase 4 will replace this with the LLM API call)
    setTimeout(() => {
      setIsCompiling(false);
      setCompiledFiles({
        'AGENTS.md': `# AGENTS.md\n\n## Project Context\nName: PromptOps Blueprint\nStack: Next.js (App Router), TailwindCSS, Supabase (Realtime)\n\n## Build & Test Rules\n- Build Command: npm run build\n- Test Command: npm test\n\n## Exclusions\n- No User Authorization/Signups\n- No Kanban Boards`,
        'CLAUDE.md': `# CLAUDE.md\n\n## Rules & References\n@AGENTS.md\n\n## Operating Rules\n- Only deploy on approved zero-retention hosts\n- Build command: npm run dev`,
        'api.mdc': `---\nglobs: src/app/api/**/*\n---\n# API Guidelines\n\n- All API endpoints must be stateless.\n- Ensure zero data retention logic is strictly followed.`,
        'ui.mdc': `---\nglobs: src/components/**/*, src/app/**/*.tsx\n---\n# UI Guidelines\n\n- Use Geist/Geist_Mono font variables.\n- Apply premium glassmorphic cards and obsidian glow classes.`
      });
      setActiveFile('AGENTS.md');
    }, 1200);
  };

  // Connection Indicator UI Helpers
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="w-3.5 h-3.5 text-emerald-400" />;
      case 'connecting':
        return <Network className="w-3.5 h-3.5 text-amber-400 animate-spin" />;
      case 'disconnected':
      default:
        return <WifiOff className="w-3.5 h-3.5 text-rose-500" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Synced';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
      default:
        return 'Offline';
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-background">
      {/* Workspace Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 px-6 h-16 border-b border-white/5 glass z-20">
        {/* Left Side Brand */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-foreground"
            title="Go to landing page"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">Auxo Workspace</span>
              <span className="px-2 py-0.5 text-[10px] font-medium tracking-wider text-accent border border-accent/20 rounded-md bg-accent/5">
                ROOM: {roomId.slice(0, 8)}...
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              {getConnectionIcon()}
              <span>{getConnectionText()}</span>
            </div>
          </div>
        </div>

        {/* Center: IP Protection Safety */}
        <div className="hidden md:flex items-center gap-2 text-xs text-amber-400/90 bg-amber-400/5 border border-amber-400/10 px-3 py-1.5 rounded-lg">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>Zero-Data Retention: Raw notes wiped instantly on tab close</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Active Users Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 border border-white/5 rounded-lg bg-white/[0.02] text-xs text-muted-foreground">
            <Users className="w-3.5 h-3.5 text-accent" />
            <span>{usersCount} {usersCount === 1 ? 'Builder' : 'Builders'} online</span>
          </div>

          {/* Copy Link / Invite Partner */}
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-white/5 bg-white/[0.02] text-xs font-medium text-foreground hover:bg-white/[0.06] transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Invite Partner</span>
              </>
            )}
          </button>

          {/* Compile Button */}
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="flex items-center gap-2 h-9 px-4 rounded-lg bg-gradient-to-r from-primary to-accent text-xs font-semibold text-white hover:opacity-90 active:scale-95 transition-all shadow-[0_2px_10px_rgba(99,102,241,0.2)] disabled:opacity-50"
          >
            {isCompiling ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Compile Agent Pack</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Workspace split view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-hidden">
        
        {/* Collaborative Editor component */}
        <Editor 
          roomId={roomId}
          value={markdownText}
          onChange={setMarkdownText}
          onUsersChange={setUsersCount}
          onStatusChange={setConnectionStatus}
        />

        {/* Structured Preview component */}
        <Preview 
          compiledFiles={compiledFiles}
          activeFile={activeFile}
          onActiveFileChange={setActiveFile}
        />

      </div>
    </div>
  );
}
