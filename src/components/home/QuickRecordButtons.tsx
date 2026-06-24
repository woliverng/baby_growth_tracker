import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import { useUIStore } from '@/store/useUIStore';
import { RECORD_TYPE_COLORS } from '@/lib/constants';
import type { RecordType } from '@/types';

/**
 * Quick-record buttons with a top color bar per type.
 * 20px radius, warm border, hover lift with bar expansion.
 */
const QuickRecordButtons: React.FC = () => {
  const openQuickRecord = useUIStore((s) => s.openQuickRecord);

  const buttons: { type: RecordType; label: string; icon: React.ReactNode }[] = [
    { type: 'feeding', label: '喂奶', icon: <RestaurantIcon /> },
    { type: 'sleep', label: '睡眠', icon: <BedtimeIcon /> },
    { type: 'diaper', label: '尿布', icon: <BabyChangingStationIcon /> },
    { type: 'growth', label: '量体', icon: <MonitorWeightIcon /> },
    { type: 'jaundice', label: '黄疸', icon: <WaterDropIcon /> },
  ];

  return (
    <Box sx={{ display: 'flex', gap: 1.5 }}>
      {buttons.map(({ type, label, icon }) => {
        const color = RECORD_TYPE_COLORS[type];
        return (
          <Box
            key={type}
            onClick={() => openQuickRecord(type)}
            sx={{
              flex: 1,
              minWidth: 0,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              py: 1.5,
              borderRadius: '20px',
              cursor: 'pointer',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #F0E6D8',
              boxShadow: '0 1px 3px rgba(93,58,26,0.04)',
              transition: 'all 150ms cubic-bezier(0.25, 1, 0.5, 1)',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                backgroundColor: color,
                borderRadius: '0 0 6px 6px',
                transition: 'height 150ms cubic-bezier(0.25, 1, 0.5, 1)',
              },
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(93,58,26,0.08)',
                '&::before': {
                  height: '5px',
                },
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 36,
                height: 36,
                borderRadius: '14px',
                backgroundColor: `${color}20`,
                color: color,
              }}
            >
              {icon}
            </Box>
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 600,
                color: '#8B7355',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default QuickRecordButtons;
