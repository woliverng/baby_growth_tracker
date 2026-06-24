import { create } from 'zustand';
import type { RecordItem, RecordType } from '@/types';

interface UIStore {
  quickRecordOpen: boolean;
  quickRecordType: RecordType | null;
  editingRecord: RecordItem | null;
  openQuickRecord: (type?: RecordType) => void;
  closeQuickRecord: () => void;
  startEdit: (record: RecordItem) => void;
}

export const useUIStore = create<UIStore>()((set) => ({
  quickRecordOpen: false,
  quickRecordType: null,
  editingRecord: null,

  openQuickRecord: (type?: RecordType): void => {
    set({ quickRecordOpen: true, quickRecordType: type ?? null, editingRecord: null });
  },

  closeQuickRecord: (): void => {
    set({ quickRecordOpen: false, quickRecordType: null, editingRecord: null });
  },

  startEdit: (record: RecordItem): void => {
    set({ quickRecordOpen: true, quickRecordType: record.type, editingRecord: record });
  },
}));
