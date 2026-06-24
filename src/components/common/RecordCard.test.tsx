import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '@/test/render';
import RecordCard from '@/components/common/RecordCard';
import { resetAllStores } from '@/test/helpers';
import type { RecordItem } from '@/types';

describe('RecordCard', () => {
  beforeEach(() => {
    resetAllStores();
  });

  const baseRecord = {
    id: 'test-id',
    babyId: 'baby-1',
    createdAt: '2026-06-24T08:00:00.000Z',
    updatedAt: '2026-06-24T08:00:00.000Z',
  };

  describe('feeding record', () => {
    it('should render feeding type label', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
        duration: 15,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('喂养')).toBeInTheDocument();
    });

    it('should show method label (母乳)', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('母乳')).toBeInTheDocument();
    });

    it('should show method label (配方奶)', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'formula',
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('配方奶')).toBeInTheDocument();
    });

    it('should show amount in ml', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 80,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('80ml')).toBeInTheDocument();
    });

    it('should show duration in minutes', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        duration: 20,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('20分钟')).toBeInTheDocument();
    });

    it('should show note when present', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        note: '宝宝吃得很开心',
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('宝宝吃得很开心')).toBeInTheDocument();
    });
  });

  describe('sleep record', () => {
    it('should render sleep type label', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'sleep',
        startTime: '2026-06-24T10:00:00.000Z',
        endTime: '2026-06-24T11:30:00.000Z',
        duration: 90,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('睡眠')).toBeInTheDocument();
    });

    it('should show sleep duration', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'sleep',
        startTime: '2026-06-24T10:00:00.000Z',
        endTime: '2026-06-24T11:30:00.000Z',
        duration: 90,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('1小时30分钟')).toBeInTheDocument();
    });

    it('should show "进行中" for ongoing sleep', () => {
      const now = new Date().toISOString();
      const record: RecordItem = {
        ...baseRecord,
        type: 'sleep',
        startTime: now,
        endTime: now, // Same time = ongoing
        duration: 0,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText(/进行中/)).toBeInTheDocument();
    });
  });

  describe('diaper record', () => {
    it('should render diaper type label', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'diaper',
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'wet',
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('尿布')).toBeInTheDocument();
    });

    it('should show 湿尿布 for wet type', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'diaper',
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'wet',
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('湿尿布')).toBeInTheDocument();
    });

    it('should show 排便 for poop type', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'diaper',
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'poop',
        poopTexture: 'soft',
        poopColor: '黄色',
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('排便')).toBeInTheDocument();
    });

    it('should show poop texture', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'diaper',
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'poop',
        poopTexture: 'soft',
        poopColor: '黄色',
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('性状: 软')).toBeInTheDocument();
    });

    it('should show poop color', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'diaper',
        time: '2026-06-24T09:00:00.000Z',
        diaperType: 'poop',
        poopTexture: 'soft',
        poopColor: '黄色',
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('颜色: 黄色')).toBeInTheDocument();
    });
  });

  describe('growth record', () => {
    it('should render growth type label', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'growth',
        date: '2026-06-24',
        weight: 5.2,
        height: 58,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('成长')).toBeInTheDocument();
    });

    it('should show weight in kg', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'growth',
        date: '2026-06-24',
        weight: 5.2,
        height: 58,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('5.2 kg')).toBeInTheDocument();
    });

    it('should show height in cm', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'growth',
        date: '2026-06-24',
        weight: 5.2,
        height: 58,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('58 cm')).toBeInTheDocument();
    });

    it('should show only weight when height is missing', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'growth',
        date: '2026-06-24',
        weight: 5.2,
      };
      render(<RecordCard record={record} />);
      expect(screen.getByText('5.2 kg')).toBeInTheDocument();
      expect(screen.queryByText(/cm/)).not.toBeInTheDocument();
    });
  });

  describe('jaundice record', () => {
    const jaundiceBase = {
      ...baseRecord,
      type: 'jaundice' as const,
      time: '2026-06-24T09:00:00.000Z',
      value: 8.5,
      measureSite: 'forehead' as const,
    };

    it('should render jaundice type label', () => {
      const record: RecordItem = { ...jaundiceBase };
      render(<RecordCard record={record} />);
      expect(screen.getByText('黄疸')).toBeInTheDocument();
    });

    it('should show jaundice value in mg/dL', () => {
      const record: RecordItem = { ...jaundiceBase, value: 12.3 };
      render(<RecordCard record={record} />);
      expect(screen.getByText('12.3 mg/dL')).toBeInTheDocument();
    });

    it('should show forehead site label', () => {
      const record: RecordItem = { ...jaundiceBase, measureSite: 'forehead' };
      render(<RecordCard record={record} />);
      expect(screen.getByText('额头')).toBeInTheDocument();
    });

    it('should show chest site label', () => {
      const record: RecordItem = { ...jaundiceBase, measureSite: 'chest' };
      render(<RecordCard record={record} />);
      expect(screen.getByText('胸前')).toBeInTheDocument();
    });

    it('should show abdomen site label', () => {
      const record: RecordItem = { ...jaundiceBase, measureSite: 'abdomen' };
      render(<RecordCard record={record} />);
      expect(screen.getByText('腹部')).toBeInTheDocument();
    });

    it('should show note when present', () => {
      const record: RecordItem = { ...jaundiceBase, note: '轻度黄疸' };
      render(<RecordCard record={record} />);
      expect(screen.getByText('轻度黄疸')).toBeInTheDocument();
    });
  });

  describe('jaundice warning indicator', () => {
    const warnBase = {
      ...baseRecord,
      type: 'jaundice' as const,
      time: '2026-06-24T09:00:00.000Z',
      value: 8.5,
      measureSite: 'forehead' as const,
    };

    it('should show "超标" warning when value > 12', () => {
      const record: RecordItem = { ...warnBase, value: 15.0 };
      render(<RecordCard record={record} />);
      expect(screen.getByText('超标')).toBeInTheDocument();
    });

    it('should not show "超标" warning when value equals 12 (boundary)', () => {
      const record: RecordItem = { ...warnBase, value: 12.0 };
      render(<RecordCard record={record} />);
      expect(screen.queryByText('超标')).not.toBeInTheDocument();
    });

    it('should not show "超标" warning when value < 12', () => {
      const record: RecordItem = { ...warnBase, value: 8.5 };
      render(<RecordCard record={record} />);
      expect(screen.queryByText('超标')).not.toBeInTheDocument();
    });

    it('should render WarningIcon for high jaundice value', () => {
      const record: RecordItem = { ...warnBase, value: 15.0 };
      render(<RecordCard record={record} />);
      // WarningIcon renders as an SVG alongside the "超标" text
      const warningText = screen.getByText('超标');
      const warningContainer = warningText.parentElement;
      const svg = warningContainer?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should not show warning for non-jaundice records even with high values', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
        amount: 200,
      };
      render(<RecordCard record={record} />);
      expect(screen.queryByText('超标')).not.toBeInTheDocument();
    });
  });

  describe('edit and delete actions', () => {
    it('should have edit button', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      };
      render(<RecordCard record={record} />);
      expect(screen.getByLabelText('编辑')).toBeInTheDocument();
    });

    it('should have delete button', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      };
      render(<RecordCard record={record} />);
      expect(screen.getByLabelText('删除')).toBeInTheDocument();
    });

    it('should open confirm dialog when delete is clicked', () => {
      const record: RecordItem = {
        ...baseRecord,
        type: 'feeding',
        time: '2026-06-24T08:00:00.000Z',
        feedingMethod: 'breast',
      };
      render(<RecordCard record={record} />);

      fireEvent.click(screen.getByLabelText('删除'));

      expect(screen.getByText('删除记录')).toBeInTheDocument();
      expect(screen.getByText('确定要删除这条记录吗？此操作不可撤销。')).toBeInTheDocument();
    });
  });
});
