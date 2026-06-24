import React from 'react';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

interface VoiceInputButtonProps {
  /** Called when a final transcript segment is recognized. */
  onTranscript: (text: string) => void;
  size?: 'small' | 'medium' | 'large';
}

/**
 * Voice input button with pulse animation during recording.
 *
 * Wraps the useSpeechRecognition hook. When the browser does not support
 * the Web Speech API, this component renders null (graceful degradation).
 *
 * Click to start listening; click again to stop. Finalized transcript
 * segments are passed to the onTranscript callback.
 */
const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onTranscript,
  size = 'small',
}) => {
  const { isSupported, isListening, start, stop, interimTranscript, error } =
    useSpeechRecognition({
      onResult: onTranscript,
    });

  // Graceful degradation: render nothing if unsupported
  if (!isSupported) return null;

  const handleClick = (): void => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  const iconSize = size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium';

  return (
    <IconButton
      onClick={handleClick}
      size={iconSize as 'small' | 'medium' | 'large'}
      aria-label={isListening ? '停止语音输入' : '语音输入'}
      sx={{
        position: 'relative',
        bgcolor: isListening ? 'error.main' : 'transparent',
        color: isListening ? 'white' : 'text.secondary',
        '&:hover': {
          bgcolor: isListening ? 'error.dark' : 'action.hover',
        },
      }}
    >
      {isListening ? <MicIcon /> : <MicOffIcon />}

      {/* Pulse animation rings while listening */}
      {isListening && (
        <>
          <span className="voice-pulse-ring" />
          <span className="voice-pulse-ring" style={{ animationDelay: '0.5s' }} />
        </>
      )}

      {/* Interim transcript tooltip */}
      {isListening && interimTranscript && (
        <span
          style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: 4,
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            fontSize: '0.75rem',
            whiteSpace: 'nowrap',
            maxWidth: 200,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            pointerEvents: 'none',
          }}
        >
          {interimTranscript}
        </span>
      )}

      {/* Error indicator */}
      {error && (
        <span
          style={{
            position: 'absolute',
            bottom: '100%',
            right: 0,
            marginBottom: 4,
            padding: '2px 8px',
            borderRadius: 4,
            backgroundColor: 'rgba(244,67,54,0.8)',
            color: 'white',
            fontSize: '0.7rem',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {error}
        </span>
      )}
    </IconButton>
  );
};

export default VoiceInputButton;
