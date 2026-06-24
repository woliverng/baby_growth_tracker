import React from 'react';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

interface ImagePreviewProps {
  open: boolean;
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/**
 * Full-screen image preview dialog with left/right navigation.
 *
 * Renders a black-background full-screen dialog with the image centered,
 * arrow buttons to navigate between images, and a counter showing
 * the current position (e.g. "2 / 5").
 */
const ImagePreview: React.FC<ImagePreviewProps> = ({
  open,
  images,
  index,
  onClose,
  onIndexChange,
}) => {
  const hasMultiple = images.length > 1;

  const handlePrev = (): void => {
    onIndexChange(index === 0 ? images.length - 1 : index - 1);
  };

  const handleNext = (): void => {
    onIndexChange(index === images.length - 1 ? 0 : index + 1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: { bgcolor: 'black' },
      }}
    >
      {/* Close button */}
      <IconButton
        onClick={onClose}
        aria-label="关闭"
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          color: 'white',
          zIndex: 2,
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Image display */}
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {images[index] && (
          <Box
            component="img"
            src={images[index]}
            alt=""
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )}

        {/* Left arrow */}
        {hasMultiple && (
          <IconButton
            onClick={handlePrev}
            aria-label="上一张"
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.3)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}

        {/* Right arrow */}
        {hasMultiple && (
          <IconButton
            onClick={handleNext}
            aria-label="下一张"
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.3)',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        )}

        {/* Counter */}
        {hasMultiple && (
          <Typography
            sx={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '0.875rem',
            }}
          >
            {index + 1} / {images.length}
          </Typography>
        )}
      </Box>
    </Dialog>
  );
};

export default ImagePreview;
