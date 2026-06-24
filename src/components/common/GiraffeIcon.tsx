import React from 'react';

interface GiraffeIconProps {
  /** Pixel size for both width and height. Defaults to 32. */
  size?: number;
  /** Additional className for styling. */
  className?: string;
}

/**
 * Reusable giraffe icon — a cute baby giraffe head with ossicones,
 * large round eyes, blush, and body spots.
 *
 * Based on the design system's mascot "Xiao Lu".
 * Colors use giraffe brown (#8B5E3C) and giraffe yellow (#F4A940).
 */
const GiraffeIcon: React.FC<GiraffeIconProps> = ({ size = 32, className }) => {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* Ossicones (horns) */}
      <ellipse cx="14.5" cy="1.5" rx="1.5" ry="2.5" fill="#8B5E3C" />
      <ellipse cx="17.5" cy="1.5" rx="1.5" ry="2.5" fill="#8B5E3C" />
      <circle cx="14.5" cy="0" r="0.8" fill="#F4A940" />
      <circle cx="17.5" cy="0" r="0.8" fill="#F4A940" />

      {/* Head */}
      <ellipse cx="16" cy="12" rx="6" ry="7" fill="#F4A940" />

      {/* Spots on head */}
      <ellipse cx="12" cy="15" rx="1.5" ry="1.2" fill="#8B5E3C" opacity="0.3" />
      <ellipse cx="20" cy="14" rx="1.2" ry="1" fill="#8B5E3C" opacity="0.3" />

      {/* Body */}
      <rect x="14" y="18" width="4" height="6" rx="2" fill="#F4A940" />

      {/* Body spots */}
      <ellipse cx="16" cy="21" rx="1" ry="0.8" fill="#8B5E3C" opacity="0.3" />

      {/* Ears */}
      <ellipse cx="10" cy="11" rx="2" ry="3" fill="#F4A940" opacity="0.8" />
      <ellipse cx="22" cy="11" rx="2" ry="3" fill="#F4A940" opacity="0.8" />
      <ellipse cx="10" cy="11" rx="1" ry="1.5" fill="#8B5E3C" opacity="0.3" />
      <ellipse cx="22" cy="11" rx="1" ry="1.5" fill="#8B5E3C" opacity="0.3" />

      {/* Eyes (white) */}
      <circle cx="13" cy="10" r="1.5" fill="#FFFAF0" />
      <circle cx="19" cy="10" r="1.5" fill="#FFFAF0" />

      {/* Pupils */}
      <circle cx="12.5" cy="9.5" r="0.6" fill="#4A3728" />
      <circle cx="18.5" cy="9.5" r="0.6" fill="#4A3728" />

      {/* Eye highlights */}
      <circle cx="12.8" cy="9.2" r="0.2" fill="#FFFFFF" />
      <circle cx="18.8" cy="9.2" r="0.2" fill="#FFFFFF" />

      {/* Blush */}
      <ellipse cx="10.5" cy="13" rx="1.2" ry="0.8" fill="#FF8A80" opacity="0.3" />
      <ellipse cx="21.5" cy="13" rx="1.2" ry="0.8" fill="#FF8A80" opacity="0.3" />

      {/* Smile */}
      <path
        d="M13 13.5 Q16 15 19 13.5"
        stroke="#4A3728"
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default GiraffeIcon;
