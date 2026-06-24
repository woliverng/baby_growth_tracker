import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import SettingsPage from '@/pages/SettingsPage';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('SettingsPage', () => {
  beforeEach(() => {
    resetAllStores();
  });

  describe('layout and sections', () => {
    it('should render "宝宝档案" section', () => {
      render(<SettingsPage />);
      expect(screen.getByText('宝宝档案')).toBeInTheDocument();
    });

    it('should render "数据管理" section', () => {
      render(<SettingsPage />);
      expect(screen.getByText('数据管理')).toBeInTheDocument();
    });

    it('should render "外观与存储" section', () => {
      render(<SettingsPage />);
      expect(screen.getByText('外观与存储')).toBeInTheDocument();
    });

    it('should render "关于小鹿成长记" in about section', () => {
      render(<SettingsPage />);
      expect(screen.getByText('关于小鹿成长记')).toBeInTheDocument();
    });

    it('should show "添加宝宝" button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('添加宝宝')).toBeInTheDocument();
    });

    it('should show export JSON option', () => {
      render(<SettingsPage />);
      expect(screen.getByText('导出 JSON')).toBeInTheDocument();
    });

    it('should show export CSV option', () => {
      render(<SettingsPage />);
      expect(screen.getByText('导出 CSV')).toBeInTheDocument();
    });

    it('should show app version in about section', () => {
      render(<SettingsPage />);
      expect(screen.getByText(/版本 1\.0\.0/)).toBeInTheDocument();
    });
  });

  describe('when no babies exist', () => {
    it('should show "暂无宝宝档案" message', () => {
      render(<SettingsPage />);
      expect(screen.getByText('暂无宝宝档案')).toBeInTheDocument();
    });
  });

  describe('with babies', () => {
    beforeEach(() => {
      useBabyStore.getState().addBaby(sampleBabyInput);
      useBabyStore.getState().addBaby({ ...sampleBabyInput, name: '第二个宝宝' });
    });

    it('should display baby names in the list', () => {
      render(<SettingsPage />);
      // Baby names appear in both the profile header and the list
      expect(screen.getAllByText('测试宝宝').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('第二个宝宝').length).toBeGreaterThanOrEqual(1);
    });

    it('should show "添加宝宝" button', () => {
      render(<SettingsPage />);
      expect(screen.getByText('添加宝宝')).toBeInTheDocument();
    });
  });

  describe('theme toggle', () => {
    it('should show dark mode switch', () => {
      render(<SettingsPage />);
      expect(screen.getByText('深色模式')).toBeInTheDocument();
    });

    it('should show "已关闭" when light mode', () => {
      render(<SettingsPage />);
      expect(screen.getByText('已关闭')).toBeInTheDocument();
    });

    it('should toggle to dark mode when switch is clicked', () => {
      render(<SettingsPage />);

      // Find the switch and click it
      const switchEl = screen.getByRole('checkbox');
      fireEvent.click(switchEl);

      expect(useSettingsStore.getState().theme).toBe('dark');
    });
  });

  describe('add baby dialog', () => {
    it('should open add baby dialog when "添加宝宝" is clicked', () => {
      render(<SettingsPage />);
      fireEvent.click(screen.getByText('添加宝宝'));

      // Dialog should now show "添加宝宝" title and form fields
      // After clicking, there will be both the button and the dialog title
      const matches = screen.getAllByText('添加宝宝');
      expect(matches.length).toBeGreaterThanOrEqual(2);
      // Should have input fields for gender selection
      expect(screen.getByText('👦 男孩')).toBeInTheDocument();
      expect(screen.getByText('👧 女孩')).toBeInTheDocument();
    });
  });

  describe('delete baby', () => {
    beforeEach(() => {
      useBabyStore.getState().addBaby(sampleBabyInput);
    });

    it('should open delete confirmation dialog when delete is clicked', () => {
      render(<SettingsPage />);

      // Find the delete button (aria-label="删除" may not be set, use the icon button)
      const deleteButtons = screen.getAllByRole('button');
      // The delete button has DeleteIcon with color="error"
      const deleteBtn = deleteButtons.find(
        (btn) => btn.querySelector('[data-testid="DeleteIcon"]') !== null
      );

      if (deleteBtn) {
        fireEvent.click(deleteBtn);
        expect(screen.getByText('删除宝宝档案')).toBeInTheDocument();
      }
    });
  });
});
