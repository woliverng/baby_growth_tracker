import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { genId } from '@/lib/id';
import type { Baby, NewBabyInput } from '@/types';

interface BabyStore {
  babies: Baby[];
  addBaby: (data: NewBabyInput) => Baby;
  updateBaby: (id: string, data: Partial<NewBabyInput>) => void;
  deleteBaby: (id: string) => void;
  /** Internal: replace all babies (used by import) */
  _setBabies: (babies: Baby[]) => void;
}

export const useBabyStore = create<BabyStore>()(
  persist(
    (set) => ({
      babies: [],

      addBaby: (data: NewBabyInput): Baby => {
        const now = new Date().toISOString();
        const newBaby: Baby = {
          ...data,
          id: genId(),
          createdAt: now,
        };
        set((state) => ({ babies: [...state.babies, newBaby] }));
        return newBaby;
      },

      updateBaby: (id: string, data: Partial<NewBabyInput>): void => {
        set((state) => ({
          babies: state.babies.map((baby) =>
            baby.id === id ? { ...baby, ...data } : baby
          ),
        }));
      },

      deleteBaby: (id: string): void => {
        set((state) => ({
          babies: state.babies.filter((baby) => baby.id !== id),
        }));
      },

      _setBabies: (babies: Baby[]): void => {
        set({ babies });
      },
    }),
    {
      name: 'bgt_babies',
    }
  )
);
