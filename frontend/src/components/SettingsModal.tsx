'use client';

import { useState } from 'react';
import { X, Sun, Moon, Monitor, Settings, Keyboard, Eye, Volume2, Palette, Accessibility } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { UserPreferences, KeyboardShortcut } from '@/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserPreferences;
  onPreferencesChange: (preferences: UserPreferences) => void;
  shortcuts: KeyboardShortcut[];
  onShortcutAction?: (action: string) => void;
  onTestVoice?: (text?: string) => void;
}

export const SettingsModal = ({
  isOpen,
  onClose,
  preferences,
  onPreferencesChange,
  shortcuts,
  onShortcutAction
}: SettingsModalProps) => {
  const [activeTab, setActiveTab] = useState<'general' | 'accessibility' | 'shortcuts' | 'recording' | 'display' | 'voice'>('general');

  if (!isOpen) return null;

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    onPreferencesChange({ ...preferences, ...updates });
  };

  const updateAccessibility = (updates: Partial<UserPreferences['accessibility']>) => {
    updatePreferences({
      accessibility: { ...preferences.accessibility, ...updates }
    });
  };

  const updateRecording = (updates: Partial<UserPreferences['recording']>) => {
    updatePreferences({
      recording: { ...preferences.recording, ...updates }
    });
  };

  const updateDisplay = (updates: Partial<UserPreferences['display']>) => {
    updatePreferences({
      display: { ...preferences.display, ...updates }
    });
  };

  const getShortcutsByCategory = () => {
    return shortcuts.reduce((acc, shortcut) => {
      if (!acc[shortcut.category]) {
        acc[shortcut.category] = [];
      }
      acc[shortcut.category].push(shortcut);
      return acc;
    }, {} as Record<string, KeyboardShortcut[]>);
  };

  const categories = getShortcutsByCategory();

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden" style={{ backgroundColor: 'hsl(var(--card))' }}>
        {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-semibold" style={{ color: 'hsl(var(--foreground))' }}>Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:opacity-80"
            style={{ color: 'hsl(var(--muted-foreground))' }}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b overflow-x-auto" style={{ borderColor: 'hsl(var(--border))' }}>
          {[
            { id: 'general', label: 'General', icon: Settings },
            { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
            { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
            { id: 'recording', label: 'Recording', icon: Volume2 },
            { id: 'display', label: 'Display', icon: Eye },
            { id: 'voice', label: 'Voice', icon: Volume2 },
          ].map(({ id, label, icon: Icon }) => (
                         <button
               key={id}
               onClick={() => setActiveTab(id as 'general' | 'accessibility' | 'shortcuts' | 'recording' | 'display')}
               className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent hover:opacity-80'
              }`}
              style={{ 
                color: activeTab === id 
                  ? 'hsl(158 64% 52%)' 
                  : 'hsl(var(--foreground))'
              }}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4" style={{ color: 'hsl(var(--foreground))' }}>Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Light', icon: Sun },
                    { value: 'dark', label: 'Dark', icon: Moon },
                    { value: 'system', label: 'System', icon: Monitor },
                  ].map(({ value, label, icon: Icon }) => (
                                         <button
                       key={value}
                       onClick={() => updatePreferences({ theme: value as 'light' | 'dark' | 'system' })}
                       className={`flex flex-col items-center p-4 rounded-lg border-2 transition-colors ${
                        preferences.theme === value
                          ? 'border-emerald-600'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: preferences.theme === value 
                          ? 'hsl(158 64% 52% / 0.1)' 
                          : 'transparent',
                        borderColor: preferences.theme === value 
                          ? 'hsl(158 64% 52%)' 
                          : 'hsl(var(--border))'
                      }}
                    >
                                              <Icon className="w-6 h-6 mb-2" style={{ color: 'hsl(var(--muted-foreground))' }} />
                      <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Auto-save</h4>
                    <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Automatically save changes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) => updatePreferences({ autoSave: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Keyboard shortcuts</h4>
                    <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Enable keyboard navigation</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.keyboardShortcuts}
                    onChange={(e) => updatePreferences({ keyboardShortcuts: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>High contrast</h4>
                    <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Increase color contrast</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.highContrast}
                    onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Reduced motion</h4>
                    <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Disable animations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.reducedMotion}
                    onChange={(e) => updateAccessibility({ reducedMotion: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Screen reader support</h4>
                    <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Enable ARIA labels</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.screenReader}
                    onChange={(e) => updateAccessibility({ screenReader: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>Font size</h4>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'small', label: 'Small' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'large', label: 'Large' },
                  ].map(({ value, label }) => (
                                         <button
                       key={value}
                       onClick={() => updateAccessibility({ fontSize: value as 'small' | 'medium' | 'large' })}
                       className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                        preferences.accessibility.fontSize === value
                          ? 'border-emerald-600'
                          : 'hover:opacity-80'
                      }`}
                      style={{
                        backgroundColor: preferences.accessibility.fontSize === value 
                          ? 'hsl(158 64% 52% / 0.1)' 
                          : 'transparent',
                        borderColor: preferences.accessibility.fontSize === value 
                          ? 'hsl(158 64% 52%)' 
                          : 'hsl(var(--border))'
                      }}
                    >
                      <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-6">
              <div className="text-sm mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Press the keys to test shortcuts. Click any shortcut to trigger its action.
              </div>
              
              {Object.entries(categories).map(([category, categoryShortcuts]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium mb-3 capitalize" style={{ color: 'hsl(var(--foreground))' }}>
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut) => (
                      <div
                        key={shortcut.action}
                        className="flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:opacity-80"
                        style={{ 
                          borderColor: 'hsl(var(--border))',
                          backgroundColor: 'transparent'
                        }}
                        onClick={() => onShortcutAction?.(shortcut.action)}
                      >
                        <div>
                          <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>
                            {shortcut.description}
                          </div>
                          <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                            {shortcut.action}
                          </div>
                        </div>
                        <kbd className="px-2 py-1 text-sm font-mono rounded border" style={{ 
                          backgroundColor: 'hsl(var(--muted))',
                          color: 'hsl(var(--foreground))',
                          borderColor: 'hsl(var(--border))'
                        }}>
                          {shortcut.key}
                        </kbd>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'recording' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Auto-start recording</h4>
                    <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Start recording immediately when page loads</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.recording.autoStart}
                    onChange={(e) => updateRecording({ autoStart: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>Recording quality</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'low', label: 'Low' },
                      { value: 'medium', label: 'Medium' },
                      { value: 'high', label: 'High' },
                    ].map(({ value, label }) => (
                                           <button
                       key={value}
                       onClick={() => updateRecording({ quality: value as 'low' | 'medium' | 'high' })}
                       className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          preferences.recording.quality === value
                            ? 'border-emerald-600'
                            : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: preferences.recording.quality === value 
                            ? 'hsl(158 64% 52% / 0.1)' 
                            : 'transparent',
                          borderColor: preferences.recording.quality === value 
                            ? 'hsl(158 64% 52%)' 
                            : 'hsl(var(--border))'
                        }}
                      >
                        <span className="text-sm font-medium" style={{ color: 'hsl(var(--foreground))' }}>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>
                    Maximum recording duration: {preferences.recording.maxDuration} minutes
                  </h4>
                  <Slider
                    value={[preferences.recording.maxDuration]}
                    onValueChange={([value]) => updateRecording({ maxDuration: value })}
                    max={60}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Compact mode</h4>
                                          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Show more notes in less space</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.display.compactMode}
                    onChange={(e) => updateDisplay({ compactMode: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Show timestamps</h4>
                                          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Display creation and update times</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.display.showTimestamps}
                    onChange={(e) => updateDisplay({ showTimestamps: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Show costs</h4>
                                          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Display AI processing costs</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.display.showCosts}
                    onChange={(e) => updateDisplay({ showCosts: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                                  <h4 className="font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>
                    Notes per page: {preferences.display.notesPerPage}
                  </h4>
                <Slider
                  value={[preferences.display.notesPerPage]}
                  onValueChange={([value]) => updateDisplay({ notesPerPage: value })}
                  max={50}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>Enable voice output</h4>
                                          <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>Use ElevenLabs for text-to-speech</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.voice?.enabled ?? false}
                    onChange={(e) => updatePreferences({ 
                      voice: { 
                        ...preferences.voice, 
                        enabled: e.target.checked 
                      } 
                    })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>Voice selection</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', description: 'Professional female voice' },
                      { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', description: 'Professional male voice' },
                      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'Friendly female voice' },
                      { id: 'VR6AewLTigWG4xSOukaG', name: 'Josh', description: 'Professional male voice' },
                    ].map((voice) => (
                      <button
                        key={voice.id}
                        onClick={() => updatePreferences({ 
                          voice: { 
                            ...preferences.voice, 
                            voiceId: voice.id,
                            voiceName: voice.name
                          } 
                        })}
                        className={`p-3 rounded-lg border-2 transition-colors text-left ${
                          preferences.voice?.voiceId === voice.id
                            ? 'border-emerald-600'
                            : 'hover:opacity-80'
                        }`}
                        style={{
                          backgroundColor: preferences.voice?.voiceId === voice.id 
                            ? 'hsl(158 64% 52% / 0.1)' 
                            : 'transparent',
                          borderColor: preferences.voice?.voiceId === voice.id 
                            ? 'hsl(158 64% 52%)' 
                            : 'hsl(var(--border))'
                        }}
                      >
                        <div className="font-medium" style={{ color: 'hsl(var(--foreground))' }}>{voice.name}</div>
                                                  <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{voice.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>
                    Playback speed: {preferences.voice?.playbackSpeed ?? 1.0}x
                  </h4>
                  <Slider
                    value={[preferences.voice?.playbackSpeed ?? 1.0]}
                    onValueChange={([value]) => updatePreferences({ 
                      voice: { 
                        ...preferences.voice, 
                        playbackSpeed: value 
                      } 
                    })}
                    max={2.0}
                    min={0.5}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-3" style={{ color: 'hsl(var(--foreground))' }}>
                    Volume: {Math.round((preferences.voice?.volume ?? 0.8) * 100)}%
                  </h4>
                  <Slider
                    value={[preferences.voice?.volume ?? 0.8]}
                    onValueChange={([value]) => updatePreferences({ 
                      voice: { 
                        ...preferences.voice, 
                        volume: value 
                      } 
                    })}
                    max={1.0}
                    min={0.0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={() => onShortcutAction?.('test-voice')}
                    className="w-full"
                    variant="outline"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Test Voice Settings
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
          <Button
            variant="outline"
                         onClick={() => {
               // Reset to defaults
               onPreferencesChange({
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
                 voice: {
                   enabled: true,
                   voiceId: '21m00Tcm4TlvDq8ikWAM',
                   voiceName: 'Rachel',
                   playbackSpeed: 1.0,
                   volume: 0.8,
                 },
               });
             }}
          >
            Reset to Defaults
          </Button>
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}; 