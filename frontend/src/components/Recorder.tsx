'use client';

import { useState } from 'react';
import { Mic, Square, Pause, Play, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRecorder } from '@/hooks/useRecorder';
import { CostDisplay } from '@/components/CostDisplay';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { RecordingQualityIndicator } from '@/components/RecordingQualityIndicator';
import { formatDuration } from '@/lib/utils';
import { CostBreakdown, TokenUsage } from '@/types';
import { calculateTotalCost } from '@/lib/costCalculator';

export const Recorder = () => {
  const {
    recordingState,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
  } = useRecorder();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [costBreakdown, setCostBreakdown] = useState<CostBreakdown | null>(null);
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [showCostDisplay, setShowCostDisplay] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [recordingQuality, setRecordingQuality] = useState<'good' | 'poor' | null>(null);

  const handleStartRecording = async () => {
    try {
      setRecordingError(null);
      setRecordingQuality(null);
      await startRecording();
      // Reset cost display when starting new recording
      setCostBreakdown(null);
      setTokenUsage(null);
      setShowCostDisplay(false);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setRecordingError('Failed to start recording. Please check microphone permissions.');
    }
  };

  const handleStopRecording = async () => {
    try {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        // Simulate quality check
        const quality = Math.random() > 0.3 ? 'good' : 'poor';
        setRecordingQuality(quality);
        
        await processRecording(audioBlob, recordingState.duration / 1000);
      }
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setRecordingError('Failed to stop recording. Please try again.');
    }
  };

  const processRecording = async (audioBlob: Blob, durationSeconds: number) => {
    setIsProcessing(true);
    
    try {
      // Simulate transcription step
      setProcessingStep('Transcribing audio...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate transcript text (in real app, this would come from Whisper API)
      const mockTranscript = `This is a simulated transcript of a ${Math.round(durationSeconds)} second recording. It contains sample text that would normally be generated by OpenAI's Whisper API. The content would include whatever was spoken during the recording session.`;
      
      // Simulate summarization step
      setProcessingStep('Generating summary...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Calculate costs
      const costEstimate = calculateTotalCost(durationSeconds, mockTranscript);
      setCostBreakdown(costEstimate);
      setTokenUsage({
        transcription: costEstimate.transcription.tokens,
        summarization: costEstimate.summarization.tokens,
        total: costEstimate.total.tokens,
      });
      
      setProcessingStep('Processing complete!');
      setShowCostDisplay(true);
      
      // Hide processing message after a delay
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStep('');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to process recording:', error);
      setProcessingStep('Processing failed');
      setTimeout(() => {
        setIsProcessing(false);
        setProcessingStep('');
      }, 2000);
    }
  };

  const handlePauseResume = () => {
    if (recordingState.isPaused) {
      resumeRecording();
    } else {
      pauseRecording();
    }
  };

  const getRecordingStatus = () => {
    if (recordingError) return 'error';
    if (isProcessing) return 'processing';
    if (recordingState.isRecording) return 'recording';
    if (recordingState.isPaused) return 'paused';
    return 'idle';
  };

  const status = getRecordingStatus();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Voice Recorder</h2>
        <p className="text-gray-600">Record your thoughts and transform them into organized notes</p>
      </div>

      {/* Audio Visualizer */}
      <div className="mb-6">
        <AudioVisualizer 
          stream={recordingState.stream || null}
          isRecording={recordingState.isRecording}
          className="mb-4"
        />
      </div>

      {/* Recording Status */}
      <div className="flex items-center justify-center mb-6">
        <div className="flex items-center space-x-4">
          {/* Recording Duration */}
          {recordingState.isRecording && (
            <div className="text-center">
              <div className="text-3xl font-mono text-gray-900">
                {formatDuration(recordingState.duration)}
              </div>
              <div className="text-sm text-gray-600">Recording time</div>
            </div>
          )}

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            {status === 'recording' && (
              <>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-red-600 font-medium">Recording</span>
              </>
            )}
            {status === 'paused' && (
              <>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-yellow-600 font-medium">Paused</span>
              </>
            )}
            {status === 'processing' && (
              <>
                <Loader2 className="w-4 h-4 text-blue-600 animate-spin"></Loader2>
                <span className="text-blue-600 font-medium">{processingStep}</span>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="w-4 h-4 text-red-600"></AlertCircle>
                <span className="text-red-600 font-medium">Error</span>
              </>
            )}
          </div>

                     {/* Real-time Quality Indicator */}
           <RecordingQualityIndicator 
             stream={recordingState.stream || null}
             isRecording={recordingState.isRecording}
           />
        </div>
      </div>

      {/* Error Message */}
      {recordingError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2"></AlertCircle>
            <span className="text-red-800">{recordingError}</span>
          </div>
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex justify-center space-x-4 mb-6">
        {!recordingState.isRecording ? (
          <Button
            onClick={handleStartRecording}
            disabled={isProcessing}
            className="px-8 py-3 rounded-lg flex items-center space-x-2 cursor-pointer"
            size="lg"
            style={{
              backgroundColor: 'hsl(var(--primary))',
              color: 'hsl(var(--primary-foreground))'
            }}
          >
            <Mic className="w-5 h-5" />
            <span>Start Recording</span>
          </Button>
        ) : (
          <>
            <Button
              onClick={handlePauseResume}
              variant="outline"
              className="px-6 py-3 rounded-lg flex items-center space-x-2"
              size="lg"
            >
              {recordingState.isPaused ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4" />
                  <span>Pause</span>
                </>
              )}
            </Button>
            
            <Button
              onClick={handleStopRecording}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
              size="lg"
            >
              <Square className="w-4 h-4" />
              <span>Stop Recording</span>
            </Button>
          </>
        )}
      </div>

      {/* Cost Display */}
      {showCostDisplay && costBreakdown && tokenUsage && (
        <CostDisplay
          costBreakdown={costBreakdown}
          tokenUsage={tokenUsage}
          isVisible={showCostDisplay}
          onClose={() => setShowCostDisplay(false)}
        />
      )}

      {/* Recording Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">Recording Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Speak clearly and at a normal pace</li>
          <li>• Minimize background noise for better transcription</li>
          <li>• Keep the microphone at a consistent distance</li>
          <li>• Use pause/resume for longer recordings</li>
        </ul>
      </div>
    </div>
  );
}; 