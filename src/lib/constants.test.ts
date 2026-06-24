import { describe, it, expect } from 'vitest';
import {
  JAUNDICE_MEASURE_SITES,
  JAUNDICE_WARNING_THRESHOLD,
  RECORD_TYPE_COLORS,
  RECORD_TYPE_LABELS,
} from '@/lib/constants';

describe('lib/constants.ts — jaundice feature', () => {
  describe('JAUNDICE_MEASURE_SITES', () => {
    it('should have 3 measurement sites', () => {
      expect(JAUNDICE_MEASURE_SITES).toHaveLength(3);
    });

    it('should include forehead, chest, and abdomen values', () => {
      const values = JAUNDICE_MEASURE_SITES.map((s) => s.value);
      expect(values).toEqual(['forehead', 'chest', 'abdomen']);
    });

    it('should have correct Chinese labels', () => {
      const labelMap = Object.fromEntries(
        JAUNDICE_MEASURE_SITES.map((s) => [s.value, s.label])
      );
      expect(labelMap.forehead).toBe('额头');
      expect(labelMap.chest).toBe('胸前');
      expect(labelMap.abdomen).toBe('腹部');
    });

    it('should have non-empty labels for all sites', () => {
      JAUNDICE_MEASURE_SITES.forEach((site) => {
        expect(site.label).toBeTruthy();
      });
    });
  });

  describe('RECORD_TYPE_COLORS', () => {
    it('should include jaundice color #FFAB91', () => {
      expect(RECORD_TYPE_COLORS.jaundice).toBe('#FFAB91');
    });

    it('should include all 5 record type colors', () => {
      expect(RECORD_TYPE_COLORS.feeding).toBeDefined();
      expect(RECORD_TYPE_COLORS.sleep).toBeDefined();
      expect(RECORD_TYPE_COLORS.diaper).toBeDefined();
      expect(RECORD_TYPE_COLORS.growth).toBeDefined();
      expect(RECORD_TYPE_COLORS.jaundice).toBeDefined();
    });
  });

  describe('RECORD_TYPE_LABELS', () => {
    it('should include jaundice label "黄疸"', () => {
      expect(RECORD_TYPE_LABELS.jaundice).toBe('黄疸');
    });

    it('should include all 5 record type labels', () => {
      expect(RECORD_TYPE_LABELS.feeding).toBe('喂养');
      expect(RECORD_TYPE_LABELS.sleep).toBe('睡眠');
      expect(RECORD_TYPE_LABELS.diaper).toBe('尿布');
      expect(RECORD_TYPE_LABELS.growth).toBe('成长');
      expect(RECORD_TYPE_LABELS.jaundice).toBe('黄疸');
    });
  });

  describe('JAUNDICE_WARNING_THRESHOLD', () => {
    it('should be 12 (mg/dL)', () => {
      expect(JAUNDICE_WARNING_THRESHOLD).toBe(12);
    });

    it('should be a number type', () => {
      expect(typeof JAUNDICE_WARNING_THRESHOLD).toBe('number');
    });
  });
});
