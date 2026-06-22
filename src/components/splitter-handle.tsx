'use client';

import * as React from 'react';

interface SplitterHandleProps {
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onDoubleClick: () => void;
  isResizing: boolean;
  className?: string;
}

/**
 * Interactive visual vertical handle for click-and-drag panel resizing.
 * Highlights with cyan glow when resizing or hovered, and features double-click resets.
 */
export function SplitterHandle({
  onMouseDown,
  onTouchStart,
  onDoubleClick,
  isResizing,
  className = '',
}: SplitterHandleProps) {
  return (
    <div
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onDoubleClick={onDoubleClick}
      className={`relative w-1.5 h-full cursor-col-resize select-none shrink-0 group z-30 transition-colors ${className}`}
    >
      {/* Outer transparent hitbox to make dragging easy */}
      <div className="absolute inset-y-0 -left-1.5 -right-1.5 z-10" />

      {/* Inner visual line */}
      <div
        className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1px] transition-all duration-200 z-20 ${
          isResizing
            ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
            : 'bg-white/[0.03] group-hover:bg-zinc-600'
        }`}
      />
    </div>
  );
}
