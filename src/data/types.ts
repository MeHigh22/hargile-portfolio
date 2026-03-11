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
  industry: string;
  narrative: ProjectNarrative;
  caseStudy?: CaseStudyContent;
}
