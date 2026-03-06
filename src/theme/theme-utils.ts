export interface ThemePalette {
  accent: string;
  bg: string;
  bgElevated: string;
  bgCard: string;
  text: string;
  textSecondary: string;
  coral: string;
  lavender: string;
}

export const defaultTheme: ThemePalette = {
  accent: '#96b8f7',
  bg: '#06080d',
  bgElevated: '#0d1117',
  bgCard: '#111827',
  text: '#edf2fc',
  textSecondary: 'rgba(237,242,252,0.55)',
  coral: '#f7a896',
  lavender: '#b896f7',
};

export const altTheme: ThemePalette = {
  accent: '#f7a896',
  bg: '#0d0908',
  bgElevated: '#1a120e',
  bgCard: '#1f1510',
  text: '#fcf2ed',
  textSecondary: 'rgba(252,242,237,0.55)',
  coral: '#96b8f7',
  lavender: '#f796b8',
};

export function applyTheme(palette: ThemePalette): void {
  const root = document.documentElement;
  root.style.setProperty('--color-accent', palette.accent);
  root.style.setProperty('--color-bg', palette.bg);
  root.style.setProperty('--color-bg-elevated', palette.bgElevated);
  root.style.setProperty('--color-bg-card', palette.bgCard);
  root.style.setProperty('--color-text', palette.text);
  root.style.setProperty('--color-text-secondary', palette.textSecondary);
  root.style.setProperty('--color-coral', palette.coral);
  root.style.setProperty('--color-lavender', palette.lavender);
}
