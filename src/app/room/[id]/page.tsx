'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Check, Play, ShieldAlert, Users, Network, Wifi, WifiOff } from 'lucide-react';
import { Editor } from '@/components/editor';
import { Preview } from '@/components/preview';
import { CompiledPack } from '@/lib/prompt-compiler';
import JSZip from 'jszip';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RoomPage({ params }: PageProps) {
  const { id: roomId } = React.use(params);
  const router = useRouter();

  // Core Room State
  const [markdownText, setMarkdownText] = React.useState<string>(
    `# Project Auxo\n\n` +
    `## Stack\n- Next.js (App Router)\n- TailwindCSS\n- Supabase (Realtime)\n\n` +
    `## Goals\nBuild a zero-auth real-time markdown playground for founders to collaborate.`
  );
  
  const [compiledFiles, setCompiledFiles] = React.useState<CompiledPack | null>(null);
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

  const handleCompile = async () => {
    try {
      setIsCompiling(true);

      // 1. Call custom Next.js API Route for Software 3.0 Context Compilation
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markdownText }),
      });

      if (!response.ok) {
        throw new Error(`Compile route failed: ${response.statusText}`);
      }

      const files: CompiledPack = await response.json();
      setCompiledFiles(files);
      setActiveFile('AGENTS.md');

      // 2. Generate ZIP file structure containing the dynamic file matrix
      const zip = new JSZip();

      // Set root-level agent standard configurations
      if (files.agentsMd) zip.file('AGENTS.md', files.agentsMd);
      if (files.claudeMd) zip.file('CLAUDE.md', files.claudeMd);

      // Build nested rule definitions (.cursor/rules/)
      const cursorFolder = zip.folder('.cursor');
      if (cursorFolder) {
        const rulesFolder = cursorFolder.folder('rules');
        if (rulesFolder) {
          Object.entries(files.cursorRules).forEach(([name, content]) => {
            rulesFolder.file(name, content);
          });
        }
      }

      // 3. Trigger immediate client-side package download
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
      console.error('Compilation and zipping failure:', error);
      alert('Failed to compile context blueprint. Inspect server logs for details.');
    } finally {
      setIsCompiling(false);
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />;
      case 'connecting':
        return <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />;
      case 'disconnected':
      default:
        return <span className="w-1.5 h-1.5 bg-rose-500 rounded-full" />;
    }
  };

  const getConnectionText = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'SYNCED';
      case 'connecting':
        return 'CONNECTING';
      case 'disconnected':
      default:
        return 'OFFLINE';
    }
  };

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden bg-background font-sans selection:bg-zinc-800">
      
      {/* Header Toolbar */}
      <header className="flex items-center justify-between px-6 h-14 border-b border-white/[0.03] bg-zinc-950/20 backdrop-blur-md z-20">
        
        {/* Brand & Connection Details */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/')}
            className="flex items-center justify-center w-7 h-7 rounded border border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all text-zinc-400 hover:text-zinc-200"
            title="Go to landing page"
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
            
            {/* Status Indicator */}
            <div className="flex items-center gap-1.5">
              {getConnectionIcon()}
              <span className="font-mono text-[8px] tracking-wider text-zinc-500 font-bold">{getConnectionText()}</span>
            </div>
          </div>
        </div>

        {/* Center: Zero-Data Log Warning */}
        <div className="hidden md:flex items-center gap-2 text-[10px] font-mono tracking-wider text-amber-500/80 bg-amber-500/[0.02] border border-amber-500/10 px-3 py-1 rounded">
          <ShieldAlert className="w-3 h-3 text-amber-500" />
          <span>ZERO-DATA RETENTION PREVENTATIVE IP SHELTER ACTIVE</span>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-3">
          {/* Active Builders Counter */}
          <div className="flex items-center gap-2 px-2.5 py-1 border border-white/5 rounded bg-white/[0.01] text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <Users className="w-3 h-3 text-zinc-500" />
            <span>{usersCount} {usersCount === 1 ? 'BUILDER' : 'BUILDERS'}</span>
          </div>

          {/* Copy invite URL */}
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 h-8 px-3 rounded border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.03] text-[10px] font-mono font-semibold tracking-wider text-zinc-300 transition-colors"
          >
            {copiedLink ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">LINK COPIED</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>INVITE PARTNER</span>
              </>
            )}
          </button>

          {/* Compile Button */}
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className="flex items-center justify-center gap-2 h-8 px-4 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 text-[10px] font-mono font-semibold tracking-wider transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-95 shadow-sm cursor-pointer"
          >
            {isCompiling ? (
              <div className="w-3 h-3 border border-zinc-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>COMPILE AGENT PACK</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main split panels viewports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 flex-1 overflow-hidden h-[calc(100vh-3.5rem)]">
        
        {/* Collaborative Markdown Editor */}
        <Editor 
          roomId={roomId}
          value={markdownText}
          onChange={setMarkdownText}
          onUsersChange={setUsersCount}
          onStatusChange={setConnectionStatus}
        />

        {/* Structured Context Matrix Preview */}
        <Preview 
          compiledFiles={compiledFiles}
          activeFile={activeFile}
          onActiveFileChange={setActiveFile}
        />

      </div>
    </div>
  );
}
