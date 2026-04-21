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

// Correct French text (with accents) and exact metrics from the static portfolio HTML.
// projects.ts has stripped accents — these overrides are the source of truth for display.
const PORTFOLIO_CONTENT: Record<string, {
  name: [string, string];
  tagline: string;
  problem: string;
  solution: string;
  result: string;
  tags: string[];
  metrics: MetricChip[];
}> = {
  atlas: {
    name: ['Atlas', 'Analytics'],
    tagline: 'Un tableau de bord temps réel pour équipes data.',
    problem: "L'ancien outil était lent, surchargé et ne permettait pas d'analyser les flux en temps réel.",
    solution: "Refonte complète avec React, WebSockets et visualisations sur-mesure. Architecture réactive du back au front.",
    result: "Temps d'analyse réduit de 60 %, adoption en hausse de 85 % dès le premier mois.",
    tags: ['SaaS', 'React', 'Node.js', 'PostgreSQL', 'AWS', '2025'],
    metrics: [
      { n: '−60', suf: '%', l: "Temps d'analyse" },
      { n: '+85', suf: '%', l: 'Adoption utilisateur' },
      { n: '−2.4', suf: 's', l: 'Temps de chargement' },
    ],
  },
  pulse: {
    name: ['Meridian', 'Capital'],
    tagline: 'Un terminal de trading qui rend la densité lisible.',
    problem: "Un mur de chiffres illisible : les analystes perdaient 30 secondes par décision à chercher l'information.",
    solution: "Re-conception complète de l'interface en Next.js, hiérarchie visuelle claire, streaming temps réel via gRPC.",
    result: "Prise de décision trois fois plus rapide sur 4.2 milliards d'euros traités.",
    tags: ['Fintech', 'Next.js', 'TypeScript', 'gRPC', '2024'],
    metrics: [
      { n: '×3', suf: '', l: 'Rapidité de décision' },
      { n: '€4.2', suf: 'B', l: 'Volume quotidien' },
      { n: '<1', suf: 's', l: 'Latence stream' },
    ],
  },
  verde: {
    name: ['Lumen', 'Studio'],
    tagline: "Billetterie et site vitrine pour une galerie d'art.",
    problem: "Un site WordPress figé, impossible à mettre à jour, conversion billetterie autour de 1.2 %.",
    solution: "Refonte sous Astro + Stripe avec CMS headless (Sanity). Parcours de réservation en 3 clics.",
    result: "Conversion billetterie à 4.8 %, ventes en ligne + 142 % sur 6 mois.",
    tags: ['Astro', 'Stripe', 'Sanity', '2025'],
    metrics: [
      { n: '+142', suf: '%', l: 'Ventes en ligne' },
      { n: '4.8', suf: '%', l: 'Taux de conversion' },
      { n: '3', suf: ' clics', l: 'Parcours réservation' },
    ],
  },
  koi: {
    name: ['Koi', 'Financial'],
    tagline: 'Banque, fiscalité et facturation pour freelances.',
    problem: "Les freelances jonglaient entre 4 outils. TVA oubliée, trésorerie floue, temps perdu.",
    solution: "App web React Native Web avec moteur de règles fiscales FR, facturation intégrée et vue trésorerie temps réel.",
    result: "Freelances couverts : 4 200 utilisateurs actifs en 8 mois, NPS 62.",
    tags: ['React Native Web', 'Rails', 'PostgreSQL', 'Stripe', '2026'],
    metrics: [
      { n: '4 200', suf: '', l: 'Utilisateurs actifs' },
      { n: '62', suf: '', l: 'NPS mesuré' },
      { n: '8', suf: ' mois', l: 'Délai de lancement' },
    ],
  },
  verso: {
    name: ['Verso', 'Journal'],
    tagline: 'Un journal numérique qui se lit lentement.',
    problem: "Un site éditorial avec pubs envahissantes, temps de lecture moyen en chute libre.",
    solution: "Refonte sans pub, grille inspirée de la presse 70s. Lecteur Astro + MDX, performances 100/100 Lighthouse.",
    result: "Temps moyen par article : de 1:40 à 7:12 sur mobile. +310 % d'abonnés payants.",
    tags: ['Astro', 'MDX', 'Vercel', '2026'],
    metrics: [
      { n: '7:12', suf: '', l: 'Lecture moyenne mobile' },
      { n: '+310', suf: '%', l: "Abonnés payants" },
      { n: '100', suf: '/100', l: 'Score Lighthouse' },
    ],
  },
  helios: {
    name: ['Helios', 'Brew'],
    tagline: 'Shop en ligne et abonnement café.',
    problem: "Un Shopify par défaut, panier moyen stagnant, pas d'abonnement.",
    solution: "Thème Shopify Hydrogen sur-mesure, moteur d'abonnement maison, storytelling produit riche.",
    result: "Panier moyen × 2.4 ; 38 % du CA en abonnement récurrent après 4 mois.",
    tags: ['Shopify Hydrogen', 'Remix', 'Stripe', '2026'],
    metrics: [
      { n: '×2.4', suf: '', l: 'Panier moyen' },
      { n: '38', suf: '%', l: 'CA en abonnement' },
      { n: '4', suf: ' mois', l: "Délai d'atteinte" },
    ],
  },
  puybernier: {
    name: ['Domaine de', 'Puybernier'],
    tagline: 'Domaine provençal de 200 hectares — une présence digitale à la hauteur du standing.',
    problem: "Le domaine manquait d'une présence digitale à la hauteur de son standing, les réservations passaient encore par téléphone.",
    solution: "Site immersif avec visite virtuelle, réservation en ligne et storytelling photographique du domaine.",
    result: "Réservations en ligne +120 %, temps moyen sur le site 4 min 30 s.",
    tags: ['Next.js', 'Sanity', 'Vercel', '2024'],
    metrics: [
      { n: '+120', suf: '%', l: 'Réservations en ligne' },
      { n: '4:30', suf: '', l: 'Temps moyen sur le site' },
      { n: '200', suf: ' ha', l: 'Domaine provençal' },
    ],
  },
  venizi: {
    name: ['Venizi', 'Jewelry'],
    tagline: 'Bijoux vénitiens accessibles — une boutique en ligne à la hauteur du positionnement premium.',
    problem: "La boutique en ligne ne reflétait pas le positionnement premium de la marque, taux de conversion bien en dessous du secteur.",
    solution: "Refonte complète de l'e-commerce avec mise en valeur produit, navigation par collection et expérience mobile-first.",
    result: "Taux de conversion +65 %, panier moyen en hausse de 28 %.",
    tags: ['Shopify', 'Liquid', 'Klaviyo', '2024'],
    metrics: [
      { n: '+65', suf: '%', l: 'Taux de conversion' },
      { n: '+28', suf: '%', l: 'Panier moyen' },
      { n: '3', suf: ' clics', l: 'Checkout optimisé' },
    ],
  },
  fondacio: {
    name: ['Fondacio', 'Community'],
    tagline: 'Mouvement international sur 4 continents — une plateforme unifiée pour une communauté mondiale.',
    problem: "Le site existant était fragmenté entre les différentes antennes internationales, sans cohérence visuelle ni parcours clair.",
    solution: "Plateforme unifiée multilingue avec CMS centralisé et navigation par mission, pays et programmes.",
    result: "Inscriptions aux programmes +90 %, cohérence de marque sur 4 continents.",
    tags: ['WordPress', 'PHP', 'ACF', '2024'],
    metrics: [
      { n: '+90', suf: '%', l: 'Inscriptions programmes' },
      { n: '4', suf: '', l: 'Continents couverts' },
      { n: '12', suf: '', l: 'Langues supportées' },
    ],
  },
  itsabouttogo: {
    name: ["It's About", 'To Go'],
    tagline: "7 mois à vélo de Bruxelles au Togo — un site pour documenter l'aventure en temps réel.",
    problem: "Le projet avait besoin d'une plateforme pour partager les reportages en temps réel et fidéliser l'audience.",
    solution: "Site avec carte interactive du parcours, blog de voyage et galeries photo immersives mises à jour sur la route.",
    result: "35 000 visiteurs uniques pendant le voyage, couverture médiatique dans 3 pays.",
    tags: ['Next.js', 'MDX', 'Mapbox', '2023'],
    metrics: [
      { n: '35K', suf: '', l: 'Visiteurs uniques' },
      { n: '14', suf: '', l: 'Pays traversés' },
      { n: '3', suf: '', l: 'Couvertures médias' },
    ],
  },
  mybob: {
    name: ['My', 'Bob'],
    tagline: 'Accessoires artisanaux du monde entier — le storytelling au cœur de chaque produit.',
    problem: "La marque peinait à transmettre son histoire artisanale en ligne, les fiches produits étaient génériques.",
    solution: "Storytelling par artisan, fiches produits enrichies avec origine et savoir-faire, checkout optimisé.",
    result: "Taux de retour −40 %, engagement sur les pages produit +55 %.",
    tags: ['Shopify', 'Liquid', 'Klaviyo', '2024'],
    metrics: [
      { n: '−40', suf: '%', l: 'Taux de retour' },
      { n: '+55', suf: '%', l: 'Engagement produit' },
      { n: '×2', suf: '', l: 'Pages produit vues' },
    ],
  },
  centrespms: {
    name: ['Centres', 'PMS'],
    tagline: 'Accompagnement psychologique et social gratuit — un site accessible à toutes les familles.',
    problem: "Les familles avaient du mal à trouver les informations et à comprendre les services proposés par les centres PMS.",
    solution: "Site accessible et clair avec parcours par profil (parent, élève, enseignant) et prise de rendez-vous simplifiée.",
    result: "Demandes de rendez-vous en ligne +150 %, score d'accessibilité WCAG AA atteint.",
    tags: ['WordPress', 'PHP', 'WCAG', '2024'],
    metrics: [
      { n: '+150', suf: '%', l: 'RDV en ligne' },
      { n: 'AA', suf: '', l: 'Score WCAG' },
      { n: '3', suf: '', l: 'Profils utilisateurs' },
    ],
  },
  delphinesimonis: {
    name: ['Delphine', 'Simonis'],
    tagline: 'Peintures abstraites avec audiodescriptions — une galerie accessible et immersive.',
    problem: "L'artiste avait besoin d'une galerie en ligne qui mette en valeur ses œuvres tout en restant accessible aux malvoyants.",
    solution: "Galerie immersive avec audiodescriptions intégrées, navigation par série et expérience plein écran.",
    result: "Ventes en ligne lancées, 12 expositions promues, accessibilité saluée par la communauté.",
    tags: ['Next.js', 'Sanity', 'Vercel', '2023'],
    metrics: [
      { n: '12', suf: '', l: 'Expositions promues' },
      { n: '100', suf: '%', l: 'Accessibilité WCAG' },
      { n: '1er', suf: '', l: 'Lancement e-commerce' },
    ],
  },
  trussogne: {
    name: ['Gîte de', 'Trussogne'],
    tagline: "Maison de vacances dans les Ardennes — sortir des plateformes et vendre en direct.",
    problem: "Le gîte dépendait entièrement de plateformes tierces (Airbnb, Booking) avec des commissions élevées.",
    solution: "Site avec réservation directe, galerie immersive des espaces et mise en avant des activités nature.",
    result: "Réservations directes 45 % du total, commission économisée estimée à 8 000 € par an.",
    tags: ['Next.js', 'Lodgify', 'Stripe', '2024'],
    metrics: [
      { n: '45', suf: '%', l: 'Réservations directes' },
      { n: '8K€', suf: '', l: 'Commission économisée/an' },
      { n: '2', suf: ' mois', l: 'Délai de livraison' },
    ],
  },
  eren: {
    name: ['Eren', 'Energy'],
    tagline: 'Batteries industrielles pour entreprises — un site qui génère des leads qualifiés.',
    problem: "EREN manquait de visibilité en ligne et générait ses leads principalement par le bouche-à-oreille.",
    solution: "Site corporate avec calculateur d'économies, études de cas détaillées et tunnel de conversion optimisé.",
    result: "Leads qualifiés +200 %, coût d'acquisition divisé par 3.",
    tags: ['Next.js', 'HubSpot', 'Vercel', '2024'],
    metrics: [
      { n: '+200', suf: '%', l: 'Leads qualifiés' },
      { n: '÷3', suf: '', l: "Coût d'acquisition" },
      { n: '2', suf: ' mois', l: 'Délai de livraison' },
    ],
  },
  aluvi: {
    name: ['Aluvi', 'Immo'],
    tagline: 'Gestion de copropriété et transactions à Bruxelles — un site qui attire les mandats.',
    problem: "Le site ne reflétait pas le professionnalisme de l'agence et n'attirait pas de mandats en ligne.",
    solution: "Refonte avec mise en avant des services, témoignages clients et formulaires de contact segmentés.",
    result: "Demandes de mandat en ligne +80 %, positionnement SEO local top 5.",
    tags: ['WordPress', 'PHP', 'Yoast', '2024'],
    metrics: [
      { n: '+80', suf: '%', l: 'Mandats en ligne' },
      { n: 'Top 5', suf: '', l: 'SEO local' },
      { n: '2', suf: ' mois', l: 'Délai de livraison' },
    ],
  },
  dripdrops: {
    name: ['Drip', 'Drops'],
    tagline: "Sneakers hype et streetwear — l'urgence et l'exclusivité au cœur de l'expérience.",
    problem: "La boutique avait du mal à créer l'urgence et l'exclusivité que recherchent les acheteurs de sneakers limitées.",
    solution: "E-commerce avec système de drops programmés, compte à rebours, notifications et expérience mobile-first.",
    result: "Sell-out en moins de 2h sur les drops, base email +10 000 en 6 mois.",
    tags: ['Shopify', 'Liquid', 'Klaviyo', '2023'],
    metrics: [
      { n: '<2h', suf: '', l: 'Sell-out sur les drops' },
      { n: '+10K', suf: '', l: 'Emails en 6 mois' },
      { n: '2', suf: ' mois', l: 'Délai de livraison' },
    ],
  },
  basseilles: {
    name: ['Ferme de', 'Basseilles'],
    tagline: 'Dômes, bulles, cabanes dans une ferme historique — réserver en direct, sans intermédiaire.',
    problem: "La diversité des hébergements rendait la navigation confuse et les réservations compliquées.",
    solution: "Site avec parcours de découverte visuel, filtrage par type d'expérience et réservation directe intégrée.",
    result: "Réservations directes +70 %, durée moyenne de séjour +0.8 nuit.",
    tags: ['Next.js', 'Lodgify', 'Stripe', '2024'],
    metrics: [
      { n: '+70', suf: '%', l: 'Réservations directes' },
      { n: '+0.8', suf: ' nuit', l: 'Durée moyenne séjour' },
      { n: '2', suf: ' mois', l: 'Délai de livraison' },
    ],
  },
  azzaizzy: {
    name: ['Azza', 'Izzy'],
    tagline: 'Leader européen du scrapbooking — 5 000 produits, une navigation repensée.',
    problem: "Le catalogue de plus de 5 000 produits était difficile à naviguer et les clientes ne trouvaient pas l'inspiration.",
    solution: "Recherche avancée avec Algolia, navigation par projet créatif et tutoriels intégrés aux fiches produit.",
    result: "Taux de conversion +45 %, pages vues par session +60 %.",
    tags: ['Shopify', 'Liquid', 'Algolia', '2023'],
    metrics: [
      { n: '+45', suf: '%', l: 'Taux de conversion' },
      { n: '+60', suf: '%', l: 'Pages vues/session' },
      { n: '5K', suf: '', l: 'Produits catalogués' },
    ],
  },
  gvegroup: {
    name: ['GVE', 'Group'],
    tagline: 'Solutions à impact pour entreprises durables — un site qui communique la diversité sans diluer.',
    problem: "GVE Group avait du mal à communiquer la diversité de ses activités sans diluer son message principal.",
    solution: "Architecture d'information par secteur avec storytelling d'impact et études de cas interactives.",
    result: "Temps passé sur le site +85 %, demandes de partenariat +50 %.",
    tags: ['Next.js', 'Sanity', 'Vercel', '2024'],
    metrics: [
      { n: '+85', suf: '%', l: 'Temps sur le site' },
      { n: '+50', suf: '%', l: 'Demandes partenariat' },
      { n: '2', suf: ' mois', l: 'Délai de livraison' },
    ],
  },
  foorn: {
    name: ['Foorn', 'Beirut'],
    tagline: 'Saveurs libanaises à Bruxelles — faire découvrir le kaak au grand public.',
    problem: "Le restaurant avait besoin de se démarquer dans le paysage bruxellois et de faire connaître le kaak.",
    solution: "Site vitrine appétissant avec menu digital, commande en ligne et storytelling sur les origines libanaises.",
    result: "Commandes en ligne 30 % du CA, notoriété locale en forte hausse.",
    tags: ['Next.js', 'Sanity', 'Vercel', '2024'],
    metrics: [
      { n: '30', suf: '%', l: 'CA en ligne' },
      { n: '2', suf: ' mois', l: 'Délai de livraison' },
      { n: '↑', suf: '', l: 'Notoriété locale' },
    ],
  },
  alianature: {
    name: ['Alia', 'Nature'],
    tagline: "Beauté et bien-être naturels et locaux — une boutique qui met l'humain au centre.",
    problem: "La marque manquait de visibilité face aux géants du naturel et ne mettait pas assez en avant son ancrage local.",
    solution: "E-commerce chaleureux avec mise en avant des productrices, contenu éducatif et programme de fidélité.",
    result: "Ventes en ligne +90 %, taux de fidélisation 35 %.",
    tags: ['Shopify', 'Liquid', 'Klaviyo', '2023'],
    metrics: [
      { n: '+90', suf: '%', l: 'Ventes en ligne' },
      { n: '35', suf: '%', l: 'Taux de fidélisation' },
      { n: '2', suf: ' mois', l: 'Délai de livraison' },
    ],
  },
};

