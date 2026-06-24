import React from 'react';
import Box from '@mui/material/Box';
import TopBar from './TopBar';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout with TopBar, content area, and BottomNav.
 * Mobile-first container capped at 430px with warm background.
 */
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        maxWidth: '430px',
        margin: '0 auto',
        backgroundColor: '#FFF8EE',
      }}
    >
      <TopBar />
      <Box
        component="main"
        sx={{
          flex: 1,
          pb: 9,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          /* Bottom safe area for home-indicator devices */
          paddingBottom: 'calc(2.25rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {children}
      </Box>
      <BottomNav />
    </Box>
  );
};

export default AppLayout;
