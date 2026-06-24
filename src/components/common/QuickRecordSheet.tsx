import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import CloseIcon from '@mui/icons-material/Close';

import { useUIStore } from '@/store/useUIStore';
import { RECORD_TYPE_COLORS, RECORD_TYPE_LABELS } from '@/lib/constants';
import FeedingForm from '@/components/records/FeedingForm';
import SleepForm from '@/components/records/SleepForm';
import DiaperForm from '@/components/records/DiaperForm';
import GrowthForm from '@/components/records/GrowthForm';
import JaundiceForm from '@/components/records/JaundiceForm';
import type { RecordType } from '@/types';

/**
 * Bottom drawer for quick recording.
 * Features 40px top radius, a handle indicator, and spring-easing animation.
 * Shows type selection grid or a specific form.
 */
const QuickRecordSheet: React.FC = () => {
  const quickRecordOpen = useUIStore((s) => s.quickRecordOpen);
  const quickRecordType = useUIStore((s) => s.quickRecordType);
  const closeQuickRecord = useUIStore((s) => s.closeQuickRecord);
  const openQuickRecord = useUIStore((s) => s.openQuickRecord);

  const typeOptions: { type: RecordType; icon: React.ReactNode }[] = [
    { type: 'feeding', icon: <RestaurantIcon /> },
    { type: 'sleep', icon: <BedtimeIcon /> },
    { type: 'diaper', icon: <BabyChangingStationIcon /> },
    { type: 'growth', icon: <MonitorWeightIcon /> },
    { type: 'jaundice', icon: <WaterDropIcon /> },
  ];

  const renderForm = (): React.ReactNode => {
    switch (quickRecordType) {
      case 'feeding':
        return <FeedingForm />;
      case 'sleep':
        return <SleepForm />;
      case 'diaper':
        return <DiaperForm />;
      case 'growth':
        return <GrowthForm />;
      case 'jaundice':
        return <JaundiceForm />;
      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={quickRecordOpen}
      onClose={closeQuickRecord}
      PaperProps={{
        sx: {
          borderTopLeftRadius: '40px',
          borderTopRightRadius: '40px',
          maxHeight: '85dvh',
          transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        },
      }}
    >
      {/* Handle indicator */}
      <Box
        sx={{
          width: '36px',
          height: '5px',
          background: '#E0D0B8',
          borderRadius: '9999px',
          margin: '16px auto 16px',
        }}
      />

      <Box sx={{ px: 2, pb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: '"Nunito", "PingFang SC", sans-serif',
              color: '#4A3728',
            }}
          >
            {quickRecordType ? RECORD_TYPE_LABELS[quickRecordType] : '快速记录'}
          </Typography>
          <IconButton onClick={closeQuickRecord} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {!quickRecordType ? (
          <Grid container spacing={2} sx={{ pb: 2 }}>
            {typeOptions.map(({ type, icon }) => (
              <Grid item xs={6} key={type}>
                <Box
                  onClick={() => openQuickRecord(type)}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    py: 3,
                    borderRadius: '20px',
                    cursor: 'pointer',
                    backgroundColor: '#FFF3E0',
                    border: '2px solid #F0E6D8',
                    color: RECORD_TYPE_COLORS[type],
                    fontWeight: 600,
                    transition: 'all 150ms cubic-bezier(0.25, 1, 0.5, 1)',
                    '&:hover': {
                      borderColor: '#F4A940',
                      backgroundColor: '#FFFAF0',
                    },
                    '&:active': {
                      transform: 'scale(0.96)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: '14px',
                      backgroundColor: `${RECORD_TYPE_COLORS[type]}20`,
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: '#8B7355' }}>
                    {RECORD_TYPE_LABELS[type]}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ pt: 1.5, pb: 2, maxHeight: '70vh', overflowY: 'auto' }}>
            {renderForm()}
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default QuickRecordSheet;
