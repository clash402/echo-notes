'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { formatDuration } from '@/lib/utils';

interface PlaybackBarProps {
  audioUrl: string;
  onClose?: () => void;
}

export const PlaybackBar = ({ audioUrl, onClose }: PlaybackBarProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration * 1000);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime * 1000);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime / 1000;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = value[0] / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const skipBackward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, audio.currentTime - 10);
  };

  const skipForward = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex items-center space-x-4 max-w-4xl mx-auto">
        {/* Play/Pause Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlayPause}
          className="text-gray-700 hover:text-gray-900"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </Button>

        {/* Skip Controls */}
        <Button
          variant="ghost"
          size="sm"
          onClick={skipBackward}
          className="text-gray-600 hover:text-gray-800"
        >
          <SkipBack className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={skipForward}
          className="text-gray-600 hover:text-gray-800"
        >
          <SkipForward className="w-4 h-4" />
        </Button>

        {/* Progress Bar */}
        <div className="flex-1 flex items-center space-x-2">
          <span className="text-sm text-gray-600 w-12">
            {formatDuration(currentTime)}
          </span>
          <div className="flex-1">
            <Slider
              value={[progressPercentage]}
              onValueChange={handleSeek}
              max={100}
              step={0.1}
              className="w-full"
            />
          </div>
          <span className="text-sm text-gray-600 w-12">
            {formatDuration(duration)}
          </span>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-gray-600" />
          <div className="w-20">
            <Slider
              value={[volume * 100]}
              onValueChange={handleVolumeChange}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        {/* Close Button */}
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
}; 