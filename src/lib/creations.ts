/**
 * Les emails montrés dans la galerie.
 *
 * Pour ajouter une création : déposer l'image dans `public/emails/`, puis
 * ajouter une entrée ici avec ses dimensions réelles. Elles sont indispensables
 * : les courriels sont montrés sur toute leur longueur, et sans le bon rapport
 * la page saute au moment où chaque image arrive.
 */

export type Creation = {
  brand: string
  tag: string
  /** Chemin depuis /public, ex. "/emails/mobilier.webp". */
  src: string
  /** Dimensions réelles du fichier, en pixels. */
  width: number
  height: number
}

export const creations: Creation[] = [
  { brand: "Mobilier design", tag: "Promotion saisonnière", src: "/emails/mobilier.webp", width: 740, height: 4096 },
  { brand: "Boisson végétale", tag: "Lancement de gamme", src: "/emails/boisson-vegetale.webp", width: 1200, height: 5378 },
  { brand: "Crème glacée", tag: "Nouveau produit", src: "/emails/creme-glacee.webp", width: 796, height: 3273 },
  { brand: "Soins solaires", tag: "Campagne et FAQ", src: "/emails/soins-solaires.webp", width: 796, height: 5223 },
  { brand: "Caméras d'action", tag: "Fiche produit", src: "/emails/cameras.webp", width: 680, height: 5760 },
  { brand: "Automobile", tag: "Programme de fidélité", src: "/emails/automobile.webp", width: 796, height: 3936 },
  { brand: "Divertissement", tag: "Nouveautés du mois", src: "/emails/divertissement.webp", width: 478, height: 4096 },
  { brand: "Pâtisserie", tag: "Menu hebdomadaire", src: "/emails/patisserie.webp", width: 679, height: 4096 },
  { brand: "Vélo de route", tag: "Lancement de modèle", src: "/emails/velo.webp", width: 820, height: 4096 },
]
