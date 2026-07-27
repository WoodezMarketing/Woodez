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
 * Révélation d'un titre masqué ligne par ligne.
 *
 * Le masque n'est utile que le temps du glissement. Une fois la ligne en
 * place, on lui rend `overflow: visible` : sinon il continue de rogner ce qui
 * dépasse du bloc de la lettre, c'est-à-dire le contour, l'ombre portée et la
 * queue des lettres comme le Q.
 */
export function revealLines(selector: string, trigger: Trigger) {
  return reveal(
    selector,
    { yPercent: 110 },
    {
      yPercent: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "expo.out",
      onComplete() {
        for (const node of this.targets() as HTMLElement[]) {
          const mask = node.parentElement
          if (mask) mask.style.overflow = "visible"
        }
      },
    },
    trigger,
  )
}
