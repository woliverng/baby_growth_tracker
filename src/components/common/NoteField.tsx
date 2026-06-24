import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import VoiceInputButton from './VoiceInputButton';
import ImageUploader from './ImageUploader';

interface NoteFieldProps {
  value: string;
  onChange: (value: string) => void;
  images: string[];
  onImagesChange: (images: string[]) => void;
}

/**
 * Composite note field combining a multiline text input,
 * an embedded voice input button, and an image uploader.
 *
 * This component replaces the standalone TextField in all four
 * record forms (Feeding/Sleep/Diaper/Growth), providing unified
 * note editing with speech-to-text and image attachment.
 *
 * Voice transcript text is appended to the current value.
 */
const NoteField: React.FC<NoteFieldProps> = ({
  value,
  onChange,
  images,
  onImagesChange,
}) => {
  const handleTranscript = (text: string): void => {
    onChange(value + text);
  };

  return (
    <Box>
      <TextField
        label="备注"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        fullWidth
        multiline
        rows={2}
        size="small"
        placeholder="输入备注或点击麦克风语音输入"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end" sx={{ alignSelf: 'flex-start', mt: 0.5 }}>
              <VoiceInputButton onTranscript={handleTranscript} size="small" />
            </InputAdornment>
          ),
        }}
      />
      <Box sx={{ mt: 1 }}>
        <ImageUploader images={images} onChange={onImagesChange} />
      </Box>
    </Box>
  );
};

export default NoteField;
