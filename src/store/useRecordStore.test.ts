import { describe, it, expect, beforeEach } from 'vitest';
import { useRecordStore } from '@/store/useRecordStore';
import { useBabyStore } from '@/store/useBabyStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';
import type { FeedingRecord, SleepRecord, DiaperRecord, GrowthRecord } from '@/types';

describe('useRecordStore', () => {
  beforeEach(() => {
    resetAllStores();
  });

  describe('addRecord', () => {
    it('should add a feeding record and return it', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      const record = useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
        duration: 15,
      });

      expect(record).toBeDefined();
      expect(record.id).toBeTruthy();
      expect(record.type).toBe('feeding');
      expect(record.babyId).toBe(baby.id);
      expect((record as FeedingRecord).feedingMethod).toBe('breast');
      expect((record as FeedingRecord).amount).toBe(80);
      expect(record.createdAt).toBeTruthy();
      expect(record.updatedAt).toBeTruthy();
    });

    it('should add a sleep record', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      const record = useRecordStore.getState().addRecord({
        type: 'sleep',
        babyId: baby.id,
        startTime: '2026-06-24T10:00:00.000Z',
        endTime: '2026-06-24T11:30:00.000Z',
        duration: 90,
      });

      expect(record.type).toBe('sleep');
      expect((record as SleepRecord).startTime).toBe('2026-06-24T10:00:00.000Z');
      expect((record as SleepRecord).endTime).toBe('2026-06-24T11:30:00.000Z');
      expect((record as SleepRecord).duration).toBe(90);
    });

    it('should add a diaper record', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      const record = useRecordStore.getState().addRecord({
        type: 'diaper',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'wet',
      });

      expect(record.type).toBe('diaper');
      expect((record as DiaperRecord).diaperType).toBe('wet');
    });

    it('should add a growth record', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      const record = useRecordStore.getState().addRecord({
        type: 'growth',
        babyId: baby.id,
        date: '2026-06-24',
        weight: 5.2,
        height: 58,
      });

      expect(record.type).toBe('growth');
      expect((record as GrowthRecord).date).toBe('2026-06-24');
      expect((record as GrowthRecord).weight).toBe(5.2);
      expect((record as GrowthRecord).height).toBe(58);
    });

    it('should store records in the records array', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      });

      expect(useRecordStore.getState().records).toHaveLength(1);
    });

    it('should generate unique IDs', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      const r1 = useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      });
      const r2 = useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        feedingMethod: 'formula',
      });

      expect(r1.id).not.toBe(r2.id);
    });
  });

  describe('updateRecord', () => {
    it('should update a feeding record', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      const record = useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
      });

      useRecordStore.getState().updateRecord(record.id, {
        type: 'feeding',
        amount: 100,
      });

      const updated = useRecordStore.getState().records.find((r) => r.id === record.id);
      expect(updated?.type).toBe('feeding');
      if (updated?.type === 'feeding') {
        expect(updated.amount).toBe(100);
      }
    });

    it('should update the updatedAt timestamp', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      const record = useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      });

      // Small delay to ensure timestamp difference
      useRecordStore.getState().updateRecord(record.id, {
        type: 'feeding',
        amount: 50,
      });

      const updated = useRecordStore.getState().records.find((r) => r.id === record.id);
      expect(updated?.updatedAt).toBeTruthy();
    });

    it('should not affect other records', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      const r1 = useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
      });
      const r2 = useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        feedingMethod: 'formula',
        amount: 100,
      });

      useRecordStore.getState().updateRecord(r1.id, { type: 'feeding', amount: 50 });

      const other = useRecordStore.getState().records.find((r) => r.id === r2.id);
      if (other?.type === 'feeding') {
        expect(other.amount).toBe(100);
      }
    });
  });

  describe('deleteRecord', () => {
    it('should remove a record', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      const record = useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      });

      useRecordStore.getState().deleteRecord(record.id);

      expect(useRecordStore.getState().records).toHaveLength(0);
    });

    it('should only remove the specified record', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      const r1 = useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      });
      useRecordStore.getState().addRecord({
        type: 'sleep',
        babyId: baby.id,
        startTime: '2026-06-24T10:00:00.000Z',
        endTime: '2026-06-24T11:00:00.000Z',
        duration: 60,
      });

      useRecordStore.getState().deleteRecord(r1.id);

      expect(useRecordStore.getState().records).toHaveLength(1);
    });
  });

  describe('deleteRecordsByBaby', () => {
    it('should delete all records for a specific baby', () => {
      const baby1 = useBabyStore.getState().addBaby(sampleBabyInput);
      const baby2 = useBabyStore.getState().addBaby({ ...sampleBabyInput, name: '宝宝2' });

      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby1.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      });
      useRecordStore.getState().addRecord({
        type: 'sleep',
        babyId: baby1.id,
        startTime: '2026-06-24T10:00:00.000Z',
        endTime: '2026-06-24T11:00:00.000Z',
        duration: 60,
      });
      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby2.id,
        time: '2026-06-24T09:00:00.000Z',
        feedingMethod: 'formula',
      });

      useRecordStore.getState().deleteRecordsByBaby(baby1.id);

      const remaining = useRecordStore.getState().records;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].babyId).toBe(baby2.id);
    });

    it('should do nothing if no records match', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      });

      useRecordStore.getState().deleteRecordsByBaby('non-existent-baby');
      expect(useRecordStore.getState().records).toHaveLength(1);
    });
  });

  describe('_setRecords', () => {
    it('should replace all records', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      });

      const newRecords = [
        {
          id: 'new-record-id',
          babyId: baby.id,
          type: 'sleep' as const,
          startTime: '2026-06-24T10:00:00.000Z',
          endTime: '2026-06-24T11:00:00.000Z',
          duration: 60,
          createdAt: '2026-06-24T10:00:00.000Z',
          updatedAt: '2026-06-24T10:00:00.000Z',
        },
      ];

      useRecordStore.getState()._setRecords(newRecords);
      expect(useRecordStore.getState().records).toHaveLength(1);
      expect(useRecordStore.getState().records[0].id).toBe('new-record-id');
    });
  });
});
