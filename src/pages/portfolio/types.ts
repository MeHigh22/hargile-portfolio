export type SceneKind = 'dashboard' | 'trading' | 'gallery' | 'banking' | 'editorial' | 'shop';

export interface MetricChip {
  n: string;   // e.g. '+85', '-60', '×3', '<2h'
  suf: string; // e.g. '%', ' mois', '' — appended after n in display
  l: string;   // label text (short, <= 40 chars)
}

export interface PortfolioSlideData {
  slug: string;
  num: string;              // '001', '002', ... (zero-padded, adapter-assigned)
  kind: string;             // e.g. 'Plateforme SaaS · Analytics'
  name: [string, string];   // [title1, title2] — displayed as h2 with em on second part
  tagline: string;
  problem: string;
  solution: string;
  result: string;
  tags: string[];           // [...tech.split(', '), year]
  metrics: MetricChip[];    // 2-3 chips shown in project right column
  scene: SceneKind;
  caption: [string, string];
  quote: [string, string];  // [quote text, attribution]
  year: string;
  heroImg: string;          // pass-through from ProjectData.heroImg
  websiteUrl?: string;
}
