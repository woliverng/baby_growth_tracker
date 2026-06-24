import { describe, it, expect, beforeEach } from 'vitest';
import { useBabyStore } from '@/store/useBabyStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('useBabyStore', () => {
  beforeEach(() => {
    resetAllStores();
  });

  describe('addBaby', () => {
    it('should add a baby and return the new baby object', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      expect(baby).toBeDefined();
      expect(baby.id).toBeTruthy();
      expect(baby.name).toBe('测试宝宝');
      expect(baby.gender).toBe('male');
      expect(baby.birthDate).toBe('2026-01-01T00:00:00.000Z');
      expect(baby.birthWeight).toBe(3.5);
      expect(baby.birthHeight).toBe(50);
      expect(baby.createdAt).toBeTruthy();
    });

    it('should store the baby in the babies array', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      const babies = useBabyStore.getState().babies;

      expect(babies).toHaveLength(1);
      expect(babies[0].id).toBe(baby.id);
    });

    it('should add multiple babies', () => {
      useBabyStore.getState().addBaby(sampleBabyInput);
      useBabyStore.getState().addBaby({ ...sampleBabyInput, name: '第二个宝宝' });

      expect(useBabyStore.getState().babies).toHaveLength(2);
    });

    it('should generate unique IDs for each baby', () => {
      const baby1 = useBabyStore.getState().addBaby(sampleBabyInput);
      const baby2 = useBabyStore.getState().addBaby({ ...sampleBabyInput, name: '宝宝2' });

      expect(baby1.id).not.toBe(baby2.id);
    });
  });

  describe('updateBaby', () => {
    it('should update an existing baby', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      useBabyStore.getState().updateBaby(baby.id, { name: '新名字' });

      const updated = useBabyStore.getState().babies.find((b) => b.id === baby.id);
      expect(updated?.name).toBe('新名字');
    });

    it('should update multiple fields', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);

      useBabyStore.getState().updateBaby(baby.id, {
        name: '改名',
        birthWeight: 4.0,
      });

      const updated = useBabyStore.getState().babies.find((b) => b.id === baby.id);
      expect(updated?.name).toBe('改名');
      expect(updated?.birthWeight).toBe(4.0);
    });

    it('should not affect other babies', () => {
      const baby1 = useBabyStore.getState().addBaby(sampleBabyInput);
      const baby2 = useBabyStore.getState().addBaby({ ...sampleBabyInput, name: '宝宝2' });

      useBabyStore.getState().updateBaby(baby1.id, { name: '改名1' });

      const other = useBabyStore.getState().babies.find((b) => b.id === baby2.id);
      expect(other?.name).toBe('宝宝2');
    });

    it('should not crash when updating non-existent baby', () => {
      expect(() => {
        useBabyStore.getState().updateBaby('non-existent-id', { name: 'test' });
      }).not.toThrow();
    });
  });

  describe('deleteBaby', () => {
    it('should remove a baby from the array', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      expect(useBabyStore.getState().babies).toHaveLength(1);

      useBabyStore.getState().deleteBaby(baby.id);
      expect(useBabyStore.getState().babies).toHaveLength(0);
    });

    it('should only remove the specified baby', () => {
      const baby1 = useBabyStore.getState().addBaby(sampleBabyInput);
      const baby2 = useBabyStore.getState().addBaby({ ...sampleBabyInput, name: '宝宝2' });

      useBabyStore.getState().deleteBaby(baby1.id);

      const babies = useBabyStore.getState().babies;
      expect(babies).toHaveLength(1);
      expect(babies[0].id).toBe(baby2.id);
    });

    it('should not crash when deleting non-existent baby', () => {
      expect(() => {
        useBabyStore.getState().deleteBaby('non-existent-id');
      }).not.toThrow();
    });
  });

  describe('_setBabies', () => {
    it('should replace all babies', () => {
      useBabyStore.getState().addBaby(sampleBabyInput);
      const newBabies = [
        {
          id: 'new-id',
          name: '全新宝宝',
          gender: 'female' as const,
          birthDate: '2026-02-01T00:00:00.000Z',
          birthWeight: 3.2,
          birthHeight: 49,
          createdAt: '2026-02-01T00:00:00.000Z',
        },
      ];

      useBabyStore.getState()._setBabies(newBabies);

      const babies = useBabyStore.getState().babies;
      expect(babies).toHaveLength(1);
      expect(babies[0].id).toBe('new-id');
    });
  });
});
