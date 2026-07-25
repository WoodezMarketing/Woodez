/**
 * Les emails montrés dans la galerie.
 *
 * Pour ajouter une création : déposer l'image dans `public/emails/`, puis
 * remplir `src` ici. Tant que `src` est vide, une maquette de remplacement
 * est affichée à la place — la section reste présentable.
 */

export type Creation = {
  brand: string
  tag: string
  /** Chemin depuis /public, ex. "/emails/silk.jpg". Vide = maquette. */
  src?: string
  /** Couleur de la maquette de remplacement. */
  tone: "green" | "lemon" | "coral" | "violet" | "sky" | "bubble" | "mint"
}

export const creations: Creation[] = [
  { brand: "Mobilier design", tag: "Promotion saisonnière", tone: "mint" },
  { brand: "Boisson végétale", tag: "Lancement de gamme", tone: "sky" },
  { brand: "Crème glacée", tag: "Nouveau produit", tone: "lemon" },
  { brand: "Soins solaires", tag: "Campagne + FAQ", tone: "bubble" },
  { brand: "Caméras d'action", tag: "Fiche produit", tone: "violet" },
  { brand: "Automobile", tag: "Programme de fidélité", tone: "sky" },
  { brand: "Divertissement", tag: "Nouveautés du mois", tone: "violet" },
  { brand: "Pâtisserie", tag: "Menu hebdomadaire", tone: "bubble" },
  { brand: "Vélo de route", tag: "Lancement de modèle", tone: "green" },
]
