import type { ThemePalette } from './theme-utils';
import type { ProjectColors } from '../data/types';

/**
 * Convert a hex color string to RGB tuple.
 */
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/**
 * Convert RGB values to a 7-character hex string.
 */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return (
    '#' +
    clamp(r).toString(16).padStart(2, '0') +
    clamp(g).toString(16).padStart(2, '0') +
    clamp(b).toString(16).padStart(2, '0')
  );
}

/**
 * Lighten a hex color by blending toward white.
 * @param hex - source color
 * @param amount - 0 (no change) to 1 (pure white)
 */
export function lighten(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex);
  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount,
  );
}

/**
 * Derive a full 8-token ThemePalette from 4 core ProjectColors.
 *
 * Direct mappings:
 *   accent       <- core.accent
 *   bg           <- core.background
 *   coral        <- core.gradientFrom
 *   lavender     <- core.gradientTo
 *
 * Derived values:
 *   bgElevated   <- lighten(background, 0.05)
 *   bgCard       <- lighten(background, 0.08)
 *   text         <- lighten(background, 0.92)  (near-white)
 *   textSecondary <- lighten(background, 0.60)  (hex, no rgba — GSAP safe)
 */
export function deriveTheme(core: ProjectColors): ThemePalette {
  return {
    accent: core.accent,
    bg: core.background,
    bgElevated: lighten(core.background, 0.05),
    bgCard: lighten(core.background, 0.08),
    text: lighten(core.background, 0.92),
    textSecondary: lighten(core.background, 0.60),
    coral: core.gradientFrom,
    lavender: core.gradientTo,
  };
}
