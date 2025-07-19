'use client';

import { Mic, Square, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecorder } from '@/hooks/useRecorder';
import { formatDuration } from '@/lib/utils';

export const Recorder = () => {
  const {
    recordingState,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useRecorder();

  const handleStartRecording = async () => {
    try {
      await startRecording();
    } catch (error) {
      console.error('Failed to start recording:', error);
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        // Handle the recorded audio blob
        console.log('Recording completed:', audioBlob);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  const handlePauseResume = () => {
    if (recordingState.isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="text-2xl font-semibold text-gray-800">
        {recordingState.isRecording ? 'Recording...' : 'Ready to Record'}
      </div>
      
      {recordingState.isRecording && (
        <div className="text-lg text-gray-600">
          {formatDuration(recordingState.duration)}
        </div>
      )}

      <div className="flex space-x-4">
        {!recordingState.isRecording ? (
          <Button
            onClick={handleStartRecording}
            size="lg"
            className="bg-red-500 hover:bg-red-600"
          >
            <Mic className="w-5 h-5 mr-2" />
            Start Recording
          </Button>
        ) : (
          <>
            <Button
              onClick={handlePauseResume}
              variant="outline"
              size="lg"
            >
              {recordingState.isPaused ? (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Resume
                </>
              ) : (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              )}
            </Button>
            
            <Button
              onClick={handleStopRecording}
              size="lg"
              className="bg-gray-500 hover:bg-gray-600"
            >
              <Square className="w-5 h-5 mr-2" />
              Stop Recording
            </Button>
          </>
        )}
      </div>
    </div>
  );
}; 