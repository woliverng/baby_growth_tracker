import React, { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Stack from '@mui/material/Stack';

import RecordCard from '@/components/common/RecordCard';
import EmptyState from '@/components/common/EmptyState';
import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import { getRecordDate } from '@/lib/date';
import { RECORD_TYPE_LABELS } from '@/lib/constants';
import ListAltIcon from '@mui/icons-material/ListAlt';

/**
 * Records page with date picker and type filter tabs.
 * Groups records by date and displays them in a list.
 * Filter tabs use giraffe yellow active state.
 */
const RecordsPage: React.FC = () => {
  const records = useRecordStore((s) => s.records);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const openQuickRecord = useUIStore((s) => s.openQuickRecord);

  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [tabValue, setTabValue] = useState<string>('all');

  const filteredRecords = useMemo(() => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    return records
      .filter((r) => r.babyId === activeBabyId)
      .filter((r) => getRecordDate(r) === dateKey)
      .filter((r) => tabValue === 'all' || r.type === tabValue)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [records, activeBabyId, selectedDate, tabValue]);

  const tabs: { value: string; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'feeding', label: RECORD_TYPE_LABELS['feeding'] },
    { value: 'sleep', label: RECORD_TYPE_LABELS['sleep'] },
    { value: 'diaper', label: RECORD_TYPE_LABELS['diaper'] },
    { value: 'growth', label: RECORD_TYPE_LABELS['growth'] },
    { value: 'jaundice', label: RECORD_TYPE_LABELS['jaundice'] },
  ];

  return (
    <Box sx={{ p: 2 }} className="page-transition">
      <Typography
        sx={{
          fontFamily: '"Nunito", "PingFang SC", sans-serif',
          fontWeight: 700,
          fontSize: '1.05rem',
          color: '#4A3728',
          mb: 1,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Box component="span" className="giraffe-section-dot" />
        记录列表
      </Typography>

      <Stack direction="row" spacing={1} sx={{ mb: 1 }} alignItems="center">
        <DatePicker
          label="选择日期"
          value={selectedDate}
          onChange={(val) => val && setSelectedDate(val)}
          maxDate={dayjs()}
          format="YYYY-MM-DD"
          sx={{ flex: 1 }}
        />
      </Stack>

      <Tabs
        value={tabValue}
        onChange={(_, val) => setTabValue(val)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          mb: 2,
          minHeight: 40,
          '& .MuiTab-root': {
            minHeight: '36px',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '9999px',
            color: '#8B7355',
            border: '1.5px solid #F0E6D8',
            margin: '0 4px',
            padding: '4px 12px',
            transition: 'all 150ms cubic-bezier(0.25, 1, 0.5, 1)',
            '&.Mui-selected': {
              backgroundColor: '#F4A940',
              color: '#FFFFFF',
              borderColor: '#F4A940',
            },
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          },
        }}
      >
        {tabs.map((t) => (
          <Tab key={t.value} value={t.value} label={t.label} />
        ))}
      </Tabs>

      {filteredRecords.length === 0 ? (
        <EmptyState
          icon={<ListAltIcon sx={{ fontSize: 48 }} />}
          title="当天暂无记录"
          subtitle={`日期: ${selectedDate.format('YYYY年M月D日')}`}
          actionLabel="快速记录"
          onAction={() => openQuickRecord()}
        />
      ) : (
        <Box>
          {filteredRecords.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default RecordsPage;
