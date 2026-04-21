import type { ProjectData } from '../../data/types';
import type { PortfolioSlideData, SceneKind, MetricChip } from './types';

const SCENE_MAP: Record<string, SceneKind> = {
  'Plateforme SaaS': 'dashboard',
  'Site Corporate': 'dashboard',
  'AgriTech': 'dashboard',
  'Application Mobile': 'banking',
  'E-commerce': 'shop',
  'Restauration': 'shop',
  'Portfolio Artistique': 'gallery',
  'Hotellerie de Luxe': 'gallery',
  'Hotellerie': 'gallery',
  'Site Institutionnel': 'editorial',
  'Media & Documentaire': 'editorial',
};

function deriveScene(p: ProjectData): SceneKind {
  return SCENE_MAP[p.category] ?? 'dashboard';
}

function deriveMetrics(p: ProjectData): MetricChip[] {
  if (p.caseStudy?.metrics && p.caseStudy.metrics.length > 0) {
    return p.caseStudy.metrics.slice(0, 3).map(m => {
      // Extract numeric-ish prefix as n, rest as suf
      const match = m.value.match(/^([+\-×÷<>≈~]?[\d.,KMB]+[+\-×÷]?)(.*)?$/);
      return {
        n: match ? match[1] : m.value,
        suf: match && match[2] ? match[2].trim() : '',
        l: m.label,
      };
    });
  }
  // Synthesize 3 metrics from narrative for projects without case studies
  const outcomeWords = p.narrative.outcome.split(',');
  return [
    { n: '↗', suf: '', l: outcomeWords[0]?.trim().slice(0, 40) ?? p.narrative.outcome.slice(0, 40) },
    { n: '✓', suf: '', l: `${p.category} · ${p.industry}` },
    { n: '2', suf: ' mois', l: 'Délai de livraison' },
  ];
}

export function adaptProjects(projects: ProjectData[]): PortfolioSlideData[] {
  return projects
    .slice()
    .sort((a, b) => Number(b.year) - Number(a.year))
    .map((p, i) => ({
      slug: p.id,
      num: String(i + 1).padStart(3, '0'),
      kind: `${p.category} · ${p.industry}`,
      name: [p.title1, p.title2] as [string, string],
      tagline: p.subtitle,
      problem: p.narrative.problem,
      solution: p.narrative.solution,
      result: p.narrative.outcome,
      tags: [...p.tech.split(', '), p.year],
      metrics: deriveMetrics(p),
      scene: deriveScene(p),
      caption: [`Fig. ${String(i + 1).padStart(3, '0')} — ${p.category}`, p.client],
      quote: [p.narrative.outcome, `— ${p.client}`],
      year: p.year,
      heroImg: p.heroImg,
      websiteUrl: p.websiteUrl,
    }));
}
