import { describe, it, expect, beforeEach } from 'vitest';
import { exportJSON, getStorageInfo } from '@/lib/storage';
import { useBabyStore } from '@/store/useBabyStore';
import { useRecordStore } from '@/store/useRecordStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('Storage management with images', () => {
  beforeEach(() => {
    resetAllStores();
  });

  // ===== exportJSON with images =====

  it('should export records with images field', () => {
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId: baby.id,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: [
        'data:image/jpeg;base64,img1',
        'data:image/jpeg;base64,img2',
      ],
    });

    const json = exportJSON();
    const parsed = JSON.parse(json);
    expect(parsed.records).toHaveLength(1);
    expect(parsed.records[0].images).toEqual([
      'data:image/jpeg;base64,img1',
      'data:image/jpeg;base64,img2',
    ]);
  });

  it('should export records without images field when none exist', () => {
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId: baby.id,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
    });

    const json = exportJSON();
    const parsed = JSON.parse(json);
    expect(parsed.records[0].images).toBeUndefined();
  });

  it('should handle multiple records with and without images in export', () => {
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId: baby.id,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['img1'],
    });
    useRecordStore.getState().addRecord({
      type: 'diaper',
      babyId: baby.id,
      time: '2026-06-24T09:00:00.000Z',
      diaperType: 'wet',
    });

    const json = exportJSON();
    const parsed = JSON.parse(json);
    expect(parsed.records).toHaveLength(2);
    expect(parsed.records[0].images).toEqual(['img1']);
    expect(parsed.records[1].images).toBeUndefined();
  });

  // ===== getStorageInfo with images =====

  it('should count bgt_ prefixed keys in used bytes', () => {
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId: baby.id,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
    });

    const info = getStorageInfo();
    expect(info.used).toBeGreaterThan(0);
    expect(info.total).toBe(5 * 1024 * 1024);
  });

  it('should return correct total capacity', () => {
    const info = getStorageInfo();
    expect(info.total).toBe(5 * 1024 * 1024);
  });

  it('should return zero used when no bgt_ keys exist in localStorage', () => {
    // Clear localStorage to remove any persisted state from resetAllStores()
    localStorage.clear();
    const info = getStorageInfo();
    expect(info.used).toBe(0);
  });
});
