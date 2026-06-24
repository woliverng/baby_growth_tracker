import React, { useRef, useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CloseIcon from '@mui/icons-material/Close';
import { compressImage } from '@/lib/image';
import { MAX_IMAGES_PER_RECORD } from '@/lib/constants';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

/**
 * Image upload component with thumbnail grid, compression, and deletion.
 *
 * Uses a hidden file input that supports both camera capture (mobile)
 * and gallery selection. Each selected image is compressed via Canvas API
 * before being stored as a base64 string.
 */
const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onChange,
  maxImages = MAX_IMAGES_PER_RECORD,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const remaining = maxImages - images.length;
      const fileArray = Array.from(files).slice(0, remaining);

      setLoading(true);
      try {
        const compressed: string[] = [];
        for (const file of fileArray) {
          const base64 = await compressImage(file);
          compressed.push(base64);
        }
        onChange([...images, ...compressed]);
      } catch {
        // Silently skip failed compressions
      } finally {
        setLoading(false);
      }

      // Reset input so the same file can be selected again
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [images, onChange, maxImages]
  );

  const handleRemove = useCallback(
    (index: number): void => {
      const next = images.filter((_, i) => i !== index);
      onChange(next);
    },
    [images, onChange]
  );

  const canAddMore = images.length < maxImages;

  return (
    <Box>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {/* Thumbnail grid */}
        {images.map((src, index) => (
          <Box
            key={index}
            sx={{
              position: 'relative',
              width: 72,
              height: 72,
              borderRadius: 1,
              overflow: 'hidden',
              flexShrink: 0,
            }}
            className="image-thumbnail"
          >
            <Box
              component="img"
              src={src}
              alt=""
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <IconButton
              size="small"
              onClick={() => handleRemove(index)}
              aria-label="删除图片"
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                p: 0.25,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
              }}
            >
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          </Box>
        ))}

        {/* Upload button */}
        {canAddMore && (
          <Box
            onClick={() => !loading && inputRef.current?.click()}
            sx={{
              width: 72,
              height: 72,
              borderRadius: 1,
              border: '1px dashed',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: loading ? 'default' : 'pointer',
              flexShrink: 0,
              color: 'text.secondary',
              transition: 'border-color 0.2s, background-color 0.2s',
              '&:hover': {
                borderColor: 'primary.main',
                backgroundColor: 'action.hover',
              },
            }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <AddPhotoAlternateIcon />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ImageUploader;
