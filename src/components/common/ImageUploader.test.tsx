import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/render';

// Mock compressImage to avoid canvas dependencies in jsdom
vi.mock('@/lib/image', () => ({
  compressImage: vi.fn(() =>
    Promise.resolve('data:image/jpeg;base64,mockCompressedData')
  ),
}));

import ImageUploader from '@/components/common/ImageUploader';

describe('ImageUploader', () => {
  it('should render the hidden file input', () => {
    render(<ImageUploader images={[]} onChange={() => {}} />);
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it('should render upload button when no images', () => {
    const { container } = render(
      <ImageUploader images={[]} onChange={() => {}} maxImages={3} />
    );
    // The flex container should have 1 child (the upload area)
    const fileInput = container.querySelector('input[type="file"]');
    const topLevelBox = fileInput?.parentElement;
    const flexBox = topLevelBox?.lastElementChild;
    expect(flexBox?.children.length).toBe(1);
  });

  it('should display thumbnails for existing images', () => {
    const images = ['data:image/jpeg;base64,img1', 'data:image/jpeg;base64,img2'];
    const { container } = render(
      <ImageUploader images={images} onChange={() => {}} />
    );
    const thumbnails = container.querySelectorAll('.image-thumbnail');
    expect(thumbnails).toHaveLength(2);
  });

  it('should show upload button alongside thumbnails when under max', () => {
    const { container } = render(
      <ImageUploader images={['img1']} onChange={() => {}} maxImages={3} />
    );
    const thumbnails = container.querySelectorAll('.image-thumbnail');
    expect(thumbnails).toHaveLength(1);
    // flex container should have 2 children: 1 thumbnail + 1 upload area
    const flexContainer = thumbnails[0].parentElement;
    expect(flexContainer?.children.length).toBe(2);
  });

  it('should hide upload button when max images is reached', () => {
    const { container } = render(
      <ImageUploader images={['img1']} onChange={() => {}} maxImages={1} />
    );
    const thumbnails = container.querySelectorAll('.image-thumbnail');
    expect(thumbnails).toHaveLength(1);
    // flex container should have only 1 child (the thumbnail), no upload area
    const flexContainer = thumbnails[0].parentElement;
    expect(flexContainer?.children.length).toBe(1);
  });

  it('should hide upload button when default max (9) images are present', () => {
    const images = Array.from({ length: 9 }, (_, i) => `img${i}`);
    const { container } = render(
      <ImageUploader images={images} onChange={() => {}} />
    );
    const thumbnails = container.querySelectorAll('.image-thumbnail');
    expect(thumbnails).toHaveLength(9);
    const flexContainer = thumbnails[0].parentElement;
    // Only 9 thumbnails, no upload area
    expect(flexContainer?.children.length).toBe(9);
  });

  it('should call onChange with compressed images when file is selected', async () => {
    const onChange = vi.fn();
    render(<ImageUploader images={[]} onChange={onChange} maxImages={3} />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith([
        'data:image/jpeg;base64,mockCompressedData',
      ]);
    });
  });

  it('should append new images to existing ones', async () => {
    const onChange = vi.fn();
    render(
      <ImageUploader
        images={['existing1']}
        onChange={onChange}
        maxImages={3}
      />
    );

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith([
        'existing1',
        'data:image/jpeg;base64,mockCompressedData',
      ]);
    });
  });

  it('should call onChange without the deleted image when delete is clicked', () => {
    const onChange = vi.fn();
    const images = ['img1', 'img2', 'img3'];
    render(<ImageUploader images={images} onChange={onChange} />);

    const deleteButtons = screen.getAllByLabelText('删除图片');
    fireEvent.click(deleteButtons[0]); // Delete first image

    expect(onChange).toHaveBeenCalledWith(['img2', 'img3']);
  });

  it('should delete the correct image by index', () => {
    const onChange = vi.fn();
    const images = ['img1', 'img2', 'img3'];
    render(<ImageUploader images={images} onChange={onChange} />);

    const deleteButtons = screen.getAllByLabelText('删除图片');
    fireEvent.click(deleteButtons[1]); // Delete second image (index 1)

    expect(onChange).toHaveBeenCalledWith(['img1', 'img3']);
  });

  it('should reset file input value after selection', async () => {
    render(<ImageUploader images={[]} onChange={() => {}} maxImages={3} />);

    const input = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const file = new File(['dummy'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(input.value).toBe('');
    });
  });
});
