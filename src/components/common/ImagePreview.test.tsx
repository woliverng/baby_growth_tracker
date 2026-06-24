import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import ImagePreview from '@/components/common/ImagePreview';

describe('ImagePreview', () => {
  const multiImages = [
    'data:image/jpeg;base64,img1',
    'data:image/jpeg;base64,img2',
    'data:image/jpeg;base64,img3',
  ];

  // ===== Closed state =====

  it('should not render counter when open is false', () => {
    render(
      <ImagePreview
        open={false}
        images={multiImages}
        index={0}
        onClose={() => {}}
        onIndexChange={() => {}}
      />
    );
    expect(screen.queryByText(/1\s*\/\s*3/)).not.toBeInTheDocument();
  });

  it('should not render close button when open is false', () => {
    render(
      <ImagePreview
        open={false}
        images={multiImages}
        index={0}
        onClose={() => {}}
        onIndexChange={() => {}}
      />
    );
    expect(screen.queryByLabelText('关闭')).not.toBeInTheDocument();
  });

  // ===== Open state =====

  it('should render counter when open is true with multiple images', () => {
    render(
      <ImagePreview
        open={true}
        images={multiImages}
        index={0}
        onClose={() => {}}
        onIndexChange={() => {}}
      />
    );
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('should render close button when open is true', () => {
    render(
      <ImagePreview
        open={true}
        images={multiImages}
        index={0}
        onClose={() => {}}
        onIndexChange={() => {}}
      />
    );
    expect(screen.getByLabelText('关闭')).toBeInTheDocument();
  });

  it('should display correct counter for different index', () => {
    render(
      <ImagePreview
        open={true}
        images={multiImages}
        index={1}
        onClose={() => {}}
        onIndexChange={() => {}}
      />
    );
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  // ===== Navigation =====

  it('should render navigation arrows for multiple images', () => {
    render(
      <ImagePreview
        open={true}
        images={multiImages}
        index={0}
        onClose={() => {}}
        onIndexChange={() => {}}
      />
    );
    expect(screen.getByLabelText('上一张')).toBeInTheDocument();
    expect(screen.getByLabelText('下一张')).toBeInTheDocument();
  });

  it('should not render navigation arrows for single image', () => {
    render(
      <ImagePreview
        open={true}
        images={['img1']}
        index={0}
        onClose={() => {}}
        onIndexChange={() => {}}
      />
    );
    expect(screen.queryByLabelText('上一张')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('下一张')).not.toBeInTheDocument();
  });

  it('should not render counter for single image', () => {
    render(
      <ImagePreview
        open={true}
        images={['img1']}
        index={0}
        onClose={() => {}}
        onIndexChange={() => {}}
      />
    );
    expect(screen.queryByText(/\/\s*1/)).not.toBeInTheDocument();
  });

  // ===== Navigation callbacks =====

  it('should call onIndexChange with next index when next is clicked', () => {
    const onIndexChange = vi.fn();
    render(
      <ImagePreview
        open={true}
        images={multiImages}
        index={0}
        onClose={() => {}}
        onIndexChange={onIndexChange}
      />
    );
    fireEvent.click(screen.getByLabelText('下一张'));
    expect(onIndexChange).toHaveBeenCalledWith(1);
  });

  it('should call onIndexChange with prev index when prev is clicked', () => {
    const onIndexChange = vi.fn();
    render(
      <ImagePreview
        open={true}
        images={multiImages}
        index={1}
        onClose={() => {}}
        onIndexChange={onIndexChange}
      />
    );
    fireEvent.click(screen.getByLabelText('上一张'));
    expect(onIndexChange).toHaveBeenCalledWith(0);
  });

  it('should wrap to last image when prev is clicked on first image', () => {
    const onIndexChange = vi.fn();
    render(
      <ImagePreview
        open={true}
        images={multiImages}
        index={0}
        onClose={() => {}}
        onIndexChange={onIndexChange}
      />
    );
    fireEvent.click(screen.getByLabelText('上一张'));
    expect(onIndexChange).toHaveBeenCalledWith(2); // wrap to last
  });

  it('should wrap to first image when next is clicked on last image', () => {
    const onIndexChange = vi.fn();
    render(
      <ImagePreview
        open={true}
        images={multiImages}
        index={2}
        onClose={() => {}}
        onIndexChange={onIndexChange}
      />
    );
    fireEvent.click(screen.getByLabelText('下一张'));
    expect(onIndexChange).toHaveBeenCalledWith(0); // wrap to first
  });

  // ===== Close callback =====

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <ImagePreview
        open={true}
        images={multiImages}
        index={0}
        onClose={onClose}
        onIndexChange={() => {}}
      />
    );
    fireEvent.click(screen.getByLabelText('关闭'));
    expect(onClose).toHaveBeenCalled();
  });
});
