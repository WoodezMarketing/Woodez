/**
 * Les emails montrés dans la galerie.
 *
 * Pour ajouter une création : déposer l'image dans `public/emails/`, puis
 * ajouter une entrée ici. Sans `src`, une maquette de remplacement s'affiche
 * — la section reste présentable.
 */

export type Creation = {
  brand: string
  tag: string
  /** Chemin depuis /public, ex. "/emails/mobilier.webp". Vide = maquette. */
  src?: string
  /** Couleur de la maquette de remplacement. */
  tone: "green" | "lemon" | "coral" | "violet" | "sky" | "bubble" | "mint"
}

export const creations: Creation[] = [
  { brand: "Mobilier design", tag: "Promotion saisonnière", src: "/emails/mobilier.webp", tone: "mint" },
  { brand: "Boisson végétale", tag: "Lancement de gamme", src: "/emails/boisson-vegetale.webp", tone: "sky" },
  { brand: "Crème glacée", tag: "Nouveau produit", src: "/emails/creme-glacee.webp", tone: "lemon" },
  { brand: "Soins solaires", tag: "Campagne + FAQ", src: "/emails/soins-solaires.webp", tone: "bubble" },
  { brand: "Caméras d'action", tag: "Fiche produit", src: "/emails/cameras.webp", tone: "violet" },
  { brand: "Automobile", tag: "Programme de fidélité", src: "/emails/automobile.webp", tone: "sky" },
  { brand: "Divertissement", tag: "Nouveautés du mois", src: "/emails/divertissement.webp", tone: "violet" },
  { brand: "Pâtisserie", tag: "Menu hebdomadaire", src: "/emails/patisserie.webp", tone: "bubble" },
  { brand: "Vélo de route", tag: "Lancement de modèle", src: "/emails/velo.webp", tone: "green" },
]
