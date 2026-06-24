import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/render';
import App from '@/App';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useRecordStore } from '@/store/useRecordStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('Album route and navigation', () => {
  beforeEach(() => {
    resetAllStores();
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useSettingsStore.getState().setActiveBabyId(baby.id);
  });

  // ===== /album route =====

  it('should render album page at /album route', () => {
    render(<App />, { initialEntries: ['/album'] });
    // "相册" appears as both the page title and the bottom nav tab label
    expect(screen.getAllByText('相册').length).toBeGreaterThanOrEqual(1);
  });

  it('should show empty state on album page when no images exist', () => {
    render(<App />, { initialEntries: ['/album'] });
    expect(screen.getByText('还没有照片')).toBeInTheDocument();
  });

  it('should render album page with filter tabs at /album route', () => {
    render(<App />, { initialEntries: ['/album'] });
    expect(screen.getByText('全部')).toBeInTheDocument();
    expect(screen.getByText('喂养')).toBeInTheDocument();
    expect(screen.getByText('睡眠')).toBeInTheDocument();
    expect(screen.getByText('尿布')).toBeInTheDocument();
    // "成长" appears in both the filter tabs and the bottom navigation
    expect(screen.getAllByText('成长').length).toBeGreaterThanOrEqual(2);
  });

  // ===== BottomNav with 5 tabs =====

  it('should show all 5 navigation tabs including album', () => {
    render(<App />, { initialEntries: ['/'] });
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('记录')).toBeInTheDocument();
    expect(screen.getByText('相册')).toBeInTheDocument();
    expect(screen.getByText('成长')).toBeInTheDocument();
    expect(screen.getByText('更多')).toBeInTheDocument();
  });

  it('should show album tab in bottom navigation on home route', () => {
    render(<App />, { initialEntries: ['/'] });
    expect(screen.getByText('相册')).toBeInTheDocument();
  });

  it('should show album tab in bottom navigation on records route', () => {
    render(<App />, { initialEntries: ['/records'] });
    expect(screen.getByText('相册')).toBeInTheDocument();
  });

  it('should show album tab in bottom navigation on album route', () => {
    render(<App />, { initialEntries: ['/album'] });
    // Album page title and nav tab both say "相册"
    // There should be at least 2 occurrences
    expect(screen.getAllByText('相册').length).toBeGreaterThanOrEqual(2);
  });

  // ===== Album page with data =====

  it('should display images on album page when records have images', () => {
    const babyId = useSettingsStore.getState().activeBabyId!;
    useRecordStore.getState().addRecord({
      type: 'feeding',
      babyId,
      time: '2026-06-24T08:00:00.000Z',
      feedingMethod: 'breast',
      images: ['data:image/jpeg;base64,img1'],
    });

    const { container } = render(<App />, { initialEntries: ['/album'] });
    expect(container.querySelectorAll('img').length).toBeGreaterThan(0);
  });
});
