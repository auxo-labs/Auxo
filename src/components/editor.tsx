'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabase';

interface EditorProps {
  roomId: string;
  value: string;
  onChange: (value: string) => void;
  onUsersChange: (count: number) => void;
  onStatusChange: (status: 'connected' | 'connecting' | 'disconnected') => void;
}

export function Editor({ roomId, value, onChange, onUsersChange, onStatusChange }: EditorProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const channelRef = React.useRef<ReturnType<typeof supabase.channel> | null>(null);

  React.useEffect(() => {
    onStatusChange('connecting');

    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        broadcast: { ack: false },
        presence: { key: roomId }
      }
    });

    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'text-change' }, (payload) => {
        const newText = payload.payload.text;
        const textarea = textareaRef.current;
        
        if (textarea && document.activeElement === textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          
          onChange(newText);
          
          setTimeout(() => {
            if (textareaRef.current) {
              textareaRef.current.selectionStart = start;
              textareaRef.current.selectionEnd = end;
            }
          }, 0);
        } else {
          onChange(newText);
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const userCount = Object.keys(state).length;
        onUsersChange(userCount);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          onStatusChange('connected');
          await channel.track({ online_at: new Date().toISOString() });
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          onStatusChange('disconnected');
        }
      });

    return () => {
      onStatusChange('disconnected');
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId, onChange, onUsersChange, onStatusChange]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    onChange(newVal);

    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'text-change',
        payload: { text: newVal }
      });
    }
  };

  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;
  const characterCount = value.length;

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden bg-background">
      {/* Fine-border panel header */}
      <div className="flex items-center justify-between px-6 h-10 border-b border-white/[0.03] bg-zinc-950/40">
        <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
          01 // scratchpad.md
        </span>
        <span className="text-[10px] text-zinc-600 font-mono">
          {wordCount} words &bull; {characterCount} chars
        </span>
      </div>

      {/* Structured Text Workspace */}
      <div className="flex-grow relative overflow-hidden bg-zinc-950/20">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          className="w-full h-full p-8 bg-transparent outline-none resize-none text-zinc-300 font-mono text-sm leading-relaxed selection:bg-zinc-800 focus:text-zinc-100"
          placeholder="Paste raw chaotic notes or outline your app here..."
          spellCheck="false"
        />
      </div>
    </div>
  );
}
