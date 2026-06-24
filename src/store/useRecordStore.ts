import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { genId } from '@/lib/id';
import type { RecordItem, NewRecordInput, UpdateRecordInput } from '@/types';

interface RecordStore {
  records: RecordItem[];
  addRecord: (data: NewRecordInput) => RecordItem;
  updateRecord: (id: string, data: UpdateRecordInput) => void;
  deleteRecord: (id: string) => void;
  deleteRecordsByBaby: (babyId: string) => void;
  /** Internal: replace all records (used by import) */
  _setRecords: (records: RecordItem[]) => void;
}

export const useRecordStore = create<RecordStore>()(
  persist(
    (set) => ({
      records: [],

      addRecord: (data: NewRecordInput): RecordItem => {
        const now = new Date().toISOString();
        const newRecord = {
          ...data,
          id: genId(),
          createdAt: now,
          updatedAt: now,
        } as RecordItem;
        set((state) => ({ records: [...state.records, newRecord] }));
        return newRecord;
      },

      updateRecord: (id: string, data: UpdateRecordInput): void => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id
              ? ({ ...record, ...data, updatedAt: new Date().toISOString() } as RecordItem)
              : record
          ),
        }));
      },

      deleteRecord: (id: string): void => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }));
      },

      deleteRecordsByBaby: (babyId: string): void => {
        set((state) => ({
          records: state.records.filter((record) => record.babyId !== babyId),
        }));
      },

      _setRecords: (records: RecordItem[]): void => {
        set({ records });
      },
    }),
    {
      name: 'bgt_records',
    }
  )
);
