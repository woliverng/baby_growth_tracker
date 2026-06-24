import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/render';
import RecordCard from '@/components/common/RecordCard';
import { resetAllStores } from '@/test/helpers';
import type { RecordItem } from '@/types';

describe('RecordCard image display', () => {
  beforeEach(() => {
    resetAllStores();
  });

  const baseRecord = {
    id: 'test-id',
    babyId: 'baby-1',
    createdAt: '2026-06-24T08:00:00.000Z',
    updatedAt: '2026-06-24T08:00:00.000Z',
  };

  it('should display thumbnails when record has images', () => {
    const record: RecordItem = {
      ...baseRecord,
      type: 'feeding',
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: [
        'data:image/jpeg;base64,img1',
        'data:image/jpeg;base64,img2',
      ],
    };
    const { container } = render(<RecordCard record={record} />);
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBe(2);
  });

  it('should not display any thumbnails when record has no images', () => {
    const record: RecordItem = {
      ...baseRecord,
      type: 'feeding',
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
    };
    const { container } = render(<RecordCard record={record} />);
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBe(0);
  });

  it('should not display thumbnails when images array is empty', () => {
    const record: RecordItem = {
      ...baseRecord,
      type: 'feeding',
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: [],
    };
    const { container } = render(<RecordCard record={record} />);
    const imgs = container.querySelectorAll('img');
    expect(imgs.length).toBe(0);
  });

  it('should display single thumbnail for record with one image', () => {
    const record: RecordItem = {
      ...baseRecord,
      type: 'diaper',
      time: '2026-06-24T09:00:00.000Z',
      diaperType: 'wet',
      images: ['data:image/jpeg;base64,img1'],
    };
    const { container } = render(<RecordCard record={record} />);
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });

  it('should open image preview when a thumbnail is clicked', async () => {
    const record: RecordItem = {
      ...baseRecord,
      type: 'feeding',
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: [
        'data:image/jpeg;base64,img1',
        'data:image/jpeg;base64,img2',
      ],
    };
    const { container } = render(<RecordCard record={record} />);
    const imgs = container.querySelectorAll('img');
    fireEvent.click(imgs[0]);

    // ImagePreview should open with close button
    await waitFor(() => {
      expect(screen.getByLabelText('关闭')).toBeInTheDocument();
    });
  });

  it('should still render note text alongside images', () => {
    const record: RecordItem = {
      ...baseRecord,
      type: 'feeding',
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      note: '这是备注文字',
      images: ['data:image/jpeg;base64,img1'],
    };
    render(<RecordCard record={record} />);
    expect(screen.getByText('这是备注文字')).toBeInTheDocument();
  });

  it('should display images for sleep record type', () => {
    const record: RecordItem = {
      ...baseRecord,
      type: 'sleep',
      startTime: '2026-06-24T10:00:00.000Z',
      endTime: '2026-06-24T11:30:00.000Z',
      duration: 90,
      images: ['data:image/jpeg;base64,sleep-img'],
    };
    const { container } = render(<RecordCard record={record} />);
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });

  it('should display images for growth record type', () => {
    const record: RecordItem = {
      ...baseRecord,
      type: 'growth',
      date: '2026-06-24',
      weight: 5.2,
      height: 58,
      images: ['data:image/jpeg;base64,growth-img'],
    };
    const { container } = render(<RecordCard record={record} />);
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });
});
