/**
 * Constantes globales du site Supaco Digital.
 * Source unique pour le NAP (nom / adresse / téléphone), la navigation
 * et les métadonnées — cohérence stricte avec la fiche Google Business Profile.
 */

export const site = {
  name: "Supaco Digital",
  legalName: "Supaco Digital",
  founder: "Supa",
  domain: "supaco-digital.com",
  url: "https://supaco-digital.com",
  tagline: "Studio web & IA du bassin franco-suisse",
  description:
    "Supaco Digital conçoit des sites web, agents IA, SaaS sur-mesure et automatisations pour les TPE, PME et artisans du Pays de Gex et du bassin franco-suisse.",

  // NAP — doit rester identique partout (site, footer, JSON-LD, Google Business Profile)
  contact: {
    email: "contact@supaco-digital.com",
    // format affiché + format lien tel: (E.164)
    phone: "+33 7 83 05 24 12",
    phoneHref: "+33783052412",
    address: {
      locality: "Saint-Genis-Pouilly",
      region: "Ain",
      area: "Pays de Gex",
      postalCode: "01630",
      country: "FR",
    },
    // coordonnées approximatives de Saint-Genis-Pouilly (JSON-LD geo)
    geo: { latitude: 46.2436, longitude: 6.0217 },
  },

  // horaires — cohérence avec Google Business Profile
  hours: {
    label: "Sur rendez-vous, du lundi au vendredi",
    // format schema.org openingHours
    schema: "Mo-Fr 09:00-18:00",
  },

  // réseaux sociaux — alimentent `sameAs` du JSON-LD
  social: [
    {
      label: "Instagram",
      icon: "instagram" as const,
      href: "https://www.instagram.com/supacodigital/",
      handle: "@supacodigital",
    },
    {
      label: "Facebook",
      icon: "facebook" as const,
      href: "https://www.facebook.com/SupacoDigital/",
      handle: "SupacoDigital",
    },
    {
      label: "LinkedIn",
      icon: "linkedin" as const,
      href: "https://www.linkedin.com/in/supaco-digital-24384041b",
      handle: "Supaco Digital",
    },
  ],

  legal: {
    siret: "945 066 207",
    rcs: "RCS Bourg-en-Bresse 945 066 207",
    vatNote: "TVA non applicable, art. 293 B du CGI",
  },

  // fourchette de prix (JSON-LD priceRange) — pack Essentiel à Performance
  priceRange: "1 800 € – 4 500 €",

  // Bandeau défilant + phrase "zone d'intervention" du footer : liste courte,
  // orientée cœur de cible. Les villes exhaustives vivent dans `serviceAreas`.
  serviceArea: [
    "Saint-Genis-Pouilly",
    "Gex",
    "Ferney-Voltaire",
    "Prévessin-Moëns",
    "Thoiry",
    "Pays de Gex",
    "Bassin franco-suisse",
    "Genève",
  ],
} as const;

/**
 * Zones d'intervention détaillées — SEO local.
 * Regroupées en trois secteurs : cœur du Pays de Gex, reste de l'Ain (rayon
 * RCS Bourg-en-Bresse), et Genève / Suisse frontalière. Alimente le JSON-LD
 * `areaServed`, la page /services et les contenus locaux.
 */
export const serviceAreas = {
  paysDeGex: {
    label: "Pays de Gex",
    cities: [
      "Saint-Genis-Pouilly",
      "Gex",
      "Ferney-Voltaire",
      "Prévessin-Moëns",
      "Thoiry",
      "Cessy",
      "Segny",
      "Divonne-les-Bains",
      "Ornex",
      "Sergy",
      "Crozet",
    ],
  },
  ain: {
    label: "Ain",
    cities: [
      "Bourg-en-Bresse",
      "Oyonnax",
      "Valserhône",
      "Bellegarde-sur-Valserine",
      "Nantua",
      "Gex",
    ],
  },
  geneve: {
    label: "Genève et Suisse frontalière",
    cities: [
      "Genève",
      "Meyrin",
      "Grand-Saconnex",
      "Vernier",
      "Nyon",
    ],
  },
} as const;

