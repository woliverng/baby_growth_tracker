import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import GiraffeIcon from './GiraffeIcon';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * A reusable empty state component with a giraffe-themed SVG illustration,
 * warm-toned text, and optional action button.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 3,
        textAlign: 'center',
      }}
    >
      {/* Giraffe illustration or custom icon */}
      {icon ? (
        <Box sx={{ color: '#B8A088', mb: 2, opacity: 0.4 }}>{icon}</Box>
      ) : (
        <Box
          sx={{
            mb: 2,
            opacity: 0.4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <GiraffeIcon size={80} />
        </Box>
      )}
      <Typography
        sx={{
          fontFamily: '"Nunito", "PingFang SC", sans-serif',
          fontWeight: 700,
          fontSize: '1.1rem',
          color: '#8B7355',
          mb: 0.5,
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body2"
          sx={{ color: '#B8A088', mb: 2 }}
        >
          {subtitle}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button
          variant="contained"
          color="primary"
          onClick={onAction}
          sx={{
            background: 'linear-gradient(135deg, #F4A940, #D97706)',
            borderRadius: '20px',
            fontWeight: 700,
            textTransform: 'none',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(244,169,64,0.35)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default EmptyState;
