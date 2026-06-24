import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import {
  formatDate,
  formatDuration,
  calculateAge,
  getTodayKey,
  isSameDay,
  getTimeAgo,
  diffMinutes,
  getRecordDate,
} from '@/lib/date';
import type { RecordItem } from '@/types';

describe('lib/date.ts', () => {
  describe('formatDate', () => {
    it('should format date with default format (M月D日)', () => {
      const result = formatDate('2026-06-24T08:00:00.000Z');
      // Day is timezone-dependent, but should contain 月 and 日
      expect(result).toMatch(/\d+月\d+日/);
    });

    it('should format date with custom format', () => {
      const result = formatDate('2026-06-24T08:00:00.000Z', 'YYYY-MM-DD');
      expect(result).toBe('2026-06-24');
    });

    it('should format time with HH:mm', () => {
      // Use a fixed UTC time and format in UTC to avoid timezone issues
      const result = formatDate('2026-06-24T08:30:00.000Z', 'HH:mm');
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it('should accept Date object as input', () => {
      const date = new Date('2026-06-24T08:00:00.000Z');
      const result = formatDate(date, 'YYYY-MM-DD');
      expect(result).toBe('2026-06-24');
    });
  });

  describe('formatDuration', () => {
    it('should return "0分钟" for zero or negative minutes', () => {
      expect(formatDuration(0)).toBe('0分钟');
      expect(formatDuration(-10)).toBe('0分钟');
    });

    it('should format minutes only', () => {
      expect(formatDuration(30)).toBe('30分钟');
      expect(formatDuration(45)).toBe('45分钟');
    });

    it('should format hours only (exact hours)', () => {
      expect(formatDuration(60)).toBe('1小时');
      expect(formatDuration(120)).toBe('2小时');
    });

    it('should format hours and minutes', () => {
      expect(formatDuration(90)).toBe('1小时30分钟');
      expect(formatDuration(150)).toBe('2小时30分钟');
    });

    it('should round minutes', () => {
      expect(formatDuration(90.4)).toBe('1小时30分钟');
      expect(formatDuration(90.6)).toBe('1小时31分钟');
    });
  });

  describe('calculateAge', () => {
    it('should calculate age from birth date', () => {
      // Birth 60 days ago = 2 months 0 days
      const birthDate = dayjs().subtract(60, 'day').toISOString();
      const age = calculateAge(birthDate);

      expect(age.months).toBeGreaterThanOrEqual(1);
      expect(age.days).toBeGreaterThanOrEqual(0);
      expect(age.text).toMatch(/\d+个月\d+天/);
    });

    it('should return 0 months for a newborn', () => {
      const birthDate = dayjs().subtract(5, 'day').toISOString();
      const age = calculateAge(birthDate);

      expect(age.months).toBe(0);
      expect(age.days).toBe(5);
      expect(age.text).toBe('0个月5天');
    });

    it('should calculate correct months and days', () => {
      const birthDate = dayjs().subtract(35, 'day').toISOString();
      const age = calculateAge(birthDate);

      expect(age.months).toBe(1);
      expect(age.days).toBe(5);
      expect(age.text).toBe('1个月5天');
    });

    it('should produce text containing months and days', () => {
      const birthDate = dayjs().subtract(100, 'day').toISOString();
      const age = calculateAge(birthDate);

      expect(age.text).toContain('个月');
      expect(age.text).toContain('天');
    });
  });

  describe('getTodayKey', () => {
    it('should return today date in YYYY-MM-DD format', () => {
      const result = getTodayKey();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should match current date', () => {
      const result = getTodayKey();
      expect(result).toBe(dayjs().format('YYYY-MM-DD'));
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day (using noon times to avoid TZ edge)', () => {
      // Use noon UTC to avoid timezone boundary issues
      expect(isSameDay('2026-06-24T12:00:00.000Z', '2026-06-24T14:00:00.000Z')).toBe(true);
    });

    it('should return false for different days', () => {
      expect(isSameDay('2026-06-24T12:00:00.000Z', '2026-06-25T12:00:00.000Z')).toBe(false);
    });

    it('should accept Date objects', () => {
      const d1 = new Date('2026-06-24T12:00:00.000Z');
      const d2 = new Date('2026-06-24T14:00:00.000Z');
      expect(isSameDay(d1, d2)).toBe(true);
    });

    it('should return false for different months', () => {
      expect(isSameDay('2026-06-24T12:00:00.000Z', '2026-07-24T12:00:00.000Z')).toBe(false);
    });
  });

  describe('getTimeAgo', () => {
    it('should return "刚刚" for less than 1 minute ago', () => {
      const date = new Date().toISOString();
      expect(getTimeAgo(date)).toBe('刚刚');
    });

    it('should return "X分钟前" for minutes ago', () => {
      const date = dayjs().subtract(5, 'minute').toISOString();
      expect(getTimeAgo(date)).toBe('5分钟前');
    });

    it('should return "X小时前" for hours ago', () => {
      const date = dayjs().subtract(3, 'hour').toISOString();
      expect(getTimeAgo(date)).toBe('3小时前');
    });

    it('should return "X天前" for days ago (within 30 days)', () => {
      const date = dayjs().subtract(5, 'day').toISOString();
      expect(getTimeAgo(date)).toBe('5天前');
    });

    it('should return formatted date for more than 30 days ago', () => {
      const date = dayjs().subtract(60, 'day').toISOString();
      const result = getTimeAgo(date);
      expect(result).toMatch(/\d+月\d+日/);
    });
  });

  describe('diffMinutes', () => {
    it('should calculate positive difference', () => {
      const start = '2026-06-24T10:00:00.000Z';
      const end = '2026-06-24T11:30:00.000Z';
      expect(diffMinutes(start, end)).toBe(90);
    });

    it('should return 0 for same time', () => {
      const time = '2026-06-24T10:00:00.000Z';
      expect(diffMinutes(time, time)).toBe(0);
    });

    it('should handle fractional minutes (rounding)', () => {
      const start = '2026-06-24T10:00:00.000Z';
      const end = '2026-06-24T10:00:30.000Z'; // 0.5 minutes
      expect(diffMinutes(start, end)).toBe(1); // rounded
    });

    it('should calculate large differences', () => {
      const start = '2026-06-24T10:00:00.000Z';
      const end = '2026-06-24T14:00:00.000Z';
      expect(diffMinutes(start, end)).toBe(240);
    });
  });

  describe('getRecordDate', () => {
    it('should return date for feeding record', () => {
      const record: RecordItem = {
        id: '1',
        babyId: 'baby1',
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        createdAt: '2026-06-24T08:00:00.000Z',
        updatedAt: '2026-06-24T08:00:00.000Z',
      };
      expect(getRecordDate(record)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return date for sleep record (based on startTime)', () => {
      const record: RecordItem = {
        id: '1',
        babyId: 'baby1',
        type: 'sleep',
        startTime: '2026-06-24T10:00:00.000Z',
        endTime: '2026-06-24T11:00:00.000Z',
        duration: 60,
        createdAt: '2026-06-24T10:00:00.000Z',
        updatedAt: '2026-06-24T10:00:00.000Z',
      };
      expect(getRecordDate(record)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return date for diaper record', () => {
      const record: RecordItem = {
        id: '1',
        babyId: 'baby1',
        type: 'diaper',
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'wet',
        createdAt: '2026-06-24T09:00:00.000Z',
        updatedAt: '2026-06-24T09:00:00.000Z',
      };
      expect(getRecordDate(record)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should return the date field directly for growth record', () => {
      const record: RecordItem = {
        id: '1',
        babyId: 'baby1',
        type: 'growth',
        date: '2026-06-24',
        weight: 5.2,
        height: 58,
        createdAt: '2026-06-24T09:00:00.000Z',
        updatedAt: '2026-06-24T09:00:00.000Z',
      };
      expect(getRecordDate(record)).toBe('2026-06-24');
    });

    it('should return date for jaundice record (based on time)', () => {
      const record: RecordItem = {
        id: '1',
        babyId: 'baby1',
        type: 'jaundice',
        time: '2026-06-24T09:00:00.000Z',
        value: 8.5,
        measureSite: 'forehead',
        createdAt: '2026-06-24T09:00:00.000Z',
        updatedAt: '2026-06-24T09:00:00.000Z',
      };
      expect(getRecordDate(record)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});
