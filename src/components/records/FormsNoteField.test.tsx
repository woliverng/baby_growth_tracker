import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import FeedingForm from '@/components/records/FeedingForm';
import SleepForm from '@/components/records/SleepForm';
import DiaperForm from '@/components/records/DiaperForm';
import GrowthForm from '@/components/records/GrowthForm';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useRecordStore } from '@/store/useRecordStore';
import { useUIStore } from '@/store/useUIStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

// Mock compressImage for the embedded ImageUploader
vi.mock('@/lib/image', () => ({
  compressImage: vi.fn(() =>
    Promise.resolve('data:image/jpeg;base64,mockCompressedData')
  ),
}));

describe('Forms NoteField integration', () => {
  beforeEach(() => {
    resetAllStores();
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useSettingsStore.getState().setActiveBabyId(baby.id);
  });

  // ===== FeedingForm =====

  describe('FeedingForm', () => {
    it('should render NoteField with placeholder text', () => {
      render(<FeedingForm />);
      expect(
        screen.getByPlaceholderText('输入备注或点击麦克风语音输入')
      ).toBeInTheDocument();
    });

    it('should render image upload file input', () => {
      render(<FeedingForm />);
      expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    it('should not include images field when no images are added', () => {
      render(<FeedingForm />);
      fireEvent.click(screen.getByText('添加记录'));

      const record = useRecordStore.getState().records[0];
      expect(record.images).toBeUndefined();
    });

    it('should load existing images in edit mode', () => {
      const babyId = useSettingsStore.getState().activeBabyId!;
      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        images: ['data:image/jpeg;base64,existing-img'],
      });
      const record = useRecordStore.getState().records[0];

      useUIStore.getState().startEdit(record);

      const { container } = render(<FeedingForm />);
      const thumbnails = container.querySelectorAll('.image-thumbnail');
      expect(thumbnails.length).toBe(1);
    });

    it('should show save button text in edit mode', () => {
      const babyId = useSettingsStore.getState().activeBabyId!;
      const added = useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId,
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      });
      useUIStore.getState().startEdit(added);

      render(<FeedingForm />);
      expect(screen.getByText('保存修改')).toBeInTheDocument();
    });
  });

  // ===== DiaperForm =====

  describe('DiaperForm', () => {
    it('should render NoteField with placeholder text', () => {
      render(<DiaperForm />);
      expect(
        screen.getByPlaceholderText('输入备注或点击麦克风语音输入')
      ).toBeInTheDocument();
    });

    it('should render image upload file input', () => {
      render(<DiaperForm />);
      expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    it('should not include images field when no images are added', () => {
      render(<DiaperForm />);
      fireEvent.click(screen.getByText('添加记录'));

      const record = useRecordStore.getState().records[0];
      expect(record.images).toBeUndefined();
    });

    it('should load existing images in edit mode', () => {
      const babyId = useSettingsStore.getState().activeBabyId!;
      useRecordStore.getState().addRecord({
        type: 'diaper',
        babyId,
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'wet',
        images: ['data:image/jpeg;base64,diaper-img'],
      });
      const record = useRecordStore.getState().records[0];

      useUIStore.getState().startEdit(record);

      const { container } = render(<DiaperForm />);
      const thumbnails = container.querySelectorAll('.image-thumbnail');
      expect(thumbnails.length).toBe(1);
    });
  });

  // ===== GrowthForm =====

  describe('GrowthForm', () => {
    it('should render NoteField with placeholder text', () => {
      render(<GrowthForm />);
      expect(
        screen.getByPlaceholderText('输入备注或点击麦克风语音输入')
      ).toBeInTheDocument();
    });

    it('should render image upload file input', () => {
      render(<GrowthForm />);
      expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    it('should not include images field when no images are added', () => {
      render(<GrowthForm />);
      // Enter weight to enable submit
      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[0], { target: { value: '5.2' } });

      fireEvent.click(screen.getByText('添加记录'));

      const record = useRecordStore.getState().records[0];
      expect(record.images).toBeUndefined();
    });

    it('should load existing images in edit mode', () => {
      const babyId = useSettingsStore.getState().activeBabyId!;
      useRecordStore.getState().addRecord({
        type: 'growth',
        babyId,
        date: '2026-06-24',
        weight: 5.2,
        images: ['data:image/jpeg;base64,growth-img'],
      });
      const record = useRecordStore.getState().records[0];

      useUIStore.getState().startEdit(record);

      const { container } = render(<GrowthForm />);
      const thumbnails = container.querySelectorAll('.image-thumbnail');
      expect(thumbnails.length).toBe(1);
    });
  });

  // ===== SleepForm =====

  describe('SleepForm', () => {
    it('should render NoteField with placeholder text', () => {
      render(<SleepForm />);
      expect(
        screen.getByPlaceholderText('输入备注或点击麦克风语音输入')
      ).toBeInTheDocument();
    });

    it('should render image upload file input', () => {
      render(<SleepForm />);
      expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
    });

    it('should not include images field when no images are added', () => {
      render(<SleepForm />);
      fireEvent.click(screen.getByText('添加记录'));

      const record = useRecordStore.getState().records[0];
      expect(record.images).toBeUndefined();
    });

    it('should load existing images in edit mode', () => {
      const babyId = useSettingsStore.getState().activeBabyId!;
      useRecordStore.getState().addRecord({
        type: 'sleep',
        babyId,
        startTime: '2026-06-24T10:00:00.000Z',
        endTime: '2026-06-24T11:00:00.000Z',
        duration: 60,
        images: ['data:image/jpeg;base64,sleep-img'],
      });
      const record = useRecordStore.getState().records[0];

      useUIStore.getState().startEdit(record);

      const { container } = render(<SleepForm />);
      const thumbnails = container.querySelectorAll('.image-thumbnail');
      expect(thumbnails.length).toBe(1);
    });
  });
});
