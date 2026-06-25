'use client';

import * as React from 'react';
import { X, Copy, Check, MessageSquare, Mail } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
}

export function SupportModal({ isOpen, onClose, roomId }: SupportModalProps) {
  const [copiedRoomId, setCopiedRoomId] = React.useState(false);
  const [copiedEmail, setCopiedEmail] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyRoomId = async () => {
    if (!roomId) return;
    try {
      await navigator.clipboard.writeText(roomId);
      setCopiedRoomId(true);
      setTimeout(() => setCopiedRoomId(false), 2000);
    } catch (err) {
      console.error('Failed to copy Room ID', err);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('woo9ine@gmail.com');
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error('Failed to copy email', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm rounded-lg border border-white/5 bg-zinc-950/90 p-6 shadow-2xl backdrop-blur-md">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-5">
          <div className="space-y-2">
            <h3 className="font-mono text-sm font-semibold tracking-wide text-zinc-200">
              SUPPORT & FEEDBACK
            </h3>
            <p className="text-[10px] font-mono text-zinc-400 leading-relaxed">
              Have issues with compiling, Stripe billing, or credit balances? Get in touch with our team.
            </p>
          </div>

          <div className="space-y-3.5">
            {/* Contact Method: X.com DMs */}
            <div className="p-3 rounded border border-white/5 bg-white/[0.01] flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded bg-zinc-900 border border-white/5 text-zinc-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Direct Message on X</p>
                <a href="https://x.com/dksosnhejejd" target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-zinc-300 hover:text-zinc-100 transition-colors break-all">
                  @dksosnhejejd
                </a>
              </div>
            </div>

            {/* Contact Method: Email */}
            {/* Contact Method: Email */}
            <div className="p-3 rounded border border-white/5 bg-white/[0.01] flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex items-center justify-center w-8 h-8 rounded bg-zinc-900 border border-white/5 text-zinc-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Email Support</p>
                  <button 
                    onClick={handleCopyEmail}
                    className="text-xs font-mono text-zinc-300 hover:text-zinc-100 transition-colors break-all text-left block w-full focus:outline-none cursor-pointer"
                  >
                    woo9ine@gmail.com
                  </button>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="flex items-center justify-center w-7 h-7 rounded border border-white/5 hover:border-white/10 hover:bg-white/[0.03] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
                title="Copy Email"
              >
                {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Room ID reference */}
            {roomId && (
              <div className="p-3 rounded border border-white/5 bg-white/[0.01] flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex-1 min-w-0">
                  <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider">Active Room Reference ID</p>
                  <p className="text-xs font-mono text-zinc-300 truncate select-all">{roomId}</p>
                </div>
                <button
                  onClick={handleCopyRoomId}
                  className="flex items-center justify-center w-7 h-7 rounded border border-white/5 hover:border-white/10 hover:bg-white/[0.03] text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
                  title="Copy Room ID"
                >
                  {copiedRoomId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-2.5 pt-1">
            <a
              href="https://x.com/dksosnhejejd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center h-8 rounded bg-white/5 hover:bg-white/10 border border-white/5 text-zinc-200 font-mono text-[10px] font-medium transition-colors"
            >
              SEND DIRECT MESSAGE
            </a>
            <button
              onClick={onClose}
              className="flex-1 h-8 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-mono text-[10px] font-semibold tracking-wider transition-colors cursor-pointer"
            >
              DISMISS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
