import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '@/test/render';
import BottomNav from '@/components/layout/BottomNav';

describe('BottomNav', () => {
  it('should render all 5 navigation tabs', () => {
    render(<BottomNav />);
    expect(screen.getByText('首页')).toBeInTheDocument();
    expect(screen.getByText('记录')).toBeInTheDocument();
    expect(screen.getByText('相册')).toBeInTheDocument();
    expect(screen.getByText('成长')).toBeInTheDocument();
    expect(screen.getByText('更多')).toBeInTheDocument();
  });

  it('should not contain a Fab (floating action button)', () => {
    const { container } = render(<BottomNav />);
    // The "+" FAB has been removed from BottomNav and moved to HomePage
    expect(container.querySelector('.MuiFab-root')).not.toBeInTheDocument();
  });

  it('should highlight the active tab based on current route', () => {
    render(<BottomNav />, { initialEntries: ['/records'] });
    const recordsTab = screen.getByText('记录').closest('button');
    expect(recordsTab).toHaveClass('Mui-selected');
  });
});
