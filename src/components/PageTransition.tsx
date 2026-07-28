"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

/**
 * Transition de dessin animé entre les pages.
 *
 * La tête de Woodez jaillit du centre en tournoyant, recouvre l'écran, puis
 * repart en tournant dans l'autre sens. La navigation se fait pendant que
 * l'écran est couvert, donc on ne voit jamais de page blanche. Le tout dure
 * une seconde.
 *
 * Le composant écoute les clics sur les liens marqués `data-transition` plutôt
 * que d'exposer un contexte : n'importe quel lien du site peut en profiter en
 * ajoutant l'attribut.
 */
/** Taille de rendu de la tête, avant agrandissement. */
const BASE = 1200

export default function PageTransition() {
  const router = useRouter()
  const wrap = useRef<HTMLDivElement>(null)
  const disc = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = wrap.current
    const target = disc.current
    if (!overlay || !target) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        "a[data-transition]",
      )
      if (!link) return

      const href = link.getAttribute("href")
      if (!href || href.startsWith("#") || href.startsWith("mailto:")) return
      if (href === window.location.pathname) return

      event.preventDefault()

      if (reduced) {
        router.push(href)
        return
      }

      // C'est la tête elle-même qui doit couvrir l'écran, sans disque derrière.
      // Seul son centre est plein — les oreilles laissent passer les coins —
      // donc on grossit bien au-delà de la diagonale pour que la fenêtre
      // tienne entièrement dans la partie opaque.
      const diagonale = Math.hypot(window.innerWidth, window.innerHeight)
      const plein = (diagonale / BASE) * 2.4

      gsap.set(overlay, { display: "block" })
      gsap
        .timeline({
          onComplete: () => gsap.set(overlay, { display: "none" }),
        })
        .fromTo(
          target,
          { scale: 0, rotate: 0 },
          { scale: plein, rotate: 540, duration: 0.42, ease: "power2.in" },
        )
        .add(() => router.push(href))
        .to(target, { scale: 0, rotate: 1080, duration: 0.5, ease: "power2.out" }, "+=0.08")
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [router])

  return (
    <div
      ref={wrap}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] hidden overflow-hidden"
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Base large et non 240 px : le navigateur rastérise le calque à sa
            taille de départ, puis se contente d'étirer le bitmap. Partir petit
            donnait une tête franchement floue au sommet de l'animation. */}
        <div ref={disc} style={{ width: BASE, height: BASE }}>
          <Image src="/brand/mascot.svg" alt="" width={BASE} height={BASE} className="w-full" />
        </div>
      </div>
    </div>
  )
}
