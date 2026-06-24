import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import AlbumGrid from '@/components/album/AlbumGrid';
import type { AlbumGroup, RecordItem } from '@/types';

describe('AlbumGrid', () => {
  const record: RecordItem = {
    id: 'r1',
    babyId: 'b1',
    type: 'feeding',
    time: '2026-06-24T08:00:00.000Z',
    feedingMethod: 'breast',
    images: [
      'data:image/jpeg;base64,img1',
      'data:image/jpeg;base64,img2',
    ],
    createdAt: '2026-06-24T08:00:00.000Z',
    updatedAt: '2026-06-24T08:00:00.000Z',
  };

  const group: AlbumGroup = {
    date: '2026-06-24',
    label: '6月24日',
    items: [
      {
        record,
        imageIndex: 0,
        imageSrc: 'data:image/jpeg;base64,img1',
      },
      {
        record,
        imageIndex: 1,
        imageSrc: 'data:image/jpeg;base64,img2',
      },
    ],
  };

  it('should render the group date label', () => {
    render(<AlbumGrid group={group} onItemClick={() => {}} />);
    expect(screen.getByText('6月24日')).toBeInTheDocument();
  });

  it('should render all images in the group', () => {
    const { container } = render(
      <AlbumGrid group={group} onItemClick={() => {}} />
    );
    const imgs = container.querySelectorAll('img');
    expect(imgs).toHaveLength(2);
  });

  it('should call onItemClick with record and imageIndex when an image is clicked', () => {
    const onItemClick = vi.fn();
    const { container } = render(
      <AlbumGrid group={group} onItemClick={onItemClick} />
    );
    const imgs = container.querySelectorAll('img');
    fireEvent.click(imgs[0]);
    expect(onItemClick).toHaveBeenCalledWith(record, 0);
  });

  it('should call onItemClick with correct index for second image', () => {
    const onItemClick = vi.fn();
    const { container } = render(
      <AlbumGrid group={group} onItemClick={onItemClick} />
    );
    const imgs = container.querySelectorAll('img');
    fireEvent.click(imgs[1]);
    expect(onItemClick).toHaveBeenCalledWith(record, 1);
  });

  it('should render an empty group without errors', () => {
    const emptyGroup: AlbumGroup = {
      date: '2026-06-25',
      label: '6月25日',
      items: [],
    };
    const { container } = render(
      <AlbumGrid group={emptyGroup} onItemClick={() => {}} />
    );
    expect(screen.getByText('6月25日')).toBeInTheDocument();
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  it('should render a single item group', () => {
    const singleGroup: AlbumGroup = {
      date: '2026-06-24',
      label: '6月24日',
      items: [
        {
          record,
          imageIndex: 0,
          imageSrc: 'data:image/jpeg;base64,img1',
        },
      ],
    };
    const { container } = render(
      <AlbumGrid group={singleGroup} onItemClick={() => {}} />
    );
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });
});
