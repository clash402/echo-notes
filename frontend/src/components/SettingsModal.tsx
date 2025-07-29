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
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <Settings className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
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
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Theme</h3>
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
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <Icon className="w-6 h-6 mb-2 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Auto-save</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically save changes</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.autoSave}
                    onChange={(e) => updatePreferences({ autoSave: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Keyboard shortcuts</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable keyboard navigation</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.keyboardShortcuts}
                    onChange={(e) => updatePreferences({ keyboardShortcuts: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
                    <h4 className="font-medium text-gray-900 dark:text-white">High contrast</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Increase color contrast</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.highContrast}
                    onChange={(e) => updateAccessibility({ highContrast: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Reduced motion</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Disable animations</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.reducedMotion}
                    onChange={(e) => updateAccessibility({ reducedMotion: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Screen reader support</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Enable ARIA labels</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.screenReader}
                    onChange={(e) => updateAccessibility({ screenReader: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Font size</h4>
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
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-6">
              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Press the keys to test shortcuts. Click any shortcut to trigger its action.
              </div>
              
              {Object.entries(categories).map(([category, categoryShortcuts]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3 capitalize">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryShortcuts.map((shortcut) => (
                      <div
                        key={shortcut.action}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        onClick={() => onShortcutAction?.(shortcut.action)}
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {shortcut.description}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {shortcut.action}
                          </div>
                        </div>
                        <kbd className="px-2 py-1 text-sm font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded border">
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
                    <h4 className="font-medium text-gray-900 dark:text-white">Auto-start recording</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Start recording immediately when page loads</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.recording.autoStart}
                    onChange={(e) => updateRecording({ autoStart: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recording quality</h4>
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
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
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
                    <h4 className="font-medium text-gray-900 dark:text-white">Compact mode</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Show more notes in less space</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.display.compactMode}
                    onChange={(e) => updateDisplay({ compactMode: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Show timestamps</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Display creation and update times</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.display.showTimestamps}
                    onChange={(e) => updateDisplay({ showTimestamps: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Show costs</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Display AI processing costs</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preferences.display.showCosts}
                    onChange={(e) => updateDisplay({ showCosts: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
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
                    <h4 className="font-medium text-gray-900 dark:text-white">Enable voice output</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Use ElevenLabs for text-to-speech</p>
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
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Voice selection</h4>
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
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{voice.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{voice.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
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
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
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
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
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