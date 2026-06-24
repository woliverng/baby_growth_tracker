import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/store/useUIStore';
import { resetAllStores } from '@/test/helpers';
import type { RecordItem } from '@/types';

describe('useUIStore', () => {
  beforeEach(() => {
    resetAllStores();
  });

  describe('initial state', () => {
    it('should have quickRecordOpen as false', () => {
      expect(useUIStore.getState().quickRecordOpen).toBe(false);
    });

    it('should have quickRecordType as null', () => {
      expect(useUIStore.getState().quickRecordType).toBeNull();
    });

    it('should have editingRecord as null', () => {
      expect(useUIStore.getState().editingRecord).toBeNull();
    });
  });

  describe('openQuickRecord', () => {
    it('should open the quick record panel', () => {
      useUIStore.getState().openQuickRecord();
      expect(useUIStore.getState().quickRecordOpen).toBe(true);
    });

    it('should set quickRecordType when type is provided', () => {
      useUIStore.getState().openQuickRecord('feeding');
      expect(useUIStore.getState().quickRecordType).toBe('feeding');
    });

    it('should set quickRecordType to null when no type is provided', () => {
      useUIStore.getState().openQuickRecord();
      expect(useUIStore.getState().quickRecordType).toBeNull();
    });

    it('should clear editingRecord when opening', () => {
      // First set an editing record via startEdit
      const mockRecord: RecordItem = {
        id: 'test-id',
        babyId: 'baby-id',
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        createdAt: '2026-06-24T08:00:00.000Z',
        updatedAt: '2026-06-24T08:00:00.000Z',
      };
      useUIStore.getState().startEdit(mockRecord);
      expect(useUIStore.getState().editingRecord).not.toBeNull();

      // Now open quick record, which should clear editingRecord
      useUIStore.getState().openQuickRecord('sleep');
      expect(useUIStore.getState().editingRecord).toBeNull();
    });

    it('should support all record types', () => {
      const types = ['feeding', 'sleep', 'diaper', 'growth'] as const;
      for (const type of types) {
        useUIStore.getState().openQuickRecord(type);
        expect(useUIStore.getState().quickRecordType).toBe(type);
      }
    });
  });

  describe('closeQuickRecord', () => {
    it('should close the quick record panel', () => {
      useUIStore.getState().openQuickRecord('feeding');
      useUIStore.getState().closeQuickRecord();
      expect(useUIStore.getState().quickRecordOpen).toBe(false);
    });

    it('should reset quickRecordType to null', () => {
      useUIStore.getState().openQuickRecord('feeding');
      useUIStore.getState().closeQuickRecord();
      expect(useUIStore.getState().quickRecordType).toBeNull();
    });

    it('should reset editingRecord to null', () => {
      useUIStore.getState().openQuickRecord('feeding');
      useUIStore.getState().closeQuickRecord();
      expect(useUIStore.getState().editingRecord).toBeNull();
    });
  });

  describe('startEdit', () => {
    it('should open the quick record panel in edit mode', () => {
      const mockRecord: RecordItem = {
        id: 'test-id',
        babyId: 'baby-id',
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        createdAt: '2026-06-24T08:00:00.000Z',
        updatedAt: '2026-06-24T08:00:00.000Z',
      };
      useUIStore.getState().startEdit(mockRecord);

      expect(useUIStore.getState().quickRecordOpen).toBe(true);
    });

    it('should set quickRecordType to the record type', () => {
      const mockRecord: RecordItem = {
        id: 'test-id',
        babyId: 'baby-id',
        type: 'sleep',
        startTime: '2026-06-24T10:00:00.000Z',
        endTime: '2026-06-24T11:00:00.000Z',
        duration: 60,
        createdAt: '2026-06-24T10:00:00.000Z',
        updatedAt: '2026-06-24T10:00:00.000Z',
      };
      useUIStore.getState().startEdit(mockRecord);

      expect(useUIStore.getState().quickRecordType).toBe('sleep');
    });

    it('should set editingRecord to the provided record', () => {
      const mockRecord: RecordItem = {
        id: 'test-id',
        babyId: 'baby-id',
        type: 'diaper',
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'wet',
        createdAt: '2026-06-24T09:00:00.000Z',
        updatedAt: '2026-06-24T09:00:00.000Z',
      };
      useUIStore.getState().startEdit(mockRecord);

      expect(useUIStore.getState().editingRecord).toEqual(mockRecord);
    });
  });
});
