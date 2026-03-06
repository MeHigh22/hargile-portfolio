import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressIndicator } from '../ProgressIndicator';
import { useSliderStore } from '../../../store/useSliderStore';

describe('ProgressIndicator', () => {
  beforeEach(() => {
    useSliderStore.setState({
      currentIndex: 0,
      direction: 1,
      isAnimating: false,
    });
  });

  it('renders current slide number as zero-padded 1-indexed value', () => {
    render(<ProgressIndicator />);
    expect(screen.getByText('01')).toBeDefined();
  });

  it('renders total slide count as zero-padded value', () => {
    render(<ProgressIndicator />);
    const total = useSliderStore.getState().totalSlides;
    expect(screen.getByText(String(total).padStart(2, '0'))).toBeDefined();
  });

  it('updates display when currentIndex changes to 5', () => {
    const { rerender } = render(<ProgressIndicator />);

    useSliderStore.setState({ currentIndex: 5 });
    rerender(<ProgressIndicator />);

    expect(screen.getByText('06')).toBeDefined();
  });

  it('renders progress bar with correct width percentage', () => {
    const total = useSliderStore.getState().totalSlides;
    useSliderStore.setState({ currentIndex: 2 });

    render(<ProgressIndicator />);

    const progressBar = screen.getByTestId('progress-bar');
    const expectedWidth = `${((2 + 1) / total) * 100}%`;
    expect(progressBar.style.width).toBe(expectedWidth);
  });

  it('renders progress bar at 100% for last slide', () => {
    const total = useSliderStore.getState().totalSlides;
    useSliderStore.setState({ currentIndex: total - 1 });

    render(<ProgressIndicator />);

    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar.style.width).toBe('100%');
  });
});
