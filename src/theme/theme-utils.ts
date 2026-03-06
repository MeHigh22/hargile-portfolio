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

/**
 * Default theme matches first project (atlas) derived palette.
 * Hardcoded to avoid circular import with color-utils/projects.
 */
export const defaultTheme: ThemePalette = {
  accent: '#96b8f7',
  bg: '#06080d',
  bgElevated: '#121419',
  bgCard: '#1a1c20',
  text: '#ebebec',
  textSecondary: '#9b9c9e',
  coral: '#96b8f7',
  lavender: '#b896f7',
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
