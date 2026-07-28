import { gsap } from "gsap"
import type { ScrollTrigger } from "gsap/ScrollTrigger"

type Vars = gsap.TweenVars
type Trigger = ScrollTrigger.Vars

/**
 * Apparition déclenchée au défilement.
 *
 * On passe par `fromTo` avec `immediateRender: false` plutôt que par `from` :
 * un `ScrollTrigger.refresh()` — que l'on déclenche après le chargement des
 * images, sinon les positions sont fausses — ré-applique l'état de départ d'un
 * `from` sans jamais le rejouer. L'élément reste alors invisible pour de bon.
 * Le bug est silencieux et ne se voit qu'à l'écran, d'où cet utilitaire.
 */
export function reveal(targets: gsap.TweenTarget, from: Vars, to: Vars, trigger: Trigger) {
  return gsap.fromTo(
    targets,
    from,
    {
      ...to,
      immediateRender: false,
      scrollTrigger: { once: true, ...trigger },
    },
  )
}

/**
 * Révélation d'un titre, ligne par ligne.
 *
 * Fondu et légère montée plutôt qu'un glissement derrière un masque : le
 * relief déborde par nature du bloc de la lettre — contour, ombre portée,
 * accents — et le masque le tronquait pendant toute l'animation.
 */
export function revealLines(selector: string, trigger: Trigger) {
  return reveal(
    selector,
    { y: 34, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: "expo.out" },
    trigger,
  )
}
