import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';

import { formatDuration, getTimeAgo } from '@/lib/date';
import type { TodaySummary } from '@/types';

interface SummaryCardsProps {
  summary: TodaySummary;
}

/**
 * Three summary cards showing today's feeding, sleep, and diaper stats.
 * Cards use 20px radius, warm border, and hover lift effect.
 */
const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const cardStyle = {
    borderRadius: '20px',
    border: '1px solid #F0E6D8',
    boxShadow: '0 1px 3px rgba(93,58,26,0.06)',
    transition: 'all 150ms cubic-bezier(0.25, 1, 0.5, 1)',
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(93,58,26,0.08)',
    },
    '&:active': {
      transform: 'scale(0.97)',
    },
  };

  return (
    <Grid container spacing={1.5}>
      {/* Feeding Card */}
      <Grid item xs={12}>
        <Box sx={{ ...cardStyle, backgroundColor: '#FFFFFF', p: 2, display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '14px',
              backgroundColor: '#FFF0EE',
              color: '#FF8A80',
              mr: 2,
              flexShrink: 0,
            }}
          >
            <RestaurantIcon />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="caption" sx={{ color: '#8B7355', fontWeight: 600 }}>
              今日喂养
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
              <Typography
                sx={{
                  fontFamily: '"Nunito", "PingFang SC", sans-serif',
                  fontWeight: 800,
                  fontSize: '1.375rem',
                  color: '#4A3728',
                  lineHeight: 1.1,
                }}
              >
                {summary.feedingCount}
              </Typography>
              <Typography variant="body2" sx={{ color: '#8B7355' }}>
                次 · {summary.feedingTotalAmount}ml
              </Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#B8A088' }}>
              {summary.lastFeedingTime ? `上次: ${getTimeAgo(summary.lastFeedingTime)}` : '暂无记录'}
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Sleep & Diaper Cards */}
      <Grid item xs={6}>
        <Box sx={{ ...cardStyle, backgroundColor: '#FFFFFF', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '10px',
                backgroundColor: '#F5F0FF',
                color: '#B39DDB',
                mr: 0.5,
              }}
            >
              <BedtimeIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="caption" sx={{ color: '#8B7355', fontWeight: 600 }}>
              今日睡眠
            </Typography>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Nunito", "PingFang SC", sans-serif',
              fontWeight: 800,
              fontSize: '1.375rem',
              color: '#4A3728',
              lineHeight: 1.1,
            }}
          >
            {formatDuration(summary.sleepTotalDuration)}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: summary.isSleeping ? '#66BB6A' : '#B8A088',
              fontWeight: 600,
            }}
          >
            {summary.isSleeping ? '● 睡眠中' : '○ 清醒'}
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box sx={{ ...cardStyle, backgroundColor: '#FFFFFF', p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '10px',
                backgroundColor: '#EBF5FF',
                color: '#64B5F6',
                mr: 0.5,
              }}
            >
              <BabyChangingStationIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="caption" sx={{ color: '#8B7355', fontWeight: 600 }}>
              今日尿布
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
            <Typography
              sx={{
                fontFamily: '"Nunito", "PingFang SC", sans-serif',
                fontWeight: 800,
                fontSize: '1.375rem',
                color: '#4A3728',
                lineHeight: 1.1,
              }}
            >
              {summary.diaperCount}
            </Typography>
            <Typography variant="body2" sx={{ color: '#8B7355', fontWeight: 400 }}>
              次
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: '#B8A088', fontWeight: 600 }}>
            排便 {summary.poopCount} 次
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};

export default SummaryCards;
