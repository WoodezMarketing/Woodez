"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { creations } from "@/lib/creations"

/**
 * Ruban de créations qui défile en continu.
 *
 * Pas de titre ni de texte : les courriels parlent d'eux-mêmes. Le rail est
 * doublé et translaté de la moitié de sa largeur, ce qui rend la boucle
 * invisible.
 *
 * Au survol d'une vignette, le courriel défile verticalement dans son cadre :
 * on le lit en entier sans quitter la page. Le rail ralentit pendant ce temps,
 * sinon la pièce qu'on regarde s'échapperait.
 */
export default function Creations() {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const boucle = gsap.to(el, {
      xPercent: -50,
      duration: creations.length * 7,
      ease: "none",
      repeat: -1,
    })

    const parent = el.parentElement
    const ralentir = () => gsap.to(boucle, { timeScale: 0.15, duration: 0.5, overwrite: true })
    const reprendre = () => gsap.to(boucle, { timeScale: 1, duration: 0.6, overwrite: true })
    parent?.addEventListener("pointerenter", ralentir)
    parent?.addEventListener("pointerleave", reprendre)

    // Le défilement vertical n'a de sens qu'avec une souris : au doigt, il n'y
    // a pas de survol, et la vignette resterait figée sur son en-tête.
    const survolPossible = window.matchMedia("(hover: hover) and (pointer: fine)").matches
    const nettoyages: (() => void)[] = []

    if (survolPossible) {
      for (const cadre of el.querySelectorAll<HTMLElement>("[data-piece]")) {
        const image = cadre.firstElementChild as HTMLElement | null
        if (!image) continue

        const descendre = () => {
          const course = image.offsetHeight - cadre.clientHeight
          if (course <= 0) return
          // Vitesse constante quelle que soit la longueur du courriel : un
          // envoi deux fois plus long prend deux fois plus de temps.
          gsap.to(image, { y: -course, duration: course / 260, ease: "none", overwrite: true })
        }
        const remonter = () => {
          gsap.to(image, { y: 0, duration: 0.7, ease: "power2.out", overwrite: true })
        }

        cadre.addEventListener("pointerenter", descendre)
        cadre.addEventListener("pointerleave", remonter)
        nettoyages.push(() => {
          cadre.removeEventListener("pointerenter", descendre)
          cadre.removeEventListener("pointerleave", remonter)
        })
      }
    }

    return () => {
      parent?.removeEventListener("pointerenter", ralentir)
      parent?.removeEventListener("pointerleave", reprendre)
      for (const nettoyer of nettoyages) nettoyer()
      boucle.kill()
    }
  }, [])

  // Le rail est doublé : la seconde copie prend le relais quand la première
  // sort du cadre, sans rupture visible.
  const pieces = [...creations, ...creations]

  return (
    <section id="creations" className="overflow-hidden bg-mint py-16 sm:py-24">
      <div ref={track} className="flex w-max gap-4 will-change-transform sm:gap-6">
        {pieces.map((item, i) => (
          <div
            key={`${item.brand}-${i}`}
            data-piece
            className="sticker-lg h-[26rem] w-[18rem] shrink-0 overflow-hidden rounded-[1.75rem] bg-cream sm:h-[38rem] sm:w-[26rem] sm:rounded-[2rem]"
          >
            {/* Hauteur naturelle et non recadrée : c'est ce qui permet de faire
                défiler le courriel entier dans son cadre au survol. */}
            <Image
              src={item.src}
              alt={`Courriel conçu pour ${item.brand}`}
              width={item.width}
              height={item.height}
              sizes="(max-width: 640px) 18rem, 26rem"
              className="block h-auto w-full will-change-transform"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
