import { describe, it, expect, beforeEach, vi } from 'vitest';
import { exportJSON, exportCSV, importJSON, downloadFile } from '@/lib/storage';
import { useBabyStore } from '@/store/useBabyStore';
import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('lib/storage.ts', () => {
  beforeEach(() => {
    resetAllStores();
  });

  describe('exportJSON', () => {
    it('should return valid JSON string', () => {
      const json = exportJSON();
      const parsed = JSON.parse(json);
      expect(parsed).toHaveProperty('babies');
      expect(parsed).toHaveProperty('records');
      expect(parsed).toHaveProperty('settings');
    });

    it('should include babies in export', () => {
      useBabyStore.getState().addBaby(sampleBabyInput);
      const json = exportJSON();
      const parsed = JSON.parse(json);
      expect(parsed.babies).toHaveLength(1);
      expect(parsed.babies[0].name).toBe('测试宝宝');
    });

    it('should include records in export', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
      });

      const json = exportJSON();
      const parsed = JSON.parse(json);
      expect(parsed.records).toHaveLength(1);
    });

    it('should include settings in export', () => {
      useSettingsStore.getState().setTheme('dark');
      const json = exportJSON();
      const parsed = JSON.parse(json);
      expect(parsed.settings.theme).toBe('dark');
    });

    it('should export empty data when nothing is set', () => {
      const json = exportJSON();
      const parsed = JSON.parse(json);
      expect(parsed.babies).toHaveLength(0);
      expect(parsed.records).toHaveLength(0);
    });
  });

  describe('exportCSV', () => {
    it('should return CSV with BOM prefix', () => {
      const csv = exportCSV();
      expect(csv.startsWith('\uFEFF')).toBe(true);
    });

    it('should include header row', () => {
      const csv = exportCSV();
      const lines = csv.split('\n');
      expect(lines[0]).toContain('宝宝');
      expect(lines[0]).toContain('记录类型');
      expect(lines[0]).toContain('日期');
      expect(lines[0]).toContain('时间');
      expect(lines[0]).toContain('详情');
      expect(lines[0]).toContain('备注');
    });

    it('should include record rows', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
      });

      const csv = exportCSV();
      const lines = csv.split('\n');
      // BOM + header + 1 record
      expect(lines.length).toBe(2);
      expect(lines[1]).toContain('测试宝宝');
      expect(lines[1]).toContain('喂养');
    });

    it('should handle multiple record types', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
      });
      useRecordStore.getState().addRecord({
        type: 'sleep',
        babyId: baby.id,
        startTime: '2026-06-24T10:00:00.000Z',
        endTime: '2026-06-24T11:00:00.000Z',
        duration: 60,
      });
      useRecordStore.getState().addRecord({
        type: 'diaper',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'wet',
      });
      useRecordStore.getState().addRecord({
        type: 'growth',
        babyId: baby.id,
        date: '2026-06-24',
        weight: 5.2,
        height: 58,
      });

      const csv = exportCSV();
      const lines = csv.split('\n');
      // BOM + header + 4 records
      expect(lines.length).toBe(5);
    });

    it('should include jaundice record in CSV export', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useRecordStore.getState().addRecord({
        type: 'jaundice',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        value: 8.5,
        measureSite: 'forehead',
      });

      const csv = exportCSV();
      const lines = csv.split('\n');
      // BOM + header + 1 record
      expect(lines.length).toBe(2);
      expect(lines[1]).toContain('黄疸');
      expect(lines[1]).toContain('8.5');
      expect(lines[1]).toContain('额头');
    });

    it('should include jaundice record with chest site in CSV', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useRecordStore.getState().addRecord({
        type: 'jaundice',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        value: 12.0,
        measureSite: 'chest',
      });

      const csv = exportCSV();
      expect(csv).toContain('胸前');
      expect(csv).toContain('12');
    });

    it('should include all 5 record types in CSV export', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
      });
      useRecordStore.getState().addRecord({
        type: 'sleep',
        babyId: baby.id,
        startTime: '2026-06-24T10:00:00.000Z',
        endTime: '2026-06-24T11:00:00.000Z',
        duration: 60,
      });
      useRecordStore.getState().addRecord({
        type: 'diaper',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'wet',
      });
      useRecordStore.getState().addRecord({
        type: 'growth',
        babyId: baby.id,
        date: '2026-06-24',
        weight: 5.2,
        height: 58,
      });
      useRecordStore.getState().addRecord({
        type: 'jaundice',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        value: 8.5,
        measureSite: 'abdomen',
      });

      const csv = exportCSV();
      const lines = csv.split('\n');
      // BOM + header + 5 records
      expect(lines.length).toBe(6);
      expect(csv).toContain('喂养');
      expect(csv).toContain('睡眠');
      expect(csv).toContain('尿布');
      expect(csv).toContain('成长');
      expect(csv).toContain('黄疸');
    });

    it('should handle empty records', () => {
      const csv = exportCSV();
      const lines = csv.split('\n');
      // BOM + header only
      expect(lines.length).toBe(1);
    });
  });

  describe('importJSON', () => {
    it('should import valid JSON data', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
      });
      useSettingsStore.getState().setActiveBabyId(baby.id);

      const json = exportJSON();
      resetAllStores();

      // Verify it's empty after reset
      expect(useBabyStore.getState().babies).toHaveLength(0);

      const result = importJSON(json);
      expect(result).toBe(true);
      expect(useBabyStore.getState().babies).toHaveLength(1);
      expect(useRecordStore.getState().records).toHaveLength(1);
    });

    it('should import settings', () => {
      useSettingsStore.getState().setTheme('dark');
      const json = exportJSON();
      resetAllStores();

      importJSON(json);
      expect(useSettingsStore.getState().theme).toBe('dark');
    });

    it('should return false for invalid JSON', () => {
      const result = importJSON('not valid json');
      expect(result).toBe(false);
    });

    it('should return false for JSON without babies', () => {
      const result = importJSON(JSON.stringify({ records: [] }));
      expect(result).toBe(false);
    });

    it('should return false for JSON without records', () => {
      const result = importJSON(JSON.stringify({ babies: [] }));
      expect(result).toBe(false);
    });

    it('should replace existing data on import', () => {
      // Add some initial data
      const baby1 = useBabyStore.getState().addBaby(sampleBabyInput);
      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby1.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      });

      // Prepare import data with different content
      const importData = {
        babies: [
          {
            id: 'imported-baby',
            name: '导入宝宝',
            gender: 'female',
            birthDate: '2026-02-01T00:00:00.000Z',
            birthWeight: 3.2,
            birthHeight: 49,
            createdAt: '2026-02-01T00:00:00.000Z',
          },
        ],
        records: [
          {
            id: 'imported-record',
            babyId: 'imported-baby',
            type: 'sleep',
            startTime: '2026-06-24T10:00:00.000Z',
            endTime: '2026-06-24T11:00:00.000Z',
            duration: 60,
            createdAt: '2026-06-24T10:00:00.000Z',
            updatedAt: '2026-06-24T10:00:00.000Z',
          },
        ],
        settings: {
          theme: 'dark',
          activeBabyId: 'imported-baby',
        },
      };

      const result = importJSON(JSON.stringify(importData));
      expect(result).toBe(true);

      const babies = useBabyStore.getState().babies;
      expect(babies).toHaveLength(1);
      expect(babies[0].id).toBe('imported-baby');

      const records = useRecordStore.getState().records;
      expect(records).toHaveLength(1);
      expect(records[0].id).toBe('imported-record');
    });
  });

  describe('downloadFile', () => {
    it('should create a blob and trigger download', () => {
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL');
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');

      downloadFile('test content', 'test.txt', 'text/plain');

      expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
      expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);

      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
    });

    it('should create an anchor element and click it', () => {
      const linkClickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');

      downloadFile('test content', 'test.txt', 'text/plain');

      expect(linkClickSpy).toHaveBeenCalledTimes(1);

      linkClickSpy.mockRestore();
    });
  });
});
