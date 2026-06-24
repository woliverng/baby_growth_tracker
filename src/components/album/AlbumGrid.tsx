import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { AlbumGroup, RecordItem } from '@/types';

interface AlbumGridProps {
  group: AlbumGroup;
  onItemClick: (record: RecordItem, imageIndex: number) => void;
}

/**
 * Album grid component rendering a date-grouped set of image thumbnails
 * in a 3-column CSS grid layout with 14px rounded corners.
 *
 * Each thumbnail is a square (aspect-ratio 1/1) with object-fit: cover.
 * Clicking a thumbnail calls onItemClick with the owning record and
 * the image index within that record.
 */
const AlbumGrid: React.FC<AlbumGridProps> = ({ group, onItemClick }) => {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography
        sx={{
          fontWeight: 700,
          mb: 1,
          px: 0.5,
          color: '#8B7355',
          fontFamily: '"Nunito", "PingFang SC", sans-serif',
          fontSize: '0.85rem',
        }}
      >
        {group.label}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
        }}
      >
        {group.items.map((item) => (
          <Box
            key={`${item.record.id}-${item.imageIndex}`}
            onClick={() => onItemClick(item.record, item.imageIndex)}
            sx={{
              aspectRatio: '1 / 1',
              borderRadius: '14px',
              overflow: 'hidden',
              cursor: 'pointer',
              backgroundColor: '#FFF3E0',
              '&:hover': { opacity: 0.85, boxShadow: '0 4px 12px rgba(93,58,26,0.08)' },
              '&:active': { transform: 'scale(0.95)' },
              transition: 'all 150ms cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            <Box
              component="img"
              src={item.imageSrc}
              alt=""
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AlbumGrid;
