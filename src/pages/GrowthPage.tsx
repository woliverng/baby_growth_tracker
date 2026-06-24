import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

import GrowthChart from '@/components/growth/GrowthChart';
import StatsChart from '@/components/growth/StatsChart';
import EmptyState from '@/components/common/EmptyState';
import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import type { GrowthRecord } from '@/types';
import ShowChartIcon from '@mui/icons-material/ShowChart';

/**
 * Growth page with tabs: weight, height, and statistics.
 * Tab selection uses giraffe yellow color.
 */
const GrowthPage: React.FC = () => {
  const records = useRecordStore((s) => s.records);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const openQuickRecord = useUIStore((s) => s.openQuickRecord);

  const [tabValue, setTabValue] = useState<number>(0);

  const growthRecords = useMemo(() => {
    return records
      .filter((r) => r.type === 'growth' && r.babyId === activeBabyId)
      .sort((a, b) => new Date((b as GrowthRecord).date).getTime() - new Date((a as GrowthRecord).date).getTime()) as GrowthRecord[];
  }, [records, activeBabyId]);

  const renderTab = (): React.ReactNode => {
    switch (tabValue) {
      case 0: // Weight
        return (
          <Box>
            <GrowthChart records={growthRecords} metric="weight" />
            {growthRecords.filter((r) => r.weight != null).length > 0 && (
              <Box sx={{ mt: 2 }}>
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
                  体重记录
                </Typography>
                <Box
                  sx={{
                    borderRadius: '20px',
                    border: '1px solid #F0E6D8',
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden',
                  }}
                >
                  <List disablePadding>
                    {growthRecords
                      .filter((r) => r.weight != null)
                      .map((r, idx, arr) => (
                        <React.Fragment key={r.id}>
                          <ListItem sx={{ py: 1, px: 2 }}>
                            <ListItemText
                              primary={`${r.weight} kg`}
                              secondary={r.date}
                              primaryTypographyProps={{
                                fontWeight: 600,
                                sx: { color: '#4A3728' },
                              }}
                              secondaryTypographyProps={{
                                sx: { color: '#B8A088' },
                              }}
                            />
                          </ListItem>
                          {idx < arr.length - 1 && <Divider sx={{ borderColor: '#F0E6D8' }} />}
                        </React.Fragment>
                      ))}
                  </List>
                </Box>
              </Box>
            )}
          </Box>
        );

      case 1: // Height
        return (
          <Box>
            <GrowthChart records={growthRecords} metric="height" />
            {growthRecords.filter((r) => r.height != null).length > 0 && (
              <Box sx={{ mt: 2 }}>
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
                  身长记录
                </Typography>
                <Box
                  sx={{
                    borderRadius: '20px',
                    border: '1px solid #F0E6D8',
                    backgroundColor: '#FFFFFF',
                    overflow: 'hidden',
                  }}
                >
                  <List disablePadding>
                    {growthRecords
                      .filter((r) => r.height != null)
                      .map((r, idx, arr) => (
                        <React.Fragment key={r.id}>
                          <ListItem sx={{ py: 1, px: 2 }}>
                            <ListItemText
                              primary={`${r.height} cm`}
                              secondary={r.date}
                              primaryTypographyProps={{
                                fontWeight: 600,
                                sx: { color: '#4A3728' },
                              }}
                              secondaryTypographyProps={{
                                sx: { color: '#B8A088' },
                              }}
                            />
                          </ListItem>
                          {idx < arr.length - 1 && <Divider sx={{ borderColor: '#F0E6D8' }} />}
                        </React.Fragment>
                      ))}
                  </List>
                </Box>
              </Box>
            )}
          </Box>
        );

      case 2: // Stats
        return <StatsChart />;

      default:
        return null;
    }
  };

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
        成长曲线
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(_, val) => setTabValue(val)}
        variant="fullWidth"
        sx={{
          mb: 2,
          minHeight: 40,
          '& .MuiTab-root': {
            minHeight: 40,
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
        <Tab label="体重" />
        <Tab label="身长" />
        <Tab label="统计" />
      </Tabs>

      {tabValue < 2 && growthRecords.length === 0 ? (
        <EmptyState
          icon={<ShowChartIcon sx={{ fontSize: 48 }} />}
          title="暂无成长数据"
          subtitle="记录宝宝的体重和身长，即可查看成长趋势"
          actionLabel="记录成长"
          onAction={() => openQuickRecord('growth')}
        />
      ) : (
        renderTab()
      )}
    </Box>
  );
};

export default GrowthPage;
