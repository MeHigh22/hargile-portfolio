import { describe, it, expect } from 'vitest';
import { adaptProjects } from '../portfolioDataAdapter';
import { projects } from '../../../data/projects';

describe('adaptProjects', () => {
  const result = adaptProjects(projects);

  it('returns one entry per project', () => {
    expect(result).toHaveLength(projects.length);
  });

  it('sorts descending by year', () => {
    for (let i = 0; i < result.length - 1; i++) {
      expect(Number(result[i].year)).toBeGreaterThanOrEqual(Number(result[i + 1].year));
    }
  });

  it('zero-pads num correctly', () => {
    expect(result[0].num).toBe('001');
    expect(result[1].num).toBe('002');
    if (result.length >= 10) {
      expect(result[9].num).toBe('010');
    }
    // All nums should be 3-digit zero-padded strings
    result.forEach((entry, i) => {
      expect(entry.num).toBe(String(i + 1).padStart(3, '0'));
    });
  });

  it('slug matches project id', () => {
    // After sorting by year, slugs should still correspond 1:1 with input ids
    const sortedProjects = projects.slice().sort((a, b) => Number(b.year) - Number(a.year));
    result.forEach((entry, i) => {
      expect(entry.slug).toBe(sortedProjects[i].id);
    });
  });

  it('tags array ends with year string', () => {
    result.forEach((entry) => {
      const lastTag = entry.tags[entry.tags.length - 1];
      expect(lastTag).toBe(entry.year);
    });
  });

  it('assigns dashboard scene for Plateforme SaaS', () => {
    const saasProjIndex = result.findIndex(e => {
      const p = projects.find(p => p.id === e.slug);
      return p?.category === 'Plateforme SaaS';
    });
    expect(saasProjIndex).toBeGreaterThanOrEqual(0);
    expect(result[saasProjIndex].scene).toBe('dashboard');
  });

  it('assigns shop scene for E-commerce', () => {
    const entry = result.find(e => {
      const p = projects.find(p => p.id === e.slug);
      return p?.category === 'E-commerce';
    });
    expect(entry).toBeDefined();
    expect(entry!.scene).toBe('shop');
  });

  it('assigns gallery scene for Portfolio Artistique', () => {
    const entry = result.find(e => {
      const p = projects.find(p => p.id === e.slug);
      return p?.category === 'Portfolio Artistique';
    });
    expect(entry).toBeDefined();
    expect(entry!.scene).toBe('gallery');
  });

  it('assigns editorial scene for Site Institutionnel', () => {
    const entry = result.find(e => {
      const p = projects.find(p => p.id === e.slug);
      return p?.category === 'Site Institutionnel';
    });
    expect(entry).toBeDefined();
    expect(entry!.scene).toBe('editorial');
  });

  it('assigns banking scene for Application Mobile', () => {
    const entry = result.find(e => {
      const p = projects.find(p => p.id === e.slug);
      return p?.category === 'Application Mobile';
    });
    expect(entry).toBeDefined();
    expect(entry!.scene).toBe('banking');
  });

  it('maps caseStudy metrics for projects that have them', () => {
    // atlas has caseStudy with metrics
    const atlasEntry = result.find(e => e.slug === 'atlas');
    expect(atlasEntry).toBeDefined();
    const atlasProject = projects.find(p => p.id === 'atlas')!;
    expect(atlasProject.caseStudy?.metrics).toBeDefined();
    // Should have up to 3 chips from caseStudy.metrics
    expect(atlasEntry!.metrics.length).toBeGreaterThan(0);
    expect(atlasEntry!.metrics.length).toBeLessThanOrEqual(3);
    // Each chip must have n, suf, l
    atlasEntry!.metrics.forEach(chip => {
      expect(chip).toHaveProperty('n');
      expect(chip).toHaveProperty('suf');
      expect(chip).toHaveProperty('l');
    });
    // The label should match one of the caseStudy metric labels
    const atlasLabels = atlasProject.caseStudy!.metrics.slice(0, 3).map(m => m.label);
    expect(atlasLabels).toContain(atlasEntry!.metrics[0].l);
  });

  it('synthesizes 3 metrics for projects without caseStudy', () => {
    // puybernier has no caseStudy
    const puyEntry = result.find(e => e.slug === 'puybernier');
    expect(puyEntry).toBeDefined();
    expect(puyEntry!.metrics).toHaveLength(3);
    // Last synthesized metric should be the delivery time
    expect(puyEntry!.metrics[2].l).toBe('Délai de livraison');
    expect(puyEntry!.metrics[2].suf).toBe(' mois');
  });

  it('passes heroImg through unchanged', () => {
    const sortedProjects = projects.slice().sort((a, b) => Number(b.year) - Number(a.year));
    result.forEach((entry, i) => {
      expect(entry.heroImg).toBe(sortedProjects[i].heroImg);
    });
  });

  it('produces kind in category · industry format', () => {
    const sortedProjects = projects.slice().sort((a, b) => Number(b.year) - Number(a.year));
    result.forEach((entry, i) => {
      const p = sortedProjects[i];
      expect(entry.kind).toBe(`${p.category} · ${p.industry}`);
    });
  });
});
