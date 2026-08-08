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
 * invisible. Le défilement ralentit au survol pour laisser le temps de
 * regarder une pièce.
 */
export default function Creations() {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const boucle = gsap.to(el, {
      xPercent: -50,
      duration: creations.length * 6,
      ease: "none",
      repeat: -1,
    })

    const parent = el.parentElement
    const ralentir = () => gsap.to(boucle, { timeScale: 0.25, duration: 0.6, overwrite: true })
    const reprendre = () => gsap.to(boucle, { timeScale: 1, duration: 0.6, overwrite: true })
    parent?.addEventListener("pointerenter", ralentir)
    parent?.addEventListener("pointerleave", reprendre)

    return () => {
      parent?.removeEventListener("pointerenter", ralentir)
      parent?.removeEventListener("pointerleave", reprendre)
      boucle.kill()
    }
  }, [])

  // Le rail est doublé : la seconde copie prend le relais quand la première
  // sort du cadre, sans rupture visible.
  const pieces = [...creations, ...creations]

  return (
    <section id="creations" className="overflow-hidden bg-ink py-16 sm:py-24">
      <div ref={track} className="flex w-max gap-4 will-change-transform sm:gap-6">
        {pieces.map((item, i) => (
          <div
            key={`${item.brand}-${i}`}
            className="h-[22rem] w-[15rem] shrink-0 overflow-hidden rounded-[1.5rem] border-4 border-ink/0 sm:h-[30rem] sm:w-[21rem] sm:rounded-[2rem]"
          >
            {/* Cadré par le haut : c'est l'en-tête du courriel qui porte le
                design, et un courriel entier serait illisible à cette taille. */}
            <Image
              src={item.src}
              alt={`Courriel conçu pour ${item.brand}`}
              width={item.width}
              height={item.height}
              sizes="(max-width: 640px) 15rem, 21rem"
              className="h-full w-full object-cover object-top"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
