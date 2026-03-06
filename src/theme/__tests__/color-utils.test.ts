import { describe, it, expect } from 'vitest'
import { hexToRgb, rgbToHex, lighten, deriveTheme } from '../color-utils'
import type { ProjectColors } from '../../data/types'

describe('hexToRgb', () => {
  it('converts #96b8f7 to [150, 184, 247]', () => {
    expect(hexToRgb('#96b8f7')).toEqual([150, 184, 247])
  })

  it('converts #000000 to [0, 0, 0]', () => {
    expect(hexToRgb('#000000')).toEqual([0, 0, 0])
  })

  it('converts #ffffff to [255, 255, 255]', () => {
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255])
  })
})

describe('rgbToHex', () => {
  it('converts (150, 184, 247) to #96b8f7', () => {
    expect(rgbToHex(150, 184, 247)).toBe('#96b8f7')
  })

  it('converts (0, 0, 0) to #000000', () => {
    expect(rgbToHex(0, 0, 0)).toBe('#000000')
  })
})

describe('lighten', () => {
  it('returns a hex string lighter than input', () => {
    const result = lighten('#06080d', 0.05)
    expect(result).toMatch(/^#[0-9a-f]{6}$/)
    // The result should be lighter (higher RGB values)
    const [rOrig, gOrig, bOrig] = hexToRgb('#06080d')
    const [rNew, gNew, bNew] = hexToRgb(result)
    expect(rNew).toBeGreaterThanOrEqual(rOrig)
    expect(gNew).toBeGreaterThanOrEqual(gOrig)
    expect(bNew).toBeGreaterThanOrEqual(bOrig)
    // At least one channel should increase
    expect(rNew + gNew + bNew).toBeGreaterThan(rOrig + gOrig + bOrig)
  })

  it('lighten with amount 0 returns same color', () => {
    expect(lighten('#06080d', 0)).toBe('#06080d')
  })

  it('lighten with amount 1 returns white', () => {
    expect(lighten('#06080d', 1)).toBe('#ffffff')
  })
})

describe('deriveTheme', () => {
  const coreColors: ProjectColors = {
    accent: '#96b8f7',
    background: '#06080d',
    gradientFrom: '#f7a896',
    gradientTo: '#b896f7',
  }

  it('returns a ThemePalette with all 8 fields', () => {
    const theme = deriveTheme(coreColors)
    expect(theme).toHaveProperty('accent')
    expect(theme).toHaveProperty('bg')
    expect(theme).toHaveProperty('bgElevated')
    expect(theme).toHaveProperty('bgCard')
    expect(theme).toHaveProperty('text')
    expect(theme).toHaveProperty('textSecondary')
    expect(theme).toHaveProperty('coral')
    expect(theme).toHaveProperty('lavender')
  })

  it('maps accent -> accent', () => {
    const theme = deriveTheme(coreColors)
    expect(theme.accent).toBe('#96b8f7')
  })

  it('maps background -> bg', () => {
    const theme = deriveTheme(coreColors)
    expect(theme.bg).toBe('#06080d')
  })

  it('maps gradientFrom -> coral', () => {
    const theme = deriveTheme(coreColors)
    expect(theme.coral).toBe('#f7a896')
  })

  it('maps gradientTo -> lavender', () => {
    const theme = deriveTheme(coreColors)
    expect(theme.lavender).toBe('#b896f7')
  })

  it('derives bgElevated as slightly lighter than background (~5%)', () => {
    const theme = deriveTheme(coreColors)
    expect(theme.bgElevated).toMatch(/^#[0-9a-f]{6}$/)
    const [rBg, gBg, bBg] = hexToRgb(coreColors.background)
    const [rEl, gEl, bEl] = hexToRgb(theme.bgElevated)
    expect(rEl + gEl + bEl).toBeGreaterThan(rBg + gBg + bBg)
  })

  it('derives bgCard as slightly lighter than background (~8%)', () => {
    const theme = deriveTheme(coreColors)
    expect(theme.bgCard).toMatch(/^#[0-9a-f]{6}$/)
    const [rBg, gBg, bBg] = hexToRgb(coreColors.background)
    const [rCard, gCard, bCard] = hexToRgb(theme.bgCard)
    expect(rCard + gCard + bCard).toBeGreaterThan(rBg + gBg + bBg)
    // bgCard should be lighter than bgElevated
    const [rEl, gEl, bEl] = hexToRgb(theme.bgElevated)
    expect(rCard + gCard + bCard).toBeGreaterThan(rEl + gEl + bEl)
  })

  it('derives text as near-white (lighten ~92%)', () => {
    const theme = deriveTheme(coreColors)
    expect(theme.text).toMatch(/^#[0-9a-f]{6}$/)
    const [r, g, b] = hexToRgb(theme.text)
    // Should be very light (near white)
    expect(r).toBeGreaterThan(200)
    expect(g).toBeGreaterThan(200)
    expect(b).toBeGreaterThan(200)
  })

  it('derives textSecondary as hex (not rgba) for GSAP compatibility', () => {
    const theme = deriveTheme(coreColors)
    expect(theme.textSecondary).toMatch(/^#[0-9a-f]{6}$/)
    expect(theme.textSecondary).not.toContain('rgba')
  })

  it('all returned values are 7-character hex strings', () => {
    const theme = deriveTheme(coreColors)
    const hexPattern = /^#[0-9a-f]{6}$/
    expect(theme.accent).toMatch(hexPattern)
    expect(theme.bg).toMatch(hexPattern)
    expect(theme.bgElevated).toMatch(hexPattern)
    expect(theme.bgCard).toMatch(hexPattern)
    expect(theme.text).toMatch(hexPattern)
    expect(theme.textSecondary).toMatch(hexPattern)
    expect(theme.coral).toMatch(hexPattern)
    expect(theme.lavender).toMatch(hexPattern)
  })
})
