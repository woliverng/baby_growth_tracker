import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  compressImage,
  getBase64SizeKB,
  getStorageInfo,
  checkStorageCapacity,
} from '@/lib/image';
import {
  STORAGE_ESTIMATE_BYTES,
} from '@/lib/constants';

// Save original Image for restoration
const RealImage = globalThis.Image;

/**
 * Mock Image class that simulates async image loading.
 * Sets onload callback after src is assigned.
 */
class MockImage {
  width = 800;
  height = 600;
  onload: (() => void) | null = null;
  onerror: ((e: unknown) => void) | null = null;
  private _src = '';

  set src(value: string) {
    this._src = value;
    // Simulate async load completion
    setTimeout(() => {
      this.onload?.();
    }, 0);
  }

  get src(): string {
    return this._src;
  }
}

describe('lib/image.ts', () => {
  let mockCtx: { drawImage: ReturnType<typeof vi.fn> };
  let mockCanvas: {
    width: number;
    height: number;
    getContext: ReturnType<typeof vi.fn>;
    toDataURL: ReturnType<typeof vi.fn>;
  };
  let createElementSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Setup canvas mock
    mockCtx = { drawImage: vi.fn() };
    mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn(() => mockCtx),
      toDataURL: vi.fn(() => 'data:image/jpeg;base64,AAAA'),
    };

    const originalCreate = document.createElement.bind(document);
    createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tag: string) => {
        if (tag === 'canvas') return mockCanvas as unknown as HTMLCanvasElement;
        return originalCreate(tag);
      });

    // Setup Image mock
    globalThis.Image = MockImage as unknown as typeof Image;
  });

  afterEach(() => {
    createElementSpy.mockRestore();
    globalThis.Image = RealImage;
  });

  // ===== getBase64SizeKB =====

  describe('getBase64SizeKB', () => {
    it('should calculate size for a simple base64 string (no padding)', () => {
      // base64 part = 'AAAA', length = 4, no padding
      // bytes = (4 * 3) / 4 - 0 = 3, KB = round(3 / 1024) = 0
      const result = getBase64SizeKB('data:image/jpeg;base64,AAAA');
      expect(result).toBe(0);
    });

    it('should calculate size for a larger base64 string', () => {
      // base64 part = 'A' * 1366, length = 1366, no padding
      // bytes = (1366 * 3) / 4 = 1024.5, KB = round(1024.5 / 1024) = 1
      const result = getBase64SizeKB(
        'data:image/jpeg;base64,' + 'A'.repeat(1366)
      );
      expect(result).toBe(1);
    });

    it('should handle padding with == suffix', () => {
      // base64 part = 'AAAA==', length = 6, padding = 2
      // bytes = (6 * 3) / 4 - 2 = 2.5, KB = 0
      const result = getBase64SizeKB('data:image/jpeg;base64,AAAA==');
      expect(result).toBe(0);
    });

    it('should handle padding with single = suffix', () => {
      // base64 part = 'AAA=', length = 4, padding = 1
      // bytes = (4 * 3) / 4 - 1 = 2, KB = 0
      const result = getBase64SizeKB('data:image/jpeg;base64,AAA=');
      expect(result).toBe(0);
    });

    it('should return 0 for empty base64 content', () => {
      const result = getBase64SizeKB('data:image/jpeg;base64,');
      expect(result).toBe(0);
    });

    it('should calculate approximately 1KB for 1366 base64 chars', () => {
      // Verify the math: 1366 chars → ~1024 bytes → 1 KB
      const base64Str = 'data:image/jpeg;base64,' + 'A'.repeat(1366);
      expect(getBase64SizeKB(base64Str)).toBe(1);
    });
  });

  // ===== compressImage =====

  describe('compressImage', () => {
    it('should return a base64 JPEG data URL string', async () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      const result = await compressImage(file);
      expect(typeof result).toBe('string');
      expect(result.startsWith('data:image/jpeg')).toBe(true);
    });

    it('should call canvas drawImage to render the image', async () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      await compressImage(file);
      expect(mockCtx.drawImage).toHaveBeenCalled();
    });

    it('should call canvas toDataURL to export the image', async () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      await compressImage(file);
      expect(mockCanvas.toDataURL).toHaveBeenCalled();
    });

    it('should resize when image exceeds maxWidth/maxHeight', async () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      // MockImage is 800x600, max is 100x100
      // ratio = min(100/800, 100/600) = min(0.125, 0.1667) = 0.125
      // targetW = round(800 * 0.125) = 100, targetH = round(600 * 0.125) = 75
      await compressImage(file, { maxWidth: 100, maxHeight: 100 });
      expect(mockCanvas.width).toBe(100);
      expect(mockCanvas.height).toBe(75);
    });

    it('should not resize when image is within max dimensions', async () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      // MockImage is 800x600, max is 1000x1000 → no resize needed
      await compressImage(file, { maxWidth: 1000, maxHeight: 1000 });
      expect(mockCanvas.width).toBe(800);
      expect(mockCanvas.height).toBe(600);
    });

    it('should use default quality 0.7 for first toDataURL call', async () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      await compressImage(file);
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.7);
    });

    it('should apply custom compression options', async () => {
      const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });
      await compressImage(file, { quality: 0.5, maxSizeKB: 500 });
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.5);
    });
  });

  // ===== getStorageInfo =====

  describe('getStorageInfo', () => {
    it('should return zero usage when localStorage is empty', () => {
      const info = getStorageInfo();
      expect(info.used).toBe(0);
      expect(info.total).toBe(STORAGE_ESTIMATE_BYTES);
      expect(info.percent).toBe(0);
      expect(info.imageCount).toBe(0);
    });

    it('should count bgt_ prefixed keys in used bytes', () => {
      localStorage.setItem('bgt_settings', '{"theme":"light"}');
      const info = getStorageInfo();
      expect(info.used).toBeGreaterThan(0);
    });

    it('should not count non-bgt prefixed keys', () => {
      localStorage.setItem('other_key', 'some data');
      const info = getStorageInfo();
      expect(info.used).toBe(0);
    });

    it('should calculate used bytes as UTF-16 (2 bytes per char)', () => {
      const data = 'x'.repeat(100);
      localStorage.setItem('bgt_test', data);
      const info = getStorageInfo();
      // used = (key.length + value.length) * 2 = (8 + 100) * 2 = 216
      expect(info.used).toBe(216);
    });

    it('should calculate percent as used / total', () => {
      const data = 'x'.repeat(100);
      localStorage.setItem('bgt_test', data);
      const info = getStorageInfo();
      // used = 216, total = 5MB
      expect(info.percent).toBe(216 / STORAGE_ESTIMATE_BYTES);
    });

    it('should count images across all records in plain array format', () => {
      const records = [
        {
          id: 'r1',
          babyId: 'b1',
          type: 'feeding',
          time: '2026-06-24T08:00:00.000Z',
          feedingMethod: 'breast',
          images: ['img1', 'img2', 'img3'],
          createdAt: '2026-06-24T08:00:00.000Z',
          updatedAt: '2026-06-24T08:00:00.000Z',
        },
        {
          id: 'r2',
          babyId: 'b1',
          type: 'diaper',
          time: '2026-06-24T09:00:00.000Z',
          diaperType: 'wet',
          images: ['img4'],
          createdAt: '2026-06-24T09:00:00.000Z',
          updatedAt: '2026-06-24T09:00:00.000Z',
        },
      ];
      localStorage.setItem('bgt_records', JSON.stringify(records));
      const info = getStorageInfo();
      expect(info.imageCount).toBe(4);
    });

    it('should handle records without images field', () => {
      const records = [
        {
          id: 'r1',
          babyId: 'b1',
          type: 'feeding',
          time: '2026-06-24T08:00:00.000Z',
          feedingMethod: 'breast',
          createdAt: '2026-06-24T08:00:00.000Z',
          updatedAt: '2026-06-24T08:00:00.000Z',
        },
      ];
      localStorage.setItem('bgt_records', JSON.stringify(records));
      const info = getStorageInfo();
      expect(info.imageCount).toBe(0);
    });

    it('should handle invalid records JSON gracefully', () => {
      localStorage.setItem('bgt_records', 'not valid json');
      const info = getStorageInfo();
      expect(info.imageCount).toBe(0);
    });

    it('should return total as STORAGE_ESTIMATE_BYTES', () => {
      const info = getStorageInfo();
      expect(info.total).toBe(5 * 1024 * 1024);
    });
  });

  // ===== checkStorageCapacity =====

  describe('checkStorageCapacity', () => {
    it('should return true when there is plenty of capacity', () => {
      localStorage.setItem('bgt_test', 'small');
      expect(checkStorageCapacity(1000)).toBe(true);
    });

    it('should return true with empty storage and small addition', () => {
      expect(checkStorageCapacity(1000)).toBe(true);
    });

    it('should return false when storage usage exceeds warning threshold', () => {
      // Threshold = STORAGE_ESTIMATE_BYTES * 0.8 = 4194304 bytes
      // Need used > 4194304
      // used = (key.length + value.length) * 2
      // Need key.length + value.length > 2097152
      const data = 'x'.repeat(2097152); // ~2MB
      localStorage.setItem('bgt_big', data);
      // used = (7 + 2097152) * 2 = 4194318 > 4194304
      expect(checkStorageCapacity(0)).toBe(false);
    });

    it('should account for additional bytes in capacity check', () => {
      // Set used to just below threshold
      // threshold = 4194304
      // We want used + additionalBytes >= threshold → return false
      // used = 216 (from 100 chars)
      // additionalBytes = 4194304 - 216 + 1 = 4194089
      const data = 'x'.repeat(100);
      localStorage.setItem('bgt_test', data);
      // used = 216, threshold = 4194304
      // 216 + 4194089 = 4194305 >= 4194304 → false
      expect(checkStorageCapacity(4194089)).toBe(false);
    });
  });
});
