import { useState } from 'react';
import { applyTheme, defaultTheme, altTheme } from '../../theme/theme-utils';
import { Container } from './Container';

export function Navigation() {
  const [isAlt, setIsAlt] = useState(false);

  function handleToggle() {
    const next = !isAlt;
    setIsAlt(next);
    applyTheme(next ? altTheme : defaultTheme);
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-bg/80 border-b border-border">
      <Container className="flex justify-between items-center h-16">
        <span className="font-display font-bold text-lg tracking-wide text-text">
          HARGILE
        </span>
        <button
          type="button"
          onClick={handleToggle}
          className="text-text-secondary hover:text-accent transition-colors text-sm"
        >
          {isAlt ? '\u2600' : '\u263E'} Toggle Theme
        </button>
      </Container>
    </nav>
  );
}
