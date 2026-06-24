import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import QuickRecordSheet from '@/components/common/QuickRecordSheet';
import { useUIStore } from '@/store/useUIStore';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('QuickRecordSheet', () => {
  beforeEach(() => {
    resetAllStores();
    // Set up a baby for form submission tests
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useSettingsStore.getState().setActiveBabyId(baby.id);
  });

  describe('when closed', () => {
    it('should not be visible when quickRecordOpen is false', () => {
      render(<QuickRecordSheet />);
      // The Drawer should not have content visible
      expect(screen.queryByText('快速记录')).not.toBeInTheDocument();
    });
  });

  describe('when open without type', () => {
    beforeEach(() => {
      useUIStore.getState().openQuickRecord();
    });

    it('should show "快速记录" title', () => {
      render(<QuickRecordSheet />);
      expect(screen.getByText('快速记录')).toBeInTheDocument();
    });

    it('should show 5 record type options', () => {
      render(<QuickRecordSheet />);
      // The type selection grid shows the record type labels
      expect(screen.getAllByText('喂养').length).toBeGreaterThan(0);
      expect(screen.getAllByText('睡眠').length).toBeGreaterThan(0);
      expect(screen.getAllByText('尿布').length).toBeGreaterThan(0);
      expect(screen.getAllByText('成长').length).toBeGreaterThan(0);
      expect(screen.getAllByText('黄疸').length).toBeGreaterThan(0);
    });

    it('should switch to feeding form when clicking 喂养', () => {
      render(<QuickRecordSheet />);
      // Click on the 喂养 option (it should be a clickable element)
      const feedingOption = screen.getAllByText('喂养')[0];
      fireEvent.click(feedingOption);

      // After clicking, the title should change to "喂养" and form should appear
      // The FeedingForm should have "喂养时间" label and "添加记录" button
      expect(screen.getByText('添加记录')).toBeInTheDocument();
    });

    it('should switch to sleep form when clicking 睡眠', () => {
      render(<QuickRecordSheet />);
      fireEvent.click(screen.getAllByText('睡眠')[0]);
      // SleepForm has "入睡时间" and "开始睡眠" button
      expect(screen.getByText('开始睡眠')).toBeInTheDocument();
    });

    it('should switch to diaper form when clicking 尿布', () => {
      render(<QuickRecordSheet />);
      fireEvent.click(screen.getAllByText('尿布')[0]);
      // DiaperForm has "更换时间" label
      expect(screen.getByText('添加记录')).toBeInTheDocument();
    });

    it('should switch to growth form when clicking 成长', () => {
      render(<QuickRecordSheet />);
      fireEvent.click(screen.getAllByText('成长')[0]);
      // GrowthForm has "测量日期" label
      expect(screen.getByText('添加记录')).toBeInTheDocument();
    });

    it('should switch to jaundice form when clicking 黄疸', () => {
      render(<QuickRecordSheet />);
      fireEvent.click(screen.getAllByText('黄疸')[0]);
      // JaundiceForm has "添加记录" button and jaundice index label
      expect(screen.getByText('添加记录')).toBeInTheDocument();
      expect(screen.getByText('黄疸指数 (mg/dL)')).toBeInTheDocument();
    });
  });

  describe('when open with type', () => {
    it('should show feeding form when opened with feeding type', () => {
      useUIStore.getState().openQuickRecord('feeding');
      render(<QuickRecordSheet />);
      expect(screen.getByText('喂养')).toBeInTheDocument();
      expect(screen.getByText('添加记录')).toBeInTheDocument();
    });

    it('should show sleep form when opened with sleep type', () => {
      useUIStore.getState().openQuickRecord('sleep');
      render(<QuickRecordSheet />);
      expect(screen.getByText('睡眠')).toBeInTheDocument();
      expect(screen.getByText('开始睡眠')).toBeInTheDocument();
    });

    it('should show diaper form when opened with diaper type', () => {
      useUIStore.getState().openQuickRecord('diaper');
      render(<QuickRecordSheet />);
      expect(screen.getByText('尿布')).toBeInTheDocument();
      expect(screen.getByText('添加记录')).toBeInTheDocument();
    });

    it('should show growth form when opened with growth type', () => {
      useUIStore.getState().openQuickRecord('growth');
      render(<QuickRecordSheet />);
      expect(screen.getByText('成长')).toBeInTheDocument();
      expect(screen.getByText('添加记录')).toBeInTheDocument();
    });

    it('should show jaundice form when opened with jaundice type', () => {
      useUIStore.getState().openQuickRecord('jaundice');
      render(<QuickRecordSheet />);
      expect(screen.getByText('黄疸')).toBeInTheDocument();
      expect(screen.getByText('添加记录')).toBeInTheDocument();
      expect(screen.getByText('黄疸指数 (mg/dL)')).toBeInTheDocument();
    });
  });

  describe('close behavior', () => {
    it('should close when close button is clicked', () => {
      useUIStore.getState().openQuickRecord();
      render(<QuickRecordSheet />);

      // Find and click the close button (has CloseIcon)
      // The close button is the IconButton with CloseIcon
      // Let's click it
      const allButtons = screen.getAllByRole('button');
      // The first button should be the close button
      fireEvent.click(allButtons[0]);

      expect(useUIStore.getState().quickRecordOpen).toBe(false);
    });
  });
});
