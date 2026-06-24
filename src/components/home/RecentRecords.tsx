import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RecordCard from '@/components/common/RecordCard';
import EmptyState from '@/components/common/EmptyState';
import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import InvertColorsOffIcon from '@mui/icons-material/InvertColorsOff';

/**
 * Shows the most recent 5 records for the active baby.
 * Section title includes a giraffe spot dot decorator.
 */
const RecentRecords: React.FC = () => {
  const records = useRecordStore((s) => s.records);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const openQuickRecord = useUIStore((s) => s.openQuickRecord);

  const recentRecords = useMemo(() => {
    const babyRecords = records.filter((r) => r.babyId === activeBabyId);
    return babyRecords
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [records, activeBabyId]);

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: '"Nunito", "PingFang SC", sans-serif',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: '#4A3728',
          mb: 1,
          px: 0.5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box component="span" className="giraffe-section-dot" />
        最近记录
      </Typography>
      {recentRecords.length === 0 ? (
        <EmptyState
          icon={<InvertColorsOffIcon sx={{ fontSize: 48 }} />}
          title="还没有记录"
          subtitle="点击下方按钮开始记录宝宝的日常"
          actionLabel="快速记录"
          onAction={() => openQuickRecord()}
        />
      ) : (
        <Box>
          {recentRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecentRecords;
