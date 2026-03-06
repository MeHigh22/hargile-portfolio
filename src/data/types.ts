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
}
