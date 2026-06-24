import { describe, it, expect } from 'vitest';
import { genId } from '@/lib/id';

describe('lib/id.ts', () => {
  describe('genId', () => {
    it('should return a string', () => {
      const id = genId();
      expect(typeof id).toBe('string');
    });

    it('should return a non-empty string', () => {
      const id = genId();
      expect(id.length).toBeGreaterThan(0);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(genId());
      }
      expect(ids.size).toBe(100);
    });

    it('should generate UUID-like strings when crypto.randomUUID is available', () => {
      // In jsdom, crypto.randomUUID should be available
      const id = genId();
      // UUID v4 format: 8-4-4-4-12
      expect(id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      );
    });
  });
});
