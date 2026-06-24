import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import AlbumDetailDialog from '@/components/album/AlbumDetailDialog';
import type { RecordItem } from '@/types';

describe('AlbumDetailDialog', () => {
  const feedingRecord: RecordItem = {
    id: 'r1',
    babyId: 'b1',
    type: 'feeding',
    time: '2026-06-24T08:00:00.000Z',
    feedingMethod: 'breast',
    amount: 80,
    duration: 15,
    note: '宝宝吃得好',
    images: [
      'data:image/jpeg;base64,img1',
      'data:image/jpeg;base64,img2',
    ],
    createdAt: '2026-06-24T08:00:00.000Z',
    updatedAt: '2026-06-24T08:00:00.000Z',
  };

  // ===== Closed state =====

  it('should not render edit button when open is false', () => {
    render(
      <AlbumDetailDialog
        open={false}
        record={feedingRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.queryByText('编辑')).not.toBeInTheDocument();
  });

  it('should not render record type label when open is false', () => {
    render(
      <AlbumDetailDialog
        open={false}
        record={feedingRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    // The dialog content is not rendered when closed
    expect(screen.queryByText('喂养')).not.toBeInTheDocument();
  });

  // ===== Open state =====

  it('should render record type label when open', () => {
    render(
      <AlbumDetailDialog
        open={true}
        record={feedingRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText('喂养')).toBeInTheDocument();
  });

  it('should render edit button when open', () => {
    render(
      <AlbumDetailDialog
        open={true}
        record={feedingRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText('编辑')).toBeInTheDocument();
  });

  it('should show note when record has a note', () => {
    render(
      <AlbumDetailDialog
        open={true}
        record={feedingRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText('宝宝吃得好')).toBeInTheDocument();
  });

  it('should render close button when open', () => {
    render(
      <AlbumDetailDialog
        open={true}
        record={feedingRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByLabelText('关闭')).toBeInTheDocument();
  });

  // ===== Multiple images navigation =====

  it('should show navigation arrows for multiple images', () => {
    render(
      <AlbumDetailDialog
        open={true}
        record={feedingRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByLabelText('上一张')).toBeInTheDocument();
    expect(screen.getByLabelText('下一张')).toBeInTheDocument();
  });

  it('should show counter for multiple images', () => {
    render(
      <AlbumDetailDialog
        open={true}
        record={feedingRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('should not show navigation arrows for single image', () => {
    const singleImageRecord: RecordItem = {
      ...feedingRecord,
      images: ['data:image/jpeg;base64,img1'],
    };
    render(
      <AlbumDetailDialog
        open={true}
        record={singleImageRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.queryByLabelText('上一张')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('下一张')).not.toBeInTheDocument();
  });

  // ===== Callbacks =====

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <AlbumDetailDialog
        open={true}
        record={feedingRecord}
        imageIndex={0}
        onClose={onClose}
        onEdit={() => {}}
      />
    );
    fireEvent.click(screen.getByLabelText('关闭'));
    expect(onClose).toHaveBeenCalled();
  });

  it('should call onEdit with the record when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(
      <AlbumDetailDialog
        open={true}
        record={feedingRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={onEdit}
      />
    );
    fireEvent.click(screen.getByText('编辑'));
    expect(onEdit).toHaveBeenCalledWith(feedingRecord);
  });

  // ===== Record type details =====

  it('should render feeding record details', () => {
    render(
      <AlbumDetailDialog
        open={true}
        record={feedingRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    // Feeding detail includes method label and amount
    expect(screen.getByText(/母乳/)).toBeInTheDocument();
    expect(screen.getByText(/80ml/)).toBeInTheDocument();
  });

  it('should render diaper record details', () => {
    const diaperRecord: RecordItem = {
      id: 'r2',
      babyId: 'b1',
      type: 'diaper',
      time: '2026-06-24T09:00:00.000Z',
      diaperType: 'poop',
      poopTexture: 'soft',
      poopColor: '黄色',
      images: ['data:image/jpeg;base64,img1'],
      createdAt: '2026-06-24T09:00:00.000Z',
      updatedAt: '2026-06-24T09:00:00.000Z',
    };
    render(
      <AlbumDetailDialog
        open={true}
        record={diaperRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText('尿布')).toBeInTheDocument();
    expect(screen.getByText(/排便/)).toBeInTheDocument();
    expect(screen.getByText(/软/)).toBeInTheDocument();
    expect(screen.getByText(/黄色/)).toBeInTheDocument();
  });

  it('should render growth record details', () => {
    const growthRecord: RecordItem = {
      id: 'r3',
      babyId: 'b1',
      type: 'growth',
      date: '2026-06-24',
      weight: 5.2,
      height: 58,
      images: ['data:image/jpeg;base64,img1'],
      createdAt: '2026-06-24T08:00:00.000Z',
      updatedAt: '2026-06-24T08:00:00.000Z',
    };
    render(
      <AlbumDetailDialog
        open={true}
        record={growthRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText('成长')).toBeInTheDocument();
    expect(screen.getByText(/5\.2/)).toBeInTheDocument();
    expect(screen.getByText(/58/)).toBeInTheDocument();
  });

  it('should render sleep record details', () => {
    const sleepRecord: RecordItem = {
      id: 'r4',
      babyId: 'b1',
      type: 'sleep',
      startTime: '2026-06-24T10:00:00.000Z',
      endTime: '2026-06-24T11:30:00.000Z',
      duration: 90,
      images: ['data:image/jpeg;base64,img1'],
      createdAt: '2026-06-24T10:00:00.000Z',
      updatedAt: '2026-06-24T10:00:00.000Z',
    };
    render(
      <AlbumDetailDialog
        open={true}
        record={sleepRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText('睡眠')).toBeInTheDocument();
  });

  it('should render jaundice record details', () => {
    const jaundiceRecord: RecordItem = {
      id: 'r5',
      babyId: 'b1',
      type: 'jaundice',
      time: '2026-06-24T09:00:00.000Z',
      value: 8.5,
      measureSite: 'forehead',
      images: ['data:image/jpeg;base64,img1'],
      createdAt: '2026-06-24T09:00:00.000Z',
      updatedAt: '2026-06-24T09:00:00.000Z',
    };
    render(
      <AlbumDetailDialog
        open={true}
        record={jaundiceRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText('黄疸')).toBeInTheDocument();
    expect(screen.getByText(/黄疸指数/)).toBeInTheDocument();
    expect(screen.getByText(/8\.5/)).toBeInTheDocument();
    expect(screen.getByText(/额头/)).toBeInTheDocument();
  });

  it('should render jaundice record with chest site', () => {
    const jaundiceRecord: RecordItem = {
      id: 'r6',
      babyId: 'b1',
      type: 'jaundice',
      time: '2026-06-24T09:00:00.000Z',
      value: 12.0,
      measureSite: 'chest',
      images: ['data:image/jpeg;base64,img1'],
      createdAt: '2026-06-24T09:00:00.000Z',
      updatedAt: '2026-06-24T09:00:00.000Z',
    };
    render(
      <AlbumDetailDialog
        open={true}
        record={jaundiceRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText(/胸前/)).toBeInTheDocument();
  });

  // ===== Jaundice warning badge =====

  it('should show "超标警告" badge for jaundice value > 12', () => {
    const jaundiceRecord: RecordItem = {
      id: 'r7',
      babyId: 'b1',
      type: 'jaundice',
      time: '2026-06-24T09:00:00.000Z',
      value: 15.0,
      measureSite: 'forehead',
      images: ['data:image/jpeg;base64,img1'],
      createdAt: '2026-06-24T09:00:00.000Z',
      updatedAt: '2026-06-24T09:00:00.000Z',
    };
    render(
      <AlbumDetailDialog
        open={true}
        record={jaundiceRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.getByText('超标警告')).toBeInTheDocument();
  });

  it('should include warning text in detail for jaundice value > 12', () => {
    const jaundiceRecord: RecordItem = {
      id: 'r8',
      babyId: 'b1',
      type: 'jaundice',
      time: '2026-06-24T09:00:00.000Z',
      value: 18.5,
      measureSite: 'chest',
      images: ['data:image/jpeg;base64,img1'],
      createdAt: '2026-06-24T09:00:00.000Z',
      updatedAt: '2026-06-24T09:00:00.000Z',
    };
    render(
      <AlbumDetailDialog
        open={true}
        record={jaundiceRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    // Detail text should contain "超标"
    expect(screen.getByText(/黄疸指数.*超标/)).toBeInTheDocument();
  });

  it('should not show "超标警告" badge for jaundice value equal to 12', () => {
    const jaundiceRecord: RecordItem = {
      id: 'r9',
      babyId: 'b1',
      type: 'jaundice',
      time: '2026-06-24T09:00:00.000Z',
      value: 12.0,
      measureSite: 'forehead',
      images: ['data:image/jpeg;base64,img1'],
      createdAt: '2026-06-24T09:00:00.000Z',
      updatedAt: '2026-06-24T09:00:00.000Z',
    };
    render(
      <AlbumDetailDialog
        open={true}
        record={jaundiceRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.queryByText('超标警告')).not.toBeInTheDocument();
  });

  it('should not show "超标警告" badge for jaundice value below 12', () => {
    const jaundiceRecord: RecordItem = {
      id: 'r10',
      babyId: 'b1',
      type: 'jaundice',
      time: '2026-06-24T09:00:00.000Z',
      value: 8.5,
      measureSite: 'forehead',
      images: ['data:image/jpeg;base64,img1'],
      createdAt: '2026-06-24T09:00:00.000Z',
      updatedAt: '2026-06-24T09:00:00.000Z',
    };
    render(
      <AlbumDetailDialog
        open={true}
        record={jaundiceRecord}
        imageIndex={0}
        onClose={() => {}}
        onEdit={() => {}}
      />
    );
    expect(screen.queryByText('超标警告')).not.toBeInTheDocument();
  });
});