/** Toutes les villes, dédupliquées — pour `areaServed` du JSON-LD. */
export const allServiceCities: string[] = Array.from(
  new Set(
    Object.values(serviceAreas).flatMap((zone) => [...zone.cities]),
  ),
);

/**
 * Mots-clés SEO transverses (agence web, création de site, informatique…).
 * Repris dans `knowsAbout` du JSON-LD et disponibles pour les contenus.
 * Google ignore `<meta keywords>` : on ne l'utilise donc pas — ces termes
 * servent au balisage structuré et à guider la rédaction on-page.
 */
export const seoKeywords: string[] = [
  "agence web Pays de Gex",
  "agence web Saint-Genis-Pouilly",
  "création de site internet Gex",
  "création de site web Ferney-Voltaire",
  "création site internet Pays de Gex",
  "agence digitale bassin franco-suisse",
  "développeur web Pays de Gex",
  "refonte de site internet",
  "site web pour artisan",
  "site vitrine TPE PME",
  "site e-commerce Ain",
  "agence web Genève frontalier",
  "prestataire informatique Pays de Gex",
  "développement d'applications sur-mesure",
  "agent IA pour entreprise",
  "automatisation des tâches",
  "création site web Bourg-en-Bresse",
  "webmaster Pays de Gex",
];

/**
 * Navigation principale — ancres de la page d'accueil + pages dédiées.
 * `megaMenu: "services"` : l'entrée déploie le mega-menu au survol (desktop).
 */
export type NavItem = {
  label: string;
  href: string;
  megaMenu?: "services";
};

