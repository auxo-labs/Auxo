'use client';

import * as React from 'react';
import { FileText, Folder, FolderOpen, Terminal, Eye, Sparkles, AlertCircle } from 'lucide-react';

interface PreviewProps {
  compiledFiles: Record<string, string> | null;
  activeFile: string;
  onActiveFileChange: (fileName: string) => void;
}

export function Preview({ compiledFiles, activeFile, onActiveFileChange }: PreviewProps) {
  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({
    root: true,
    cursor: true,
    rules: true,
  });

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }));
  };

  // Safe checks if no compilation has run yet
  const hasFiles = compiledFiles && Object.keys(compiledFiles).length > 0;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-card/25">
      <div className="flex items-center justify-between px-6 h-10 border-b border-white/5 bg-white/[0.01]">
        <span className="text-xs font-mono tracking-wider text-muted-foreground uppercase flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-accent" /> Compiled Output Preview
        </span>
        <span className="text-[10px] text-accent/80 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 animate-spin" /> Auto-Generated View
        </span>
      </div>

      {!hasFiles ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center text-muted-foreground">
          <AlertCircle className="w-8 h-8 text-muted-foreground/40 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-300">No Compiled Files Yet</h3>
          <p className="max-w-xs mt-2 text-xs">
            Type out your requirements in the collaborative scratchpad, then click <strong className="text-primary">"Compile Agent Pack"</strong> to run the parser.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden h-full">
          {/* File Explorer Tree */}
          <div className="md:col-span-1 border-r border-white/5 bg-card/10 overflow-y-auto p-4 font-mono text-xs text-zinc-300">
            <h4 className="mb-4 text-[10px] tracking-widest text-muted-foreground uppercase font-bold">Files Matrix</h4>
            
            {/* Directory Root */}
            <div className="space-y-1">
              <div onClick={() => toggleFolder('root')} className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-white/5 cursor-pointer">
                {expandedFolders.root ? <FolderOpen className="w-3.5 h-3.5 text-primary" /> : <Folder className="w-3.5 h-3.5 text-primary" />}
                <span className="font-semibold text-zinc-100">repo-root</span>
              </div>

              {expandedFolders.root && (
                <div className="pl-4 space-y-1">
                  {/* AGENTS.md */}
                  {compiledFiles['AGENTS.md'] && (
                    <div 
                      onClick={() => onActiveFileChange('AGENTS.md')}
                      className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${activeFile === 'AGENTS.md' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'hover:bg-white/5'}`}
                    >
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      <span>AGENTS.md</span>
                    </div>
                  )}

                  {/* CLAUDE.md */}
                  {compiledFiles['CLAUDE.md'] && (
                    <div 
                      onClick={() => onActiveFileChange('CLAUDE.md')}
                      className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${activeFile === 'CLAUDE.md' ? 'bg-primary/20 text-white border-l-2 border-primary' : 'hover:bg-white/5'}`}
                    >
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      <span>CLAUDE.md</span>
                    </div>
                  )}

                  {/* .cursor Directory */}
                  <div>
                    <div onClick={() => toggleFolder('cursor')} className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-white/5 cursor-pointer">
                      {expandedFolders.cursor ? <FolderOpen className="w-3.5 h-3.5 text-accent" /> : <Folder className="w-3.5 h-3.5 text-accent" />}
                      <span>.cursor</span>
                    </div>

                    {expandedFolders.cursor && (
                      <div className="pl-4 space-y-1">
                        {/* rules Directory */}
                        <div>
                          <div onClick={() => toggleFolder('rules')} className="flex items-center gap-1.5 py-1 px-1.5 rounded hover:bg-white/5 cursor-pointer">
                            {expandedFolders.rules ? <FolderOpen className="w-3.5 h-3.5 text-accent/80" /> : <Folder className="w-3.5 h-3.5 text-accent/80" />}
                            <span>rules</span>
                          </div>

                          {expandedFolders.rules && (
                            <div className="pl-4 space-y-1">
                              {/* api.mdc */}
                              {compiledFiles['api.mdc'] && (
                                <div 
                                  onClick={() => onActiveFileChange('api.mdc')}
                                  className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${activeFile === 'api.mdc' ? 'bg-accent/20 text-white border-l-2 border-accent' : 'hover:bg-white/5'}`}
                                >
                                  <Terminal className="w-3.5 h-3.5 text-accent/60" />
                                  <span>api.mdc</span>
                                </div>
                              )}

                              {/* ui.mdc */}
                              {compiledFiles['ui.mdc'] && (
                                <div 
                                  onClick={() => onActiveFileChange('ui.mdc')}
                                  className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-colors ${activeFile === 'ui.mdc' ? 'bg-accent/20 text-white border-l-2 border-accent' : 'hover:bg-white/5'}`}
                                >
                                  <Terminal className="w-3.5 h-3.5 text-accent/60" />
                                  <span>ui.mdc</span>
                                </div>
                              )}
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

          {/* Compiled File Preview Pane */}
          <div className="md:col-span-2 flex flex-col overflow-hidden bg-black/40 h-full">
            <div className="flex items-center px-4 h-8 bg-black/60 border-b border-white/5 text-[10px] text-muted-foreground font-mono">
              PREVIEWING: {activeFile}
            </div>
            <pre className="flex-1 p-6 overflow-y-auto font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {compiledFiles[activeFile] || 'Select a file to preview its content.'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
