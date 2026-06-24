import { describe, it, expect, afterEach } from 'vitest';
import {
  isSpeechRecognitionSupported,
  createSpeechRecognition,
} from '@/lib/speech';

describe('lib/speech.ts', () => {
  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).SpeechRecognition;
    delete (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
  });

  // ===== isSpeechRecognitionSupported =====

  describe('isSpeechRecognitionSupported', () => {
    it('should return false when neither SpeechRecognition nor webkitSpeechRecognition is available', () => {
      expect(isSpeechRecognitionSupported()).toBe(false);
    });

    it('should return true when window.SpeechRecognition is available', () => {
      class MockSR {
        lang = '';
        continuous = false;
        interimResults = false;
      }
      (window as unknown as Record<string, unknown>).SpeechRecognition = MockSR;
      expect(isSpeechRecognitionSupported()).toBe(true);
    });

    it('should return true when window.webkitSpeechRecognition is available', () => {
      class MockSR {
        lang = '';
        continuous = false;
        interimResults = false;
      }
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition = MockSR;
      expect(isSpeechRecognitionSupported()).toBe(true);
    });

    it('should return true when both are available', () => {
      class MockSR1 {
        lang = '';
      }
      class MockSR2 {
        lang = '';
      }
      (window as unknown as Record<string, unknown>).SpeechRecognition = MockSR1;
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition = MockSR2;
      expect(isSpeechRecognitionSupported()).toBe(true);
    });
  });

  // ===== createSpeechRecognition =====

  describe('createSpeechRecognition', () => {
    it('should return null when unsupported', () => {
      expect(createSpeechRecognition()).toBe(null);
    });

    it('should create an instance with default options when SpeechRecognition is available', () => {
      class MockSR {
        lang = '';
        continuous = false;
        interimResults = false;
      }
      (window as unknown as Record<string, unknown>).SpeechRecognition = MockSR;

      const recognition = createSpeechRecognition();
      expect(recognition).toBeInstanceOf(MockSR);
      expect(recognition!.lang).toBe('zh-CN');
      expect(recognition!.continuous).toBe(false);
      expect(recognition!.interimResults).toBe(true);
    });

    it('should apply custom lang option', () => {
      class MockSR {
        lang = '';
        continuous = false;
        interimResults = false;
      }
      (window as unknown as Record<string, unknown>).SpeechRecognition = MockSR;

      const recognition = createSpeechRecognition({ lang: 'en-US' });
      expect(recognition!.lang).toBe('en-US');
    });

    it('should apply custom continuous option', () => {
      class MockSR {
        lang = '';
        continuous = false;
        interimResults = false;
      }
      (window as unknown as Record<string, unknown>).SpeechRecognition = MockSR;

      const recognition = createSpeechRecognition({ continuous: true });
      expect(recognition!.continuous).toBe(true);
    });

    it('should apply custom interimResults option', () => {
      class MockSR {
        lang = '';
        continuous = false;
        interimResults = false;
      }
      (window as unknown as Record<string, unknown>).SpeechRecognition = MockSR;

      const recognition = createSpeechRecognition({ interimResults: false });
      expect(recognition!.interimResults).toBe(false);
    });

    it('should use webkitSpeechRecognition when SpeechRecognition is not available', () => {
      class MockWebkitSR {
        lang = '';
        continuous = false;
        interimResults = false;
      }
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition = MockWebkitSR;

      const recognition = createSpeechRecognition();
      expect(recognition).toBeInstanceOf(MockWebkitSR);
    });

    it('should prefer SpeechRecognition over webkitSpeechRecognition', () => {
      class MockSR {
        lang = 'standard';
      }
      class MockWebkitSR {
        lang = 'webkit';
      }
      (window as unknown as Record<string, unknown>).SpeechRecognition = MockSR;
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition = MockWebkitSR;

      const recognition = createSpeechRecognition();
      expect(recognition).toBeInstanceOf(MockSR);
      expect(recognition!.lang).toBe('zh-CN'); // default applied after construction
    });
  });
});
