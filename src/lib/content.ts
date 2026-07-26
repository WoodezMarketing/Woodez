// Tout le texte du site vit ici. Pour la version anglaise, on dupliquera cet
// objet en `content.en.ts` et on choisira selon la locale — aucun composant à toucher.

export const CONTACT = {
  email: "info@woodez.ca",
  phone: "+1 450 330-4199",
  phoneHref: "tel:+14503304199",
  whatsapp: "https://wa.me/14503304199",
} as const

export const content = {
  nav: {
    links: [
      { label: "Services", href: "#services" },
      { label: "Créations", href: "#creations" },
      { label: "Pourquoi nous", href: "#comparaison" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Commencer maintenant",
  },

  // Le hero ne porte que le titre et un bouton : la scène illustrée fait le reste.
  // Les trois lignes se révèlent l'une après l'autre — c'est le parcours client
  // raconté en trois temps.
  hero: {
    // Deux lignes sur grand écran, pour que le bloc de texte reste haut et ne
    // vienne pas se poser sur la tête de Woodez. Sur mobile chaque ligne se
    // replie naturellement, ce qui en donne quatre.
    title: ["Fais revenir tes clients.", "Encore et encore."],
    /** Découpe imposée sur petit écran, le repli naturel ne tombe pas bien. */
    titleMobile: ["Fais revenir tes", "clients. Encore", "et encore."],
    kicker:
      "Le email et SMS marketing conçu pour fidéliser, automatiser et faire grandir ton commerce.",
    cta: "Commencer maintenant",
    scroll: "Défiler",
  },

  marquee: ["Email marketing", "SMS", "Klaviyo", "Design sur mesure", "Automatisations", "Rétention"],

  stats: {
    title: ["Les chiffres", "parlent"],
    items: [
      {
        value: 300,
        prefix: "+",
        suffix: "",
        label: "clients satisfaits",
        note: "Des marques qui nous ont fait confiance.",
        color: "green",
        icon: "heart",
      },
      {
        value: 30,
        prefix: "",
        suffix: "%",
        label: "du revenu par email",
        note: "La part que le courriel prend dans vos ventes.",
        color: "lemon",
        icon: "enveloppe",
      },
      {
        value: 100,
        prefix: "",
        suffix: "%",
        label: "fait main",
        note: "Zéro template recyclé, jamais.",
        color: "coral",
        icon: "target",
      },
    ],
  },

  // Section de révélation : le texte s'allume mot par mot au défilement.
  reveal: {
    text: "On augmente le revenu de ta boutique jusqu'à 40% en installant un vrai système de rétention, et en habillant chaque envoi aux couleurs de ta marque.",
    /** Ces mots restent en vert une fois allumés. */
    highlight: ["40%", "rétention", "marque"],
  },

  services: {
    eyebrow: "Ce qu'on fait",
    title: ["Trois façons", "de faire", "grandir votre marque"],
    items: [
      {
        n: "01",
        title: "Email marketing",
        color: "green",
        icon: "enveloppe",
        text: "Vos automatisations Klaviyo de A à Z, puis des campagnes qui donnent envie d'ouvrir.",
        bullets: [
          "Stratégie et plan de flows complet",
          "Campagnes mensuelles et calendrier",
          "Segmentation et A/B testing",
          "Délivrabilité et nettoyage de liste",
        ],
      },
      {
        n: "02",
        title: "SMS marketing",
        color: "sky",
        icon: "chat",
        text: "Le canal le plus direct qui existe. Au bon moment, avec le bon ton, sans jamais spammer.",
        bullets: [
          "Collecte de numéros et opt-in conforme",
          "Campagnes et automatisations SMS",
          "Coordination avec vos envois courriel",
          "Conformité canadienne (LCAP)",
        ],
      },
      {
        n: "03",
        title: "Design & créatif",
        color: "coral",
        icon: "target",
        text: "Chaque courriel dessiné sur mesure, pour qu'on reconnaisse votre marque avant même l'expéditeur.",
        bullets: [
          "Direction artistique complète",
          "Design d'emails 100 % sur mesure",
          "Rédaction et ton de marque",
          "Visuels produits et retouches",
        ],
      },
    ],
  },

  creations: {
    eyebrow: "Nos créations",
    title: ["Des emails", "qu'on a envie", "d'ouvrir"],
    lead: "Chaque marque a son univers. On le respecte, puis on le pousse plus loin.",
  },

  comparison: {
    eyebrow: "Pourquoi nous",
    title: ["Woodez", "le reste"],
    lead: "Pas de prix fixe : on bâtit une offre à votre taille. Voici ce qui ne change jamais.",
    columns: ["Woodez", "Agence classique", "À l'interne"],
    /** oui | bof | non — se lit d'un coup d'œil, sans rien avoir à lire. */
    rows: [
      { label: "Design 100 % sur mesure", values: ["oui", "non", "bof"] },
      { label: "Stratégie et créatif réunis", values: ["oui", "bof", "non"] },
      { label: "Le fondateur sur votre compte", values: ["oui", "non", "non"] },
      { label: "En ligne en 14 jours", values: ["oui", "non", "non"] },
      { label: "Prix adapté à votre taille", values: ["oui", "non", "bof"] },
      { label: "Sans engagement", values: ["oui", "non", "bof"] },
    ],
    legend: { oui: "Inclus", bof: "Ça dépend", non: "Non" },
  },

  faq: {
    eyebrow: "FAQ",
    title: ["On vous", "répond"],
    items: [
      {
        q: "Combien ça coûte ?",
        a: "Ça dépend de votre taille et de vos besoins. Une marque qui démarre n'a pas besoin du même service qu'une marque qui fait des centaines de milliers de dollars. On regarde votre situation, puis on vous propose une offre à votre mesure, sans forfait imposé.",
      },
      {
        q: "Vous travaillez avec quelle plateforme ?",
        a: "Klaviyo principalement, parce que c'est ce qui donne les meilleurs résultats en ecommerce. On s'intègre aussi avec Shopify, WooCommerce et la plupart des outils que vous utilisez déjà. Si vous êtes ailleurs, on s'occupe de la migration.",
      },
      {
        q: "Combien de temps avant de voir des résultats ?",
        a: "Vos premières automatisations sont en ligne en environ 14 jours. Les flows de bienvenue et de panier abandonné génèrent généralement des ventes dès les premières semaines, parce qu'ils s'adressent à des gens déjà intéressés par vos produits.",
      },
      {
        q: "Est-ce qu'il y a un contrat à long terme ?",
        a: "Non. On travaille mois par mois. Si on fait bien notre travail, vous restez, c'est notre seul argument de rétention.",
      },
      {
        q: "Est-ce que vous utilisez l'intelligence artificielle ?",
        a: "Oui, mais pas pour remplacer le travail créatif. On l'utilise pour accélérer l'analyse, la segmentation et les tests. Le design, la stratégie et le ton de votre marque restent faits par des humains, c'est exactement ce qui fait qu'on ne ressemble pas à tout le monde.",
      },
      {
        q: "Est-ce que je dois déjà avoir une liste d'abonnés ?",
        a: "Non. Si votre liste est petite ou inexistante, on commence par la faire grandir : formulaires de capture, pop-ups bien conçus, offres d'inscription. Une liste de 500 personnes engagées vaut mieux que 50 000 adresses mortes.",
      },
    ],
  },

  cta: {
    title: ["Prêt à faire", "parler", "votre marque ?"],
    lead: "Dites-nous où vous en êtes. On revient avec un plan concret.",
    button: "Commencer maintenant",
  },

  footer: {
    tagline: "Email & SMS marketing pour marques ecommerce.",
    madeIn: "Fait au Québec",
    rights: "Tous droits réservés.",
  },
} as const
