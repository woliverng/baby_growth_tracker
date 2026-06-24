import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import dayjs from 'dayjs';

import QuickRecordButtons from '@/components/home/QuickRecordButtons';
import SummaryCards from '@/components/home/SummaryCards';
import RecentRecords from '@/components/home/RecentRecords';
import EmptyState from '@/components/common/EmptyState';
import GiraffeSpots from '@/components/common/GiraffeSpots';
import { useBabyStore } from '@/store/useBabyStore';
import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import { getTodayKey, diffMinutes, getTimeAgo } from '@/lib/date';
import type { TodaySummary, FeedingRecord, SleepRecord, DiaperRecord } from '@/types';

/**
 * Home page with hero card, quick record buttons, summary cards,
 * recent records, and giraffe spots decoration.
 */
const HomePage: React.FC = () => {
  const babies = useBabyStore((s) => s.babies);
  const activeBabyId = useSettingsStore((s) => s.activeBabyId);
  const records = useRecordStore((s) => s.records);
  const openQuickRecord = useUIStore((s) => s.openQuickRecord);

  const activeBaby = babies.find((b) => b.id === activeBabyId) ?? babies[0];

  const summary: TodaySummary = useMemo(() => {
    if (!activeBaby) {
      return {
        feedingCount: 0,
        feedingTotalAmount: 0,
        lastFeedingTime: null,
        sleepTotalDuration: 0,
        isSleeping: false,
        diaperCount: 0,
        poopCount: 0,
      };
    }

    const todayKey = getTodayKey();
    const babyRecords = records.filter((r) => r.babyId === activeBaby.id);

    const todayFeedings = babyRecords.filter(
      (r): r is FeedingRecord =>
        r.type === 'feeding' && dayjs(r.time).format('YYYY-MM-DD') === todayKey
    );
    const lastFeeding = todayFeedings
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())[0];

    const todaySleeps = babyRecords.filter(
      (r): r is SleepRecord =>
        r.type === 'sleep' && dayjs(r.startTime).format('YYYY-MM-DD') === todayKey
    );
    const sleepTotal = todaySleeps.reduce((sum, r) => {
      if (r.startTime === r.endTime) {
        return sum + diffMinutes(r.startTime, new Date().toISOString());
      }
      return sum + r.duration;
    }, 0);
    const isSleeping = todaySleeps.some((r) => r.startTime === r.endTime);

    const todayDiapers = babyRecords.filter(
      (r): r is DiaperRecord =>
        r.type === 'diaper' && dayjs(r.time).format('YYYY-MM-DD') === todayKey
    );
    const poopCount = todayDiapers.filter((r) => r.diaperType === 'poop').length;

    return {
      feedingCount: todayFeedings.length,
      feedingTotalAmount: todayFeedings.reduce((sum, r) => sum + (r.amount ?? 0), 0),
      lastFeedingTime: lastFeeding?.time ?? null,
      sleepTotalDuration: sleepTotal,
      isSleeping,
      diaperCount: todayDiapers.length,
      poopCount,
    };
  }, [records, activeBaby]);

  if (!activeBaby) {
    return (
      <EmptyState
        icon={null}
        title="还没有宝宝档案"
        subtitle="请在设置页面创建宝宝档案"
        actionLabel="去设置"
        onAction={() => (window.location.hash = '#/settings')}
      />
    );
  }

  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 6 ? '夜深了' : hour < 11 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好';
  const greetingEmoji = hour < 6 ? '🌙' : hour < 11 ? '🌞' : hour < 14 ? '☀️' : hour < 18 ? '🌤️' : '🌆';

  const lastFeedingAgo = summary.lastFeedingTime ? getTimeAgo(summary.lastFeedingTime) : null;

  return (
    <Box sx={{ p: 2 }} className="page-transition">
      {/* Hero Card */}
      <Box
        sx={{
          position: 'relative',
          background: 'linear-gradient(155deg, #FFFBF0 0%, #FFF5E1 40%, #FFECB3 100%)',
          borderRadius: '28px',
          padding: '24px 20px',
          marginBottom: '16px',
          overflow: 'hidden',
          border: '1.5px solid rgba(244,169,64,0.15)',
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '-30px',
            right: '-20px',
            width: '120px',
            height: '120px',
            background: 'radial-gradient(circle, rgba(244,169,64,0.2) 0%, transparent 70%)',
            borderRadius: '50%',
          },
        }}
      >
        {/* Giraffe illustration (right side) */}
        <Box
          component="svg"
          viewBox="0 0 88 88"
          fill="none"
          aria-hidden="true"
          sx={{
            position: 'absolute',
            right: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '5.5rem',
            height: '5.5rem',
            opacity: 0.9,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <ellipse cx="38" cy="35" rx="18" ry="20" fill="#F4A940" opacity="0.9" />
          <rect x="36" y="52" width="4" height="10" rx="2" fill="#D97706" />
          <ellipse cx="38" cy="52" rx="10" ry="3" fill="#FDE68A" opacity="0.5" />
          <ellipse cx="25" cy="28" rx="5" ry="8" fill="#8B5E3C" opacity="0.6" />
          <ellipse cx="18" cy="25" rx="5" ry="8" fill="#8B5E3C" opacity="0.4" />
          <ellipse cx="58" cy="22" rx="4" ry="7" fill="#8B5E3C" opacity="0.5" />
          <circle cx="32" cy="30" r="2" fill="#FFFAF0" />
          <circle cx="44" cy="30" r="2" fill="#FFFAF0" />
          <circle cx="31" cy="29" r="0.8" fill="#4A3728" />
          <circle cx="43" cy="29" r="0.8" fill="#4A3728" />
          <path d="M33 38 Q38 41 43 38" stroke="#4A3728" strokeWidth="1" fill="none" strokeLinecap="round" />
          <path d="M38 15 L37 4 L40 4 L39 15" fill="#F4A940" />
          <ellipse cx="36" cy="4" rx="3" ry="5" fill="#8B5E3C" />
          <ellipse cx="41" cy="4" rx="3" ry="5" fill="#8B5E3C" />
          <ellipse cx="34" cy="7" rx="2" ry="3" fill="#F4A940" opacity="0.5" />
          <ellipse cx="43" cy="5" rx="2" ry="3" fill="#F4A940" opacity="0.5" />
        </Box>

        {/* Hero text */}
        <Typography
          component="h1"
          sx={{
            fontFamily: '"Nunito", "PingFang SC", sans-serif',
            fontWeight: 800,
            fontSize: '1.5rem',
            color: '#4A3728',
            lineHeight: 1.3,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {activeBaby.name}{greeting} {greetingEmoji}
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            fontSize: '0.85rem',
            color: '#8B7355',
            marginTop: '4px',
            position: 'relative',
            zIndex: 2,
          }}
        >
          今天是元气满满的一天呢！
        </Typography>

        {/* Time-ago badge */}
        {lastFeedingAgo && (
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '12px',
              padding: '4px 12px',
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(8px)',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#D97706',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Box
              component="span"
              className="breathing-dot"
              sx={{
                width: '8px',
                height: '8px',
                borderRadius: '9999px',
                background: '#FF8A80',
              }}
            />
            距上次喂奶：{lastFeedingAgo}
          </Box>
        )}
      </Box>

      {/* Quick Record Buttons */}
      <QuickRecordButtons />

      {/* Summary Section */}
      <Box sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
          <Typography
            sx={{
              fontFamily: '"Nunito", "PingFang SC", sans-serif',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: '#4A3728',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Box
              component="span"
              className="giraffe-section-dot"
            />
            今日概览
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: '#B8A088' }}>
            {dayjs().format('M月D日')}
          </Typography>
        </Box>
        <SummaryCards summary={summary} />
      </Box>

      {/* Recent Records */}
      <Box sx={{ mt: 2 }}>
        <RecentRecords />
      </Box>

      {/* Giraffe Spots Decoration */}
      <GiraffeSpots count={9} opacity={0.15} />

      {/* Inline FAB — floats above content, right-aligned within the 430px container */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 'calc(76px + env(safe-area-inset-bottom, 0px))',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '430px',
          maxWidth: '100%',
          pointerEvents: 'none',
          zIndex: 1000,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, pointerEvents: 'auto' }}>
          <Fab
            aria-label="快速记录"
            onClick={() => openQuickRecord()}
            size="medium"
            sx={{
              width: 50,
              height: 50,
              minHeight: 'unset',
              background: 'linear-gradient(135deg, #F4A940, #D97706)',
              border: '3px solid #FFFFFF',
              boxShadow: '0 6px 20px rgba(244,169,64,0.35), 0 2px 6px rgba(244,169,64,0.2)',
              color: '#FFFFFF',
              transition: 'all 150ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              '&:hover': {
                transform: 'scale(1.08)',
                boxShadow: '0 8px 28px rgba(244,169,64,0.45), 0 3px 8px rgba(244,169,64,0.25)',
                background: 'linear-gradient(135deg, #F4A940, #D97706)',
              },
              '&:active': {
                transform: 'scale(0.92)',
              },
            }}
          >
            <AddIcon />
          </Fab>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
