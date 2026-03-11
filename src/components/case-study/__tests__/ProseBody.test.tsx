import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProseBody } from '../ProseBody';

describe('ProseBody', () => {
  it('renders multiple <p> elements when text contains \\n\\n', () => {
    const text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
    const { container } = render(<ProseBody text={text} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(3);
  });

  it('first <p> has class text-lg, subsequent <p>s have text-base', () => {
    const text = 'First paragraph.\n\nSecond paragraph.\n\nThird paragraph.';
    const { container } = render(<ProseBody text={text} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs[0].className).toContain('text-lg');
    expect(paragraphs[1].className).toContain('text-base');
    expect(paragraphs[2].className).toContain('text-base');
  });

  it('all <p> elements have text-text class', () => {
    const text = 'First paragraph.\n\nSecond paragraph.';
    const { container } = render(<ProseBody text={text} />);
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach((p) => {
      expect(p.className).toContain('text-text');
    });
  });

  it('all <p> elements have leading-relaxed class', () => {
    const text = 'First paragraph.\n\nSecond paragraph.';
    const { container } = render(<ProseBody text={text} />);
    const paragraphs = container.querySelectorAll('p');
    paragraphs.forEach((p) => {
      expect(p.className).toContain('leading-relaxed');
    });
  });

  it('empty paragraphs from consecutive \\n\\n are filtered out', () => {
    const text = 'First paragraph.\n\n\n\nSecond paragraph.';
    const { container } = render(<ProseBody text={text} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
  });

  it('single paragraph text renders one <p> with text-lg', () => {
    const text = 'Just one paragraph here.';
    const { container } = render(<ProseBody text={text} />);
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].className).toContain('text-lg');
  });

  it('wrapping div has space-y-6 class', () => {
    const text = 'First paragraph.\n\nSecond paragraph.';
    const { container } = render(<ProseBody text={text} />);
    const wrapper = container.firstElementChild;
    expect(wrapper?.className).toContain('space-y-6');
  });

  it('renders the actual text content of each paragraph', () => {
    const text = 'Hello world.\n\nGoodbye world.';
    render(<ProseBody text={text} />);
    expect(screen.getByText('Hello world.')).toBeInTheDocument();
    expect(screen.getByText('Goodbye world.')).toBeInTheDocument();
  });
});