export const mainNav: NavItem[] = [
  { label: "Services", href: "/services", megaMenu: "services" },
  { label: "Réalisations", href: "/#portfolio" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

/**
 * Les quatre piliers de service.
 * `bg` : dégradé placeholder de la carte mega-menu (remplaçable par une vraie
 * photo plus tard). `motif` : clé du décor SVG dessiné dans ServiceCard.
 * `icon` : nom de l'icône Phosphor pour la section Services de l'accueil.
 * `blurb` : phrase plus longue que `summary`, pour la carte éditoriale.
 * `features` : livrables clés listés dans la carte-produit de l'accueil.
 */
export const services = [
  {
    slug: "sites-web",
    title: "Sites web",
    summary: "Vitrine, e-commerce et plateformes sur-mesure.",
    blurb:
      "Vitrines, boutiques en ligne et plateformes sur-mesure, pensées pour convertir.",
    icon: "browser" as const,
    features: [
      "Design sur-mesure, pas de template",
      "SEO local intégré dès la conception",
      "Formation à la prise en main",
    ],
    bg: {
      from: "#0a1830",
      via: "#0e2c50",
      to: "#123a5e",
      accent: "#35a7f0",
    },
    motif: "browser" as const,
  },
  {
    slug: "agents-ia",
    title: "Agents IA",
    summary: "Assistants et automatisation conversationnelle.",
    blurb:
      "Des assistants qui répondent à vos clients et qualifient les demandes à votre place.",
    icon: "chat" as const,
    features: [
      "Entraîné sur vos contenus et vos process",
      "Intégré à votre site ou vos messageries",
      "Reprise humaine à tout moment",
    ],
    bg: {
      from: "#0c1330",
      via: "#171b48",
      to: "#232159",
      accent: "#6a8cff",
    },
    motif: "network" as const,
  },
  {
    slug: "saas-sur-mesure",
    title: "SaaS sur-mesure",
    summary: "Applications métier taillées pour votre activité.",
    blurb:
      "Une application métier taillée pour votre activité, quand rien du marché ne convient.",
    icon: "stack" as const,
    features: [
      "Cadrage des besoins avant la première ligne",
      "Interface pensée pour vos équipes",
      "Hébergement et maintenance assurés",
    ],
    bg: {
      from: "#08201f",
      via: "#0d3236",
      to: "#123f45",
      accent: "#2fd9c8",
    },
    motif: "blocks" as const,
  },
  {
    slug: "automatisation",
    title: "Automatisation",
    summary: "Flux métier et intégrations entre vos outils.",
    blurb:
      "Vos outils reliés entre eux pour supprimer les ressaisies et les tâches répétitives.",
    icon: "flow" as const,
    features: [
      "Devis, facturation et CRM connectés",
      "Zéro double saisie entre vos outils",
      "Alertes et relances déclenchées seules",
    ],
    bg: {
      from: "#0a1226",
      via: "#111f42",
      to: "#182c58",
      accent: "#4d7cff",
    },
    motif: "flow" as const,
  },
] as const;

export type Service = (typeof services)[number];
export type ServiceSlug = Service["slug"];

/**
 * Contenu long des pages /services/[slug] — rédigé pour le SEO local
 * (agence web, création de site internet, informatique) sur le bassin
 * franco-suisse. Indexé par slug ; la forme de `services` (consommée par le
 * mega-menu et la section d'accueil) reste inchangée.
 *
 * `metaTitle` / `metaDescription` : balises uniques de la page (≤ ~60 / ~155
 * caractères). `intro` : chapô sous le H1. `sections` : blocs h2 + paragraphes.
 * `deliverables` : liste détaillée. `faq` : questions fréquentes (alimente le
 * JSON-LD FAQPage — utile pour les rich snippets).
 */
export const serviceContent: Record<
  ServiceSlug,
  {
    metaTitle: string;
    metaDescription: string;
    h1: string;
    intro: string;
    sections: { title: string; body: string[] }[];
    deliverables: string[];
    faq: { q: string; a: string }[];
  }
> = {
  "sites-web": {
    metaTitle: "Création de site internet dans le Pays de Gex",
    metaDescription:
      "Agence web à Saint-Genis-Pouilly : création de sites vitrines, e-commerce et sur-mesure pour les TPE, PME et artisans du Pays de Gex, de l'Ain et de la région de Genève.",
    h1: "Création de site internet dans le Pays de Gex",
    intro:
      "Supaco Digital est l'agence web du bassin franco-suisse pour la création et la refonte de sites internet. Site vitrine, boutique en ligne ou plateforme sur-mesure : chaque projet est conçu à la main, optimisé pour le référencement local et pensé pour transformer vos visiteurs en clients.",
    sections: [
      {
        title: "Un site vitrine qui inspire confiance",
        body: [
          "Pour un artisan, un commerce ou un cabinet de Gex, Ferney-Voltaire, Divonne-les-Bains ou Saint-Genis-Pouilly, le site internet est souvent le premier contact avec un prospect. Il doit charger vite, être lisible sur mobile et donner immédiatement envie de vous appeler.",
          "Nous concevons des sites vitrines sur-mesure — pas de template revendu à l'identique — avec un contenu rédigé pour les recherches locales : « plombier à Gex », « avocat Ferney-Voltaire », « restaurant Pays de Gex ».",
        ],
      },
      {
        title: "Des boutiques en ligne qui vendent",
        body: [
          "Vous vendez déjà en magasin ou sur les réseaux : une boutique en ligne vous ouvre la clientèle du Pays de Gex, de l'Ain et de la Suisse voisine, 24 h/24. Catalogue, paiement sécurisé, gestion des stocks et des livraisons transfrontalières.",
        ],
      },
      {
        title: "Refonte de site : repartir sur des bases saines",
        body: [
          "Un site lent, daté ou invisible sur Google pénalise votre activité. Nous reprenons l'existant, conservons ce qui fonctionne côté référencement (redirections, URLs, contenus) et reconstruisons le reste sur une base moderne et rapide.",
        ],
      },
    ],
    deliverables: [
      "Design sur-mesure aligné sur votre identité",
      "Rédaction et structuration du contenu pour le SEO local",
      "Site rapide et responsive (Core Web Vitals soignés)",
      "Fiche Google Business Profile mise en cohérence avec le site",
      "Formation à la prise en main et à la mise à jour",
      "Hébergement en France et nom de domaine",
    ],
    faq: [
      {
        q: "Combien coûte un site internet dans le Pays de Gex ?",
        a: "Nos sites démarrent à 1 800 € pour un site vitrine essentiel. Les packs Croissance (3 000 €) et Performance (4 500 €) ajoutent des fonctionnalités et une maintenance mensuelle. Le détail est sur la page Tarifs.",
      },
      {
        q: "Intervenez-vous en dehors du Pays de Gex ?",
        a: "Oui. Nous travaillons avec des clients dans tout l'Ain (Bourg-en-Bresse, Oyonnax, Valserhône), ainsi qu'avec des entreprises et indépendants de Genève et de la Suisse frontalière.",
      },
      {
        q: "Reprenez-vous un site existant fait par quelqu'un d'autre ?",
        a: "Oui, la refonte de site fait partie de nos prestations courantes. Nous auditons l'existant, préservons votre référencement acquis et reconstruisons sur une base saine.",
      },
    ],
  },
  "agents-ia": {
    metaTitle: "Agent IA pour entreprise — Pays de Gex & Genève",
    metaDescription:
      "Assistants IA et chatbots sur-mesure pour les TPE et PME du Pays de Gex, de l'Ain et de la région de Genève : répondez à vos clients et qualifiez les demandes automatiquement.",
    h1: "Agents IA pour les entreprises du bassin franco-suisse",
    intro:
      "Un agent IA entraîné sur vos contenus répond à vos clients à toute heure, qualifie les demandes et fait gagner un temps précieux à votre équipe. Supaco Digital conçoit et intègre ces assistants pour les entreprises du Pays de Gex et de la région de Genève.",
    sections: [
      {
        title: "Un assistant qui connaît votre activité",
        body: [
          "L'agent est entraîné sur vos documents, vos tarifs, vos process et votre FAQ. Il répond avec précision, dans votre ton, et oriente le visiteur vers la bonne page ou le bon interlocuteur.",
          "Intégré à votre site, à WhatsApp ou à votre messagerie, il prend le relais quand vous n'êtes pas disponible — le soir, le week-end, en déplacement.",
        ],
      },
      {
        title: "Qualifier les demandes avant qu'elles n'arrivent",
        body: [
          "Plutôt qu'un formulaire mort, l'agent pose les bonnes questions, récupère les informations utiles (besoin, zone, budget) et vous transmet des demandes déjà triées.",
        ],
      },
      {
        title: "Reprise humaine à tout moment",
        body: [
          "L'agent ne remplace pas la relation client : il la prépare. Vous gardez la main et reprenez la conversation quand c'est pertinent.",
        ],
      },
    ],
    deliverables: [
      "Cadrage des cas d'usage et des limites de l'agent",
      "Entraînement sur vos contenus et vos procédures",
      "Intégration au site, à la messagerie ou à WhatsApp",
      "Garde-fous et scénarios de reprise humaine",
      "Tableau de bord des conversations",
      "Suivi et amélioration continue",
    ],
    faq: [
      {
        q: "Un agent IA est-il utile pour une petite entreprise ?",
        a: "Oui, surtout quand vous êtes seul ou en petite équipe : l'agent absorbe les questions répétitives et vous ne perdez plus de prospects faute de réponse rapide.",
      },
      {
        q: "Les réponses de l'agent sont-elles fiables ?",
        a: "L'agent répond à partir de vos contenus validés, avec des garde-fous. Pour les sujets sensibles, il passe la main à un humain plutôt que d'inventer.",
      },
    ],
  },
  "saas-sur-mesure": {
    metaTitle: "SaaS & application métier sur-mesure — Pays de Gex",
    metaDescription:
      "Développement d'applications métier et de logiciels SaaS sur-mesure pour les entreprises du Pays de Gex, de l'Ain et de la région de Genève, quand aucun outil du marché ne convient.",
    h1: "SaaS et applications métier sur-mesure",
    intro:
      "Quand les logiciels du marché ne collent pas à votre façon de travailler, une application sur-mesure devient rentable. Supaco Digital cadre, développe et héberge des outils métier et des plateformes SaaS pour les entreprises du bassin franco-suisse.",
    sections: [
      {
        title: "Cadrer avant de coder",
        body: [
          "Un projet sur-mesure réussit ou échoue au cadrage. Nous partons de vos processus réels, identifions ce qui doit être automatisé et ce qui doit rester manuel, et priorisons une première version utile rapidement.",
        ],
      },
      {
        title: "Une interface pensée pour vos équipes",
        body: [
          "Vos collaborateurs utiliseront l'outil tous les jours : il doit être clair, rapide et sans friction. Nous concevons des interfaces sobres, testées avec les personnes qui s'en serviront.",
        ],
      },
      {
        title: "Hébergement et maintenance assurés",
        body: [
          "Nous hébergeons l'application sur une infrastructure en Europe, assurons les sauvegardes, les mises à jour de sécurité et l'évolution de l'outil au fil de vos besoins.",
        ],
      },
    ],
    deliverables: [
      "Atelier de cadrage et spécifications",
      "Maquettes et validation avant développement",
      "Développement par itérations, livraisons régulières",
      "Reprise de vos données existantes",
      "Hébergement, sauvegardes et supervision",
      "Maintenance corrective et évolutive",
    ],
    faq: [
      {
        q: "À partir de quand une application sur-mesure est-elle justifiée ?",
        a: "Dès que vous jonglez entre plusieurs fichiers Excel, que vous ressaisissez les mêmes données ou que votre logiciel actuel vous oblige à contourner ses limites tous les jours.",
      },
      {
        q: "Combien de temps prend un projet SaaS ?",
        a: "Une première version utilisable est généralement livrée en quelques semaines à quelques mois selon le périmètre. Nous ne communiquons pas de délai ferme avant le cadrage.",
      },
    ],
  },
  automatisation: {
    metaTitle: "Automatisation des tâches — Pays de Gex & Ain",
    metaDescription:
      "Automatisation des tâches répétitives et connexion de vos outils (devis, facturation, CRM) pour les TPE et PME du Pays de Gex, de l'Ain et de la région de Genève.",
    h1: "Automatisation des tâches pour les TPE et PME",
    intro:
      "Devis recopiés, relances oubliées, données saisies deux fois : ces tâches vous coûtent des heures chaque semaine. Supaco Digital relie vos outils entre eux et automatise ce qui peut l'être, pour les entreprises du bassin franco-suisse.",
    sections: [
      {
        title: "Vos outils qui se parlent enfin",
        body: [
          "Site, formulaire, CRM, facturation, comptabilité, agenda : nous connectons ces briques pour qu'une information saisie une fois se propage partout, sans copier-coller.",
        ],
      },
      {
        title: "Les relances et alertes qui se déclenchent seules",
        body: [
          "Devis sans réponse, facture en retard, nouveau lead : l'automatisation envoie la bonne relance au bon moment et vous alerte uniquement quand une action humaine est nécessaire.",
        ],
      },
      {
        title: "Commencer petit, étendre ensuite",
        body: [
          "On démarre par le flux qui vous fait perdre le plus de temps, on mesure le gain, puis on étend. Pas de refonte de tout votre système d'un coup.",
        ],
      },
    ],
    deliverables: [
      "Cartographie de vos flux et points de friction",
      "Connexion de vos outils (devis, facturation, CRM, agenda)",
      "Scénarios d'automatisation et de relance",
      "Alertes ciblées pour votre équipe",
      "Documentation des automatisations mises en place",
      "Ajustements après mise en production",
    ],
    faq: [
      {
        q: "Faut-il changer de logiciels pour automatiser ?",
        a: "Le plus souvent non : nous connectons les outils que vous utilisez déjà. Nous ne recommandons un changement que si un outil bloque réellement toute automatisation.",
      },
      {
        q: "L'automatisation est-elle réservée aux grandes entreprises ?",
        a: "Au contraire : une TPE ou un artisan seul gagne proportionnellement plus de temps, car chaque tâche répétitive supprimée pèse lourd sur une petite structure.",
      },
    ],
  },
};

/**
 * Réalisations clients — aperçu sur l'accueil + base des études de cas.
 * `slug` : segment d'URL de la page dédiée (/portfolio/[slug]).
 * `image` : capture optimisée dans public/portfolio/ (à fournir).
 * `url` : site en ligne du client (lien externe sur la page d'étude de cas).
 * L'ordre du tableau = ordre d'affichage dans la grille.
 *
 * ⚠️ Champs d'étude de cas (`year`, `summary`, `context`, `challenge`,
 * `solution`, `deliverables`, `result`) : contenu PLACEHOLDER à réécrire avec
 * Supa. La structure est figée, seul le texte change.
 */
export const projects = [
  {
    slug: "bushido-gym",
    name: "Bushido Gym",
    sector: "Salle de sport",
    projectType: "Site vitrine",
    area: "Pays de Gex",
    url: "https://bushidogym.fr/",
    image: "/portfolio/bushido-gym.webp",
    year: "2025",
    summary:
      "Un site vitrine qui transforme la curiosité en première séance réservée.",
    context:
      "Bushido Gym est une salle de sport et d'arts martiaux du Pays de Gex. Sa présence en ligne se limitait à une page de réseau social, difficile à trouver et peu rassurante pour un prospect qui hésite à pousser la porte.",
    challenge:
      "Donner une vitrine crédible à la salle, présenter clairement les disciplines et les créneaux, et pousser le visiteur vers une première séance d'essai — sans promettre de délai ni brader l'image.",
    solution:
      "Site vitrine sombre et graphique fidèle à l'univers arts martiaux, hiérarchie claire des disciplines, mise en avant des coachs et des horaires, appels à l'action « Réserver ma séance » présents à chaque section.",
    deliverables: [
      "Design sur-mesure aligné sur l'identité de la salle",
      "Pages disciplines, coachs, horaires et tarifs",
      "Parcours de réservation d'une séance d'essai",
      "Optimisation SEO locale (Pays de Gex)",
    ],
    result:
      "Une vitrine qui inspire confiance avant même la visite, et un chemin direct vers la première séance.",
  },
  {
    slug: "kekosan",
    name: "Kekosan",
    sector: "Restauration japonaise",
    projectType: "Site de commande en ligne",
    area: "Pays de Gex",
    url: "https://www.kekosan.com/",
    image: "/portfolio/kekosan.webp",
    year: "2025",
    summary:
      "Un site de commande en ligne qui met la cuisine du restaurant au premier plan.",
    context:
      "Kekosan est un restaurant de cuisine japonaise du Pays de Gex. La prise de commande passait par le téléphone et des plateformes tierces qui prélèvent une commission sur chaque panier.",
    challenge:
      "Reprendre la main sur la commande en ligne, donner envie avec des visuels qui rendent justice aux plats, et rendre le parcours de commande simple sur mobile.",
    solution:
      "Site de commande en propre, cartes produits photographiques, panier fluide et paiement en ligne, le tout pensé mobile-first pour la commande du soir.",
    deliverables: [
      "Catalogue produits avec photos et options",
      "Panier et paiement en ligne intégrés",
      "Parcours de commande optimisé mobile",
      "Mise en avant des menus et formules",
    ],
    result:
      "Des commandes passées en direct, sans commission d'intermédiaire, et une carte qui donne faim au premier coup d'œil.",
  },
  {
    slug: "gex-energies",
    name: "Gex Énergies",
    sector: "Énergies & chauffage",
    projectType: "Site vitrine",
    area: "Pays de Gex",
    url: "https://gex-energies.fr/",
    image: "/portfolio/gex-energies.webp",
    year: "2025",
    summary:
      "Une vitrine qui installe la crédibilité d'un artisan chauffagiste local.",
    context:
      "Gex Énergies installe et entretient des solutions de chauffage et d'énergies renouvelables dans le Pays de Gex et le nord de la Haute-Savoie.",
    challenge:
      "Rassurer un particulier qui engage plusieurs milliers d'euros de travaux, présenter les prestations (pompe à chaleur, entretien, dépannage) et générer des demandes de devis qualifiées.",
    solution:
      "Site vitrine clair et professionnel, pages prestations détaillées, mise en avant de la zone d'intervention et des certifications, formulaire de contact orienté demande de devis.",
    deliverables: [
      "Pages prestations (installation, entretien, dépannage)",
      "Zone d'intervention et certifications mises en avant",
      "Formulaire de demande de devis",
      "SEO local Pays de Gex / Haute-Savoie",
    ],
    result:
      "Une présence en ligne à la hauteur du sérieux de l'artisan, et un canal de demandes de devis en continu.",
  },
  {
    slug: "au-point-compte",
    name: "Au Point Compte",
    sector: "Broderie personnalisée",
    projectType: "Site e-commerce",
    area: "Suisse",
    url: "https://au-point-compte.ch/",
    image: "/portfolio/au-point-compte.webp",
    year: "2025",
    summary:
      "Une boutique en ligne pour vendre de la broderie personnalisée au-delà du bouche-à-oreille.",
    context:
      "Au Point Compte est un atelier suisse de broderie personnalisée. Les commandes se faisaient sur devis, au cas par cas, sans catalogue en ligne.",
    challenge:
      "Structurer l'offre en produits achetables, gérer la personnalisation (texte, motif, support) dans le parcours d'achat, et vendre à une clientèle suisse habituée à un e-commerce soigné.",
    solution:
      "Site e-commerce avec catalogue par type de produit, options de personnalisation intégrées au tunnel de commande, présentation de l'atelier et du savoir-faire.",
    deliverables: [
      "Catalogue e-commerce avec options de personnalisation",
      "Tunnel de commande et paiement en ligne",
      "Pages atelier et savoir-faire",
      "Design premium adapté au marché suisse",
    ],
    result:
      "Un atelier qui vend en ligne 24h/24, avec un parcours de personnalisation clair et une image à la hauteur de son travail.",
  },
  {
    slug: "mb-patrimoine-finance",
    name: "MB Patrimoine Finance",
    sector: "Gestion de patrimoine",
    projectType: "Site vitrine",
    area: "France",
    url: "https://mb-patrimoine-finance.fr/",
    image: "/portfolio/mb-patrimoine-finance.webp",
    year: "2025",
    summary:
      "Une vitrine sobre qui inspire confiance pour un conseiller en gestion de patrimoine.",
    context:
      "MB Patrimoine Finance accompagne des particuliers et des chefs d'entreprise dans la gestion et l'optimisation de leur patrimoine.",
    challenge:
      "Dans un métier où tout repose sur la confiance, donner une image sérieuse et rassurante, expliquer clairement les domaines d'accompagnement et faciliter la prise de premier rendez-vous.",
    solution:
      "Site vitrine épuré, ton institutionnel maîtrisé, pages domaines d'expertise, présentation du conseiller et de sa méthode, prise de contact directe.",
    deliverables: [
      "Pages domaines d'expertise (placement, prévoyance, transmission)",
      "Présentation du conseiller et de la méthode",
      "Prise de rendez-vous facilitée",
      "Mentions et conformité du secteur",
    ],
    result:
      "Une vitrine qui pose d'emblée le professionnalisme du cabinet et ouvre la conversation avec de nouveaux clients.",
  },
] as const;

export type Project = (typeof projects)[number];

/** Retrouve une réalisation par son slug (études de cas). */
export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
