import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import VoiceInputButton from '@/components/common/VoiceInputButton';

describe('VoiceInputButton', () => {
  afterEach(() => {
    delete (window as unknown as Record<string, unknown>).SpeechRecognition;
    delete (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
  });

  // ===== Graceful degradation =====

  it('should return null when speech recognition is not supported', () => {
    const { container } = render(<VoiceInputButton onTranscript={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should not render any button when unsupported', () => {
    render(<VoiceInputButton onTranscript={() => {}} />);
    expect(screen.queryByLabelText('语音输入')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('停止语音输入')).not.toBeInTheDocument();
  });

  // ===== Supported =====

  describe('when speech recognition is supported', () => {
    let mockStart: ReturnType<typeof vi.fn>;
    let mockStop: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      mockStart = vi.fn();
      mockStop = vi.fn();

      class MockSR {
        lang = '';
        continuous = false;
        interimResults = false;
        onresult: ((event: unknown) => void) | null = null;
        onerror: ((event: unknown) => void) | null = null;
        onend: (() => void) | null = null;
        onstart: (() => void) | null = null;
        start = mockStart;
        stop = mockStop;
        abort = vi.fn();
      }
      (window as unknown as Record<string, unknown>).SpeechRecognition = MockSR;
    });

    it('should render a button with aria-label "语音输入"', () => {
      render(<VoiceInputButton onTranscript={() => {}} />);
      expect(screen.getByLabelText('语音输入')).toBeInTheDocument();
    });

    it('should start listening when button is clicked', () => {
      render(<VoiceInputButton onTranscript={() => {}} />);
      fireEvent.click(screen.getByLabelText('语音输入'));
      expect(mockStart).toHaveBeenCalled();
    });

    it('should change aria-label to "停止语音输入" when listening', () => {
      render(<VoiceInputButton onTranscript={() => {}} />);
      fireEvent.click(screen.getByLabelText('语音输入'));
      expect(screen.getByLabelText('停止语音输入')).toBeInTheDocument();
    });

    it('should stop listening when button is clicked while listening', () => {
      render(<VoiceInputButton onTranscript={() => {}} />);
      // Start listening
      fireEvent.click(screen.getByLabelText('语音输入'));
      // Stop listening
      fireEvent.click(screen.getByLabelText('停止语音输入'));
      expect(mockStop).toHaveBeenCalled();
    });

    it('should change aria-label back to "语音输入" after stopping', () => {
      render(<VoiceInputButton onTranscript={() => {}} />);
      fireEvent.click(screen.getByLabelText('语音输入'));
      fireEvent.click(screen.getByLabelText('停止语音输入'));
      expect(screen.getByLabelText('语音输入')).toBeInTheDocument();
    });

    it('should render pulse animation rings when listening', () => {
      const { container } = render(
        <VoiceInputButton onTranscript={() => {}} />
      );
      fireEvent.click(screen.getByLabelText('语音输入'));
      const pulseRings = container.querySelectorAll('.voice-pulse-ring');
      expect(pulseRings.length).toBe(2);
    });

    it('should not render pulse rings when not listening', () => {
      const { container } = render(
        <VoiceInputButton onTranscript={() => {}} />
      );
      const pulseRings = container.querySelectorAll('.voice-pulse-ring');
      expect(pulseRings.length).toBe(0);
    });
  });
});
