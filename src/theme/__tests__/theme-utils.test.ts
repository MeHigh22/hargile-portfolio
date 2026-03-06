import { describe, it, expect, vi, beforeEach } from 'vitest'
import { applyTheme, defaultTheme } from '../theme-utils'

describe('theme-utils', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('applyTheme sets --color-accent on document.documentElement', () => {
    const spy = vi.spyOn(document.documentElement.style, 'setProperty')
    applyTheme(defaultTheme)
    expect(spy).toHaveBeenCalledWith('--color-accent', defaultTheme.accent)
  })

  it('applyTheme sets --color-bg on document.documentElement', () => {
    const spy = vi.spyOn(document.documentElement.style, 'setProperty')
    applyTheme(defaultTheme)
    expect(spy).toHaveBeenCalledWith('--color-bg', defaultTheme.bg)
  })

  it('applyTheme sets all 8 theme properties', () => {
    const spy = vi.spyOn(document.documentElement.style, 'setProperty')
    applyTheme(defaultTheme)
    expect(spy).toHaveBeenCalledWith('--color-accent', defaultTheme.accent)
    expect(spy).toHaveBeenCalledWith('--color-bg', defaultTheme.bg)
    expect(spy).toHaveBeenCalledWith('--color-bg-elevated', defaultTheme.bgElevated)
    expect(spy).toHaveBeenCalledWith('--color-bg-card', defaultTheme.bgCard)
    expect(spy).toHaveBeenCalledWith('--color-text', defaultTheme.text)
    expect(spy).toHaveBeenCalledWith('--color-text-secondary', defaultTheme.textSecondary)
    expect(spy).toHaveBeenCalledWith('--color-coral', defaultTheme.coral)
    expect(spy).toHaveBeenCalledWith('--color-lavender', defaultTheme.lavender)
    expect(spy).toHaveBeenCalledTimes(8)
  })

  it('defaultTheme has accent #96b8f7', () => {
    expect(defaultTheme.accent).toBe('#96b8f7')
  })

  it('defaultTheme matches atlas project derived palette', () => {
    expect(defaultTheme.bg).toBe('#06080d')
    expect(defaultTheme.bgElevated).toBe('#121419')
    expect(defaultTheme.bgCard).toBe('#1a1c20')
    expect(defaultTheme.text).toBe('#ebebec')
    expect(defaultTheme.textSecondary).toBe('#9b9c9e')
    expect(defaultTheme.coral).toBe('#96b8f7')
    expect(defaultTheme.lavender).toBe('#b896f7')
  })
})
