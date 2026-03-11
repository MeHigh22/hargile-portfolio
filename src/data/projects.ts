import type { ProjectData } from './types';

export const projects: ProjectData[] = [
  {
    id: 'atlas',
    title1: 'Atlas',
    title2: 'Analytics',
    category: 'Plateforme SaaS',
    year: '2025',
    subtitle: "Dashboard analytique en temps reel pour la gestion de donnees d'entreprise. Une refonte complete de l'experience utilisateur.",
    client: 'Atlas Corp.',
    services: 'UI/UX, Developpement, Branding',
    duration: '4 mois',
    tech: 'React, Node.js, AWS',
    heroImg: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?h=900&fit=crop&q=85',
    colors: {
      accent: '#96b8f7',
      background: '#06080d',
      gradientFrom: '#96b8f7',
      gradientTo: '#b896f7',
    },
    industry: 'SaaS',
    narrative: {
      problem: "L'ancien tableau de bord etait lent, encombre et ne permettait pas d'analyser les donnees en temps reel.",
      solution: "Refonte complete avec une architecture reactive et des visualisations interactives optimisees pour la prise de decision rapide.",
      outcome: "Temps d'analyse reduit de 60%, adoption utilisateur en hausse de 85% des le premier mois.",
    },
    caseStudy: {
      challenge:
        "Atlas Corp. gerait des volumes de donnees croissants a travers une interface vieillissante construite sur des technologies de 2018. Les equipes analytics passaient en moyenne trois heures par jour a exporter des rapports manuellement, a recroiser des sources disparates et a attendre que des tableaux de bord lents se chargent. La prise de decision etait systematiquement retardee, et les directeurs commerciaux se plaignaient de naviguer a l'aveugle lors des reunions de pilotage.\n\nLe systeme existant ne supportait pas la concurrence multi-utilisateurs, provoquant des conflits de versions sur les rapports partages. L'absence d'alertes en temps reel signifiait que les anomalies n'etaient detectees qu'a posteriori, parfois plusieurs jours apres leur apparition. Atlas Corp. estimait perdre des opportunites commerciales equivalentes a 2M€ par an a cause de ces delais d'information.",
      solution:
        "Hargile a conduit une refonte architecturale complete, en remplacant l'ancienne stack monolithique par une architecture reactive fondee sur des flux de donnees en temps reel. Nous avons concu un nouveau systeme de visualisation modulaire permettant a chaque equipe de composer ses propres vues sans intervention technique, tout en maintenant une coherence visuelle globale via un design system dedie.\n\nLa nouvelle plateforme integre un moteur d'alertes configurable, des tableaux de bord collaboratifs avec historique de versions, et une API GraphQL permettant d'agregger facilement de nouvelles sources de donnees. L'interface a ete entierement repensee selon les principes de progressive disclosure pour reduire la charge cognitive des utilisateurs avances tout en restant accessible aux nouveaux arrivants.",
      timeline: [
        {
          phase: 'Decouverte',
          duration: '3 semaines',
          description: "Audit de l'existant, entretiens avec 12 utilisateurs cles, cartographie des flux de donnees et definition des indicateurs de succes.",
        },
        {
          phase: 'Conception',
          duration: '5 semaines',
          description: "Elaboration du design system, prototypage des vues principales, tests utilisateurs iteratifs avec les equipes analytics d'Atlas.",
        },
        {
          phase: 'Developpement',
          duration: '8 semaines',
          description: "Integration de l'architecture reactive, developpement des composants de visualisation, mise en place du systeme d'alertes et des API.",
        },
        {
          phase: 'Lancement',
          duration: '2 semaines',
          description: "Migration progressive des donnees, formation des equipes, deploiement par vagues et suivi des metriques d'adoption.",
        },
      ],
      metrics: [
        { label: 'Temps d\'analyse', value: '-60%' },
        { label: 'Adoption utilisateur', value: '+85%' },
        { label: 'Temps de chargement', value: '-2.4s' },
        { label: 'Rapports automatises', value: '+320%' },
        { label: 'Satisfaction equipes', value: '4.7/5' },
      ],
      deliverables: [
        'Design system complet avec 48 composants documentés',
        'Dashboard analytique temps réel multi-sources',
        'Moteur d\'alertes configurable avec escalade automatique',
        'API GraphQL unifiée pour l\'agrégation de données',
        'Portail de formation interactif pour les équipes',
        'Guide de gouvernance data et conventions de nommage',
      ],
      testimonial: {
        quote: "Hargile a transforme la facon dont nos equipes prennent des decisions. Ce qui prenait trois heures se fait maintenant en dix minutes. Le ROI a ete visible des le premier trimestre apres le lancement.",
        author: 'Caroline Fontaine',
        role: 'Directrice des Operations, Atlas Corp.',
      },
      team: [
        { name: 'Thomas Beaumont', role: 'Lead Designer' },
        { name: 'Sarah Michelet', role: 'Ingenieure Frontend' },
        { name: 'Alexandre Perrin', role: 'Architecte Backend' },
        { name: 'Lucie Garnier', role: 'Strategiste UX' },
      ],
    },
  },
  {
    id: 'pulse',
    title1: 'Pulse',
    title2: 'Health',
    category: 'Application Mobile',
    year: '2025',
    subtitle: "Application de suivi sante avec interface intuitive, synchronisation en temps reel et experience utilisateur premium.",
    client: 'Pulse Inc.',
    services: 'UI/UX, App Mobile, Backend',
    duration: '6 mois',
    tech: 'React Native, Firebase, Swift',
    heroImg: 'https://images.unsplash.com/photo-1543722530-d2c3201371e7?h=900&fit=crop&q=85',
    colors: {
      accent: '#f76c6c',
      background: '#0d0608',
      gradientFrom: '#f76c6c',
      gradientTo: '#f7b86c',
    },
    industry: 'Sante',
    narrative: {
      problem: "Les patients avaient du mal a suivre leurs indicateurs de sante au quotidien avec les outils existants, trop complexes.",
      solution: "Une application mobile epuree avec synchronisation automatique des capteurs et alertes personnalisees.",
      outcome: "92% des utilisateurs suivent leurs objectifs sante quotidiennement, note de 4.8 sur les stores.",
    },
    caseStudy: {
      challenge:
        "Pulse Inc. avait identifie un probleme de sante publique majeur : malgre la proliferation des objets connectes, moins de 30% des patients cardiaques respectaient leur programme de suivi au-dela des trois premiers mois. Les applications existantes souffraient d'interfaces surchargees, de graphiques illisibles et de notifications intrusives qui decourageaient l'engagement a long terme. Les medecins manquaient egalement d'un outil pour consulter les donnees de leurs patients de maniere agregee.\n\nLe defi technique etait considerable : synchroniser en temps reel des donnees provenant de multiples capteurs (montres connectees, balances, glucometres) tout en maintenant une autonomie de batterie acceptable et en garantissant la conformite RGPD pour les donnees de sante. L'application devait fonctionner dans des zones de faible connectivite, courantes dans les environnements medicaux.",
      solution:
        "Hargile a adopte une approche centree sur la reduction de friction cognitive. Chaque ecran a ete concu autour d'une seule action principale, avec un parcours personnalise qui s'adapte au profil de sante de l'utilisateur. Le design exploite la couleur et le mouvement pour rendre les tendances de sante immediatement lisibles, sans necessite de comprendre les chiffres bruts.\n\nL'architecture technique repose sur un systeme de synchronisation hors-ligne-d'abord qui stocke les donnees localement et les reconcilie intelligemment lors de la reconnexion. Un tableau de bord medecin distinct, accessible via web, permet aux praticiens de suivre plusieurs patients simultanement avec des alertes prioritaires. La conformite RGPD a ete integree des la conception, avec un systeme de consentement granulaire et un chiffrement de bout en bout.",
      timeline: [
        {
          phase: 'Recherche',
          duration: '4 semaines',
          description: "Interviews approfondies avec 20 patients et 8 medecins, analyse des applications concurrentes, definition des personas et des scenarios d'usage critiques.",
        },
        {
          phase: 'Design',
          duration: '6 semaines',
          description: "Conception du systeme de navigation, design des visualisations sante, tests d'accessibilite et validation avec un panel de patients ages de 40 a 75 ans.",
        },
        {
          phase: 'Developpement',
          duration: '12 semaines',
          description: "Developpement React Native cross-platform, integration des SDK capteurs, implementation de la synchronisation offline-first et du chiffrement des donnees.",
        },
        {
          phase: 'Validation',
          duration: '4 semaines',
          description: "Tests cliniques avec un groupe pilote de 150 patients, corrections iteratives, audit de securite independant et soumission aux stores.",
        },
      ],
      metrics: [
        { label: 'Retention a 3 mois', value: '92%' },
        { label: 'Note stores', value: '4.8/5' },
        { label: 'Adherence au suivi', value: '+180%' },
        { label: 'Alertes medicales captees', value: '97%' },
      ],
      deliverables: [
        'Application iOS et Android avec synchronisation temps reel',
        'Tableau de bord medecin accessible via navigateur',
        'SDK d\'integration pour 12 types de capteurs connectes',
        'Systeme de notifications intelligentes non-intrusives',
        'Documentation technique et guide de conformite RGPD',
        'Programme d\'onboarding personnalise selon le profil patient',
      ],
      testimonial: {
        quote: "Depuis le lancement de Pulse, nous observons une transformation remarquable dans l'engagement de nos patients. Ils ne subissent plus leur sante, ils la comprennent et agissent. C'est exactement ce que la medecine preventive promettait sans jamais y parvenir.",
        author: 'Dr. Philippe Moreau',
        role: 'Cardiologue referent, Hopital Saint-Louis',
      },
      team: [
        { name: 'Emma Lefevre', role: 'Lead UX Designer' },
        { name: 'Nicolas Vidal', role: 'Developpeur React Native' },
        { name: 'Camille Rousseau', role: 'Ingenieure Backend Firebase' },
      ],
    },
  },
  {
    id: 'verde',
    title1: 'Verde',
    title2: 'Market',
    category: 'E-commerce',
    year: '2024',
    subtitle: "Marketplace eco-responsable avec une experience d'achat immersive et un design centre sur la durabilite.",
    client: 'Verde SAS',
    services: 'E-commerce, UI/UX, Branding',
    duration: '5 mois',
    tech: 'Next.js, Shopify, Stripe',
    heroImg: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?h=900&fit=crop&q=85',
    colors: {
      accent: '#4ade80',
      background: '#061a0d',
      gradientFrom: '#4ade80',
      gradientTo: '#86efac',
    },
    industry: 'E-commerce',
    narrative: {
      problem: "Les consommateurs eco-responsables manquaient d'une plateforme fiable pour trouver des produits durables et verifies.",
      solution: "Marketplace avec certification integree, empreinte carbone affichee et parcours d'achat gamifie.",
      outcome: "15 000 produits references, taux de conversion 3x superieur a la moyenne du secteur.",
    },
    caseStudy: {
      challenge:
        "Verde SAS observait un paradoxe : 68% des consommateurs francais declaraient vouloir acheter plus durable, mais seulement 12% le faisaient effectivement. Les raisons etaient claires — le manque de confiance dans les labels environnementaux, la difficulte a comparer les produits selon leur impact reel, et l'absence d'une experience d'achat qui rendait la durabilite desirable plutot que culpabilisante. Les marketplaces existantes traitaient le critere ecologique comme un filtre supplementaire, pas comme un avantage.\n\nCote vendeurs, les artisans et marques eco-responsables peinaient a se distinguer des produits green-washing, manquant d'outils pour mettre en valeur leurs demarches vertueuses. Verde SAS avait besoin d'une plateforme qui recompensait l'authenticite et transformait chaque achat en acte positif mesurable.",
      solution:
        "Hargile a concu Verde autour du concept d'impact visible. Chaque produit affiche son score environnemental calcule selon une methodologie transparente — empreinte carbone, eau economisee, matieres recyclees. Un systeme de certification progressive permet aux vendeurs de progresser vers des badges de confiance en soumettant des preuves verifiees. Cette transparence radicale est devenue l'argument commercial central de la plateforme.\n\nL'experience d'achat a ete gamifiee de maniere subtile : chaque achat contribue a un impact collectif visible sur la page d'accueil (arbres plantes, CO2 evite, emplois locaux soutenus). Un moteur de recommandation apprend les valeurs de chaque acheteur pour suggerer des alternatives plus durables a leurs habitudes actuelles. La plateforme Next.js a ete optimisee pour un score Lighthouse de 98, refletant les valeurs de performance et d'efficience de Verde.",
      timeline: [
        {
          phase: 'Strategie',
          duration: '3 semaines',
          description: "Definition de la methodologie de scoring environnemental, etude des certifications existantes (Ecocert, Fair Trade, B Corp) et conception du modele de confiance.",
        },
        {
          phase: 'Design',
          duration: '7 semaines',
          description: "Creation de l'identite visuelle Verde, design du systeme de badges, conception du parcours acheteur et du tableau de bord vendeur avec outils de certification.",
        },
        {
          phase: 'Developpement',
          duration: '10 semaines',
          description: "Integration Shopify headless avec Next.js, developpement du moteur de scoring, systeme de recommandation et tableau de bord d'impact collectif.",
        },
        {
          phase: 'Croissance',
          duration: '4 semaines',
          description: "Onboarding des premiers vendeurs, configuration des outils SEO, tests de charge et lancement progressif avec programme d'ambassadeurs.",
        },
      ],
      metrics: [
        { label: 'Produits references', value: '15 000+' },
        { label: 'Taux de conversion', value: '3x secteur' },
        { label: 'Score Lighthouse', value: '98/100' },
        { label: 'Vendeurs certifies', value: '340+' },
        { label: 'CO2 evite', value: '48t/mois' },
      ],
      deliverables: [
        'Marketplace Next.js headless avec Shopify comme backend',
        'Moteur de scoring environnemental et systeme de certification',
        'Tableau de bord vendeur avec outils de mise en valeur',
        'Systeme de recommandation personnalise par valeurs',
        'Page d\'impact collectif avec metriques en temps reel',
        'Guide editorial et charte d\'acceptation des produits',
      ],
      testimonial: {
        quote: "Verde a reussi ce que personne n'avait fait avant : rendre l'achat durable plus attrayant que l'achat ordinaire. Nos vendeurs voient leur chiffre d'affaires augmenter de 40% en moyenne dans les six mois suivant leur certification. C'est la preuve que la durabilite est un avantage competitif, pas une contrainte.",
        author: 'Beatrice Clément',
        role: 'Fondatrice et CEO, Verde SAS',
      },
      team: [
        { name: 'Julien Marchand', role: 'Directeur Creatif' },
        { name: 'Amelia Blanc', role: 'Designeuse Produit' },
        { name: 'Hugo Fernandez', role: 'Developpeur Fullstack' },
        { name: 'Margot Tissier', role: 'Responsable Contenu' },
      ],
    },
  },
];
