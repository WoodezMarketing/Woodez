"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { creations } from "@/lib/creations"
import { Eyebrow } from "./ui"

/** Quatre colonnes, chacune à sa vitesse : la plus lente donne l'arrière-plan. */
const COLUMN_SPEEDS = [1, 1.45, 0.8, 1.2]

/** Répartit les créations en colonnes, puis double chaque colonne pour
 *  qu'elle reste remplie du haut en bas pendant toute la remontée.
 *  Les courriels sont montrés sur toute leur hauteur : deux exemplaires
 *  suffisent largement, chaque image dépassant déjà la hauteur d'un écran. */
function buildColumns(count: number) {
  const columns: (typeof creations)[] = Array.from({ length: count }, () => [])
  creations.forEach((item, i) => columns[i % count].push(item))
  return columns.map((column) => [...column, ...column])
}

const COLUMNS = buildColumns(COLUMN_SPEEDS.length)

export default function Creations() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Les colonnes remontent pendant toute la traversée de la section. Chaque
      // colonne est triplée, donc translater d'un tiers de sa hauteur revient à
      // boucler sans jamais laisser de vide.
      gsap.utils.toArray<HTMLElement>("[data-column]").forEach((column, i) => {
        gsap.to(column, {
          // Course exprimée en pixels et non en pourcentage de la colonne :
          // les courriels font plusieurs milliers de pixels de haut, un
          // pourcentage donnerait une course démesurée et illisible.
          y: -520 * COLUMN_SPEEDS[i % COLUMN_SPEEDS.length],
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.4,
          },
        })
      })

      // Le texte apparaît une fois la section bien engagée, puis s'efface
      // juste avant qu'elle libère le défilement.
      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: "top 60%", end: "top top", scrub: 0.8 },
        })
        .from("[data-reveal] > span", { yPercent: 110, duration: 1, stagger: 0.15 })
        .from("[data-reveal-fade]", { opacity: 0, y: 20, duration: 0.8 }, "-=0.5")
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    // Section volontairement longue : le texte reste collé au centre de l'écran
    // pendant que les créations défilent derrière lui.
    <section ref={root} id="creations" className="relative h-[190svh] bg-ink">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden">
        {/* Mur de créations, très atténué pour ne jamais gêner la lecture */}
        <div
          aria-hidden
          className="absolute inset-0 grid grid-cols-2 gap-4 opacity-[0.22] sm:grid-cols-3 sm:gap-6 lg:grid-cols-4"
        >
          {COLUMNS.map((column, i) => (
            <div
              key={i}
              data-column
              className={`flex flex-col gap-4 will-change-transform sm:gap-6 ${
                i === 3 ? "hidden lg:flex" : i === 2 ? "hidden sm:flex" : ""
              }`}
              style={{ marginTop: `${i % 2 ? -8 : 0}rem` }}
            >
              {/* Chaque courriel sur toute sa longueur, coins arrondis. La
                  première image de chaque colonne est chargée sans attendre :
                  elle dépasse à elle seule la hauteur de l'écran, ce qui
                  garantit qu'aucun trou n'apparaisse le temps du chargement. */}
              {column.map((item, j) => (
                <div key={`${item.brand}-${j}`} className="overflow-hidden rounded-2xl sm:rounded-3xl">
                  <Image
                    src={item.src}
                    alt=""
                    width={item.width}
                    height={item.height}
                    loading={j === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="h-auto w-full"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Voile qui garantit le contraste du texte quelle que soit l'image derrière */}
        <div aria-hidden className="absolute inset-0 bg-ink/45" />

        <div className="relative z-10 mx-auto max-w-3xl px-5 text-center">
          <div data-reveal-fade>
            <Eyebrow tone="lemon">{content.creations.eyebrow}</Eyebrow>
          </div>

          <h2 className="display display-3d mt-6 text-[clamp(3rem,9vw,5rem)] leading-[0.92]">
            {content.creations.title.map((line, i) => (
              <span key={line} data-reveal className="line-mask">
                <span className={`block ${i === 1 ? "text-green" : ""}`}>{line}</span>
              </span>
            ))}
          </h2>

          <p
            data-reveal-fade
            className="prose-balanced mx-auto mt-6 max-w-lg text-lg leading-relaxed font-medium text-cream/75"
          >
            {content.creations.lead}
          </p>
        </div>
      </div>
    </section>
  )
}
