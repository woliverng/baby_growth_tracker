import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import JaundiceForm from '@/components/records/JaundiceForm';
import { useBabyStore } from '@/store/useBabyStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { useRecordStore } from '@/store/useRecordStore';
import { useUIStore } from '@/store/useUIStore';
import { resetAllStores, sampleBabyInput } from '@/test/helpers';

describe('JaundiceForm', () => {
  beforeEach(() => {
    resetAllStores();
    const baby = useBabyStore.getState().addBaby(sampleBabyInput);
    useSettingsStore.getState().setActiveBabyId(baby.id);
  });

  describe('rendering', () => {
    it('should render measurement time label', () => {
      render(<JaundiceForm />);
      // MUI renders label text in both the label and the notched outline legend
      expect(screen.getAllByText('测量时间').length).toBeGreaterThanOrEqual(1);
    });

    it('should render jaundice index label', () => {
      render(<JaundiceForm />);
      expect(screen.getByText('黄疸指数 (mg/dL)')).toBeInTheDocument();
    });

    it('should render measurement site label', () => {
      render(<JaundiceForm />);
      expect(screen.getByText('测量部位')).toBeInTheDocument();
    });

    it('should render all 3 measurement site options', () => {
      render(<JaundiceForm />);
      expect(screen.getByText('额头')).toBeInTheDocument();
      expect(screen.getByText('胸前')).toBeInTheDocument();
      expect(screen.getByText('腹部')).toBeInTheDocument();
    });

    it('should render number input with placeholder', () => {
      render(<JaundiceForm />);
      expect(screen.getByPlaceholderText(/输入黄疸指数/)).toBeInTheDocument();
    });

    it('should render placeholder containing normal range info and mg/dL unit', () => {
      render(<JaundiceForm />);
      const input = screen.getByPlaceholderText(/输入黄疸指数/);
      const placeholder = input.getAttribute('placeholder') ?? '';
      expect(placeholder).toContain('正常范围');
      expect(placeholder).toContain('mg/dL');
    });

    it('should render submit button with "添加记录" text', () => {
      render(<JaundiceForm />);
      expect(screen.getByText('添加记录')).toBeInTheDocument();
    });

    it('should render note field', () => {
      render(<JaundiceForm />);
      // MUI renders label text in both the label and the notched outline legend
      expect(screen.getAllByText('备注').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('submit button disabled logic', () => {
    it('should disable submit button when value is empty', () => {
      render(<JaundiceForm />);
      const submitBtn = screen.getByText('添加记录').closest('button');
      expect(submitBtn).toBeDisabled();
    });

    it('should enable submit button when value is entered', () => {
      render(<JaundiceForm />);
      const input = screen.getByPlaceholderText(/输入黄疸指数/);
      fireEvent.change(input, { target: { value: '8.5' } });
      const submitBtn = screen.getByText('添加记录').closest('button');
      expect(submitBtn).not.toBeDisabled();
    });

    it('should disable submit button when value is cleared after input', () => {
      render(<JaundiceForm />);
      const input = screen.getByPlaceholderText(/输入黄疸指数/);
      fireEvent.change(input, { target: { value: '8.5' } });
      fireEvent.change(input, { target: { value: '' } });
      const submitBtn = screen.getByText('添加记录').closest('button');
      expect(submitBtn).toBeDisabled();
    });
  });

  describe('submission', () => {
    it('should add a jaundice record on submit', () => {
      render(<JaundiceForm />);
      const input = screen.getByPlaceholderText(/输入黄疸指数/);
      fireEvent.change(input, { target: { value: '8.5' } });
      fireEvent.click(screen.getByText('添加记录'));

      const records = useRecordStore.getState().records;
      expect(records).toHaveLength(1);
      const record = records[0];
      expect(record.type).toBe('jaundice');
      if (record.type === 'jaundice') {
        expect(record.value).toBe(8.5);
        expect(record.measureSite).toBe('forehead');
      }
    });

    it('should close quick record after submit', () => {
      useUIStore.getState().openQuickRecord('jaundice');
      render(<JaundiceForm />);
      const input = screen.getByPlaceholderText(/输入黄疸指数/);
      fireEvent.change(input, { target: { value: '8.5' } });
      fireEvent.click(screen.getByText('添加记录'));
      expect(useUIStore.getState().quickRecordOpen).toBe(false);
    });

    it('should use selected measure site (chest) on submit', () => {
      render(<JaundiceForm />);
      const input = screen.getByPlaceholderText(/输入黄疸指数/);
      fireEvent.change(input, { target: { value: '12.0' } });
      fireEvent.click(screen.getByText('胸前'));
      fireEvent.click(screen.getByText('添加记录'));

      const record = useRecordStore.getState().records[0];
      if (record.type === 'jaundice') {
        expect(record.measureSite).toBe('chest');
        expect(record.value).toBe(12.0);
      }
    });

    it('should use selected measure site (abdomen) on submit', () => {
      render(<JaundiceForm />);
      const input = screen.getByPlaceholderText(/输入黄疸指数/);
      fireEvent.change(input, { target: { value: '7.3' } });
      fireEvent.click(screen.getByText('腹部'));
      fireEvent.click(screen.getByText('添加记录'));

      const record = useRecordStore.getState().records[0];
      if (record.type === 'jaundice') {
        expect(record.measureSite).toBe('abdomen');
      }
    });

    it('should parse decimal value correctly', () => {
      render(<JaundiceForm />);
      const input = screen.getByPlaceholderText(/输入黄疸指数/);
      fireEvent.change(input, { target: { value: '15.7' } });
      fireEvent.click(screen.getByText('添加记录'));

      const record = useRecordStore.getState().records[0];
      if (record.type === 'jaundice') {
        expect(record.value).toBeCloseTo(15.7, 1);
      }
    });
  });

  describe('edit mode', () => {
    it('should show "保存修改" button when editing a jaundice record', () => {
      const baby = useBabyStore.getState().babies[0];
      const existingRecord = useRecordStore.getState().addRecord({
        type: 'jaundice',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        value: 6.0,
        measureSite: 'chest',
      });
      useUIStore.getState().startEdit(existingRecord);

      render(<JaundiceForm />);
      expect(screen.getByText('保存修改')).toBeInTheDocument();
    });

    it('should pre-fill value when editing', () => {
      const baby = useBabyStore.getState().babies[0];
      const existingRecord = useRecordStore.getState().addRecord({
        type: 'jaundice',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        value: 9.2,
        measureSite: 'forehead',
      });
      useUIStore.getState().startEdit(existingRecord);

      render(<JaundiceForm />);
      const input = screen.getByPlaceholderText(/输入黄疸指数/) as HTMLInputElement;
      expect(input.value).toBe('9.2');
    });

    it('should update record instead of adding when editing', () => {
      const baby = useBabyStore.getState().babies[0];
      const existingRecord = useRecordStore.getState().addRecord({
        type: 'jaundice',
        babyId: baby.id,
        time: '2026-06-24T09:00:00.000Z',
        value: 9.2,
        measureSite: 'forehead',
      });
      useUIStore.getState().startEdit(existingRecord);

      render(<JaundiceForm />);
      const input = screen.getByPlaceholderText(/输入黄疸指数/);
      fireEvent.change(input, { target: { value: '10.5' } });
      fireEvent.click(screen.getByText('保存修改'));

      const records = useRecordStore.getState().records;
      expect(records).toHaveLength(1);
      if (records[0].type === 'jaundice') {
        expect(records[0].value).toBeCloseTo(10.5, 1);
      }
    });
  });
});
