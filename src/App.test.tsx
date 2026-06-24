import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/render';
import App from '@/App';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('App routing', () => {
  beforeEach(() => {
    resetAllStores();
  });

  describe('without babies', () => {
    it('should show onboarding dialog when no babies exist', () => {
      render(<App />, { initialEntries: ['/'] });
      expect(screen.getByText('欢迎使用宝宝成长记录 🎉')).toBeInTheDocument();
    });

    it('should show top bar with "请创建宝宝档案" when no babies', () => {
      render(<App />, { initialEntries: ['/'] });
      expect(screen.getByText('请创建宝宝档案')).toBeInTheDocument();
    });

    it('should show empty state on home page when no babies', () => {
      render(<App />, { initialEntries: ['/'] });
      expect(screen.getByText('还没有宝宝档案')).toBeInTheDocument();
    });
  });

  describe('with a baby', () => {
    beforeEach(() => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useSettingsStore.getState().setActiveBabyId(baby.id);
    });

    it('should render the home page at root route', () => {
      render(<App />, { initialEntries: ['/'] });
      // With a baby, the home page should have quick record buttons
      expect(screen.getByText('喂奶')).toBeInTheDocument();
    });

    it('should render the records page at /records', () => {
      render(<App />, { initialEntries: ['/records'] });
      expect(screen.getByText('记录列表')).toBeInTheDocument();
    });

    it('should render the growth page at /growth', () => {
      render(<App />, { initialEntries: ['/growth'] });
      expect(screen.getByText('成长曲线')).toBeInTheDocument();
    });

    it('should render the settings page at /settings', () => {
      render(<App />, { initialEntries: ['/settings'] });
      expect(screen.getByText('宝宝档案')).toBeInTheDocument();
    });
  });

  it('should render bottom navigation on all routes', () => {
    render(<App />, { initialEntries: ['/'] });
    // BottomNav should have navigation items
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('记录')).toBeInTheDocument();
    expect(screen.getByText('成长')).toBeInTheDocument();
    expect(screen.getByText('更多')).toBeInTheDocument();
  });
});
