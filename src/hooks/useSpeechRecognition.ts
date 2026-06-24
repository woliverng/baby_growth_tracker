import { useState, useRef, useCallback, useEffect } from 'react';
import { isSpeechRecognitionSupported, createSpeechRecognition } from '@/lib/speech';
import type { SpeechRecognitionState } from '@/types';

interface UseSpeechRecognitionOptions {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  /** Called when a final transcript segment is recognized. */
  onResult?: (finalTranscript: string) => void;
}

interface UseSpeechRecognitionReturn extends SpeechRecognitionState {
  start: () => void;
  stop: () => void;
  reset: () => void;
}

/**
 * React Hook for managing Web Speech API speech recognition lifecycle.
 *
 * Features:
 * - Auto-creates and cleans up SpeechRecognition instance on mount/unmount
 * - Tracks listening state, transcript, interim transcript, and errors
 * - Calls onResult callback with each finalized transcript segment
 * - Gracefully degrades when the API is not supported (isSupported = false)
 */
export function useSpeechRecognition(
  options?: UseSpeechRecognitionOptions
): UseSpeechRecognitionReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(options?.onResult);

  // Keep the latest onResult callback without re-creating the recognition instance
  useEffect(() => {
    onResultRef.current = options?.onResult;
  }, [options?.onResult]);

  const isSupported = isSpeechRecognitionSupported();

  // Initialize recognition instance once on mount
  useEffect(() => {
    if (!isSupported) return;

    const recognition = createSpeechRecognition({
      lang: options?.lang ?? 'zh-CN',
      continuous: options?.continuous ?? false,
      interimResults: options?.interimResults ?? true,
    });

    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent): void => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) => prev + finalText);
        onResultRef.current?.(finalText);
      }
      setInterimTranscript(interimText);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent): void => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = (): void => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported]);

  const start = useCallback((): void => {
    if (!recognitionRef.current || isListening) return;
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      setError('启动语音识别失败');
      setIsListening(false);
    }
  }, [isListening]);

  const stop = useCallback((): void => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback((): void => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    start,
    stop,
    reset,
  };
}
