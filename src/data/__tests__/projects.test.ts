import { describe, it, expect } from 'vitest'
import { projects } from '../projects'

describe('projects data', () => {
  it('has 12+ entries', () => {
    expect(projects.length).toBeGreaterThanOrEqual(12)
  })

  it('every project has all required fields', () => {
    const requiredFields = [
      'id', 'title1', 'title2', 'category', 'year',
      'subtitle', 'client', 'services', 'duration', 'tech',
      'heroImg', 'colors',
    ] as const

    for (const project of projects) {
      for (const field of requiredFields) {
        expect(project).toHaveProperty(field)
      }
    }
  })

  it('every project.colors has accent, background, gradientFrom, gradientTo', () => {
    for (const project of projects) {
      expect(project.colors).toHaveProperty('accent')
      expect(project.colors).toHaveProperty('background')
      expect(project.colors).toHaveProperty('gradientFrom')
      expect(project.colors).toHaveProperty('gradientTo')
    }
  })

  it('project IDs are unique', () => {
    const ids = projects.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('project IDs include original set plus new entries', () => {
    const ids = projects.map(p => p.id)
    const originalIds = ['atlas', 'pulse', 'verde', 'lumen', 'nexo']
    for (const id of originalIds) {
      expect(ids).toContain(id)
    }
    // New entries from Phase 2 expansion
    const newIds = ['aura', 'forge', 'prism', 'zenith', 'echo', 'orbit', 'coral']
    for (const id of newIds) {
      expect(ids).toContain(id)
    }
  })
})
