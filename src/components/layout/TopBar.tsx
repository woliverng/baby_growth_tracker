import React, { useState, MouseEvent } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { calculateAge } from '@/lib/date';
import BabyAvatar from '@/components/common/BabyAvatar';

/**
 * Top bar showing the active baby's avatar, name and age with a
 * baby switcher dropdown. Includes safe-area-inset-top padding for
 * notch / dynamic-island devices.
 */
const TopBar: React.FC = () => {
  const babies = useBabyStore((s) => s.babies);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const setActiveBabyId = useSettingsStore((s) => s.setActiveBabyId);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleSelect = (id: string): void => {
    setActiveBabyId(id);
    handleClose();
  };

  const activeBaby = babies.find((b) => b.id === activeBabyId) ?? babies[0];

  const ageText = activeBaby ? calculateAge(activeBaby.birthDate).text : '';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: '#FFFAF0',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: '#4A3728',
        borderBottom: '1px solid #F0E6D8',
        /* Safe area: extend cream background into status bar region */
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}
    >
      <Toolbar sx={{ minHeight: '56px !important' }}>
        {/* Baby avatar (clickable to upload custom photo) */}
        <Box sx={{ mr: 1.5, flexShrink: 0 }}>
          <BabyAvatar size={40} />
        </Box>

        {activeBaby ? (
          <>
            <Box
              onClick={babies.length > 1 ? handleClick : undefined}
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: babies.length > 1 ? 'pointer' : 'default',
                flexGrow: 1,
              }}
            >
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 700,
                    lineHeight: 1.2,
                    fontFamily: '"Nunito", "PingFang SC", sans-serif',
                    color: '#4A3728',
                  }}
                >
                  {activeBaby.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: '#8B7355', fontWeight: 500 }}
                >
                  {ageText}
                </Typography>
              </Box>
              {babies.length > 1 && (
                <ArrowDropDownIcon sx={{ color: '#8B7355' }} />
              )}
            </Box>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              {babies.map((baby) => (
                <MenuItem
                  key={baby.id}
                  onClick={() => handleSelect(baby.id)}
                  selected={baby.id === activeBaby?.id}
                >
                  <ListItemIcon>
                    <BabyChangingStationIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={baby.name}
                    secondary={calculateAge(baby.birthDate).text}
                  />
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : (
          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#8B7355' }}>
            请创建宝宝档案
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
