import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';

import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { getTodayKey, diffMinutes } from '@/lib/date';
import type { FeedingRecord, SleepRecord } from '@/types';

/** Type guard for FeedingRecord */
function isFeeding(r: { type: string }): r is FeedingRecord {
  return r.type === 'feeding';
}

/** Type guard for SleepRecord */
function isSleep(r: { type: string }): r is SleepRecord {
  return r.type === 'sleep';
}

interface SleepPieEntry {
  name: string;
  value: number;
  color: string;
}

/**
 * Statistics charts: 7-day feeding bar chart + today's sleep vs awake pie chart.
 * Uses giraffe yellow for bars and giraffe-aligned colors for pie segments.
 */
const StatsChart: React.FC = () => {
  const records = useRecordStore((s) => s.records);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);

  const babyRecords = useMemo(
    () => records.filter((r) => r.babyId === activeBabyId),
    [records, activeBabyId]
  );

  // 7-day feeding data
  const feedingData = useMemo(() => {
    const today = dayjs();
    const data: { date: string; label: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = today.subtract(i, 'day');
      const dayKey = day.format('YYYY-MM-DD');
      const dayFeedings = babyRecords.filter(isFeeding).filter(
        (r) => dayjs(r.time).format('YYYY-MM-DD') === dayKey
      );
      const totalAmount = dayFeedings.reduce((sum, r) => sum + (r.amount ?? 0), 0);
      data.push({
        date: dayKey,
        label: day.format('M/D'),
        amount: totalAmount,
      });
    }
    return data;
  }, [babyRecords]);

  // Today's sleep vs awake
  const sleepPieData = useMemo<SleepPieEntry[]>(() => {
    const todayKey = getTodayKey();
    const todaySleepRecords = babyRecords
      .filter(isSleep)
      .filter((r) => r.startTime.slice(0, 10) === todayKey);
    const sleepMinutes = todaySleepRecords.reduce((sum, r) => {
      if (r.startTime === r.endTime) {
        return sum + diffMinutes(r.startTime, new Date().toISOString());
      }
      return sum + r.duration;
    }, 0);
    const awakeMinutes = Math.max(0, 24 * 60 - sleepMinutes);
    return [
      { name: '睡眠', value: sleepMinutes, color: '#B39DDB' },
      { name: '清醒', value: awakeMinutes, color: '#F0E6D8' },
    ];
  }, [babyRecords]);

  const renderPieLabel = (entry: SleepPieEntry): string => {
    return `${entry.name}: ${Math.round(entry.value / 60)}h`;
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {/* 7-day feeding bar chart */}
        <Grid item xs={12}>
          <Typography
            sx={{
              fontWeight: 700,
              mb: 1,
              px: 1,
              color: '#4A3728',
              fontFamily: '"Nunito", "PingFang SC", sans-serif',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box component="span" className="giraffe-section-dot" />
            近 7 天喂养奶量
          </Typography>
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #F0E6D8',
              p: 2,
            }}
          >
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={feedingData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0E6D8" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#B8A088' }} stroke="#E0D0B8" />
                <YAxis tick={{ fontSize: 11, fill: '#B8A088' }} stroke="#E0D0B8" unit="ml" />
                <Tooltip
                  formatter={(val: number) => [`${val} ml`, '奶量']}
                  contentStyle={{
                    borderRadius: '14px',
                    fontSize: 13,
                    border: '1px solid #F0E6D8',
                    boxShadow: '0 4px 12px rgba(93,58,26,0.08)',
                  }}
                />
                <Bar
                  dataKey="amount"
                  fill="#F4A940"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Grid>

        {/* Today's sleep pie chart */}
        <Grid item xs={12}>
          <Typography
            sx={{
              fontWeight: 700,
              mb: 1,
              px: 1,
              color: '#4A3728',
              fontFamily: '"Nunito", "PingFang SC", sans-serif',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box component="span" className="giraffe-section-dot" />
            今日睡眠分布
          </Typography>
          <Box
            sx={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid #F0E6D8',
              p: 2,
            }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sleepPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={renderPieLabel}
                  labelLine={false}
                >
                  {sleepPieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: number) => [`${Math.round((val / 60) * 10) / 10} 小时`, '']}
                  contentStyle={{
                    borderRadius: '14px',
                    fontSize: 13,
                    border: '1px solid #F0E6D8',
                    boxShadow: '0 4px 12px rgba(93,58,26,0.08)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StatsChart;
