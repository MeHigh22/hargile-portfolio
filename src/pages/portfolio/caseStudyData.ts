export type SceneKey = 'dashboard' | 'trading' | 'gallery' | 'banking' | 'editorial' | 'shop';

export interface CaseStudyProject {
  slug: string;
  num: string;
  kind: string;
  name: [string, string];
  client: string;
  year: string;
  duration: string;
  team: string;
  tagline: string;
  problem: string;
  approach: string;
  outcome: string;
  pull: string;
  quote: [string, string];
  metrics: { n: string; suf: string; l: string; s: string }[];
  stack: [string, string][];
  timeline: [string, string, string][];
  scene: SceneKey;
  gallery: [SceneKey, SceneKey];
}

import { adaptProjects } from './portfolioDataAdapter';
import { projects } from '../../data/projects';

const _adapted = adaptProjects(projects);

function buildFromAdapter(slug: string): CaseStudyProject | null {
  const s = _adapted.find(p => p.slug === slug);
  if (!s) return null;
  const techTags = s.tags.slice(0, -1); // drop year
  const sceneMap: Record<string, SceneKey> = {
    dashboard: 'dashboard', trading: 'trading', gallery: 'gallery',
    banking: 'banking', editorial: 'editorial', shop: 'shop',
  };
  const sc: SceneKey = sceneMap[s.scene] ?? 'dashboard';
  const gallery2: SceneKey = sc === 'dashboard' ? 'gallery'
    : sc === 'shop' ? 'editorial'
    : sc === 'gallery' ? 'dashboard'
    : 'dashboard';
  return {
    slug: s.slug,
    num: s.num,
    kind: s.kind,
    name: s.name,
    client: s.caption[1],
    year: s.year,
    duration: s.metrics[2]?.n ? `${s.metrics[2].n}${s.metrics[2].suf} semaines` : '12 semaines',
    team: '2 devs · 1 designer',
    tagline: s.tagline,
    problem: s.problem,
    approach: s.solution,
    outcome: s.result,
    pull: `« ${s.tagline} »`,
    quote: s.quote,
    metrics: s.metrics.map(m => ({ ...m, s: '' })),
    stack: techTags.map((t, i) => {
      const labels = ['Frontend', 'Backend', 'Base', 'Infra', 'CMS', 'Paiement', 'Analytics', 'Auth'];
      return [labels[i] ?? `Tech ${i + 1}`, t] as [string, string];
    }),
    timeline: [
      ['Phase 1', 'Découverte et cadrage', ''],
      ['Phase 2', 'Conception et prototypage', ''],
      ['Phase 3', 'Développement', ''],
      ['Phase 4', 'Tests et recette', ''],
      ['Phase 5', 'Lancement', ''],
    ],
    scene: sc,
    gallery: [sc, gallery2],
  };
}

export function getCaseStudy(slug: string): CaseStudyProject {
  const handcrafted = CASE_STUDY_PROJECTS.find(p => p.slug === slug);
  if (handcrafted) return handcrafted;
  return buildFromAdapter(slug) ?? CASE_STUDY_PROJECTS[0];
}

export function getAllSlugs(): string[] {
  return _adapted.map(p => p.slug);
}

