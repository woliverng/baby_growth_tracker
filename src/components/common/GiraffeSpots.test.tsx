import { describe, it, expect } from 'vitest';
import { render } from '@/test/render';
import GiraffeSpots from '@/components/common/GiraffeSpots';

describe('GiraffeSpots', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      const { container } = render(<GiraffeSpots />);
      expect(container.firstChild).not.toBeNull();
    });

    it('should have aria-hidden for decorative purpose', () => {
      const { container } = render(<GiraffeSpots />);
      const wrapper = container.querySelector('[aria-hidden="true"]');
      expect(wrapper).toBeInTheDocument();
    });

    it('should have pointer-events none via computed style', () => {
      const { container } = render(<GiraffeSpots />);
      const wrapper = container.querySelector('[aria-hidden="true"]') as HTMLElement;
      const computed = window.getComputedStyle(wrapper);
      // pointerEvents none ensures spots don't intercept clicks
      expect(computed.pointerEvents).toBe('none');
    });
  });

  describe('spot count', () => {
    it('should render 9 spots by default', () => {
      const { container } = render(<GiraffeSpots />);
      const spots = container.querySelectorAll('[aria-hidden="true"] > div');
      expect(spots.length).toBe(9);
    });

    it('should render custom count of spots', () => {
      const { container } = render(<GiraffeSpots count={5} />);
      const spots = container.querySelectorAll('[aria-hidden="true"] > div');
      expect(spots.length).toBe(5);
    });

    it('should render 0 spots when count is 0', () => {
      const { container } = render(<GiraffeSpots count={0} />);
      const spots = container.querySelectorAll('[aria-hidden="true"] > div');
      expect(spots.length).toBe(0);
    });

    it('should render 12 spots when count is 12', () => {
      const { container } = render(<GiraffeSpots count={12} />);
      const spots = container.querySelectorAll('[aria-hidden="true"] > div');
      expect(spots.length).toBe(12);
    });
  });

  describe('spot styling', () => {
    it('should use giraffe brown color for spots via computed style', () => {
      const { container } = render(<GiraffeSpots count={1} />);
      const spot = container.querySelector('[aria-hidden="true"] > div') as HTMLElement;
      expect(spot).toBeInTheDocument();
      const computed = window.getComputedStyle(spot);
      // rgb(139, 94, 60) = #8B5E3C
      expect(computed.backgroundColor).toBe('rgb(139, 94, 60)');
    });

    it('should apply varying transforms across spots (rotation/scale)', () => {
      const { container } = render(<GiraffeSpots count={9} />);
      const spots = container.querySelectorAll('[aria-hidden="true"] > div');
      const transforms = new Set<string>();
      spots.forEach((spot) => {
        const el = spot as HTMLElement;
        const computed = window.getComputedStyle(el);
        if (computed.transform && computed.transform !== 'none') {
          transforms.add(computed.transform);
        }
      });
      // With 9 spots and 3 variants, there should be at least 2 different transforms
      expect(transforms.size).toBeGreaterThanOrEqual(2);
    });
  });

  describe('opacity prop', () => {
    it('should use default opacity of 0.15 via computed style', () => {
      const { container } = render(<GiraffeSpots />);
      const wrapper = container.querySelector('[aria-hidden="true"]') as HTMLElement;
      const computed = window.getComputedStyle(wrapper);
      expect(computed.opacity).toBe('0.15');
    });

    it('should apply custom opacity via computed style', () => {
      const { container } = render(<GiraffeSpots opacity={0.5} />);
      const wrapper = container.querySelector('[aria-hidden="true"]') as HTMLElement;
      const computed = window.getComputedStyle(wrapper);
      expect(computed.opacity).toBe('0.5');
    });
  });
});
