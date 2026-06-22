'use client';

import * as React from 'react';

interface UseResizableOptions {
  initialSize: number;
  minSize: number;
  maxSize: number;
  localStorageKey?: string;
}

/**
 * Custom hook to manage dragging layouts and resizing sidebars/split-panels.
 * Supports mouse drag, touch events, boundary constraints, and localStorage persistence.
 */
export function useResizable({
  initialSize,
  minSize,
  maxSize,
  localStorageKey,
}: UseResizableOptions) {
  const [size, setSize] = React.useState<number>(initialSize);
  const [isResizing, setIsResizing] = React.useState(false);

  // Load saved layouts from LocalStorage on mount
  React.useEffect(() => {
    if (localStorageKey) {
      try {
        const cached = localStorage.getItem(localStorageKey);
        if (cached) {
          const parsed = parseFloat(cached);
          if (!isNaN(parsed) && parsed >= minSize && parsed <= maxSize) {
            queueMicrotask(() => {
              setSize(parsed);
            });
          }
        }
      } catch (err) {
        console.error('Failed to load resizable size state:', err);
      }
    }
  }, [localStorageKey, minSize, maxSize]);

  const startResizing = React.useCallback((
    e: React.MouseEvent | React.TouchEvent,
    calculateSize: (clientX: number) => number
  ) => {
    // Avoid interfering with default text selections
    if ('button' in e && e.button !== 0) return; // only left click
    
    setIsResizing(true);

    const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in moveEvent 
        ? moveEvent.touches[0].clientX 
        : moveEvent.clientX;

      let newSize = calculateSize(clientX);
      newSize = Math.max(minSize, Math.min(newSize, maxSize));
      setSize(newSize);

      if (localStorageKey) {
        try {
          localStorage.setItem(localStorageKey, newSize.toString());
        } catch (err) {
          console.error('Failed to save resizable size state:', err);
        }
      }
    };

    const handleStop = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleStop);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleStop);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleStop);
    document.addEventListener('touchmove', handleMove);
    document.addEventListener('touchend', handleStop);
  }, [minSize, maxSize, localStorageKey]);

  const reset = React.useCallback(() => {
    setSize(initialSize);
    if (localStorageKey) {
      try {
        localStorage.setItem(localStorageKey, initialSize.toString());
      } catch (err) {
        console.error('Failed to reset resizable size state:', err);
      }
    }
  }, [initialSize, localStorageKey]);

  return {
    size,
    isResizing,
    startResizing,
    reset,
  };
}
