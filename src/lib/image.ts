import {
  DEFAULT_COMPRESS_OPTIONS,
  STORAGE_ESTIMATE_BYTES,
  STORAGE_WARNING_THRESHOLD,
} from '@/lib/constants';
import type { CompressOptions, StorageInfo } from '@/types';

/**
 * Compress an image file to a base64 JPEG string using Canvas API.
 *
 * Strategy:
 * 1. Resize to max 1280x1280 (preserving aspect ratio)
 * 2. Export at quality 0.7
 * 3. If still over maxSizeKB, progressively lower quality (0.55, 0.4, 0.3)
 * 4. If still over, scale dimensions to 60% and re-export at quality 0.5
 *
 * @param file - The image file selected by the user
 * @param options - Optional compression configuration overrides
 * @returns A base64-encoded JPEG data URL string
 */
export async function compressImage(
  file: File,
  options?: CompressOptions
): Promise<string> {
  const opts = { ...DEFAULT_COMPRESS_OPTIONS, ...options };

  // Step 1: Read file as Data URL
  const dataUrl = await readFileAsDataURL(file);

  // Step 2: Load the image element
  const img = await loadImage(dataUrl);

  // Step 3: Calculate target dimensions (preserve aspect ratio)
  let { width: srcW, height: srcH } = img;
  let targetW = srcW;
  let targetH = srcH;

  if (srcW > opts.maxWidth! || srcH > opts.maxHeight!) {
    const ratio = Math.min(opts.maxWidth! / srcW, opts.maxHeight! / srcH);
    targetW = Math.round(srcW * ratio);
    targetH = Math.round(srcH * ratio);
  }

  // Step 4: Draw to canvas and export
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }
  ctx.drawImage(img, 0, 0, targetW, targetH);

  // Step 5: Progressive quality reduction
  let quality = opts.quality!;
  let result = canvas.toDataURL('image/jpeg', quality);

  while (getBase64SizeKB(result) > opts.maxSizeKB! && quality > 0.3) {
    quality -= 0.15;
    result = canvas.toDataURL('image/jpeg', quality);
  }

  // Step 6: If quality reduction wasn't enough, shrink dimensions
  if (getBase64SizeKB(result) > opts.maxSizeKB!) {
    const scale = 0.6;
    canvas.width = Math.round(targetW * scale);
    canvas.height = Math.round(targetH * scale);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    result = canvas.toDataURL('image/jpeg', 0.5);
  }

  return result;
}

/**
 * Read a File object as a Data URL string.
 * @param file - The file to read
 * @returns A promise resolving to the base64 data URL
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Load an HTMLImageElement from a source URL.
 * @param src - The image source URL (can be a data URL)
 * @returns A promise resolving to the loaded image element
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = src;
  });
}

/**
 * Calculate the approximate size of a base64 string in kilobytes.
 * @param base64 - The base64 data URL string
 * @returns Size in KB
 */
export function getBase64SizeKB(base64: string): number {
  const padding = base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0;
  const base64Length = base64.split(',')[1]?.length ?? 0;
  const bytes = (base64Length * 3) / 4 - padding;
  return Math.round(bytes / 1024);
}

/**
 * Estimate current localStorage usage by scanning all bgt_ prefixed keys.
 * Also counts total number of images stored across all records.
 * @returns StorageInfo with used bytes, total estimate, percentage, and image count
 */
export function getStorageInfo(): StorageInfo {
  let used = 0;
  let imageCount = 0;

  const keys = Object.keys(localStorage).filter((k) => k.startsWith('bgt_'));
  for (const key of keys) {
    const value = localStorage.getItem(key) ?? '';
    used += key.length + value.length;
  }
  // UTF-16: each character is 2 bytes
  used = used * 2;

  // Count images across all records
  try {
    const records = JSON.parse(localStorage.getItem('bgt_records') ?? '[]');
    if (Array.isArray(records)) {
      for (const r of records) {
        if (r.images && Array.isArray(r.images)) {
          imageCount += r.images.length;
        }
      }
    }
  } catch {
    // Ignore parse errors
  }

  const total = STORAGE_ESTIMATE_BYTES;
  return {
    used,
    total,
    percent: total > 0 ? used / total : 0,
    imageCount,
  };
}

/**
 * Check whether there is enough localStorage capacity for additional data.
 * @param additionalBytes - The estimated number of bytes to be added
 * @returns true if there is sufficient capacity below the warning threshold
 */
export function checkStorageCapacity(additionalBytes: number): boolean {
  const info = getStorageInfo();
  return info.used + additionalBytes < info.total * STORAGE_WARNING_THRESHOLD;
}