export function getPortfolioContent(slug: string) {
  return PORTFOLIO_CONTENT[slug];
}

function deriveScene(p: ProjectData): SceneKind {
  return SCENE_MAP[p.category] ?? 'dashboard';
}

function deriveMetrics(p: ProjectData): MetricChip[] {
  // Use override metrics if available (correct French text)
  const override = PORTFOLIO_CONTENT[p.id];
  if (override) return override.metrics;

  if (p.caseStudy?.metrics && p.caseStudy.metrics.length > 0) {
    return p.caseStudy.metrics.slice(0, 3).map(m => {
      const match = m.value.match(/^([+\-×÷<>≈~]?[\d.,KMB]+[+\-×÷]?)(.*)?$/);
      return {
        n: match ? match[1] : m.value,
        suf: match && match[2] ? match[2].trim() : '',
        l: m.label,
      };
    });
  }
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
    .map((p, i) => {
      const override = PORTFOLIO_CONTENT[p.id];
      return {
        slug: p.id,
        num: String(i + 1).padStart(3, '0'),
        kind: `${p.category} · ${p.industry}`,
        name: override?.name ?? ([p.title1, p.title2] as [string, string]),
        tagline: override?.tagline ?? p.subtitle,
        problem: override?.problem ?? p.narrative.problem,
        solution: override?.solution ?? p.narrative.solution,
        result: override?.result ?? p.narrative.outcome,
        tags: override?.tags ?? [...p.tech.split(', '), p.year],
        metrics: deriveMetrics(p),
        scene: deriveScene(p),
        caption: [`Fig. ${String(i + 1).padStart(3, '0')} — ${p.category}`, p.client],
        quote: [override?.result ?? p.narrative.outcome, `— ${p.client}`],
        year: p.year,
        heroImg: p.heroImg,
        websiteUrl: p.websiteUrl,
      };
    });
}
