import { describe, it, expect } from 'vitest'
import { projects } from '../projects'
import type {
  CaseStudyContent,
  CaseStudyMetric,
  CaseStudyTimelineStep,
  CaseStudyTestimonial,
  CaseStudyTeamMember,
} from '../types'

describe('projects data — base fields', () => {
  it('has 3 entries (atlas, pulse, verde)', () => {
    expect(projects.length).toBe(3)
  })

  it('every project has all required base fields', () => {
    const requiredFields = [
      'id', 'title1', 'title2', 'category', 'year',
      'subtitle', 'client', 'services', 'duration', 'tech',
      'heroImg', 'colors', 'industry', 'narrative',
    ] as const

    for (const project of projects) {
      for (const field of requiredFields) {
        expect(project).toHaveProperty(field)
      }
    }
  })

  it('project IDs are atlas, pulse, verde', () => {
    const ids = projects.map(p => p.id)
    expect(ids).toContain('atlas')
    expect(ids).toContain('pulse')
    expect(ids).toContain('verde')
  })

  it('project IDs are unique', () => {
    const ids = projects.map(p => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('every project.colors has accent, background, gradientFrom, gradientTo', () => {
    for (const project of projects) {
      expect(project.colors).toHaveProperty('accent')
      expect(project.colors).toHaveProperty('background')
      expect(project.colors).toHaveProperty('gradientFrom')
      expect(project.colors).toHaveProperty('gradientTo')
    }
  })

  it('all projects have narrative with non-empty problem/solution/outcome', () => {
    for (const project of projects) {
      expect(project.narrative).toBeDefined()
      expect(project.narrative.problem.length).toBeGreaterThan(0)
      expect(project.narrative.solution.length).toBeGreaterThan(0)
      expect(project.narrative.outcome.length).toBeGreaterThan(0)
    }
  })

  it('all projects have non-empty industry', () => {
    for (const project of projects) {
      expect(project.industry).toBeDefined()
      expect(project.industry.length).toBeGreaterThan(0)
    }
  })
})

// Type shape tests — validate CaseStudy* interfaces compile correctly
describe('CaseStudyMetric type shape', () => {
  it('has label and value fields', () => {
    const metric: CaseStudyMetric = { label: 'Trafic organique', value: '+140%' }
    expect(metric.label).toBe('Trafic organique')
    expect(metric.value).toBe('+140%')
  })
})

describe('CaseStudyTimelineStep type shape', () => {
  it('has phase, duration, description fields', () => {
    const step: CaseStudyTimelineStep = {
      phase: 'Decouverte',
      duration: '3 semaines',
      description: 'Audit de l\'existant et ateliers utilisateurs.',
    }
    expect(step.phase).toBe('Decouverte')
    expect(step.duration).toBe('3 semaines')
    expect(step.description.length).toBeGreaterThan(0)
  })
})

describe('CaseStudyTestimonial type shape', () => {
  it('has quote, author, role fields', () => {
    const testimonial: CaseStudyTestimonial = {
      quote: 'Resultat exceptionnel.',
      author: 'Jean Dupont',
      role: 'Directeur Produit',
    }
    expect(testimonial.quote).toBe('Resultat exceptionnel.')
    expect(testimonial.author).toBe('Jean Dupont')
    expect(testimonial.role).toBe('Directeur Produit')
  })
})

describe('CaseStudyTeamMember type shape', () => {
  it('has name and role fields', () => {
    const member: CaseStudyTeamMember = { name: 'Marie Dupont', role: 'Lead Designer' }
    expect(member.name).toBe('Marie Dupont')
    expect(member.role).toBe('Lead Designer')
  })
})

describe('CaseStudyContent type shape', () => {
  it('has challenge, solution, timeline, metrics, deliverables, testimonial, team', () => {
    const content: CaseStudyContent = {
      challenge: 'Le defi.',
      solution: 'La solution.',
      timeline: [{ phase: 'P1', duration: '2w', description: 'Desc' }],
      metrics: [{ label: 'KPI', value: '100%' }],
      deliverables: ['Livrable 1'],
      testimonial: { quote: 'Super!', author: 'Pierre Martin', role: 'CEO' },
      team: [{ name: 'Sophie Leroy', role: 'Designer' }],
    }
    expect(content.challenge.length).toBeGreaterThan(0)
    expect(content.solution.length).toBeGreaterThan(0)
    expect(Array.isArray(content.timeline)).toBe(true)
    expect(Array.isArray(content.metrics)).toBe(true)
    expect(Array.isArray(content.deliverables)).toBe(true)
    expect(typeof content.testimonial).toBe('object')
    expect(Array.isArray(content.team)).toBe(true)
  })
})

describe('projects data — caseStudy completeness', () => {
  const projectIds = ['atlas', 'pulse', 'verde']

  for (const id of projectIds) {
    describe(`project: ${id}`, () => {
      it('has caseStudy property defined', () => {
        const project = projects.find(p => p.id === id)
        expect(project).toBeDefined()
        expect(project!.caseStudy).toBeDefined()
      })

      it('caseStudy.challenge is non-empty string', () => {
        const project = projects.find(p => p.id === id)!
        expect(project.caseStudy!.challenge.length).toBeGreaterThan(50)
      })

      it('caseStudy.solution is non-empty string', () => {
        const project = projects.find(p => p.id === id)!
        expect(project.caseStudy!.solution.length).toBeGreaterThan(50)
      })

      it('caseStudy.timeline has 4 steps with all fields', () => {
        const project = projects.find(p => p.id === id)!
        const { timeline } = project.caseStudy!
        expect(timeline.length).toBe(4)
        for (const step of timeline) {
          expect(step.phase.length).toBeGreaterThan(0)
          expect(step.duration.length).toBeGreaterThan(0)
          expect(step.description.length).toBeGreaterThan(0)
        }
      })

      it('caseStudy.metrics has 3-5 items with non-empty label and value', () => {
        const project = projects.find(p => p.id === id)!
        const { metrics } = project.caseStudy!
        expect(metrics.length).toBeGreaterThanOrEqual(3)
        expect(metrics.length).toBeLessThanOrEqual(5)
        for (const metric of metrics) {
          expect(metric.label.length).toBeGreaterThan(0)
          expect(metric.value.length).toBeGreaterThan(0)
        }
      })

      it('caseStudy.deliverables has 4-6 non-empty strings', () => {
        const project = projects.find(p => p.id === id)!
        const { deliverables } = project.caseStudy!
        expect(deliverables.length).toBeGreaterThanOrEqual(4)
        expect(deliverables.length).toBeLessThanOrEqual(6)
        for (const d of deliverables) {
          expect(d.length).toBeGreaterThan(0)
        }
      })

      it('caseStudy.testimonial has non-empty quote, author, role', () => {
        const project = projects.find(p => p.id === id)!
        const { testimonial } = project.caseStudy!
        expect(testimonial.quote.length).toBeGreaterThan(0)
        expect(testimonial.author.length).toBeGreaterThan(0)
        expect(testimonial.role.length).toBeGreaterThan(0)
      })

      it('caseStudy.team has 3-4 members with name and role', () => {
        const project = projects.find(p => p.id === id)!
        const { team } = project.caseStudy!
        expect(team.length).toBeGreaterThanOrEqual(3)
        expect(team.length).toBeLessThanOrEqual(4)
        for (const member of team) {
          expect(member.name.length).toBeGreaterThan(0)
          expect(member.role.length).toBeGreaterThan(0)
        }
      })
    })
  }
})
