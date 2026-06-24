import { useBabyStore } from '@/store/useBabyStore';
import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { RECORD_TYPE_LABELS } from '@/lib/constants';
import { getRecordDate, formatDate } from '@/lib/date';
import { getStorageInfo as getStorageInfoImpl, checkStorageCapacity } from '@/lib/image';
import type { Baby, RecordItem, StorageInfo } from '@/types';

/**
 * Get localStorage storage usage info (re-exported from image.ts).
 * @returns StorageInfo with used bytes, total estimate, percentage, and image count
 */
export function getStorageInfo(): StorageInfo {
  return getStorageInfoImpl();
}

/**
 * Get a formatted storage summary string for display.
 * @returns Human-readable storage info
 */
export function getStorageSummary(): string {
  const info = getStorageInfo();
  const usedMB = (info.used / (1024 * 1024)).toFixed(1);
  const totalMB = (info.total / (1024 * 1024)).toFixed(1);
  const percent = Math.round(info.percent * 100);
  return `${usedMB}MB / ${totalMB}MB (${percent}%) · ${info.imageCount}张图片`;
}

export { checkStorageCapacity };

/**
 * Export all app data as a JSON string.
 * @returns JSON string containing babies, records, and settings
 */
export function exportJSON(): string {
  const babies = useBabyStore.getState().babies;
  const records = useRecordStore.getState().records;
  const settings = useSettingsStore.getState();
  return JSON.stringify({ babies, records, settings }, null, 2);
}

/**
 * Export all records as CSV format.
 * @returns CSV string
 */
export function exportCSV(): string {
  const records = useRecordStore.getState().records;
  const babies = useBabyStore.getState().babies;
  const babyMap = new Map<string, Baby>(babies.map((b) => [b.id, b]));

  const headers = ['宝宝', '记录类型', '日期', '时间', '详情', '备注'];
  const rows: string[] = [headers.join(',')];

  for (const r of records) {
    const babyName = babyMap.get(r.babyId)?.name ?? '未知';
    const typeLabel = RECORD_TYPE_LABELS[r.type] ?? r.type;
    const date = getRecordDate(r);
    let time = '';
    let detail = '';

    switch (r.type) {
      case 'feeding':
        time = formatDate(r.time, 'HH:mm');
        detail = `${r.feedingMethod === 'breast' ? '母乳' : r.feedingMethod === 'formula' ? '配方奶' : '混合'}${r.amount ? ` ${r.amount}ml` : ''}${r.duration ? ` ${r.duration}分钟` : ''}`;
        break;
      case 'sleep':
        time = `${formatDate(r.startTime, 'HH:mm')}-${formatDate(r.endTime, 'HH:mm')}`;
        detail = `${r.duration}分钟`;
        break;
      case 'diaper':
        time = formatDate(r.time, 'HH:mm');
        detail = r.diaperType === 'wet' ? '湿尿布' : `排便 ${r.poopTexture ?? ''} ${r.poopColor ?? ''}`;
        break;
      case 'growth':
        time = '';
        detail = `${r.weight ? `体重${r.weight}kg ` : ''}${r.height ? `身长${r.height}cm` : ''}`;
        break;
      case 'jaundice': {
        const siteLabel = r.measureSite === 'forehead' ? '额头'
          : r.measureSite === 'chest' ? '胸前' : '腹部';
        time = formatDate(r.time, 'HH:mm');
        detail = `黄疸指数 ${r.value} mg/dL ${siteLabel}`;
        break;
      }
    }

    const note = r.note ?? '';
    rows.push([babyName, typeLabel, date, time, detail, note].map(escapeCSV).join(','));
  }

  return '\uFEFF' + rows.join('\n');
}

/**
 * Escape a value for CSV format.
 */
function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Import data from a JSON string, replacing current data.
 * @param jsonStr - JSON string with babies, records, settings
 * @returns true if import succeeded
 */
export function importJSON(jsonStr: string): boolean {
  try {
    const data = JSON.parse(jsonStr);
    if (!data.babies || !data.records) {
      return false;
    }
    const babyStore = useBabyStore.getState();
    const recordStore = useRecordStore.getState();

    // Replace all babies
    (babyStore as unknown as { _setBabies: (b: Baby[]) => void })._setBabies(data.babies);
    (recordStore as unknown as { _setRecords: (r: RecordItem[]) => void })._setRecords(data.records);

    if (data.settings) {
      const settingsStore = useSettingsStore.getState();
      if (data.settings.theme) settingsStore.setTheme(data.settings.theme);
      if (data.settings.activeBabyId) settingsStore.setActiveBabyId(data.settings.activeBabyId);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Download a file with the given content.
 * @param content - File content
 * @param filename - Name of the file
 * @param mime - MIME type
 */
export function downloadFile(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
