import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/types';

interface SettingsStore {
  theme: ThemeMode;
  activeBabyId: string | null;
  setTheme: (theme: ThemeMode) => void;
  setActiveBabyId: (id: string) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      activeBabyId: null,

      setTheme: (theme: ThemeMode): void => {
        set({ theme });
      },

      setActiveBabyId: (id: string): void => {
        set({ activeBabyId: id });
      },
    }),
    {
      name: 'bgt_settings',
    }
  )
);
