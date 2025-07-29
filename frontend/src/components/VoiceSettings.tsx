'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import type { VoiceSettings, ElevenLabsVoice, VoicePreferences } from '@/types';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChange: (settings: VoiceSettings) => void;
  currentSettings: VoiceSettings;
  onTestVoice?: (text: string) => void;
}

// Dummy ElevenLabs voices for development
const DUMMY_VOICES: ElevenLabsVoice[] = [
  {
    voice_id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    category: 'premade',
    description: 'Professional and clear female voice',
    labels: { accent: 'American', gender: 'Female', age: 'Adult' }
  },
  {
    voice_id: 'AZnzlk1XvdvUeBnXmlld',
    name: 'Domi',
    category: 'premade',
    description: 'Warm and friendly female voice',
    labels: { accent: 'American', gender: 'Female', age: 'Adult' }
  },
  {
    voice_id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    category: 'premade',
    description: 'Soft and gentle female voice',
    labels: { accent: 'British', gender: 'Female', age: 'Adult' }
  },
  {
    voice_id: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold',
    category: 'premade',
    description: 'Deep and authoritative male voice',
    labels: { accent: 'American', gender: 'Male', age: 'Adult' }
  },
  {
    voice_id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    category: 'premade',
    description: 'Clear and professional male voice',
    labels: { accent: 'American', gender: 'Male', age: 'Adult' }
  },
  {
    voice_id: 'yoZ06aMxZJJ28mfd3POQ',
    name: 'Sam',
    category: 'premade',
    description: 'Casual and approachable male voice',
    labels: { accent: 'American', gender: 'Male', age: 'Adult' }
  }
];

export const VoiceSettingsModal = ({ 
  isOpen, 
  onClose, 
  onSettingsChange, 
  currentSettings,
  onTestVoice 
}: VoiceSettingsModalProps) => {
  const [settings, setSettings] = useState<VoiceSettings>(currentSettings);
  const [isTesting, setIsTesting] = useState(false);
  const [testText] = useState('Hello! This is a test of the text-to-speech functionality. How does this voice sound to you?');

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  const handleSettingChange = (key: keyof VoiceSettings, value: string | number | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleTestVoice = async () => {
    if (!onTestVoice) return;
    
    setIsTesting(true);
    try {
      await onTestVoice(testText);
    } catch (error) {
      console.error('Failed to test voice:', error);
    } finally {
      setIsTesting(false);
    }
  };

  const resetToDefaults = () => {
    const defaultSettings: VoiceSettings = {
      enabled: true,
      voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
      voiceName: 'Rachel',
      playbackSpeed: 1.0,
      volume: 0.8,
    };
    setSettings(defaultSettings);
    onSettingsChange(defaultSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Volume2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Voice Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Enable/Disable Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Text-to-Speech</h3>
              <p className="text-sm text-gray-600">Enable AI-powered voice output for your notes</p>
            </div>
            <Button
              variant={settings.enabled ? "default" : "outline"}
              onClick={() => handleSettingChange('enabled', !settings.enabled)}
              className="flex items-center gap-2"
            >
              {settings.enabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  Enabled
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  Disabled
                </>
              )}
            </Button>
          </div>

          {settings.enabled && (
            <>
              {/* Voice Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Voice
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {DUMMY_VOICES.map((voice) => (
                    <div
                      key={voice.voice_id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        settings.voiceId === voice.voice_id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => {
                        handleSettingChange('voiceId', voice.voice_id);
                        handleSettingChange('voiceName', voice.name);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{voice.name}</h4>
                          <p className="text-sm text-gray-600">{voice.description}</p>
                          {voice.labels && (
                            <div className="flex gap-1 mt-1">
                              {Object.entries(voice.labels).map(([key, value]) => (
                                <span
                                  key={key}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                                >
                                  {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        {settings.voiceId === voice.voice_id && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Playback Speed */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Playback Speed: {settings.playbackSpeed}x
                </label>
                <Slider
                  value={[settings.playbackSpeed]}
                  onValueChange={(value) => handleSettingChange('playbackSpeed', value[0])}
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5x</span>
                  <span>1.0x</span>
                  <span>2.0x</span>
                </div>
              </div>

              {/* Volume */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volume: {Math.round(settings.volume * 100)}%
                </label>
                <Slider
                  value={[settings.volume]}
                  onValueChange={(value) => handleSettingChange('volume', value[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Test Voice */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700">Test Voice</h3>
                    <p className="text-xs text-gray-500">Preview how your selected voice sounds</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestVoice}
                    disabled={isTesting}
                    className="flex items-center gap-2"
                  >
                    {isTesting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        Testing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Test Voice
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 