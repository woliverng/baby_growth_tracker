import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import NoteField from '@/components/common/NoteField';

// Mock compressImage for the embedded ImageUploader
vi.mock('@/lib/image', () => ({
  compressImage: vi.fn(() =>
    Promise.resolve('data:image/jpeg;base64,mockCompressedData')
  ),
}));

describe('NoteField', () => {
  it('should render a text field with label "备注"', () => {
    render(
      <NoteField
        value=""
        onChange={() => {}}
        images={[]}
        onImagesChange={() => {}}
      />
    );
    // MUI TextField renders the label text in multiple places (label + notched outline legend)
    expect(screen.getAllByText('备注').length).toBeGreaterThanOrEqual(1);
  });

  it('should render with placeholder text', () => {
    render(
      <NoteField
        value=""
        onChange={() => {}}
        images={[]}
        onImagesChange={() => {}}
      />
    );
    expect(
      screen.getByPlaceholderText('输入备注或点击麦克风语音输入')
    ).toBeInTheDocument();
  });

  it('should render the image uploader (file input)', () => {
    render(
      <NoteField
        value=""
        onChange={() => {}}
        images={[]}
        onImagesChange={() => {}}
      />
    );
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it('should display the current text value', () => {
    render(
      <NoteField
        value="已有的备注内容"
        onChange={() => {}}
        images={[]}
        onImagesChange={() => {}}
      />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue('已有的备注内容');
  });

  it('should call onChange when text is entered', () => {
    const onChange = vi.fn();
    render(
      <NoteField
        value=""
        onChange={onChange}
        images={[]}
        onImagesChange={() => {}}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: '测试备注' } });
    expect(onChange).toHaveBeenCalledWith('测试备注');
  });

  it('should display existing images as thumbnails', () => {
    const { container } = render(
      <NoteField
        value=""
        onChange={() => {}}
        images={['img1', 'img2']}
        onImagesChange={() => {}}
      />
    );
    const thumbnails = container.querySelectorAll('.image-thumbnail');
    expect(thumbnails).toHaveLength(2);
  });

  it('should call onImagesChange when an image is deleted', () => {
    const onImagesChange = vi.fn();
    render(
      <NoteField
        value=""
        onChange={() => {}}
        images={['img1', 'img2']}
        onImagesChange={onImagesChange}
      />
    );
    const deleteButtons = screen.getAllByLabelText('删除图片');
    fireEvent.click(deleteButtons[0]);
    expect(onImagesChange).toHaveBeenCalledWith(['img2']);
  });

  it('should render as a multiline text field', () => {
    render(
      <NoteField
        value=""
        onChange={() => {}}
        images={[]}
        onImagesChange={() => {}}
      />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
  });
});
