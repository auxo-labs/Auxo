  'use client';

import * as React from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  maxLength?: number;
}

export function Editor({
  value,
  onChange,
  isExpanded,
  onToggleExpand,
  maxLength = 15000
}: EditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const lastLocalValueRef = React.useRef(value);

  // Preserve cursor selection state only when a remote update modifies the value asynchronously
  React.useEffect(() => {
    if (value !== lastLocalValueRef.current) {
      const textarea = textareaRef.current;
      if (textarea && document.activeElement === textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.selectionStart = start;
            textareaRef.current.selectionEnd = end;
          }
        }, 0);
      }
      lastLocalValueRef.current = value;
    }
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    lastLocalValueRef.current = newVal;
    onChange(newVal);
  };

  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = value.length;

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
      {/* Fine-border panel header */}
      <div className="flex items-center justify-between px-6 h-10 border-b border-white/[0.03] bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
            01 // scratchpad.md
          </span>
          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              className="flex items-center justify-center w-5 h-5 rounded border border-white/5 hover:border-white/10 hover:bg-white/[0.02] text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
              title={isExpanded ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isExpanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
            </button>
          )}
        </div>
        <span className={`text-[10px] font-mono ${characterCount >= maxLength ? 'text-rose-500 font-bold animate-pulse' : characterCount > maxLength * 0.9 ? 'text-amber-500' : 'text-zinc-600'}`}>
          {wordCount} words &bull; {characterCount.toLocaleString()} / {maxLength.toLocaleString()} chars
        </span>
      </div>

      {/* Structured Text Workspace */}
      <div className="flex-grow relative overflow-hidden bg-zinc-950/20">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          maxLength={maxLength}
          className="w-full h-full p-8 bg-transparent outline-none resize-none text-zinc-300 font-mono text-sm leading-relaxed selection:bg-zinc-800 focus:text-zinc-100"
          placeholder="Paste raw chaotic notes or outline your app here..."
          spellCheck="false"
        />
      </div>
    </div>
  );
}
