import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import FeedingForm from '@/components/records/FeedingForm';
import DiaperForm from '@/components/records/DiaperForm';
import GrowthForm from '@/components/records/GrowthForm';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useRecordStore } from '@/store/useRecordStore';
import { useUIStore } from '@/store/useUIStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('Record Forms', () => {
  beforeEach(() => {
    resetAllStores();
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useSettingsStore.getState().setActiveBabyId(baby.id);
  });

  describe('FeedingForm', () => {
    it('should render form fields', () => {
      render(<FeedingForm />);
      expect(screen.getByText('喂养方式')).toBeInTheDocument();
      expect(screen.getByText('母乳')).toBeInTheDocument();
      expect(screen.getByText('配方奶')).toBeInTheDocument();
      expect(screen.getByText('混合')).toBeInTheDocument();
    });

    it('should render quick amount buttons', () => {
      render(<FeedingForm />);
      expect(screen.getByText('30ml')).toBeInTheDocument();
      expect(screen.getByText('60ml')).toBeInTheDocument();
      expect(screen.getByText('90ml')).toBeInTheDocument();
      expect(screen.getByText('120ml')).toBeInTheDocument();
    });

    it('should render submit button with "添加记录" text', () => {
      render(<FeedingForm />);
      expect(screen.getByText('添加记录')).toBeInTheDocument();
    });

    it('should add a feeding record on submit', () => {
      render(<FeedingForm />);

      const initialCount = useRecordStore.getState().records.length;

      // Click submit
      fireEvent.click(screen.getByText('添加记录'));

      expect(useRecordStore.getState().records.length).toBe(initialCount + 1);
      const record = useRecordStore.getState().records[0];
      expect(record.type).toBe('feeding');
    });

    it('should close quick record after submit', () => {
      useUIStore.getState().openQuickRecord('feeding');
      render(<FeedingForm />);

      fireEvent.click(screen.getByText('添加记录'));

      expect(useUIStore.getState().quickRecordOpen).toBe(false);
    });

    it('should set amount when quick amount button is clicked', () => {
      render(<FeedingForm />);

      fireEvent.click(screen.getByText('90ml'));

      // After clicking, the amount input should have value 90
      // We can verify by submitting and checking the record
      fireEvent.click(screen.getByText('添加记录'));

      const record = useRecordStore.getState().records[0];
      if (record.type === 'feeding') {
        expect(record.amount).toBe(90);
      }
    });
  });

  describe('DiaperForm', () => {
    it('should render form fields', () => {
      render(<DiaperForm />);
      expect(screen.getByText('类型')).toBeInTheDocument();
      expect(screen.getByText('湿尿布')).toBeInTheDocument();
      expect(screen.getByText('排便')).toBeInTheDocument();
    });

    it('should show poop details when poop type is selected', () => {
      render(<DiaperForm />);

      // Click 排便
      fireEvent.click(screen.getByText('排便'));

      // Should show 排便性状 and 颜色 sections
      expect(screen.getByText('排便性状')).toBeInTheDocument();
      expect(screen.getByText('颜色')).toBeInTheDocument();
    });

    it('should add a diaper record on submit', () => {
      render(<DiaperForm />);

      fireEvent.click(screen.getByText('添加记录'));

      const record = useRecordStore.getState().records[0];
      expect(record.type).toBe('diaper');
    });
  });

  describe('GrowthForm', () => {
    it('should render form fields', () => {
      render(<GrowthForm />);
      // MUI renders the label text in both the label and the notched outline legend
      expect(screen.getAllByText('体重 (kg)').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('身长 (cm)').length).toBeGreaterThanOrEqual(1);
    });

    it('should disable submit button when no weight or height is entered', () => {
      render(<GrowthForm />);

      const submitBtn = screen.getByText('添加记录').closest('button');
      expect(submitBtn).toBeDisabled();
    });

    it('should enable submit button when weight is entered', () => {
      render(<GrowthForm />);

      // Find the weight input and type a value
      const inputs = screen.getAllByRole('spinbutton');
      // The weight input should be the first number input
      fireEvent.change(inputs[0], { target: { value: '5.2' } });

      const submitBtn = screen.getByText('添加记录').closest('button');
      expect(submitBtn).not.toBeDisabled();
    });

    it('should add a growth record on submit', () => {
      render(<GrowthForm />);

      // Enter weight
      const inputs = screen.getAllByRole('spinbutton');
      fireEvent.change(inputs[0], { target: { value: '5.2' } });

      fireEvent.click(screen.getByText('添加记录'));

      const record = useRecordStore.getState().records[0];
      expect(record.type).toBe('growth');
      if (record.type === 'growth') {
        expect(record.weight).toBe(5.2);
      }
    });
  });
});
