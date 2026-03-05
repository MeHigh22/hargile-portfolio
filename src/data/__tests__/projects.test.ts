import { describe, it, expect } from 'vitest'
import { projects } from '../projects'

describe('projects data', () => {
  it('has exactly 5 entries', () => {
    expect(projects).toHaveLength(5)
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

  it('project IDs match expected set', () => {
    const ids = projects.map(p => p.id).sort()
    expect(ids).toEqual(['atlas', 'lumen', 'nexo', 'pulse', 'verde'])
  })
})
