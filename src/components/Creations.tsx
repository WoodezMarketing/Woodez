"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { creations, type Creation } from "@/lib/creations"

/** Vitesse du défilement automatique, en pixels par image d'animation. */
const VITESSE = 0.9

/**
 * Ruban de créations qui défile en continu.
 *
 * Le défilement automatique agit sur `scrollLeft` plutôt que sur une
 * translation : c'est le même levier que le glissement au doigt, donc les deux
 * se composent naturellement au lieu de se contredire. Le rail contient les
 * pièces en double, et on retranche une demi-largeur dès qu'on la dépasse, ce
 * qui rend la boucle invisible.
 *
 * Au survol — souris seulement — le courriel défile dans son cadre pour se
 * lire en entier. Au doigt, où le survol n'existe pas, un appui l'ouvre en
 * plein écran.
 */
export default function Creations() {
  const rail = useRef<HTMLDivElement>(null)
  const [ouvert, setOuvert] = useState<Creation | null>(null)
  const [tactile, setTactile] = useState(false)

  // Défilement automatique
  useEffect(() => {
    const el = rail.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let image = 0
    let survol = false
    let saisi = false

    const avancer = () => {
      const moitie = el.scrollWidth / 2
      // Ralenti au survol pour laisser regarder une pièce, arrêté net pendant
      // qu'on fait glisser le ruban au doigt : sinon les deux se disputent.
      const facteur = saisi ? 0 : survol ? 0.18 : 1
      if (facteur > 0 && moitie > 0) {
        el.scrollLeft += VITESSE * facteur
        if (el.scrollLeft >= moitie) el.scrollLeft -= moitie
      }
      image = requestAnimationFrame(avancer)
    }
    image = requestAnimationFrame(avancer)

    const ecouteurs: [string, () => void][] = [
      ["pointerenter", () => (survol = true)],
      ["pointerleave", () => ((survol = false), (saisi = false))],
      ["pointerdown", () => (saisi = true)],
      ["pointerup", () => (saisi = false)],
      ["pointercancel", () => (saisi = false)],
      ["touchstart", () => (saisi = true)],
      ["touchend", () => (saisi = false)],
      ["touchcancel", () => (saisi = false)],
    ]
    for (const [t, f] of ecouteurs) el.addEventListener(t, f, { passive: true })

    return () => {
      cancelAnimationFrame(image)
      for (const [t, f] of ecouteurs) el.removeEventListener(t, f)
    }
  }, [])

  // Lecture du courriel dans son cadre, au survol
  useEffect(() => {
    const el = rail.current
    if (!el) return
    const souris = window.matchMedia("(hover: hover) and (pointer: fine)")
    setTactile(!souris.matches)
    if (!souris.matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const nettoyages: (() => void)[] = []
    for (const cadre of el.querySelectorAll<HTMLElement>("[data-piece]")) {
      const img = cadre.querySelector("img")
      if (!img) continue

      const descendre = () => {
        const course = img.offsetHeight - cadre.clientHeight
        if (course <= 0) return
        // Vitesse constante : un courriel deux fois plus long prend deux fois
        // plus de temps, au lieu de défiler deux fois plus vite.
        gsap.to(img, { y: -course, duration: course / 260, ease: "none", overwrite: true })
      }
      const remonter = () => gsap.to(img, { y: 0, duration: 0.7, ease: "power2.out", overwrite: true })

      cadre.addEventListener("pointerenter", descendre)
      cadre.addEventListener("pointerleave", remonter)
      nettoyages.push(() => {
        cadre.removeEventListener("pointerenter", descendre)
        cadre.removeEventListener("pointerleave", remonter)
      })
    }
    return () => nettoyages.forEach((n) => n())
  }, [])

  // Le plein écran verrouille la page derrière, sinon les deux défilent
  // en même temps.
  useEffect(() => {
    if (!ouvert) return
    const avant = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const parEchap = (e: KeyboardEvent) => e.key === "Escape" && setOuvert(null)
    window.addEventListener("keydown", parEchap)
    return () => {
      document.body.style.overflow = avant
      window.removeEventListener("keydown", parEchap)
    }
  }, [ouvert])

  const pieces = [...creations, ...creations]

  return (
    <>
      <section id="creations" className="bg-mint pt-8 pb-14 sm:pt-24 sm:pb-24">
        <div
          ref={rail}
          className="sans-barre flex w-full gap-4 overflow-x-auto overscroll-x-contain px-4 sm:gap-6 sm:px-6"
        >
          {pieces.map((item, i) => {
            const contenu = (
              <Image
                src={item.src}
                alt={`Courriel conçu pour ${item.brand}`}
                width={item.width}
                height={item.height}
                sizes="(max-width: 640px) 17rem, 26rem"
                className="block h-auto w-full will-change-transform"
              />
            )

            const classes =
              "sticker-lg aspect-[9/16] w-[17rem] shrink-0 overflow-hidden rounded-[1.75rem] bg-cream sm:w-[26rem] sm:rounded-[2rem]"

            // Au doigt, la vignette devient un bouton : c'est le seul moyen de
            // voir le courriel en entier sans survol.
            return tactile ? (
              <button
                key={`${item.brand}-${i}`}
                type="button"
                data-piece
                onClick={() => setOuvert(item)}
                aria-label={`Voir le courriel conçu pour ${item.brand}`}
                className={classes}
              >
                {contenu}
              </button>
            ) : (
              <div key={`${item.brand}-${i}`} data-piece className={classes}>
                {contenu}
              </div>
            )
          })}
        </div>
      </section>

      {ouvert && (
        <div className="fixed inset-0 z-[90] bg-ink/90">
          <div data-lenis-prevent className="h-full overflow-y-auto overscroll-contain px-4 py-6">
            <Image
              src={ouvert.src}
              alt={`Courriel conçu pour ${ouvert.brand}`}
              width={ouvert.width}
              height={ouvert.height}
              className="mx-auto block h-auto w-full max-w-lg rounded-2xl"
            />
            {/* De la place sous l'image pour que le bouton ne couvre jamais la
                fin du courriel. */}
            <div className="h-24" />
          </div>

          <button
            type="button"
            onClick={() => setOuvert(null)}
            aria-label="Fermer"
            className="sticker fixed bottom-7 left-1/2 flex size-14 -translate-x-1/2 items-center justify-center rounded-full bg-cream text-2xl"
          >
            <span aria-hidden className="relative block size-5">
              <span className="absolute top-1/2 left-0 h-[3px] w-5 -translate-y-1/2 rotate-45 rounded-full bg-ink" />
              <span className="absolute top-1/2 left-0 h-[3px] w-5 -translate-y-1/2 -rotate-45 rounded-full bg-ink" />
            </span>
          </button>
        </div>
      )}
    </>
  )
}
