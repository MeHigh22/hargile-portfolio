import { useState, useEffect } from 'react';
import type React from 'react';

interface TweaksPanelProps {
  portfolioRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

type Theme = 'ink' | 'cobalt' | 'paper';
type Display = 'cormorant' | 'fraunces' | 'instrument';
type Accent = 'blue' | 'electric' | 'peach';

const ACCENT_COLORS: Record<Accent, string> = {
  blue: '#95B8F8',
  electric: '#A0E9FF',
  peach: '#F0A8A8',
};

function getLS(key: string, fallback: string): string {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

export function TweaksPanel({ portfolioRef, className }: TweaksPanelProps) {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => getLS('portfolio-theme', 'cobalt') as Theme);
  const [display, setDisplay] = useState<Display>(() => getLS('portfolio-display', 'cormorant') as Display);
  const [accent, setAccent] = useState<Accent>(() => getLS('portfolio-accent', 'blue') as Accent);

  // Apply theme/display/accent to the portfolio root element
  useEffect(() => {
    const el = portfolioRef.current;
    if (!el) return;

    // Theme: 'ink' = default (no data-theme), 'cobalt'/'paper' override bg
    if (theme === 'ink') {
      el.removeAttribute('data-theme');
    } else {
      el.setAttribute('data-theme', theme);
    }

    // Display font: 'cormorant' = default, others = data-display
    if (display === 'cormorant') {
      el.removeAttribute('data-display');
    } else {
      el.setAttribute('data-display', display);
    }

    // Accent color
    el.style.setProperty('--blue', ACCENT_COLORS[accent]);
  }, [theme, display, accent, portfolioRef]);

  function handleTheme(t: Theme) {
    setTheme(t);
    try { localStorage.setItem('portfolio-theme', t); } catch {}
  }

  function handleDisplay(d: Display) {
    setDisplay(d);
    try { localStorage.setItem('portfolio-display', d); } catch {}
  }

  function handleAccent(a: Accent) {
    setAccent(a);
    try { localStorage.setItem('portfolio-accent', a); } catch {}
  }

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className={['tweaks-toggle', className].filter(Boolean).join(' ')}
        style={{
          position: 'fixed',
          right: '28px',
          bottom: '80px',
          zIndex: 201,
          background: 'transparent',
          border: '1px solid var(--line-strong)',
          borderRadius: '8px',
          color: 'var(--ink-dim)',
          fontFamily: 'var(--mono)',
          fontSize: '10px',
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          padding: '8px 12px',
          cursor: 'pointer',
        }}
        aria-label="Ouvrir les tweaks"
      >
        Tweaks
      </button>
      <div className={['tweaks', open ? 'on' : ''].filter(Boolean).join(' ')}>
        <h5>Tweaks</h5>
        <div className="grp">
          <label>Thème</label>
          <div className="seg" data-key="theme">
            {(['ink', 'cobalt', 'paper'] as Theme[]).map(t => (
              <button
                key={t}
                data-val={t}
                className={theme === t ? 'active' : ''}
                onClick={() => handleTheme(t)}
              >
                {t === 'ink' ? 'Encre' : t === 'cobalt' ? 'Cobalt' : 'Papier'}
              </button>
            ))}
          </div>
        </div>
        <div className="grp">
          <label>Police d&apos;affichage</label>
          <div className="seg" data-key="display">
            {(['cormorant', 'fraunces', 'instrument'] as Display[]).map(d => (
              <button
                key={d}
                data-val={d}
                className={display === d ? 'active' : ''}
                onClick={() => handleDisplay(d)}
              >
                {d === 'cormorant' ? 'Cormorant' : d === 'fraunces' ? 'Fraunces' : 'Instrument'}
              </button>
            ))}
          </div>
        </div>
        <div className="grp">
          <label>Accent</label>
          <div className="seg" data-key="accent">
            {(['blue', 'electric', 'peach'] as Accent[]).map(a => (
              <button
                key={a}
                data-val={a}
                className={accent === a ? 'active' : ''}
                onClick={() => handleAccent(a)}
              >
                {a === 'blue' ? 'Blue' : a === 'electric' ? 'Electric' : 'Peach'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
