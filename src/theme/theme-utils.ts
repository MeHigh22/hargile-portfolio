export interface ThemePalette {
  accent: string;
  bg: string;
  bgElevated: string;
  text: string;
  coral: string;
  lavender: string;
}

export const defaultTheme: ThemePalette = {
  accent: '#96b8f7',
  bg: '#06080d',
  bgElevated: '#0d1117',
  text: '#edf2fc',
  coral: '#f7a896',
  lavender: '#b896f7',
};

export const altTheme: ThemePalette = {
  accent: '#f7a896',
  bg: '#0d0806',
  bgElevated: '#17110d',
  text: '#fcf2ed',
  coral: '#96b8f7',
  lavender: '#f796b8',
};

export function applyTheme(palette: ThemePalette): void {
  const root = document.documentElement;
  root.style.setProperty('--color-accent', palette.accent);
  root.style.setProperty('--color-bg', palette.bg);
  root.style.setProperty('--color-bg-elevated', palette.bgElevated);
  root.style.setProperty('--color-text', palette.text);
  root.style.setProperty('--color-coral', palette.coral);
  root.style.setProperty('--color-lavender', palette.lavender);
}
