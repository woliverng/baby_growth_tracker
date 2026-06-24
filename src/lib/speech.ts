/**
 * Web Speech API compatibility detection and instance creation.
 *
 * Browser support:
 * - Chrome (desktop + Android): webkitSpeechRecognition
 * - Edge: webkitSpeechRecognition (Chromium-based)
 * - Safari (iOS 14.5+): SpeechRecognition (requires HTTPS)
 * - Firefox: Not supported
 */

/**
 * Check whether the browser supports the Web Speech API.
 * @returns true if SpeechRecognition or webkitSpeechRecognition is available
 */
export function isSpeechRecognitionSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  );
}

/**
 * Create a SpeechRecognition instance with the given options.
 * Must call isSpeechRecognitionSupported() first to verify support.
 *
 * @param options - Configuration for language, continuous mode, and interim results
 * @returns A configured SpeechRecognition instance, or null if unsupported
 */
export function createSpeechRecognition(options?: {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
}): SpeechRecognition | null {
  const SpeechRecognitionClass =
    (window as Window).SpeechRecognition ||
    (window as Window).webkitSpeechRecognition;

  if (!SpeechRecognitionClass) return null;

  const recognition = new SpeechRecognitionClass();
  recognition.lang = options?.lang ?? 'zh-CN';
  recognition.continuous = options?.continuous ?? false;
  recognition.interimResults = options?.interimResults ?? true;
  return recognition;
}
