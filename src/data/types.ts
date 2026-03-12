export interface ProjectColors {
  accent: string;
  background: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface ProjectNarrative {
  problem: string;
  solution: string;
  outcome: string;
}

export interface CaseStudyMetric {
  label: string;
  value: string;
}

export interface CaseStudyTimelineStep {
  phase: string;
  duration: string;
  description: string;
}

export interface CaseStudyTestimonial {
  quote: string;
  author: string;
  role: string;
}

export interface CaseStudyTeamMember {
  name: string;
  role: string;
}

export interface CaseStudyContent {
  challenge: string;
  solution: string;
  timeline: CaseStudyTimelineStep[];
  metrics: CaseStudyMetric[];
  deliverables: string[];
  galleryImages?: string[];
  testimonial: CaseStudyTestimonial;
  team: CaseStudyTeamMember[];
}

/**
 * Ambient feel of the slide — drives hero motion style + decorative background element.
 * 'grid'  = dot-matrix + slow horizontal drift     (data, SaaS, tech, precision)
 * 'pulse' = expanding rings + gentle vertical breathe  (health, wellness, rhythm)
 * 'drift' = floating organic blobs + diagonal drift   (eco, nature, lifestyle, luxury)
 * Add more types here as new project flavors are onboarded.
 */
export type SlideAmbience = 'grid' | 'pulse' | 'drift';

/**
 * Controls the content/image column ratio on desktop.
 * 'balanced'    = 45fr / 55fr  (default)
 * 'left-heavy'  = 55fr / 45fr  (more content space)
 * 'right-heavy' = 40fr / 60fr  (more image space)
 */
export type ImageRatio = 'balanced' | 'left-heavy' | 'right-heavy';

export interface ProjectData {
  id: string;
  title1: string;
  title2: string;
  category: string;
  year: string;
  subtitle: string;
  client: string;
  services: string;
  duration: string;
  tech: string;
  heroImg: string;
  colors: ProjectColors;
  ambience: SlideAmbience;
  imageRatio: ImageRatio;
  industry: string;
  narrative: ProjectNarrative;
  caseStudy?: CaseStudyContent;
}