export const CASE_STUDY_PROJECTS: CaseStudyProject[] = [
  {
    slug: 'atlas',
    num: '001',
    kind: 'Plateforme SaaS · Analytics',
    name: ['Atlas', 'Analytics'],
    client: 'Atlas Data SAS',
    year: '2025',
    duration: '14 semaines',
    team: '3 devs · 1 designer',
    tagline: "Un tableau de bord temps réel qui tient la charge de 1.2 million d'événements par jour.",
    problem: "L'outil historique d'Atlas — un dashboard Angular 2018 — accumulait les dettes techniques. Les analystes attendaient 8 à 12 secondes pour rafraîchir une vue. Impossible de brancher de nouvelles sources de données sans casser l'existant.",
    approach: "Nous avons réécrit l'application sur React 18 + TanStack Query, avec un back-end Fastify en streaming WebSocket. Chaque vue est un composant isolé, cacheable, progressivement hydraté. L'infrastructure tourne sur AWS Fargate avec auto-scaling.",
    outcome: "Temps de rafraîchissement passé de 12s à 400ms. L'équipe data a pu connecter 4 nouvelles sources en 2 semaines — un travail estimé à 3 mois sur l'ancien code. NPS interne : de 18 à 64.",
    pull: "Ce n'est pas une refonte, c'est un changement de vitesse.",
    quote: ["On prend des décisions en temps réel, plus en temps archivé.", "Claire M., Head of Data, Atlas"],
    metrics: [
      { n: '−60', suf: '%', l: "Temps d'analyse", s: 'Mesuré sur les 5 vues les plus consultées.' },
      { n: '+85', suf: '%', l: 'Adoption hebdo', s: 'MAU sur les 4 premières semaines post-lancement.' },
      { n: '1.2M', suf: '', l: 'Événements / jour', s: 'Pic à 3.4M sans dégradation.' },
      { n: '400', suf: 'ms', l: 'Refresh P95', s: 'Contre 12s auparavant.' },
    ],
    stack: [
      ['Frontend', 'React 18'], ['Data', 'TanStack Query'], ['Backend', 'Fastify + WS'], ['Base', 'PostgreSQL 16'],
      ['Infra', 'AWS Fargate'], ['Observabilité', 'Grafana'], ['CI / CD', 'GitHub Actions'], ['Auth', 'Auth0'],
    ],
    timeline: [
      ['S. 01-02', 'Audit technique, interviews utilisateurs', '3 ateliers · 12 entretiens'],
      ['S. 03-06', 'Prototypes et système de design', 'Storybook · 42 composants'],
      ['S. 07-11', 'Développement itératif par vue', '14 releases en staging'],
      ['S. 12-13', 'Recette, migration de données', '8.2 TB migrés sans perte'],
      ['S. 14', 'Mise en production', '0 incident P1'],
    ],
    scene: 'dashboard',
    gallery: ['dashboard', 'gallery'],
  },
  {
    slug: 'meridian',
    num: '002',
    kind: 'Fintech · Terminal de trading',
    name: ['Meridian', 'Capital'],
    client: 'Meridian Capital Ltd.',
    year: '2024',
    duration: '22 semaines',
    team: '4 devs · 2 designers',
    tagline: "Un terminal de trading institutionnel pensé pour la décision, pas pour l'admiration.",
    problem: "Les analystes de Meridian travaillaient sur un terminal legacy où 42 indicateurs se superposaient sur une seule vue. Chaque décision demandait 30 à 40 secondes de recherche visuelle.",
    approach: "Reconception complète autour de 4 vues hiérarchisées — marché, position, ordre, post-trade. Next.js pour le rendu, gRPC-Web pour le streaming, canvas WebGL pour les graphiques lourds. Chaque millième de seconde compte.",
    outcome: "La prise de décision est 3× plus rapide. Sur 4.2 milliards d'euros traités quotidiennement, un gain même marginal par ordre change la marge.",
    pull: "Un terminal invisible qui se fait oublier au moment exact où il devient indispensable.",
    quote: ["Le genre d'interface qu'on ne remarque plus — c'est un compliment.", "D. Halberd, CTO, Meridian"],
    metrics: [
      { n: '×3', suf: '', l: 'Rapidité décision', s: 'Mesurée sur 1 000 ordres types.' },
      { n: '€4.2', suf: 'B', l: 'Volume quotidien', s: 'Moyenne sur Q1 2025.' },
      { n: '−42', suf: '%', l: 'Tickets support', s: 'Après 3 mois en production.' },
      { n: '8', suf: 'ms', l: 'Latence ordre P95', s: "De la frappe à l'exécution." },
    ],
    stack: [
      ['Frontend', 'Next.js 14'], ['Data', 'gRPC-Web'], ['Graphiques', 'Canvas WebGL'], ['Backend', 'Rust + Tokio'],
      ['Base', 'TimescaleDB'], ['Infra', 'GCP Confidential'], ['Auth', 'Passkey + HSM'], ['Monitoring', 'Datadog'],
    ],
    timeline: [
      ['S. 01-04', 'Shadowing des traders, cartographie cognitive', '8 journées en salle de marché'],
      ['S. 05-09', 'Système de design haute densité', '72 composants · 4 densités'],
      ['S. 10-18', 'Développement incrémental', 'Déploiement en dark launch'],
      ['S. 19-21', 'Bench et stress tests', '10k ordres/s soutenus'],
      ['S. 22', 'Go-live pondéré', '5 % puis 25 % puis 100 %'],
    ],
    scene: 'trading',
    gallery: ['trading', 'dashboard'],
  },
  {
    slug: 'lumen',
    num: '003',
    kind: 'E-commerce · Billetterie',
    name: ['Lumen', 'Studio'],
    client: 'Lumen Studio Bordeaux',
    year: '2025',
    duration: '10 semaines',
    team: '2 devs · 1 designer',
    tagline: "Billetterie et site vitrine pour une galerie qui voulait qu'on la lise, pas qu'on la scrolle.",
    problem: "Un WordPress lent, un plugin billetterie qui imposait sa marque, un taux de conversion à 1.2 %. L'équipe de Lumen passait 4h/semaine à mettre à jour des contenus.",
    approach: "Astro + Sanity pour le contenu statique, Stripe Checkout pour le paiement. Un seul design system, des pages qui se chargent en moins de 400ms. L'équipe édite tout depuis un studio maison.",
    outcome: "Conversion billetterie à 4.8 %, ventes en ligne + 142 %. L'équipe n'a plus besoin d'un développeur pour publier une exposition.",
    pull: "Un site qui se lit à la lumière.",
    quote: ["Nos équipes mettent à jour le site sans nous appeler. Miracle.", "Camille D., directrice, Lumen Studio"],
    metrics: [
      { n: '+142', suf: '%', l: 'Ventes en ligne', s: '6 mois post-lancement.' },
      { n: '4.8', suf: '%', l: 'Conversion billet', s: 'Contre 1.2 % auparavant.' },
      { n: '3', suf: ' clics', l: 'Parcours achat', s: 'De la page expo au reçu.' },
      { n: '380', suf: 'ms', l: 'LCP moyen', s: 'Score Lighthouse 99.' },
    ],
    stack: [
      ['Frontend', 'Astro 4'], ['CMS', 'Sanity'], ['Paiement', 'Stripe Checkout'], ['Emails', 'Resend'],
      ['Hébergement', 'Vercel'], ['Analytics', 'Plausible'], ['DNS', 'Cloudflare'], ['Images', 'Cloudinary'],
    ],
    timeline: [
      ['S. 01-02', 'Atelier contenu, architecture', 'Cartographie en 3 niveaux'],
      ['S. 03-05', 'Design et système éditorial', 'Grille imprimée adaptée au web'],
      ['S. 06-08', 'Développement Astro + Sanity', 'Déployé en preview chaque jour'],
      ['S. 09', 'Migration du catalogue', '412 œuvres migrées'],
      ['S. 10', 'Lancement silencieux', 'Puis annonce newsletter'],
    ],
    scene: 'gallery',
    gallery: ['gallery', 'editorial'],
  },
  {
    slug: 'koi',
    num: '004',
    kind: 'App web · Néo-banque freelance',
    name: ['Koi', 'Financial'],
    client: 'Koi (fintech FR)',
    year: '2026',
    duration: '32 semaines',
    team: '6 devs · 2 designers',
    tagline: 'Une néo-banque qui comprend la fiscalité du freelance français.',
    problem: "Les indépendants jonglent entre 4 outils : banque, facturation, compta, URSSAF. Les erreurs coûtent cher. Koi voulait un seul produit qui couvre tout, sans jargon.",
    approach: "React Native Web pour partager 90 % du code entre app et web. Rails pour le back, PostgreSQL pour la persistance, un moteur de règles fiscales maison basé sur les barèmes BOI actualisés chaque trimestre.",
    outcome: "4 200 freelances actifs en 8 mois. NPS de 62. L'équipe a été rachetée par un groupe bancaire au printemps 2026.",
    pull: "La première banque qui fait les maths pour vous.",
    quote: ["C'est la première appli bancaire qui comprend mon métier.", "Léa R., graphiste indépendante"],
    metrics: [
      { n: '4 200', suf: '', l: 'Utilisateurs actifs', s: 'MAU sur mars 2026.' },
      { n: '62', suf: '', l: 'NPS', s: 'Enquête à 6 mois.' },
      { n: '8', suf: ' mois', l: 'Du kick-off au lancement', s: 'MVP public en semaine 20.' },
      { n: '90', suf: '%', l: 'Code partagé', s: 'App iOS · Android · web.' },
    ],
    stack: [
      ['Frontend', 'React Native Web'], ['Backend', 'Rails 7'], ['Base', 'PostgreSQL 16'], ['Paiement', 'Stripe + Lemonway'],
      ['Fiscalité', 'Moteur maison'], ['Infra', 'Scaleway'], ['Sécurité', 'HSM + 3DS2'], ['Observabilité', 'Sentry'],
    ],
    timeline: [
      ['S. 01-04', 'Découverte fiscalité, règles BOI', '14 interviews freelances'],
      ['S. 05-12', 'MVP sur 3 cas : LMNP, micro-BIC, BNC', 'Déploiement closed beta'],
      ['S. 13-24', 'Extension cas + facturation', '2 400 beta users'],
      ['S. 25-30', 'Compliance, audit PCI-DSS', 'Passé en septembre'],
      ['S. 31-32', 'Lancement public + campagne', 'Couvert par Les Échos'],
    ],
    scene: 'banking',
    gallery: ['banking', 'dashboard'],
  },
  {
    slug: 'verso',
    num: '005',
    kind: 'Site éditorial · Presse',
    name: ['Verso', 'Journal'],
    client: 'Verso Media',
    year: '2026',
    duration: '12 semaines',
    team: '2 devs · 1 designer',
    tagline: 'Un journal numérique qui se lit lentement — et rapporte plus.',
    problem: "Verso vivait de la pub programmatique. CPM en chute, lecteurs qui désinstallent l'app. Pari osé : supprimer toute la pub, passer au payant, miser sur la lecture longue.",
    approach: "Astro + MDX pour un rendu statique ultra-rapide. Un lecteur maison qui adapte la typographie au temps de lecture. Paywall Stripe, newsletter Resend, analytics sans cookies.",
    outcome: "Temps de lecture mobile : 1:40 → 7:12. Abonnés payants × 4.1. Score Lighthouse 100/100 sur toutes les pages.",
    pull: "Moins de pixels, plus de lecteurs.",
    quote: ["Lire Verso en ligne, c'est lire un magazine sans fin.", "Libération, janv. 2026"],
    metrics: [
      { n: '7:12', suf: '', l: 'Temps lecture mobile', s: 'Médiane sur avril 2026.' },
      { n: '+310', suf: '%', l: 'Abonnés payants', s: 'Premier trimestre post-paywall.' },
      { n: '100', suf: '/100', l: 'Lighthouse', s: 'Toutes pages, tous devices.' },
      { n: '0', suf: '', l: 'Pub programmatique', s: 'Par choix éditorial.' },
    ],
    stack: [
      ['Frontend', 'Astro 4 + MDX'], ['Paywall', 'Stripe Billing'], ['Newsletter', 'Resend'], ['Analytics', 'Plausible'],
      ['Hébergement', 'Vercel'], ['CMS', 'Keystatic'], ['Images', 'Cloudflare R2'], ['Search', 'Pagefind'],
    ],
    timeline: [
      ['S. 01-02', 'Audit du tunnel de lecture', '4 500 sessions étudiées'],
      ['S. 03-05', 'Système typographique', '7 tailles · 3 rythmes de lecture'],
      ['S. 06-09', 'Développement lecteur + paywall', 'Beta fermée 200 abonnés'],
      ['S. 10-11', 'Migration des archives', '1 842 articles migrés'],
      ['S. 12', 'Lancement public', 'Couvert par Télérama'],
    ],
    scene: 'editorial',
    gallery: ['editorial', 'gallery'],
  },
  {
    slug: 'helios',
    num: '006',
    kind: 'E-commerce · Torréfaction',
    name: ['Helios', 'Brew'],
    client: 'Helios Brew Co.',
    year: '2026',
    duration: '14 semaines',
    team: '2 devs · 2 designers',
    tagline: "Un Shopify sur-mesure qui transforme les clients en abonnés.",
    problem: "Un thème Shopify par défaut, panier moyen à 18€, aucun système d'abonnement. Helios voulait vendre un rituel, pas un sachet.",
    approach: "Migration vers Shopify Hydrogen + Remix pour un contrôle pixel-perfect. Moteur d'abonnement maison connecté à Stripe, storytelling produit en chapitres, photographie dirigée.",
    outcome: "Panier moyen × 2.4 (à 44€). 38 % du CA vient désormais de l'abonnement récurrent. Helios a ouvert un second point de vente à Paris.",
    pull: "On ne vend plus du café, on vend un rituel.",
    quote: ["Les gens reviennent toutes les deux semaines, comme pour une lettre.", "Ivan P., fondateur, Helios Brew"],
    metrics: [
      { n: '×2.4', suf: '', l: 'Panier moyen', s: 'De 18€ à 44€.' },
      { n: '38', suf: '%', l: 'CA récurrent', s: 'Abonnements mensuels.' },
      { n: '4', suf: ' mois', l: 'Retour sur invest.', s: 'Coûts de refonte remboursés.' },
      { n: '92', suf: '%', l: 'Rétention M1', s: 'Abonnés qui renouvellent.' },
    ],
    stack: [
      ['Frontend', 'Shopify Hydrogen'], ['Framework', 'Remix'], ['Abonnement', 'Stripe + maison'], ['CMS', 'Shopify Metaobjects'],
      ['Photos', 'Cloudinary'], ['Emails', 'Klaviyo'], ['Analytics', 'Shopify + Plausible'], ['Paiement', 'Shop Pay'],
    ],
    timeline: [
      ['S. 01-03', "Direction artistique, shoot produit", '180 photos · 14 sélectionnées'],
      ['S. 04-07', 'Thème Hydrogen sur-mesure', 'Système typographique complet'],
      ['S. 08-11', "Moteur d'abonnement", '3 fréquences · 8 grammages'],
      ['S. 12-13', 'Recette + migration Shopify', '0 downtime'],
      ['S. 14', 'Campagne de lancement', '+ 620 abonnés en 10 jours'],
    ],
    scene: 'shop',
    gallery: ['shop', 'editorial'],
  },
];
