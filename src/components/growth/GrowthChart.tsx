import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EmptyState from '@/components/common/EmptyState';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import type { GrowthRecord } from '@/types';

interface GrowthChartProps {
  records: GrowthRecord[];
  metric: 'weight' | 'height';
}

/**
 * Line chart showing weight or height trend over time.
 * Uses giraffe yellow (#F4A940) for the trend line and warm-toned grid.
 */
const GrowthChart: React.FC<GrowthChartProps> = ({ records, metric }) => {
  const chartData = useMemo(() => {
    return records
      .filter((r) => r[metric] != null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((r) => ({
        date: r.date,
        label: r.date.slice(5), // MM-DD
        value: r[metric],
      }));
  }, [records, metric]);

  const metricLabel = metric === 'weight' ? '体重 (kg)' : '身长 (cm)';

  if (chartData.length === 0) {
    return (
      <EmptyState
        icon={<ShowChartIcon sx={{ fontSize: 48 }} />}
        title={`暂无${metric === 'weight' ? '体重' : '身长'}数据`}
        subtitle="记录宝宝的生长数据后即可查看趋势图"
      />
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        border: '1px solid #F0E6D8',
        p: 2,
      }}
    >
      <Typography
        sx={{
          mb: 1,
          px: 1,
          color: '#8B7355',
          fontWeight: 600,
          fontSize: '0.85rem',
        }}
      >
        {metricLabel}趋势
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0E6D8" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#B8A088' }}
            stroke="#E0D0B8"
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#B8A088' }}
            stroke="#E0D0B8"
            domain={['auto', 'auto']}
          />
          <Tooltip
            formatter={(val: number) => [`${val} ${metric === 'weight' ? 'kg' : 'cm'}`, metricLabel]}
            labelFormatter={(label) => `日期: ${label}`}
            contentStyle={{
              borderRadius: '14px',
              fontSize: 13,
              border: '1px solid #F0E6D8',
              boxShadow: '0 4px 12px rgba(93,58,26,0.08)',
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#F4A940"
            strokeWidth={2.5}
            dot={{ fill: '#FFFFFF', stroke: '#D97706', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#F4A940', stroke: '#D97706', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default GrowthChart;
