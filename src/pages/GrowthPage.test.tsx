import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import GrowthPage from '@/pages/GrowthPage';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useRecordStore } from '@/store/useRecordStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('GrowthPage', () => {
  beforeEach(() => {
    resetAllStores();
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useSettingsStore.getState().setActiveBabyId(baby.id);
  });

  it('should render page title "成长曲线"', () => {
    render(<GrowthPage />);
    expect(screen.getByText('成长曲线')).toBeInTheDocument();
  });

  it('should render 3 tabs: 体重, 身长, 统计', () => {
    render(<GrowthPage />);
    expect(screen.getByText('体重')).toBeInTheDocument();
    expect(screen.getByText('身长')).toBeInTheDocument();
    expect(screen.getByText('统计')).toBeInTheDocument();
  });

  it('should show empty state when no growth records', () => {
    render(<GrowthPage />);
    expect(screen.getByText('暂无成长数据')).toBeInTheDocument();
  });

  it('should show "记录成长" action button in empty state', () => {
    render(<GrowthPage />);
    expect(screen.getByText('记录成长')).toBeInTheDocument();
  });

  it('should switch to height tab when clicked', () => {
    render(<GrowthPage />);
    fireEvent.click(screen.getByText('身长'));
    // When switching to height tab with no data, should still show empty state
    expect(screen.getByText('暂无成长数据')).toBeInTheDocument();
  });

  it('should switch to stats tab when clicked', () => {
    render(<GrowthPage />);
    fireEvent.click(screen.getByText('统计'));
    // Stats tab should show "近 7 天喂养奶量" and "今日睡眠分布"
    expect(screen.getByText('近 7 天喂养奶量')).toBeInTheDocument();
    expect(screen.getByText('今日睡眠分布')).toBeInTheDocument();
  });

  describe('with growth records', () => {
    beforeEach(() => {
      const baby = useBabyStore.getState().babies[0];
      useRecordStore.getState().addRecord({
        type: 'growth',
        babyId: baby.id,
        date: '2026-06-20',
        weight: 5.0,
        height: 57,
      });
      useRecordStore.getState().addRecord({
        type: 'growth',
        babyId: baby.id,
        date: '2026-06-24',
        weight: 5.2,
        height: 58,
      });
    });

    it('should show weight trend text', () => {
      render(<GrowthPage />);
      expect(screen.getByText('体重 (kg)趋势')).toBeInTheDocument();
    });

    it('should show weight records list', () => {
      render(<GrowthPage />);
      expect(screen.getByText('体重记录')).toBeInTheDocument();
    });

    it('should switch to height tab and show height data', () => {
      render(<GrowthPage />);
      fireEvent.click(screen.getByText('身长'));
      expect(screen.getByText('身长 (cm)趋势')).toBeInTheDocument();
      expect(screen.getByText('身长记录')).toBeInTheDocument();
    });
  });
});
