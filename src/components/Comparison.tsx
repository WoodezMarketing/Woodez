"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { Eyebrow, Sticker } from "./ui"

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
      gsap.from("[data-row]", {
        x: -32,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-table]", start: "top 80%" },
      })

      gsap.from("[data-mark]", {
        scale: 0,
        duration: 0.4,
        stagger: 0.03,
        ease: "back.out(2.4)",
        scrollTrigger: { trigger: "[data-table]", start: "top 80%" },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const { columns, rows, legend } = content.comparison

  return (
    <section ref={root} id="comparaison" className="bg-mint px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[1100px]">
        <div className="max-w-3xl">
          <Eyebrow tone="coral">{content.comparison.eyebrow}</Eyebrow>
          <h2 className="display mt-5 text-[clamp(2rem,6vw,4.5rem)]">
            <span className="text-green">{content.comparison.title[0]}</span>{" "}
            {content.comparison.title[1]}
          </h2>
          <p className="mt-5 text-lg leading-relaxed font-medium text-ink/75">
            {content.comparison.lead}
          </p>
        </div>

        <div data-table className="mt-12 overflow-x-auto pb-2">
          <div className="min-w-[34rem]">
            {/* En-têtes de colonnes */}
            <div className="grid grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] gap-2 pb-3 sm:gap-3">
              <div />
              {columns.map((col, i) => (
                <div
                  key={col}
                  className={`sticker flex items-center justify-center rounded-2xl px-2 py-3 text-center ${
                    i === 0 ? "bg-green text-cream" : "bg-cream text-ink/60"
                  }`}
                >
                  <span className="display text-sm leading-tight sm:text-base">{col}</span>
                </div>
              ))}
            </div>

            {/* Une ligne = un critère, trois pastilles */}
            <div className="space-y-2 sm:space-y-3">
              {rows.map((row) => (
                <div
                  key={row.label}
                  data-row
                  className="grid grid-cols-[1.4fr_repeat(3,minmax(0,1fr))] items-center gap-2 rounded-2xl bg-cream/60 sm:gap-3"
                >
                  <div className="px-3 py-4 text-sm leading-snug font-bold sm:text-base">
                    {row.label}
                  </div>

                  {row.values.map((value, i) => {
                    const mark = MARKS[value as Verdict]
                    return (
                      <div key={i} className="flex justify-center py-3">
                        <span
                          data-mark
                          title={mark.label}
                          className={`sticker flex size-11 items-center justify-center rounded-full text-lg font-bold sm:size-12 sm:text-xl ${mark.className}`}
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
        </div>

        {/* Légende */}
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
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
          <Sticker name="target" size={44} className="ml-auto hidden sm:block" />
        </div>
      </div>
    </section>
  )
}
