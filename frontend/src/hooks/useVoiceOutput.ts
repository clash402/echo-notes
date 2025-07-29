import { useState, useEffect } from 'react';
import type { VoiceSettings } from '@/types';

// Default voice settings
const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
  enabled: true,
  voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
  voiceName: 'Rachel',
  playbackSpeed: 1.0,
  volume: 0.8,
};

// Local storage key for voice settings
const VOICE_SETTINGS_KEY = 'echo-notes-voice-settings';

export const useVoiceOutput = () => {
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(DEFAULT_VOICE_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem(VOICE_SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setVoiceSettings({ ...DEFAULT_VOICE_SETTINGS, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved voice settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(VOICE_SETTINGS_KEY, JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  const updateVoiceSettings = (newSettings: Partial<VoiceSettings>) => {
    setVoiceSettings(prev => ({ ...prev, ...newSettings }));
  };

  const speakText = async (text: string): Promise<void> => {
    if (!voiceSettings.enabled) {
      console.log('Voice output is disabled');
      return;
    }

    setIsLoading(true);
    
    try {
      // For now, simulate ElevenLabs API call
      console.log('Simulating ElevenLabs TTS:', {
        text,
        voiceId: voiceSettings.voiceId,
        speed: voiceSettings.playbackSpeed,
        volume: voiceSettings.volume
      });

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // In a real implementation, this would:
      // 1. Call the backend API with the text and voice settings
      // 2. Backend would call ElevenLabs API
      // 3. Return audio URL or blob
      // 4. Play the audio with the specified settings

      console.log('Voice output completed successfully');
      
    } catch (error) {
      console.error('Failed to generate speech:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const speakNote = async (note: { title: string; content: string; summary?: string }): Promise<void> => {
    if (!voiceSettings.enabled) {
      console.log('Voice output is disabled');
      return;
    }

    const textToSpeak = `${note.title}. ${note.content}${note.summary ? ` Summary: ${note.summary}` : ''}`;
    await speakText(textToSpeak);
  };

  const testVoice = async (testText?: string): Promise<void> => {
    const defaultTestText = 'Hello! This is a test of the text-to-speech functionality. How does this voice sound to you?';
    await speakText(testText || defaultTestText);
  };

  const toggleVoiceOutput = () => {
    updateVoiceSettings({ enabled: !voiceSettings.enabled });
  };

  const resetToDefaults = () => {
    setVoiceSettings(DEFAULT_VOICE_SETTINGS);
  };

  return {
    voiceSettings,
    updateVoiceSettings,
    speakText,
    speakNote,
    testVoice,
    toggleVoiceOutput,
    resetToDefaults,
    isLoading,
    isEnabled: voiceSettings.enabled,
  };
}; 