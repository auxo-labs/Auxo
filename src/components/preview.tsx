'use client';

import * as React from 'react';
import { FileText, Folder, FolderOpen, Terminal, Eye, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import { CompiledPack } from '@/lib/prompt-compiler';

interface PreviewProps {
  compiledFiles: CompiledPack | null;
  activeFile: string;
  onActiveFileChange: (fileName: string) => void;
}

export function Preview({ compiledFiles, activeFile, onActiveFileChange }: PreviewProps) {
  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({
    root: true,
    cursor: true,
    rules: true,
  });
  const [copiedText, setCopiedText] = React.useState(false);

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
    if (activeFile === 'prompt.md') return compiledFiles.promptMd || '';
    if (activeFile === 'phases.md') return compiledFiles.phasesMd || '';
    return compiledFiles.cursorRules[activeFile] || '';
  };

  const currentContent = getCurrentContent();
  const lines = currentContent.split('\n');

  // List of dynamic rules generated under .cursor/rules
  const ruleFiles = compiledFiles ? Object.keys(compiledFiles.cursorRules) : [];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#0a0a0c]/80 border-t lg:border-t-0 lg:border-l border-white/[0.03]">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 h-10 border-b border-white/[0.03] bg-zinc-950/40">
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-zinc-500" /> 02 // compiled_agent_pack
        </span>
        {hasFiles && (
          <span className="text-[10px] text-accent/80 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" /> compiled
          </span>
        )}
      </div>

      {!hasFiles ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center text-zinc-500">
          <AlertCircle className="w-6 h-6 text-zinc-600 mb-3" />
          <h3 className="text-xs font-mono tracking-wider text-zinc-400 uppercase">Awaiting Compilation</h3>
          <p className="max-w-xs mt-2 text-xs font-sans text-zinc-500 leading-relaxed">
            Outlines from your scratchpad will be split-parsed into clean files. Click <strong className="text-zinc-300">&quot;Compile Agent Pack&quot;</strong> above to run the prompt engine.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 flex-1 overflow-hidden h-full">
          {/* Files Explorer Tree Column */}
          <div className="md:col-span-1 border-r border-white/[0.03] bg-zinc-950/20 overflow-y-auto p-5 font-mono text-[11px] text-zinc-400 select-none">
            <h4 className="mb-4 text-[9px] tracking-widest text-zinc-600 uppercase font-bold">Workspace Structure</h4>
            
            <div className="space-y-1">
              {/* Repo root folder */}
              <div onClick={() => toggleFolder('root')} className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/[0.02] cursor-pointer text-zinc-300">
                {expandedFolders.root ? <FolderOpen className="w-3.5 h-3.5 text-zinc-500" /> : <Folder className="w-3.5 h-3.5 text-zinc-500" />}
                <span className="font-semibold text-zinc-300">repo-root</span>
              </div>

              {expandedFolders.root && (
                <div className="pl-4 ml-1.5 border-l border-white/[0.03] space-y-1.5 py-1">
                  
                  {/* AGENTS.md file */}
                  <div 
                    onClick={() => onActiveFileChange('AGENTS.md')}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors ${activeFile === 'AGENTS.md' ? 'bg-white/[0.03] text-zinc-100 border-l border-white' : 'hover:bg-white/[0.02]'}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>AGENTS.md</span>
                  </div>

                  {/* CLAUDE.md file */}
                  <div 
                    onClick={() => onActiveFileChange('CLAUDE.md')}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors ${activeFile === 'CLAUDE.md' ? 'bg-white/[0.03] text-zinc-100 border-l border-white' : 'hover:bg-white/[0.02]'}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>CLAUDE.md</span>
                  </div>

                  {/* prompt.md file */}
                  <div 
                    onClick={() => onActiveFileChange('prompt.md')}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors ${activeFile === 'prompt.md' ? 'bg-white/[0.03] text-zinc-100 border-l border-white' : 'hover:bg-white/[0.02]'}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>prompt.md</span>
                  </div>

                  {/* phases.md file */}
                  <div 
                    onClick={() => onActiveFileChange('phases.md')}
                    className={`flex items-center gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors ${activeFile === 'phases.md' ? 'bg-white/[0.03] text-zinc-100 border-l border-white' : 'hover:bg-white/[0.02]'}`}
                  >
                    <FileText className="w-3.5 h-3.5 text-zinc-500" />
                    <span>phases.md</span>
                  </div>

                  {/* .cursor folder */}
                  <div>
                    <div onClick={() => toggleFolder('cursor')} className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/[0.02] cursor-pointer">
                      {expandedFolders.cursor ? <FolderOpen className="w-3.5 h-3.5 text-zinc-600" /> : <Folder className="w-3.5 h-3.5 text-zinc-600" />}
                      <span>.cursor</span>
                    </div>

                    {expandedFolders.cursor && (
                      <div className="pl-4 ml-1.5 border-l border-white/[0.03] space-y-1 py-1">
                        
                        {/* rules folder */}
                        <div>
                          <div onClick={() => toggleFolder('rules')} className="flex items-center gap-2 py-1 px-1.5 rounded hover:bg-white/[0.02] cursor-pointer">
                            {expandedFolders.rules ? <FolderOpen className="w-3.5 h-3.5 text-zinc-600" /> : <Folder className="w-3.5 h-3.5 text-zinc-600" />}
                            <span>rules</span>
                          </div>

                          {expandedFolders.rules && (
                            <div className="pl-4 ml-1.5 border-l border-white/[0.03] space-y-1 py-1">
                              {/* Dynamic .mdc rule files */}
                              {ruleFiles.map(ruleName => (
                                <div 
                                  key={ruleName}
                                  onClick={() => onActiveFileChange(ruleName)}
                                  className={`flex items-center gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors ${activeFile === ruleName ? 'bg-white/[0.03] text-zinc-100 border-l border-white' : 'hover:bg-white/[0.02]'}`}
                                >
                                  <Terminal className="w-3.5 h-3.5 text-zinc-600" />
                                  <span>{ruleName}</span>
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

          {/* Code View Pane */}
          <div className="md:col-span-2 flex flex-col overflow-hidden bg-zinc-950/40 h-full relative group">
            
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
            <div className="flex-1 overflow-y-auto p-6 flex font-mono text-xs text-zinc-300 leading-relaxed bg-[#09090b]/10 selection:bg-zinc-800">
              
              {/* Gutter Column */}
              <div className="text-zinc-600 text-right pr-5 select-none border-r border-white/[0.03] w-10 shrink-0 select-none">
                {lines.map((_, index) => (
                  <div key={index} className="h-5">{index + 1}</div>
                ))}
              </div>

              {/* Code Column */}
              <pre className="pl-5 overflow-x-auto whitespace-pre font-mono flex-1">
                {lines.map((line, index) => (
                  <div key={index} className="h-5">{line}</div>
                ))}
              </pre>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
