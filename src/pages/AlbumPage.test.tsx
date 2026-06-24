import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from '@/test/render';
import AlbumPage from '@/pages/AlbumPage';
import { useBabyStore } from '@/store/useBabyStore';
import { useRecordStore } from '@/store/useRecordStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useUIStore } from '@/store/useUIStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('AlbumPage', () => {
  beforeEach(() => {
    resetAllStores();
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useSettingsStore.getState().setActiveBabyId(baby.id);
  });

  // ===== Layout =====

  it('should render page title "相册"', () => {
    render(<AlbumPage />);
    expect(screen.getByText('相册')).toBeInTheDocument();
  });

  it('should render filter tabs', () => {
    render(<AlbumPage />);
    expect(screen.getByText('全部')).toBeInTheDocument();
    expect(screen.getByText('喂养')).toBeInTheDocument();
    expect(screen.getByText('睡眠')).toBeInTheDocument();
    expect(screen.getByText('尿布')).toBeInTheDocument();
    expect(screen.getByText('成长')).toBeInTheDocument();
  });

  // ===== Empty state =====

  it('should show empty state when no records have images', () => {
    render(<AlbumPage />);
    expect(screen.getByText('还没有照片')).toBeInTheDocument();
  });

  it('should show empty state subtitle', () => {
    render(<AlbumPage />);
    expect(
      screen.getByText('在记录中添加图片后，会自动显示在这里')
    ).toBeInTheDocument();
  });

  it('should not show images when records have no images', () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
    });

    const { container } = render(<AlbumPage />);
    // No img elements should be present (empty state icon is SVG, not img)
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });

  // ===== With images =====

  it('should display images when records have images', () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,img1'],
    });

    const { container } = render(<AlbumPage />);
    expect(container.querySelectorAll('img').length).toBeGreaterThan(0);
  });

  it('should display date group label', () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,img1'],
    });

    render(<AlbumPage />);
    // The date label should be formatted as "M月D日"
    expect(screen.getByText('6月24日')).toBeInTheDocument();
  });

  it('should display multiple images from same record', () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: [
        'data:image/jpeg;base64,img1',
        'data:image/jpeg;base64,img2',
        'data:image/jpeg;base64,img3',
      ],
    });

    const { container } = render(<AlbumPage />);
    expect(container.querySelectorAll('img')).toHaveLength(3);
  });

  // ===== Type filtering =====

  it('should show all images by default', () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,feeding-img'],
    });
    useRecordStore.getState().addRecord({
      type: 'sleep',
      babyId,
      startTime: '2026-06-24T10:00:00.000Z',
      endTime: '2026-06-24T11:00:00.000Z',
      duration: 60,
      images: ['data:image/jpeg;base64,sleep-img'],
    });

    const { container } = render(<AlbumPage />);
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('should filter to feeding type when 喂养 tab is clicked', () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,feeding-img'],
    });
    useRecordStore.getState().addRecord({
      type: 'sleep',
      babyId,
      startTime: '2026-06-24T10:00:00.000Z',
      endTime: '2026-06-24T11:00:00.000Z',
      duration: 60,
      images: ['data:image/jpeg;base64,sleep-img'],
    });

    const { container } = render(<AlbumPage />);
    // Initially 2 images
    expect(container.querySelectorAll('img')).toHaveLength(2);

    // Click 喂养 tab
    fireEvent.click(screen.getByText('喂养'));
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });

  it('should filter to sleep type when 睡眠 tab is clicked', () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,feeding-img'],
    });
    useRecordStore.getState().addRecord({
      type: 'sleep',
      babyId,
      startTime: '2026-06-24T10:00:00.000Z',
      endTime: '2026-06-24T11:00:00.000Z',
      duration: 60,
      images: ['data:image/jpeg;base64,sleep-img'],
    });

    const { container } = render(<AlbumPage />);
    fireEvent.click(screen.getByText('睡眠'));
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });

  it('should show all images again when 全部 tab is clicked', () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,feeding-img'],
    });
    useRecordStore.getState().addRecord({
      type: 'sleep',
      babyId,
      startTime: '2026-06-24T10:00:00.000Z',
      endTime: '2026-06-24T11:00:00.000Z',
      duration: 60,
      images: ['data:image/jpeg;base64,sleep-img'],
    });

    const { container } = render(<AlbumPage />);
    // Filter to feeding
    fireEvent.click(screen.getByText('喂养'));
    expect(container.querySelectorAll('img')).toHaveLength(1);
    // Back to all
    fireEvent.click(screen.getByText('全部'));
    expect(container.querySelectorAll('img')).toHaveLength(2);
  });

  it('should show empty state when filter has no matching images', () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,feeding-img'],
    });

    render(<AlbumPage />);
    // Filter to sleep which has no images
    fireEvent.click(screen.getByText('睡眠'));
    expect(screen.getByText('还没有照片')).toBeInTheDocument();
  });

  // ===== Detail dialog =====

  it('should open detail dialog when an image is clicked', async () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,img1'],
    });

    const { container } = render(<AlbumPage />);
    const imgs = container.querySelectorAll('img');
    fireEvent.click(imgs[0]);

    await waitFor(() => {
      expect(screen.getByText('编辑')).toBeInTheDocument();
    });
  });

  it('should call startEdit when edit button in dialog is clicked', async () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    const addedRecord = useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,img1'],
    });

    const { container } = render(<AlbumPage />);
    const imgs = container.querySelectorAll('img');
    fireEvent.click(imgs[0]);

    await waitFor(() => {
      expect(screen.getByText('编辑')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('编辑'));

    // startEdit should have been called
    expect(useUIStore.getState().editingRecord?.id).toBe(addedRecord.id);
  });

  // ===== Baby isolation =====

  it('should only show images for the active baby', () => {
    // Add a second baby
    const baby2 = useBabyStore.getState().addBaby({
      ...sampleBabyInput,
      name: '第二个宝宝',
    });

    // Add image for baby 1
    const baby1Id = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId: baby1Id,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,baby1-img'],
    });

    // Add image for baby 2
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId: baby2.id,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,baby2-img'],
    });

    const { container } = render(<AlbumPage />);
    // Only baby 1's image should be shown
    expect(container.querySelectorAll('img')).toHaveLength(1);
  });
});
