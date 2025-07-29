import { useState, useEffect } from 'react';
import type { UserPreferences, AccessibilitySettings } from '@/types';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'system',
  autoSave: true,
  keyboardShortcuts: true,
  accessibility: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium',
    screenReader: false,
  },
  recording: {
    autoStart: false,
    quality: 'medium',
    maxDuration: 10,
  },
  display: {
    compactMode: false,
    showTimestamps: true,
    showCosts: true,
    notesPerPage: 10,
  },
};

const PREFERENCES_KEY = 'echo-notes-preferences';

export const usePreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(PREFERENCES_KEY);
    if (savedPreferences) {
      try {
        const parsed = JSON.parse(savedPreferences);
        setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved preferences:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    }
  }, [preferences, isLoaded]);

  // Apply theme to document
  useEffect(() => {
    if (!isLoaded) return;

    const root = document.documentElement;
    const { theme } = preferences;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Apply accessibility settings
    if (preferences.accessibility.reducedMotion) {
      root.classList.add('motion-reduce');
    } else {
      root.classList.remove('motion-reduce');
    }

    if (preferences.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply font size
    root.classList.remove('text-sm', 'text-base', 'text-lg');
    switch (preferences.accessibility.fontSize) {
      case 'small':
        root.classList.add('text-sm');
        break;
      case 'large':
        root.classList.add('text-lg');
        break;
      default:
        root.classList.add('text-base');
    }
  }, [preferences, isLoaded]);

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
  };

  const updateAccessibility = (updates: Partial<AccessibilitySettings>) => {
    setPreferences(prev => ({
      ...prev,
      accessibility: { ...prev.accessibility, ...updates }
    }));
  };

  const resetToDefaults = () => {
    setPreferences(DEFAULT_PREFERENCES);
  };

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(preferences.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    updatePreferences({ theme: themes[nextIndex] });
  };

  return {
    preferences,
    updatePreferences,
    updateAccessibility,
    resetToDefaults,
    toggleTheme,
    isLoaded,
  };
}; 