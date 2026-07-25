"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { Eyebrow } from "./ui"

export default function Comparison() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from("[data-row]", {
        x: -40,
        opacity: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: "power2.out",
        scrollTrigger: { trigger: "[data-table]", start: "top 78%" },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const { columns, rows } = content.comparison

  return (
    <section ref={root} id="comparaison" className="bg-mint px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[1200px]">
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
          <div className="min-w-[46rem]">
            {/* En-têtes */}
            <div className="grid grid-cols-[1.1fr_1.2fr_1fr_1fr] gap-3 pb-3">
              <div />
              {columns.map((col, i) => (
                <div
                  key={col}
                  className={`sticker rounded-2xl px-4 py-3 text-center ${
                    i === 0 ? "bg-green text-cream" : "bg-cream text-ink/70"
                  }`}
                >
                  <span className="display text-lg">{col}</span>
                </div>
              ))}
            </div>

            {/* Lignes */}
            <div className="space-y-3">
              {rows.map((row) => (
                <div key={row.label} data-row className="grid grid-cols-[1.1fr_1.2fr_1fr_1fr] gap-3">
                  <div className="flex items-center px-2 text-sm font-bold sm:text-base">
                    {row.label}
                  </div>
                  {row.values.map((value, i) => (
                    <div
                      key={value}
                      className={`flex items-center gap-2.5 rounded-2xl border-[3px] border-ink px-4 py-4 text-sm font-semibold ${
                        i === 0 ? "bg-green text-cream shadow-[5px_5px_0_var(--color-ink)]" : "bg-cream/70 text-ink/70"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          i === 0 ? "bg-cream text-green" : "bg-ink/10 text-ink/50"
                        }`}
                      >
                        {i === 0 ? "✓" : "–"}
                      </span>
                      {value}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
