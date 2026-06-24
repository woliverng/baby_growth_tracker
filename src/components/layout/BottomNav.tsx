import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Paper from '@mui/material/Paper';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import SettingsIcon from '@mui/icons-material/Settings';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

/**
 * Bottom navigation with 5 tabs and glass background.
 * The FAB has been moved to the HomePage content area.
 */
const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentPath = location.pathname;

  const getNavValue = (): string => {
    if (currentPath.startsWith('/records')) return '/records';
    if (currentPath.startsWith('/album')) return '/album';
    if (currentPath.startsWith('/growth')) return '/growth';
    if (currentPath.startsWith('/settings')) return '/settings';
    return '/';
  };

  const handleChange = (_event: React.SyntheticEvent, newValue: string): void => {
    navigate(newValue);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '430px',
        zIndex: 1100,
        backgroundColor: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '1px solid #F0E6D8',
        /* Bottom safe area for home-indicator devices */
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <BottomNavigation
        value={getNavValue()}
        onChange={handleChange}
        showLabels
        sx={{
          height: 64,
          backgroundColor: 'transparent',
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.625rem',
            fontWeight: 700,
          },
          '& .MuiBottomNavigationAction-root': {
            color: '#B8A088',
            position: 'relative',
            '&.Mui-selected': {
              color: '#D97706',
            },
          },
          '& .MuiBottomNavigationAction-root.Mui-selected::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '20px',
            height: '3px',
            background: '#F4A940',
            borderRadius: '0 0 6px 6px',
          },
        }}
      >
        <BottomNavigationAction label="首页" value="/" icon={<HomeIcon />} />
        <BottomNavigationAction label="记录" value="/records" icon={<ListAltIcon />} />
        <BottomNavigationAction label="相册" value="/album" icon={<PhotoLibraryIcon />} />
        <BottomNavigationAction label="成长" value="/growth" icon={<ShowChartIcon />} />
        <BottomNavigationAction label="更多" value="/settings" icon={<SettingsIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
