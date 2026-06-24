import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/render';
import BabyAvatar from '@/components/common/BabyAvatar';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { compressImage } from '@/lib/image';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

// Mock compressImage — Canvas API is not available in jsdom
vi.mock('@/lib/image', () => ({
  compressImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,mockAvatar'),
  getBase64SizeKB: vi.fn().mockReturnValue(50),
  getStorageInfo: vi.fn().mockReturnValue({
    used: 0,
    total: 5242880,
    percent: 0,
    imageCount: 0,
  }),
  checkStorageCapacity: vi.fn().mockReturnValue(true),
}));

describe('BabyAvatar', () => {
  beforeEach(() => {
    resetAllStores();
    vi.mocked(compressImage).mockClear();
  });

  // ===== Default rendering =====

  describe('default rendering', () => {
    it('should render giraffe icon (SVG) when no custom avatar', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useSettingsStore.getState().setActiveBabyId(baby.id);

      const { container } = render(<BabyAvatar size={40} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
      expect(container.querySelector('img')).not.toBeInTheDocument();
    });

    it('should render custom avatar image when avatar is set', () => {
      const baby = useBabyStore.getState().addBaby({
        ...sampleBabyInput,
        avatar: 'data:image/jpeg;base64,customAvatar',
      });
      useSettingsStore.getState().setActiveBabyId(baby.id);

      const { container } = render(<BabyAvatar size={40} />);
      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute('src', 'data:image/jpeg;base64,customAvatar');
      expect(img).toHaveAttribute('alt', '宝宝头像');
    });

    it('should have aria-label "更换宝宝头像" when editable with active baby', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useSettingsStore.getState().setActiveBabyId(baby.id);

      render(<BabyAvatar size={40} />);
      expect(screen.getByLabelText('更换宝宝头像')).toBeInTheDocument();
    });

    it('should pass proportional size to giraffe icon', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useSettingsStore.getState().setActiveBabyId(baby.id);

      const { container } = render(<BabyAvatar size={56} />);
      // GiraffeIcon receives Math.round(size * 0.7) = 39 for size=56
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '39');
      expect(svg).toHaveAttribute('height', '39');
    });
  });

  // ===== No baby state =====

  describe('no baby state', () => {
    it('should not be clickable when no baby exists', () => {
      render(<BabyAvatar size={40} />);
      expect(screen.queryByLabelText('更换宝宝头像')).not.toBeInTheDocument();
    });

    it('should still render giraffe icon when no baby exists', () => {
      const { container } = render(<BabyAvatar size={40} />);
      expect(container.querySelector('svg')).toBeInTheDocument();
    });
  });

  // ===== Menu interaction =====

  describe('menu interaction', () => {
    beforeEach(() => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useSettingsStore.getState().setActiveBabyId(baby.id);
    });

    it('should open menu with "拍照" and "从相册选择" options on click', async () => {
      render(<BabyAvatar size={40} />);
      fireEvent.click(screen.getByLabelText('更换宝宝头像'));

      expect(await screen.findByText('拍照')).toBeInTheDocument();
      expect(screen.getByText('从相册选择')).toBeInTheDocument();
    });

    it('should not show "删除头像" option when no custom avatar', async () => {
      render(<BabyAvatar size={40} />);
      fireEvent.click(screen.getByLabelText('更换宝宝头像'));

      expect(await screen.findByText('拍照')).toBeInTheDocument();
      expect(screen.queryByText('删除头像')).not.toBeInTheDocument();
    });

    it('should show "删除头像" option when custom avatar is set', async () => {
      const baby = useBabyStore.getState().babies[0];
      useBabyStore.getState().updateBaby(baby.id, {
        avatar: 'data:image/jpeg;base64,custom',
      });

      render(<BabyAvatar size={40} />);
      fireEvent.click(screen.getByLabelText('更换宝宝头像'));

      expect(await screen.findByText('删除头像')).toBeInTheDocument();
    });

    it('should remove avatar when "删除头像" is clicked', async () => {
      const baby = useBabyStore.getState().babies[0];
      useBabyStore.getState().updateBaby(baby.id, {
        avatar: 'data:image/jpeg;base64,custom',
      });

      render(<BabyAvatar size={40} />);
      fireEvent.click(screen.getByLabelText('更换宝宝头像'));

      const deleteItem = await screen.findByText('删除头像');
      fireEvent.click(deleteItem);

      const updatedBaby = useBabyStore
        .getState()
        .babies.find((b) => b.id === baby.id);
      expect(updatedBaby?.avatar).toBeUndefined();
    });

    it('should close menu after clicking "拍照"', async () => {
      render(<BabyAvatar size={40} />);
      fireEvent.click(screen.getByLabelText('更换宝宝头像'));

      const cameraItem = await screen.findByText('拍照');
      fireEvent.click(cameraItem);

      // Menu should close — the "拍照" text should no longer be in the menu
      await waitFor(() => {
        expect(screen.queryByText('从相册选择')).not.toBeInTheDocument();
      });
    });
  });

  // ===== Non-editable mode =====

  describe('non-editable mode', () => {
    it('should not open menu when editable is false', () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useSettingsStore.getState().setActiveBabyId(baby.id);

      render(<BabyAvatar size={40} editable={false} />);
      expect(screen.queryByLabelText('更换宝宝头像')).not.toBeInTheDocument();
    });
  });

  // ===== File upload flow =====

  describe('file upload', () => {
    it('should compress and store avatar when a file is selected', async () => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useSettingsStore.getState().setActiveBabyId(baby.id);

      const { container } = render(<BabyAvatar size={40} />);

      // Two hidden file inputs: camera and gallery
      const inputs = container.querySelectorAll('input[type="file"]');
      expect(inputs.length).toBe(2);

      const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
      fireEvent.change(inputs[1], { target: { files: [file] } });

      await waitFor(() => {
        expect(vi.mocked(compressImage)).toHaveBeenCalledWith(
          file,
          expect.objectContaining({
            maxWidth: 256,
            maxHeight: 256,
            quality: 0.8,
            maxSizeKB: 100,
          })
        );
      });

      const updatedBaby = useBabyStore
        .getState()
        .babies.find((b) => b.id === baby.id);
      expect(updatedBaby?.avatar).toBe('data:image/jpeg;base64,mockAvatar');
    });

    it('should not call compressImage when no file is selected', async () => {
      useBabyStore.getState().addBaby(sampleBabyInput);
      const baby = useBabyStore.getState().babies[0];
      useSettingsStore.getState().setActiveBabyId(baby.id);

      const { container } = render(<BabyAvatar size={40} />);
      const inputs = container.querySelectorAll('input[type="file"]');

      // Fire change with no files
      fireEvent.change(inputs[0], { target: { files: [] } });

      await waitFor(() => {
        expect(vi.mocked(compressImage)).not.toHaveBeenCalled();
      });
    });
  });
});
