"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { reveal, revealLines } from "@/lib/anim"
import { Eyebrow } from "./ui"

type Verdict = "oui" | "bof" | "non"

/** Une pastille par case : la réponse se lit sans lire une seule phrase. */
const MARKS: Record<Verdict, { glyph: string; className: string; label: string }> = {
  oui: { glyph: "✓", className: "bg-green text-cream", label: "Inclus" },
  bof: { glyph: "~", className: "bg-lemon text-ink", label: "Ça dépend" },
  non: { glyph: "✕", className: "bg-cream text-ink/35", label: "Non" },
}

export default function Comparison() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      revealLines("[data-heading] > span > span", { trigger: el, start: "top 70%" })

      reveal(
        "[data-vs]",
        { scale: 0, rotate: -180 },
        { scale: 1, rotate: 0, duration: 0.8, ease: "back.out(2.6)", delay: 0.25 },
        { trigger: el, start: "top 70%" },
      )

      reveal(
        "[data-row]",
        { x: -32, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.45, stagger: 0.08, ease: "power2.out" },
        { trigger: el, start: "top 60%" },
      )

      reveal(
        "[data-mark]",
        { scale: 0 },
        { scale: 1, duration: 0.4, stagger: 0.03, ease: "back.out(2.4)" },
        { trigger: el, start: "top 60%" },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const { columns, rows, legend } = content.comparison

  return (
    <section
      ref={root}
      id="comparaison"
      className="relative overflow-hidden bg-mint px-4 py-24 sm:px-6 sm:py-32"
    >
      <div className="relative mx-auto max-w-[1100px]">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow tone="coral">{content.comparison.eyebrow}</Eyebrow>

          {/* Le « vs » est une pastille en relief, comme les boutons : il
              sépare les deux camps au lieu d'être un mot noyé dans le titre. */}
          <h2
            data-heading
            className="display display-3d mt-6 flex flex-nowrap items-center justify-center gap-x-2 text-[clamp(2.4rem,6vw,4.5rem)] sm:gap-x-3"
          >
            <span className="line-mask">
              <span className="block text-green">{content.comparison.title[0]}</span>
            </span>

            {/* Taille fixe plutôt que relative au titre : en `em` la pastille
                devenait un point minuscule et le mot dedans, une tache. */}
            <span
              data-vs
              className="sticker flex size-12 shrink-0 items-center justify-center rounded-full bg-ink text-base text-cream sm:size-16 sm:text-xl"
              style={{ WebkitTextStroke: "0", textShadow: "none" }}
            >
              VS
            </span>

            <span className="line-mask">
              <span className="block">{content.comparison.title[1]}</span>
            </span>
          </h2>

          <p className="prose-balanced mx-auto mt-6 max-w-lg text-lg leading-relaxed font-medium text-ink/75">
            {content.comparison.lead}
          </p>
        </div>

        {/* Aucun défilement latéral : la grille tient dans la largeur du
            téléphone. Le rembourrage droit laisse la place aux ombres portées,
            qui se faisaient couper par le bord de la section. */}
        <div data-table className="mt-14 pr-2">
          {/* En-têtes de colonnes */}
          <div className="grid grid-cols-[1.05fr_repeat(3,minmax(0,1fr))] gap-1.5 pb-3 sm:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] sm:gap-3">
            <div />
            {columns.map((col, i) => (
              <div
                key={col}
                className={`sticker flex items-center justify-center rounded-2xl px-1.5 py-2.5 text-center sm:px-2 sm:py-3 ${
                  i === 0 ? "bg-green text-cream" : "bg-cream text-ink/60"
                }`}
              >
                {i === 0 ? (
                  // Le wordmark en relief remplace le mot : la colonne est
                  // étroite sur mobile et le logo se lit mieux qu'un nom coupé.
                  <Image
                    src="/brand/wordmark-3d.svg"
                    alt={col}
                    width={160}
                    height={48}
                    className="h-5 w-auto sm:h-7"
                  />
                ) : (
                  <span className="display text-[0.68rem] leading-tight sm:text-base">{col}</span>
                )}
              </div>
            ))}
          </div>

          {/* Une ligne = un critère, trois pastilles */}
          <div className="space-y-2 sm:space-y-3">
            {rows.map((row) => (
              <div
                key={row.label}
                data-row
                className="grid grid-cols-[1.05fr_repeat(3,minmax(0,1fr))] items-center gap-1.5 rounded-2xl bg-cream/60 sm:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] sm:gap-3"
              >
                <div className="px-2.5 py-3.5 text-[0.8rem] leading-snug font-bold sm:px-3 sm:py-4 sm:text-base">
                  {row.label}
                </div>

                {row.values.map((value, i) => {
                  const mark = MARKS[value as Verdict]
                  return (
                    <div key={i} className="flex justify-center py-3">
                      <span
                        data-mark
                        title={mark.label}
                        className={`sticker flex size-9 items-center justify-center rounded-full text-base font-bold sm:size-12 sm:text-xl ${mark.className}`}
                      >
                        <span aria-hidden>{mark.glyph}</span>
                        <span className="sr-only">{mark.label}</span>
                      </span>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Légende */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {(Object.keys(MARKS) as Verdict[]).map((key) => (
            <span key={key} className="flex items-center gap-2 text-sm font-semibold text-ink/70">
              <span
                className={`flex size-7 items-center justify-center rounded-full border-[3px] border-ink text-sm ${MARKS[key].className}`}
                aria-hidden
              >
                {MARKS[key].glyph}
              </span>
              {legend[key]}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
