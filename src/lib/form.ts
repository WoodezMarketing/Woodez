/**
 * Contenu du formulaire multi-étapes.
 *
 * Chaque parcours est une liste ordonnée d'étapes. Une étape peut porter un
 * `when` : elle n'apparaît que si la condition est remplie. C'est ce qui permet
 * de poser des questions différentes selon qu'on fait déjà du marketing ou non,
 * sans dupliquer tout le parcours.
 */

export type Answers = Record<string, string>

export type Step = {
  id: string
  question: string
  /** Précision affichée sous la question. */
  hint?: string
  /** Réponses courtes : deux colonnes plutôt qu'une pile. */
  grille?: true
  when?: (a: Answers) => boolean
} & (
  | { kind: "choice"; choices: { value: string; label: string }[] }
  | { kind: "text"; placeholder: string; inputType?: "text" | "email"; multiline?: boolean }
)

export type Path = {
  id: string
  label: string
  blurb: string
  icon: string
  tone: "green" | "sky" | "lemon"
  steps: Step[]
}

/** Dernières étapes, communes à tous les parcours. */
const IDENTITE: Step[] = [
  { id: "prenom", kind: "text", question: "On se présente ?", hint: "Ton nom, tout simplement.", placeholder: "Prénom et nom" },
  { id: "entreprise", kind: "text", question: "Le nom de ton entreprise ?", placeholder: "Nom de la boutique" },
  {
    id: "courriel",
    kind: "text",
    question: "Où est-ce qu'on te répond ?",
    hint: "On revient vers toi en moins de 24 heures ouvrables.",
    placeholder: "toi@taboutique.com",
    inputType: "email",
  },
]

const REVENU: Step = {
  id: "revenu",
  kind: "choice",
  question: "Ton chiffre d'affaires mensuel ?",
  hint: "Ça nous sert à bâtir une offre à ta taille. Une estimation suffit.",
  grille: true,
  choices: [
    { value: "0-10k", label: "Moins de 10 000 $" },
    { value: "10-50k", label: "10 000 $ à 50 000 $" },
    { value: "50-250k", label: "50 000 $ à 250 000 $" },
    { value: "250k+", label: "Plus de 250 000 $" },
  ],
}

const PLATEFORME_BOUTIQUE: Step = {
  id: "boutique",
  kind: "choice",
  question: "Ta boutique tourne sur quoi ?",
  choices: [
    { value: "shopify", label: "Shopify" },
    { value: "woocommerce", label: "WooCommerce" },
    { value: "autre", label: "Une autre plateforme" },
    { value: "aucune", label: "Pas encore de boutique" },
  ],
}

