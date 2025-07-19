import RecordRTC from 'recordrtc';

export class AudioRecorder {
  private recorder: RecordRTC | null = null;
  private stream: MediaStream | null = null;

  async startRecording(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('AudioRecorder can only be used in browser environment');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new RecordRTC(this.stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1,
        desiredSampRate: 16000,
      });
      this.recorder.startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.recorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      this.recorder.stopRecording(() => {
        const blob = this.recorder!.getBlob();
        this.cleanup();
        resolve(blob);
      });
    });
  }

  pauseRecording(): void {
    if (this.recorder) {
      this.recorder.pauseRecording();
    }
  }

  resumeRecording(): void {
    if (this.recorder) {
      this.recorder.resumeRecording();
    }
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.recorder = null;
  }
}

export const createAudioUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob);
};

export const revokeAudioUrl = (url: string): void => {
  URL.revokeObjectURL(url);
}; 