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

  // Initialize Supabase Channel
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
          // Save cursor selection points to prevent jumping
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          
          onChange(newText);
          
          // Restore cursor selection on next tick
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
        // Map presence entries to determine user count
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

    // Broadcast change instantly over the existing active channel
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
      <div className="flex items-center justify-between px-6 h-10 border-b border-white/5 bg-white/[0.01]">
        <span className="text-xs font-mono tracking-wider text-muted-foreground uppercase">Collaborative Scratchpad (Markdown)</span>
        <span className="text-[10px] text-muted-foreground font-mono">
          {wordCount} words / {characterCount} chars
        </span>
      </div>
      <div className="flex-1 p-4 font-mono text-sm leading-relaxed overflow-y-auto">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleTextChange}
          className="w-full h-full p-4 bg-transparent outline-none resize-none text-zinc-100 border border-transparent focus:border-white/5 rounded-xl transition-all"
          placeholder="Paste raw chaotic notes or outline your app here..."
        />
      </div>
    </div>
  );
}
