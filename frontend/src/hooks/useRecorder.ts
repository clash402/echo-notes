import { useState, useCallback, useRef } from 'react';
import { AudioRecorder, createAudioUrl, revokeAudioUrl } from '@/lib/audio';
import { RecordingState } from '@/types';

export const useRecorder = () => {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0,
  });

  const recorderRef = useRef<AudioRecorder | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const recorder = new AudioRecorder();
      await recorder.startRecording();
      recorderRef.current = recorder;

      setRecordingState(prev => ({
        ...prev,
        isRecording: true,
        isPaused: false,
        duration: 0,
      }));

      // Start duration timer
      const startTime = Date.now();
      durationIntervalRef.current = setInterval(() => {
        setRecordingState(prev => ({
          ...prev,
          duration: Date.now() - startTime,
        }));
      }, 100);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(async () => {
    if (!recorderRef.current) return null;

    try {
      const audioBlob = await recorderRef.current.stopRecording();
      
      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
        durationIntervalRef.current = null;
      }

      setRecordingState(prev => ({
        ...prev,
        isRecording: false,
        isPaused: false,
        audioBlob,
      }));

      recorderRef.current = null;
      return audioBlob;
    } catch (error) {
      console.error('Failed to stop recording:', error);
      throw error;
    }
  }, []);

  const pauseRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.pauseRecording();
      setRecordingState(prev => ({
        ...prev,
        isPaused: true,
      }));
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (recorderRef.current) {
      recorderRef.current.resumeRecording();
      setRecordingState(prev => ({
        ...prev,
        isPaused: false,
      }));
    }
  }, []);

  const createAudioUrlFromBlob = useCallback((blob: Blob) => {
    return createAudioUrl(blob);
  }, []);

  const cleanupAudioUrl = useCallback((url: string) => {
    revokeAudioUrl(url);
  }, []);

  return {
    recordingState,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    createAudioUrlFromBlob,
    cleanupAudioUrl,
  };
}; 