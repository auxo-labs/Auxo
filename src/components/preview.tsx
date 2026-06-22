'use client';

import * as React from 'react';
import { FileText, Folder, FolderOpen, Terminal, Sparkles, AlertCircle, Copy, Check, Maximize2, Minimize2 } from 'lucide-react';
import { CompiledPack } from '@/lib/prompt-compiler';
import { useResizable } from '@/app/room/[id]/hooks/useResizable';
import { SplitterHandle } from '@/components/splitter-handle';

interface PreviewProps {
  compiledFiles: CompiledPack | null;
  activeFile: string;
  onActiveFileChange: (fileName: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  isCompiling?: boolean;
}

export function Preview({ compiledFiles, activeFile, onActiveFileChange, isExpanded, onToggleExpand, isCompiling }: PreviewProps) {
  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({
    root: true,
    cursor: true,
    rules: true,
  });
  const [copiedText, setCopiedText] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const {
    size: previewSidebarWidth,
    isResizing: isPreviewSidebarResizing,
    startResizing: startPreviewSidebarResize,
    reset: resetPreviewSidebar
  } = useResizable({
    initialSize: 240,
    minSize: 180,
    maxSize: 400,
    localStorageKey: 'auxo-resizable-preview-sidebar-width'
  });

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }));
  };

  const handleCopyFileContent = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  const hasFiles = compiledFiles !== null;

  // Resolve current active file content
  const getCurrentContent = (): string => {
    if (!compiledFiles) return '';
    if (activeFile === 'AGENTS.md') return compiledFiles.agentsMd || '';
    if (activeFile === 'CLAUDE.md') return compiledFiles.claudeMd || '';
    if (activeFile === 'phases.md') return compiledFiles.phasesMd || '';
    if (activeFile === 'README.md') return compiledFiles.readmeMd || '';
    return (compiledFiles.cursorRules && compiledFiles.cursorRules[activeFile]) || '';
  };

  const currentContent = getCurrentContent();
  const rawLines = currentContent.split('\n');
  // Trim trailing blank lines — without this every trailing \n renders an empty
  // numbered gutter row, creating phantom scrollable space beneath real content.
  let lastContentLine = rawLines.length - 1;
  while (lastContentLine > 0 && rawLines[lastContentLine].trim() === '') {
    lastContentLine--;
  }
  const lines = rawLines.slice(0, lastContentLine + 1);

  // List of dynamic rules generated under .cursor/rules
  const ruleFiles = compiledFiles && compiledFiles.cursorRules ? Object.keys(compiledFiles.cursorRules) : [];

  return (
    <div ref={containerRef} className="flex flex-col h-full overflow-hidden bg-[#0a0a0c]/80 border-t lg:border-t-0 lg:border-l border-white/[0.03]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 h-10 border-b border-white/[0.03] bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            COMPILED AGENT PACK
          </span>
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="flex items-center justify-center w-5 h-5 rounded border border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
              title={isExpanded ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
        {hasFiles && (
          <span className="text-[10px] text-accent/80 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" /> compiled
          </span>
        )}
      </div>

      {isCompiling ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center text-zinc-400 animate-fade-in">
          <div className="relative w-12 h-12 flex items-center justify-center mb-4">
            {/* Ambient background glow */}
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-md animate-pulse" />
            {/* Spinning double-ring border */}
            <div className="absolute inset-0 border border-transparent border-t-accent rounded-full animate-spin duration-1000" />
            <div className="absolute inset-1.5 border border-transparent border-b-accent/50 rounded-full animate-spin duration-700 reverse" />
            <Sparkles className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <h3 className="text-xs font-mono tracking-widest text-zinc-300 uppercase font-bold">Compiling Agent Pack</h3>
          <p className="max-w-xs mt-2 text-[9px] font-mono text-zinc-500 leading-relaxed uppercase tracking-wider animate-pulse">
            Resolving stack versioning & compiling prompt files...
          </p>
        </div>
      ) : !hasFiles ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center text-zinc-500">
          <AlertCircle className="w-6 h-6 text-zinc-600 mb-3" />
          <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Awaiting Compilation</h3>
          <p className="max-w-xs mt-2 text-xs font-sans text-zinc-500 leading-relaxed">
            Outlines from your scratchpad will be split-parsed into clean files. Click <strong className="text-zinc-300">&quot;Compile Agent Pack&quot;</strong> above to run the prompt engine.
          </p>
        </div>
      ) : (
        <div 
          style={{ '--preview-sidebar-width': `${previewSidebarWidth}px` } as React.CSSProperties}
          className="flex flex-col md:flex-row flex-1 overflow-hidden h-full"
        >
          {/* Files Explorer Tree Column */}
          <div 
            className="preview-sidebar-width md:shrink-0 border-b md:border-b-0 md:border-r border-white/[0.03] bg-zinc-950/20 overflow-y-auto p-5 font-mono text-[11px] text-zinc-400 select-none"
          >
            <h4 className="mb-4 text-[9px] tracking-widest text-zinc-600 uppercase font-bold">Workspace Structure</h4>
            
            <div className="space-y-1">
              {/* Repo root folder */}
              <div onClick={() => toggleFolder('root')} className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/[0.02] cursor-pointer text-zinc-300 min-w-0">
                {expandedFolders.root ? <FolderOpen className="w-3.5 h-3.5 text-zinc-500" /> : <Folder className="w-3.5 h-3.5 text-zinc-500" />}
                <span className="font-semibold text-zinc-300 truncate">repo-root</span>
              </div>

              {expandedFolders.root && (
                <div className="pl-4 ml-1.5 border-l border-white/[0.03] space-y-1.5 py-1">
                  
                  {/* README.md file */}
                  <div 
                    onClick={() => onActiveFileChange('README.md')}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors min-w-0 ${activeFile === 'README.md' ? 'bg-white/[0.03] text-zinc-100 border-l border-white' : 'hover:bg-white/[0.02]'}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">README.md</span>
                  </div>

                  {/* AGENTS.md file */}
                  <div 
                    onClick={() => onActiveFileChange('AGENTS.md')}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors min-w-0 ${activeFile === 'AGENTS.md' ? 'bg-white/[0.03] text-zinc-100 border-l border-white' : 'hover:bg-white/[0.02]'}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">AGENTS.md</span>
                  </div>

                  {/* CLAUDE.md file */}
                  <div 
                    onClick={() => onActiveFileChange('CLAUDE.md')}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors min-w-0 ${activeFile === 'CLAUDE.md' ? 'bg-white/[0.03] text-zinc-100 border-l border-white' : 'hover:bg-white/[0.02]'}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">CLAUDE.md</span>
                  </div>

                  {/* phases.md file */}
                  <div 
                    onClick={() => onActiveFileChange('phases.md')}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors min-w-0 ${activeFile === 'phases.md' ? 'bg-white/[0.03] text-zinc-100 border-l border-white' : 'hover:bg-white/[0.02]'}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                    <span className="truncate">phases.md</span>
                  </div>

                  {/* .cursor folder */}
                  <div>
                    <div onClick={() => toggleFolder('cursor')} className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/[0.02] cursor-pointer min-w-0">
                      {expandedFolders.cursor ? <FolderOpen className="w-3.5 h-3.5 text-zinc-600 shrink-0" /> : <Folder className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                      <span className="truncate">.cursor</span>
                    </div>

                    {expandedFolders.cursor && (
                      <div className="pl-4 ml-1.5 border-l border-white/[0.03] space-y-1 py-1">
                        
                        {/* rules folder */}
                        <div>
                          <div onClick={() => toggleFolder('rules')} className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/[0.02] cursor-pointer min-w-0">
                            {expandedFolders.rules ? <FolderOpen className="w-3.5 h-3.5 text-zinc-600 shrink-0" /> : <Folder className="w-3.5 h-3.5 text-zinc-600 shrink-0" />}
                            <span className="truncate">rules</span>
                          </div>

                          {expandedFolders.rules && (
                            <div className="pl-4 ml-1.5 border-l border-white/[0.03] space-y-1 py-1">
                              {/* Dynamic .mdc rule files */}
                              {ruleFiles.map(ruleName => (
                                <div 
                                  key={ruleName}
                                  onClick={() => onActiveFileChange(ruleName)}
                                  className={`flex items-center gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors min-w-0 ${activeFile === ruleName ? 'bg-white/[0.03] text-zinc-100 border-l border-white' : 'hover:bg-white/[0.02]'}`}
                                >
                                  <Terminal className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                                  <span className="truncate">{ruleName}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>

          <SplitterHandle
            onMouseDown={(e) => startPreviewSidebarResize(e, (clientX) => {
              const container = containerRef.current;
              if (!container) return 240;
              const rect = container.getBoundingClientRect();
              return clientX - rect.left;
            })}
            onTouchStart={(e) => startPreviewSidebarResize(e, (clientX) => {
              const container = containerRef.current;
              if (!container) return 240;
              const rect = container.getBoundingClientRect();
              return clientX - rect.left;
            })}
            onDoubleClick={resetPreviewSidebar}
            isResizing={isPreviewSidebarResizing}
            className="hidden md:block"
          />

          {/* Code View Pane */}
          <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950/40 h-full relative group">
            
            {/* Minimal Code toolbar */}
            <div className="flex items-center justify-between px-4 h-8 bg-zinc-950/80 border-b border-white/[0.03] text-[9px] text-zinc-500 font-mono">
              <span>{activeFile.toUpperCase()}</span>
              
              <button
                onClick={() => handleCopyFileContent(currentContent)}
                className="flex items-center gap-1.5 hover:text-zinc-300 transition-colors cursor-pointer bg-white/[0.02] border border-white/5 rounded px-2 py-0.5"
                title="Copy Prompt Content"
              >
                {copiedText ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Structured File lines */}
            <div className="flex-1 overflow-auto overscroll-none py-6 font-mono text-xs text-zinc-300 leading-relaxed bg-[#09090b]/10 selection:bg-zinc-800">
              <div className="flex min-w-max pr-6">
                {/* Gutter Column */}
                <div className="sticky left-0 text-zinc-600 text-right pl-6 pr-4 select-none border-r border-white/[0.03] w-16 shrink-0 bg-[#0a0a0c] z-10">
                  {lines.map((_, index) => (
                    <div key={index} className="h-5">{index + 1}</div>
                  ))}
                </div>

                {/* Code Column */}
                <pre className="pl-5 whitespace-pre font-mono flex-1">
                  {lines.map((line, index) => (
                    <div key={index} className="h-5">{line}</div>
                  ))}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