export const PATHS: Path[] = [
  {
    id: "email",
    label: "Email marketing",
    blurb: "Des automatisations et des campagnes qui font vendre.",
    icon: "enveloppe",
    tone: "green",
    steps: [
      {
        id: "deja",
        kind: "choice",
        question: "Fais-tu déjà de l'email marketing ?",
        choices: [
          { value: "oui", label: "Oui, j'en envoie déjà" },
          { value: "non", label: "Non, on part de zéro" },
        ],
      },

      // Parcours « oui »
      {
        id: "outil",
        kind: "choice",
        question: "Avec quel outil ?",
        when: (a) => a.deja === "oui",
        choices: [
          { value: "klaviyo", label: "Klaviyo" },
          { value: "mailchimp", label: "Mailchimp" },
          { value: "shopify", label: "Shopify Email" },
          { value: "autre", label: "Un autre outil" },
        ],
      },
      {
        id: "flows",
        kind: "choice",
        question: "Combien de flows en place ?",
        hint: "Bienvenue, panier abandonné, post-achat, réactivation…",
        when: (a) => a.deja === "oui",
        grille: true,
        choices: [
          { value: "0", label: "Aucun" },
          { value: "1-3", label: "1 à 3" },
          { value: "4+", label: "4 ou plus" },
          { value: "?", label: "Je ne sais pas" },
        ],
      },
      {
        id: "blocage",
        kind: "choice",
        question: "Qu'est-ce qui coince le plus ?",
        when: (a) => a.deja === "oui",
        choices: [
          { value: "resultats", label: "Les résultats stagnent" },
          { value: "temps", label: "Je n'ai pas le temps de m'en occuper" },
          { value: "design", label: "Ça ne ressemble pas à ma marque" },
          { value: "quoi", label: "Je ne sais plus quoi envoyer" },
        ],
      },

      // Parcours « non »
      { ...PLATEFORME_BOUTIQUE, when: (a) => a.deja === "non" },
      {
        id: "liste",
        kind: "choice",
        question: "As-tu déjà une liste d'abonnés ?",
        when: (a) => a.deja === "non",
        choices: [
          { value: "1000+", label: "Oui, plus de 1 000 personnes" },
          { value: "-1000", label: "Oui, moins de 1 000" },
          { value: "non", label: "Non, tout est à bâtir" },
        ],
      },
      {
        id: "objectif",
        kind: "choice",
        question: "Qu'est-ce qui t'intéresse le plus ?",
        when: (a) => a.deja === "non",
        choices: [
          { value: "paniers", label: "Récupérer les paniers abandonnés" },
          { value: "fidelite", label: "Faire revenir mes clients" },
          { value: "campagnes", label: "Lancer de vraies campagnes" },
          { value: "tout", label: "Un peu tout ça" },
        ],
      },

      REVENU,
      ...IDENTITE,
    ],
  },

  {
    id: "sms",
    label: "SMS marketing",
    blurb: "Le canal le plus direct, utilisé au bon moment.",
    icon: "chat",
    tone: "sky",
    steps: [
      {
        id: "deja",
        kind: "choice",
        question: "Fais-tu déjà du SMS marketing ?",
        choices: [
          { value: "oui", label: "Oui, j'en envoie déjà" },
          { value: "non", label: "Non, on part de zéro" },
        ],
      },

      {
        id: "outil",
        kind: "choice",
        question: "Avec quel outil ?",
        when: (a) => a.deja === "oui",
        choices: [
          { value: "klaviyo", label: "Klaviyo" },
          { value: "attentive", label: "Attentive" },
          { value: "postscript", label: "Postscript" },
          { value: "autre", label: "Un autre outil" },
        ],
      },
      {
        id: "frequence",
        kind: "choice",
        question: "Tu envoies à quelle fréquence ?",
        when: (a) => a.deja === "oui",
        choices: [
          { value: "rare", label: "Rarement, quand j'y pense" },
          { value: "mensuel", label: "Une fois par mois" },
          { value: "hebdo", label: "Chaque semaine" },
          { value: "auto", label: "Surtout des automatisations" },
        ],
      },
      {
        id: "blocage",
        kind: "choice",
        question: "Qu'est-ce qui coince le plus ?",
        when: (a) => a.deja === "oui",
        choices: [
          { value: "resultats", label: "Peu de retour sur mes envois" },
          { value: "desabo", label: "Trop de désabonnements" },
          { value: "quoi", label: "Je ne sais pas quoi écrire" },
          { value: "temps", label: "Je n'ai pas le temps" },
        ],
      },

      { ...PLATEFORME_BOUTIQUE, when: (a) => a.deja === "non" },
      {
        id: "numeros",
        kind: "choice",
        question: "Récoltes-tu déjà des numéros ?",
        when: (a) => a.deja === "non",
        choices: [
          { value: "oui", label: "Oui, à la caisse ou par formulaire" },
          { value: "peu", label: "Quelques-uns, sans vraie méthode" },
          { value: "non", label: "Non, pas du tout" },
        ],
      },
      {
        id: "objectif",
        kind: "choice",
        question: "Tu veux t'en servir pour quoi ?",
        when: (a) => a.deja === "non",
        choices: [
          { value: "promos", label: "Annoncer mes promotions" },
          { value: "paniers", label: "Relancer les paniers abandonnés" },
          { value: "lancements", label: "Créer l'urgence sur mes lancements" },
          { value: "tout", label: "Un peu tout ça" },
        ],
      },

      REVENU,
      ...IDENTITE,
    ],
  },

  {
    id: "autre",
    label: "Autre chose",
    blurb: "Design, direction artistique, ou un projet à part.",
    icon: "target",
    tone: "lemon",
    steps: [
      { id: "prenom", kind: "text", question: "On se présente ?", hint: "Ton nom, tout simplement.", placeholder: "Prénom et nom" },
      { id: "entreprise", kind: "text", question: "Le nom de ton entreprise ?", placeholder: "Nom de la boutique" },
      {
        id: "message",
        kind: "text",
        question: "Raconte-nous ton projet",
        hint: "Quelques lignes suffisent, on creusera ensemble.",
        placeholder: "Ce dont tu as besoin…",
        multiline: true,
      },
      {
        id: "courriel",
        kind: "text",
        question: "Où est-ce qu'on te répond ?",
        hint: "On revient vers toi en moins de 24 heures ouvrables.",
        placeholder: "toi@taboutique.com",
        inputType: "email",
      },
    ],
  },
]

/** Les étapes réellement posées, une fois les branches résolues. */
export function visibleSteps(path: Path, answers: Answers) {
  return path.steps.filter((step) => !step.when || step.when(answers))
}

/**
 * Empêche une fin de question de tomber seule sur la dernière ligne.
 *
 * Les deux derniers mots et la ponctuation finale sont liés par des espaces
 * insécables : le retour à la ligne ne peut plus se faire entre eux. Ça règle
 * d'un coup le point d'interrogation isolé et le mot orphelin.
 */
export function sansOrphelin(texte: string) {
  const mots = texte.split(" ")
  const aGarder = /^[?!:;»]$/.test(mots[mots.length - 1]) ? 3 : 2
  if (mots.length <= aGarder) return texte.replace(/ /g, " ")
  return [...mots.slice(0, -aGarder), mots.slice(-aGarder).join(" ")].join(" ")
}
