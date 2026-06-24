import React from 'react';
import Box from '@mui/material/Box';

interface GiraffeSpotsProps {
  /** Number of spots to render. Defaults to 9. */
  count?: number;
  /** Opacity override. Defaults to 0.15. */
  opacity?: number;
}

/**
 * Decorative row of giraffe spots, used at the bottom of the home page
 * and other decorative areas. Spots are irregular ellipses with
 * varied rotation and scale to mimic natural giraffe pattern.
 */
const GiraffeSpots: React.FC<GiraffeSpotsProps> = ({ count = 9, opacity = 0.15 }) => {
  const spots = Array.from({ length: count }, (_, i) => i);

  return (
    <Box
      component="div"
      aria-hidden="true"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        padding: '12px 0',
        opacity,
        pointerEvents: 'none',
      }}
    >
      {spots.map((i) => {
        const variant = i % 3;
        const scale = variant === 1 ? 0.7 : variant === 2 ? 0.85 : 1;
        const rotate = variant === 1 ? 15 : variant === 2 ? -10 : 5;
        const spotOpacity = variant === 1 ? 0.7 : variant === 2 ? 0.6 : 1;

        return (
          <Box
            key={i}
            component="div"
            sx={{
              width: '20px',
              height: '28px',
              background: '#8B5E3C',
              borderRadius: '40% 60% 50% 50%',
              transform: `scale(${scale}) rotate(${rotate}deg)`,
              opacity: spotOpacity,
            }}
          />
        );
      })}
    </Box>
  );
};

export default GiraffeSpots;
