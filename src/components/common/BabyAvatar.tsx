import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DeleteOutlineIcon from '@mui/icons-material/Delete';

import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { compressImage } from '@/lib/image';
import GiraffeIcon from './GiraffeIcon';
import type { CompressOptions } from '@/types';

/** Avatar compression: small square, good quality, under 100KB */
const AVATAR_COMPRESS_OPTIONS: CompressOptions = {
  maxWidth: 256,
  maxHeight: 256,
  quality: 0.8,
  maxSizeKB: 100,
};

interface BabyAvatarProps {
  /** Pixel size for both width and height. Defaults to 40. */
  size?: number;
  /** If true (default), clicking opens the avatar upload menu. */
  editable?: boolean;
}

/**
 * Baby avatar component with custom photo upload support.
 *
 * Shows the baby's custom avatar (base64) or a default giraffe icon.
 * When editable, clicking opens a menu with options to:
 * - Take a photo (camera)
 * - Choose from gallery
 * - Remove custom avatar (if one is set)
 *
 * Uploaded images are compressed to a small square and stored
 * as base64 in the baby store via `updateBaby`.
 */
const BabyAvatar: React.FC<BabyAvatarProps> = ({ size = 40, editable = true }) => {
  const babies = useBabyStore((s) => s.babies);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const updateBaby = useBabyStore((s) => s.updateBaby);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const fileInputCameraRef = useRef<HTMLInputElement>(null);
  const fileInputGalleryRef = useRef<HTMLInputElement>(null);

  const activeBaby = babies.find((b) => b.id === activeBabyId) ?? babies[0];
  const avatar = activeBaby?.avatar;
  const hasCustomAvatar = Boolean(avatar);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    if (!editable || !activeBaby) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleCameraClick = (): void => {
    handleClose();
    fileInputCameraRef.current?.click();
  };

  const handleGalleryClick = (): void => {
    handleClose();
    fileInputGalleryRef.current?.click();
  };

  const handleRemoveAvatar = (): void => {
    handleClose();
    if (activeBaby) {
      updateBaby(activeBaby.id, { avatar: undefined });
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file || !activeBaby) return;

    try {
      const base64 = await compressImage(file, AVATAR_COMPRESS_OPTIONS);
      updateBaby(activeBaby.id, { avatar: base64 });
    } catch (err) {
      console.error('Failed to process avatar image:', err);
    }

    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  const menuOpen = Boolean(anchorEl);

  return (
    <>
      <Box
        onClick={editable && activeBaby ? handleClick : undefined}
        role={editable && activeBaby ? 'button' : undefined}
        aria-label={editable && activeBaby ? '更换宝宝头像' : undefined}
        sx={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: avatar
            ? 'none'
            : 'linear-gradient(135deg, #FDE68A, #F4A940)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
          cursor: editable && activeBaby ? 'pointer' : 'default',
          border: '2px solid rgba(244,169,64,0.2)',
          transition: 'all 150ms cubic-bezier(0.25, 1, 0.5, 1)',
          '&:hover': editable && activeBaby
            ? {
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(244,169,64,0.25)',
              }
            : {},
          '&:active': editable && activeBaby
            ? { transform: 'scale(0.95)' }
            : {},
        }}
      >
        {avatar ? (
          <Box
            component="img"
            src={avatar}
            alt="宝宝头像"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%',
            }}
          />
        ) : (
          <GiraffeIcon size={Math.round(size * 0.7)} />
        )}
      </Box>

      {/* Hidden file inputs */}
      <input
        ref={fileInputCameraRef}
        type="file"
        accept="image/*"
        capture="user"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <input
        ref={fileInputGalleryRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Avatar action menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <MenuItem onClick={handleCameraClick}>
          <ListItemIcon>
            <PhotoCameraIcon fontSize="small" sx={{ color: '#F4A940' }} />
          </ListItemIcon>
          <ListItemText primary="拍照" />
        </MenuItem>
        <MenuItem onClick={handleGalleryClick}>
          <ListItemIcon>
            <PhotoLibraryIcon fontSize="small" sx={{ color: '#8B5E3C' }} />
          </ListItemIcon>
          <ListItemText primary="从相册选择" />
        </MenuItem>
        {hasCustomAvatar && (
          <MenuItem onClick={handleRemoveAvatar}>
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText primary="删除头像" sx={{ color: 'error.main' }} />
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default BabyAvatar;
