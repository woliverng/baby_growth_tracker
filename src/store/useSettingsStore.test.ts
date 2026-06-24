import { describe, it, expect, beforeEach } from 'vitest';
import { useSettingsStore } from '@/store/useSettingsStore';
import { resetAllStores } from '@/test/helpers';

describe('useSettingsStore', () => {
  beforeEach(() => {
    resetAllStores();
  });

  describe('initial state', () => {
    it('should have light theme by default', () => {
      expect(useSettingsStore.getState().theme).toBe('light');
    });

    it('should have null activeBabyId by default', () => {
      expect(useSettingsStore.getState().activeBabyId).toBeNull();
    });
  });

  describe('setTheme', () => {
    it('should set theme to dark', () => {
      useSettingsStore.getState().setTheme('dark');
      expect(useSettingsStore.getState().theme).toBe('dark');
    });

    it('should set theme to light', () => {
      useSettingsStore.getState().setTheme('dark');
      useSettingsStore.getState().setTheme('light');
      expect(useSettingsStore.getState().theme).toBe('light');
    });

    it('should toggle theme', () => {
      const initial = useSettingsStore.getState().theme;
      useSettingsStore.getState().setTheme(initial === 'light' ? 'dark' : 'light');
      expect(useSettingsStore.getState().theme).not.toBe(initial);
    });
  });

  describe('setActiveBabyId', () => {
    it('should set activeBabyId', () => {
      useSettingsStore.getState().setActiveBabyId('baby-123');
      expect(useSettingsStore.getState().activeBabyId).toBe('baby-123');
    });

    it('should update activeBabyId to a different value', () => {
      useSettingsStore.getState().setActiveBabyId('baby-1');
      useSettingsStore.getState().setActiveBabyId('baby-2');
      expect(useSettingsStore.getState().activeBabyId).toBe('baby-2');
    });

    it('should allow setting empty string', () => {
      useSettingsStore.getState().setActiveBabyId('baby-1');
      useSettingsStore.getState().setActiveBabyId('');
      expect(useSettingsStore.getState().activeBabyId).toBe('');
    });
  });
});
