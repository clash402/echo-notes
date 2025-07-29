'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckCircle, AlertCircle, Mic, MicOff } from 'lucide-react';

interface RecordingQualityIndicatorProps {
  stream: MediaStream | null;
  isRecording: boolean;
}

export const RecordingQualityIndicator = ({ stream, isRecording }: RecordingQualityIndicatorProps) => {
  const [quality, setQuality] = useState<'good' | 'poor' | 'no-signal' | null>(null);
  const [volume, setVolume] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!stream || !isRecording) {
      setQuality(null);
      setVolume(0);
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    analyserRef.current = analyser;

    const updateQuality = () => {
      if (!isRecording) return;

      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average volume
      const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      const normalizedVolume = average / 255;
      setVolume(normalizedVolume);

      // Determine quality based on volume and consistency
      if (normalizedVolume < 0.1) {
        setQuality('no-signal');
      } else if (normalizedVolume < 0.3) {
        setQuality('poor');
      } else {
        setQuality('good');
      }

      animationRef.current = requestAnimationFrame(updateQuality);
    };

    updateQuality();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioContext.close();
    };
  }, [stream, isRecording]);

  if (!isRecording) return null;

  const getQualityColor = () => {
    switch (quality) {
      case 'good':
        return 'text-green-600';
      case 'poor':
        return 'text-yellow-600';
      case 'no-signal':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getQualityIcon = () => {
    switch (quality) {
      case 'good':
        return <CheckCircle className="w-4 h-4" />;
      case 'poor':
        return <AlertCircle className="w-4 h-4" />;
      case 'no-signal':
        return <MicOff className="w-4 h-4" />;
      default:
        return <Mic className="w-4 h-4" />;
    }
  };

  const getQualityText = () => {
    switch (quality) {
      case 'good':
        return 'Good signal';
      case 'poor':
        return 'Weak signal';
      case 'no-signal':
        return 'No signal';
      default:
        return 'Checking...';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-1 ${getQualityColor()}`}>
        {getQualityIcon()}
        <span className="text-sm font-medium">{getQualityText()}</span>
      </div>
      
      {/* Volume bar */}
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-100 ${
            quality === 'good' ? 'bg-green-500' : 
            quality === 'poor' ? 'bg-yellow-500' : 
            quality === 'no-signal' ? 'bg-red-500' : 'bg-gray-400'
          }`}
          style={{ width: `${volume * 100}%` }}
        />
      </div>
    </div>
  );
}; 