import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import HomePage from '@/pages/HomePage';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useRecordStore } from '@/store/useRecordStore';
import { useUIStore } from '@/store/useUIStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('HomePage', () => {
  beforeEach(() => {
    resetAllStores();
  });

  describe('when no baby exists', () => {
    it('should show empty state message', () => {
      render(<HomePage />);
      expect(screen.getByText('还没有宝宝档案')).toBeInTheDocument();
    });

    it('should show "去设置" action button', () => {
      render(<HomePage />);
      expect(screen.getByText('去设置')).toBeInTheDocument();
    });

    it('should not render inline FAB when no baby exists', () => {
      render(<HomePage />);
      expect(screen.queryByLabelText('快速记录')).not.toBeInTheDocument();
    });
  });

  describe('when baby exists', () => {
    beforeEach(() => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useSettingsStore.getState().setActiveBabyId(baby.id);
    });

    it('should render quick record buttons', () => {
      render(<HomePage />);
      expect(screen.getByText('喂奶')).toBeInTheDocument();
      expect(screen.getByText('睡眠')).toBeInTheDocument();
      expect(screen.getByText('尿布')).toBeInTheDocument();
      expect(screen.getByText('量体')).toBeInTheDocument();
    });

    it('should render summary cards', () => {
      render(<HomePage />);
      expect(screen.getByText('今日喂养')).toBeInTheDocument();
      expect(screen.getByText('今日睡眠')).toBeInTheDocument();
      expect(screen.getByText('今日尿布')).toBeInTheDocument();
    });

    it('should render recent records section', () => {
      render(<HomePage />);
      expect(screen.getByText('最近记录')).toBeInTheDocument();
    });

    it('should show empty state for recent records when no records exist', () => {
      render(<HomePage />);
      expect(screen.getByText('还没有记录')).toBeInTheDocument();
    });

    it('should show zero counts initially', () => {
      render(<HomePage />);
      // Feeding count (0) and diaper count (0) are displayed in summary cards
      const zeros = screen.getAllByText('0');
      expect(zeros.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('with records', () => {
    beforeEach(() => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useSettingsStore.getState().setActiveBabyId(baby.id);

      // Add today's feeding record
      const now = new Date().toISOString();
      useRecordStore.getState().addRecord({
        type: 'feeding',
        babyId: baby.id,
        time: now,
        feedingMethod: 'breast',
        amount: 80,
        duration: 15,
      });

      // Add today's diaper record
      useRecordStore.getState().addRecord({
        type: 'diaper',
        babyId: baby.id,
        time: now,
        diaperType: 'wet',
      });
    });

    it('should show feeding count in summary', () => {
      render(<HomePage />);
      // The feeding count "1" is displayed in the summary card
      const ones = screen.getAllByText('1');
      expect(ones.length).toBeGreaterThanOrEqual(1);
      // "80ml" appears in both the summary card and the RecordCard chip
      const amountMatches = screen.getAllByText(/80ml/);
      expect(amountMatches.length).toBeGreaterThanOrEqual(1);
    });

    it('should show diaper count in summary', () => {
      render(<HomePage />);
      // The diaper card shows the count
      const diaperSection = screen.getByText('今日尿布');
      expect(diaperSection).toBeInTheDocument();
      // The count "1" is displayed near the diaper label
      const ones = screen.getAllByText('1');
      expect(ones.length).toBeGreaterThanOrEqual(1);
    });

    it('should show recent records', () => {
      render(<HomePage />);
      // RecordCard should show the record type labels
      expect(screen.getAllByText('喂养').length).toBeGreaterThan(0);
    });
  });

  describe('inline FAB', () => {
    beforeEach(() => {
      const baby = useBabyStore.getState().addBaby(sampleBabyInput);
      useSettingsStore.getState().setActiveBabyId(baby.id);
    });

    it('should render inline FAB with aria-label "快速记录"', () => {
      render(<HomePage />);
      expect(screen.getByLabelText('快速记录')).toBeInTheDocument();
    });

    it('should call openQuickRecord when FAB is clicked', () => {
      render(<HomePage />);
      fireEvent.click(screen.getByLabelText('快速记录'));
      expect(useUIStore.getState().quickRecordOpen).toBe(true);
    });
  });
});
