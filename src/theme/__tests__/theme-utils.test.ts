import { describe, it, expect, vi, beforeEach } from 'vitest'
import { applyTheme, defaultTheme, altTheme } from '../theme-utils'

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

  it('altTheme has different accent than defaultTheme', () => {
    expect(altTheme.accent).not.toBe(defaultTheme.accent)
  })
})
