import { useEffect } from 'react';

interface ShortcutsProps {
  /**
   * Triggers the project spec compiler handler.
   */
  onCompile: () => void;

  /**
   * Triggers client-side export zip pack download.
   */
  onDownload: () => void;

  /**
   * Copies the current workspace invite link to clipboard.
   */
  onCopyLink: () => void;

  /**
   * Navigates back home.
   */
  onRouteHome: () => void;

  /**
   * Determines if download shortcut (Cmd+S) is active.
   */
  hasCompiledFiles: boolean;
}

/**
 * Custom hook to register and clean up global workspace window shortcuts:
 * - Cmd+Enter or Ctrl+Enter: Trigger compile
 * - Cmd+S or Ctrl+S: Trigger download zip
 * - Cmd+Shift+C or Ctrl+Shift+C: Copy Invite URL
 * - Escape: Navigate home (if inputs are unfocused)
 *
 * @param props - Keyboard shortcut triggers and conditions.
 */
export function useShortcuts({
  onCompile,
  onDownload,
  onCopyLink,
  onRouteHome,
  hasCompiledFiles
}: ShortcutsProps): void {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isCmd = e.metaKey || e.ctrlKey;
      if (isCmd && e.key === 'Enter') {
        e.preventDefault();
        onCompile();
        return;
      }
      if (isCmd && e.key === 's' && hasCompiledFiles) {
        e.preventDefault();
        onDownload();
        return;
      }
      if (isCmd && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        onCopyLink();
        return;
      }
      if (e.key === 'Escape') {
        const el = document.activeElement;
        if (el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT')) return;
        e.preventDefault();
        onRouteHome();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onCompile, onDownload, onCopyLink, onRouteHome, hasCompiledFiles]);
}
