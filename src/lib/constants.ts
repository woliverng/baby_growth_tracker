import type { FeedingMethod, DiaperType, PoopTexture, CompressOptions, JaundiceMeasureSite } from '@/types';

export const FEEDING_METHODS: ReadonlyArray<{ value: FeedingMethod; label: string }> = [
  { value: 'breast', label: '母乳' },
  { value: 'formula', label: '配方奶' },
  { value: 'mixed', label: '混合' },
];

export const DIAPER_TYPES: ReadonlyArray<{ value: DiaperType; label: string }> = [
  { value: 'wet', label: '湿尿布' },
  { value: 'poop', label: '排便' },
];

export const POOP_TEXTURES: ReadonlyArray<{ value: PoopTexture; label: string }> = [
  { value: 'watery', label: '水样' },
  { value: 'soft', label: '软' },
  { value: 'hard', label: '硬' },
];

export const JAUNDICE_MEASURE_SITES: ReadonlyArray<{
  value: JaundiceMeasureSite;
  label: string;
}> = [
  { value: 'forehead', label: '额头' },
  { value: 'chest', label: '胸前' },
  { value: 'abdomen', label: '腹部' },
];

export const POOP_COLORS = ['黄色', '棕色', '绿色', '黑色', '白色'] as const;
export const QUICK_AMOUNTS = [30, 60, 90, 120] as const;

/** Maximum number of images per record */
export const MAX_IMAGES_PER_RECORD = 9;

/** Maximum base64 size per image (KB) */
export const MAX_IMAGE_SIZE_KB = 200;

/** Default image compression options */
export const DEFAULT_COMPRESS_OPTIONS: CompressOptions = {
  maxWidth: 1280,
  maxHeight: 1280,
  quality: 0.7,
  maxSizeKB: 200,
};

/** Jaundice value above which a warning indicator is shown (mg/dL).
 * Normal range for full-term newborns is < 12 mg/dL. */
export const JAUNDICE_WARNING_THRESHOLD = 12;

/** localStorage capacity warning threshold (percentage) */
export const STORAGE_WARNING_THRESHOLD = 0.8;

/** Estimated localStorage total capacity (bytes) */
export const STORAGE_ESTIMATE_BYTES = 5 * 1024 * 1024;

/** Record type color mapping — giraffe design system colors */
export const RECORD_TYPE_COLORS: Record<string, string> = {
  feeding: '#FF8A80',
  sleep: '#B39DDB',
  diaper: '#64B5F6',
  growth: '#81C784',
  jaundice: '#FFAB91',
};

/** Record type labels in Chinese */
export const RECORD_TYPE_LABELS: Record<string, string> = {
  feeding: '喂养',
  sleep: '睡眠',
  diaper: '尿布',
  growth: '成长',
  jaundice: '黄疸',
};
