// ===== Core Type Definitions =====

export type RecordType = 'feeding' | 'sleep' | 'diaper' | 'growth' | 'jaundice';
export type FeedingMethod = 'breast' | 'formula' | 'mixed';
export type DiaperType = 'wet' | 'poop';
export type PoopTexture = 'watery' | 'soft' | 'hard';
export type JaundiceMeasureSite = 'forehead' | 'chest' | 'abdomen';
export type ThemeMode = 'light' | 'dark';

export interface Baby {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthDate: string; // ISO 8601
  birthWeight: number; // kg
  birthHeight: number; // cm
  avatar?: string; // base64 (P2)
  createdAt: string; // ISO 8601
}

export type NewBabyInput = Omit<Baby, 'id' | 'createdAt'>;

export interface BaseRecord {
  id: string;
  babyId: string;
  note?: string;
  images?: string[]; // base64-encoded images, max 9
  createdAt: string;
  updatedAt: string;
}

export interface FeedingRecord extends BaseRecord {
  type: 'feeding';
  time: string;
  feedingMethod: FeedingMethod;
  amount?: number; // ml
  duration?: number; // minutes
}

export interface SleepRecord extends BaseRecord {
  type: 'sleep';
  startTime: string;
  endTime: string;
  duration: number; // minutes, auto-calculated
}

export interface DiaperRecord extends BaseRecord {
  type: 'diaper';
  time: string;
  diaperType: DiaperType;
  poopTexture?: PoopTexture;
  poopColor?: string;
}

export interface GrowthRecord extends BaseRecord {
  type: 'growth';
  date: string;
  weight?: number; // kg
  height?: number; // cm
}

export interface JaundiceRecord extends BaseRecord {
  type: 'jaundice';
  time: string; // ISO 8601 — measurement date/time
  value: number; // jaundice index (mg/dL)
  measureSite: JaundiceMeasureSite;
}

export type RecordItem = FeedingRecord | SleepRecord | DiaperRecord | GrowthRecord | JaundiceRecord;

/** Distributive Omit — properly omits keys from each union member. */
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

/** Distributive Partial — allows partial updates on each union member. */
type DistributivePartial<T> = T extends any ? Partial<T> : never;

export type NewRecordInput = DistributiveOmit<RecordItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateRecordInput = DistributivePartial<NewRecordInput>;

export interface AppSettings {
  theme: ThemeMode;
  activeBabyId: string | null;
}

export interface AgeInfo {
  months: number;
  days: number;
  text: string;
}

export interface TodaySummary {
  feedingCount: number;
  feedingTotalAmount: number;
  lastFeedingTime: string | null;
  sleepTotalDuration: number;
  isSleeping: boolean;
  diaperCount: number;
  poopCount: number;
}

// ===== Image compression configuration =====
export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeKB?: number;
}

// ===== Speech recognition state =====
export interface SpeechRecognitionState {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
}

// ===== Album grouping =====
export interface AlbumGroup {
  date: string;
  label: string;
  items: Array<{
    record: RecordItem;
    imageIndex: number;
    imageSrc: string;
  }>;
}

// ===== localStorage capacity info =====
export interface StorageInfo {
  used: number;
  total: number;
  percent: number;
  imageCount: number;
}
