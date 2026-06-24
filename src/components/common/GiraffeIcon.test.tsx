import { describe, it, expect } from 'vitest';
import { render } from '@/test/render';
import GiraffeIcon from '@/components/common/GiraffeIcon';

describe('GiraffeIcon', () => {
  describe('rendering', () => {
    it('should render an SVG element', () => {
      const { container } = render(<GiraffeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should use default size of 32 when no size prop given', () => {
      const { container } = render(<GiraffeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });

    it('should apply custom size prop', () => {
      const { container } = render(<GiraffeIcon size={80} />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('width', '80');
      expect(svg).toHaveAttribute('height', '80');
    });

    it('should have viewBox of 0 0 32 32', () => {
      const { container } = render(<GiraffeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('viewBox', '0 0 32 32');
    });

    it('should have aria-hidden for accessibility', () => {
      const { container } = render(<GiraffeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('should have fill="none" on the svg', () => {
      const { container } = render(<GiraffeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('fill', 'none');
    });
  });

  describe('SVG content', () => {
    it('should render giraffe head ellipse with giraffe yellow color', () => {
      const { container } = render(<GiraffeIcon />);
      const headEllipse = container.querySelector('ellipse[cx="16"][cy="12"]');
      expect(headEllipse).toBeInTheDocument();
      expect(headEllipse).toHaveAttribute('fill', '#F4A940');
    });

    it('should render ossicones (horns) with giraffe brown color', () => {
      const { container } = render(<GiraffeIcon />);
      const horns = container.querySelectorAll('ellipse[fill="#8B5E3C"]');
      // At least 2 ossicone ellipses
      expect(horns.length).toBeGreaterThanOrEqual(2);
    });

    it('should render eyes with white/cream fill', () => {
      const { container } = render(<GiraffeIcon />);
      const eyes = container.querySelectorAll('circle[fill="#FFFAF0"]');
      expect(eyes.length).toBe(2);
    });

    it('should render pupils with dark brown fill', () => {
      const { container } = render(<GiraffeIcon />);
      const pupils = container.querySelectorAll('circle[fill="#4A3728"]');
      expect(pupils.length).toBe(2);
    });

    it('should render a smile path', () => {
      const { container } = render(<GiraffeIcon />);
      const smile = container.querySelector('path[d="M13 13.5 Q16 15 19 13.5"]');
      expect(smile).toBeInTheDocument();
    });

    it('should render blush ellipses', () => {
      const { container } = render(<GiraffeIcon />);
      const blushes = container.querySelectorAll('ellipse[fill="#FF8A80"]');
      expect(blushes.length).toBe(2);
    });
  });

  describe('className prop', () => {
    it('should apply className when provided', () => {
      const { container } = render(<GiraffeIcon className="custom-giraffe" />);
      const svg = container.querySelector('svg.custom-giraffe');
      expect(svg).toBeInTheDocument();
    });

    it('should work without className prop', () => {
      const { container } = render(<GiraffeIcon />);
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).not.toHaveClass('custom-giraffe');
    });
  });
});
