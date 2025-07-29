import { useEffect, useCallback } from 'react';
import type { KeyboardShortcut } from '@/types';

export interface KeyboardShortcutsConfig {
  enabled: boolean;
  shortcuts: KeyboardShortcut[];
  onShortcut: (action: string) => void;
}

const DEFAULT_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'n', description: 'New recording', action: 'start-recording', category: 'recording' },
  { key: 'Escape', description: 'Stop recording', action: 'stop-recording', category: 'recording' },
  { key: 's', description: 'Search notes', action: 'focus-search', category: 'navigation' },
  { key: 'f', description: 'Filter notes', action: 'focus-filter', category: 'navigation' },
  { key: 'h', description: 'Go home', action: 'go-home', category: 'navigation' },
  { key: '?', description: 'Show shortcuts', action: 'show-shortcuts', category: 'general' },
  { key: 't', description: 'Toggle theme', action: 'toggle-theme', category: 'general' },
  { key: 'v', description: 'Toggle voice', action: 'toggle-voice', category: 'general' },
  { key: 'Enter', description: 'Open note', action: 'open-note', category: 'editing' },
  { key: 'Delete', description: 'Delete note', action: 'delete-note', category: 'editing' },
  { key: 'e', description: 'Edit note', action: 'edit-note', category: 'editing' },
  { key: 'p', description: 'Play note', action: 'play-note', category: 'editing' },
];

export const useKeyboardShortcuts = ({ enabled, shortcuts = DEFAULT_SHORTCUTS, onShortcut }: KeyboardShortcutsConfig) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
      return;
    }

    // Check for modifier keys
    const hasCtrl = event.ctrlKey || event.metaKey;
    const hasShift = event.shiftKey;
    const hasAlt = event.altKey;

    // Build the key combination
    let keyCombo = '';
    if (hasCtrl) keyCombo += 'Ctrl+';
    if (hasAlt) keyCombo += 'Alt+';
    if (hasShift) keyCombo += 'Shift+';
    keyCombo += event.key;

    // Find matching shortcut
    const shortcut = shortcuts.find(s => {
      // Handle special keys
      if (s.key === 'Escape' && event.key === 'Escape') return true;
      if (s.key === 'Enter' && event.key === 'Enter') return true;
      if (s.key === 'Delete' && event.key === 'Delete') return true;
      if (s.key === 'Backspace' && event.key === 'Backspace') return true;
      
      // Handle regular keys (case insensitive)
      return s.key.toLowerCase() === event.key.toLowerCase();
    });

    if (shortcut) {
      event.preventDefault();
      onShortcut(shortcut.action);
    }
  }, [enabled, shortcuts, onShortcut]);

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [enabled, handleKeyDown]);

  const getShortcutsByCategory = useCallback(() => {
    const categories = shortcuts.reduce((acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    }, {} as Record<string, KeyboardShortcut[]>);

    return categories;
  }, [shortcuts]);

  return {
    shortcuts,
    getShortcutsByCategory,
  };
}; 