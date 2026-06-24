import dayjs from 'dayjs';
import type { AgeInfo, RecordItem } from '@/types';

/**
 * Format a date string or Date object.
 * @param date - ISO string or Date object
 * @param fmt - dayjs format string, defaults to "M月D日"
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, fmt: string = 'M月D日'): string {
  return dayjs(date).format(fmt);
}

/**
 * Format a duration in minutes to a human-readable Chinese string.
 * @param minutes - Duration in minutes
 * @returns e.g. "2小时30分钟"
 */
export function formatDuration(minutes: number): string {
  if (minutes <= 0) return '0分钟';
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (hours > 0 && mins > 0) {
    return `${hours}小时${mins}分钟`;
  }
  if (hours > 0) {
    return `${hours}小时`;
  }
  return `${mins}分钟`;
}

/**
 * Calculate age from birth date.
 * @param birthDate - ISO string
 * @returns AgeInfo with months, days, and display text
 */
export function calculateAge(birthDate: string): AgeInfo {
  const birth = dayjs(birthDate);
  const now = dayjs();
  const totalDays = now.diff(birth, 'day');
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  return {
    months,
    days,
    text: `${months}个月${days}天`,
  };
}

/**
 * Get today's date key in YYYY-MM-DD format.
 * @returns Date string like "2026-06-24"
 */
export function getTodayKey(): string {
  return dayjs().format('YYYY-MM-DD');
}

/**
 * Check if two dates are the same calendar day.
 * @param d1 - First date (string or Date)
 * @param d2 - Second date (string or Date)
 * @returns true if same day
 */
export function isSameDay(d1: string | Date, d2: string | Date): boolean {
  return dayjs(d1).isSame(dayjs(d2), 'day');
}

/**
 * Get a human-readable "time ago" string.
 * @param date - ISO string
 * @returns e.g. "3小时前" or "5分钟前"
 */
export function getTimeAgo(date: string): string {
  const target = dayjs(date);
  const now = dayjs();
  const diffMin = now.diff(target, 'minute');
  const diffHour = now.diff(target, 'hour');
  const diffDay = now.diff(target, 'day');

  if (diffMin < 1) return '刚刚';
  if (diffMin < 60) return `${diffMin}分钟前`;
  if (diffHour < 24) return `${diffHour}小时前`;
  if (diffDay < 30) return `${diffDay}天前`;
  return target.format('M月D日');
}

/**
 * Calculate the difference in minutes between two datetime strings.
 * @param start - Start ISO string
 * @param end - End ISO string
 * @returns Minutes difference
 */
export function diffMinutes(start: string, end: string): number {
  return Math.round(dayjs(end).diff(dayjs(start), 'minute', true));
}

/**
 * Get the primary date of a record based on its type.
 * @param record - The record item
 * @returns Date string in YYYY-MM-DD format
 */
export function getRecordDate(record: RecordItem): string {
  switch (record.type) {
    case 'feeding':
      return dayjs(record.time).format('YYYY-MM-DD');
    case 'sleep':
      return dayjs(record.startTime).format('YYYY-MM-DD');
    case 'diaper':
      return dayjs(record.time).format('YYYY-MM-DD');
    case 'growth':
      return record.date;
    case 'jaundice':
      return dayjs(record.time).format('YYYY-MM-DD');
    default:
      return dayjs().format('YYYY-MM-DD');
  }
}
