"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { reveal, revealLines } from "@/lib/anim"
import { Sticker } from "./ui"

const TONES: Record<string, { box: string; text: string }> = {
  green: { box: "bg-green", text: "text-cream" },
  lemon: { box: "bg-lemon", text: "text-ink" },
  coral: { box: "bg-coral", text: "text-cream" },
  violet: { box: "bg-violet", text: "text-cream" },
}

const ITEMS = content.stats.items

/**
 * Sur grand écran, les chiffres défilent normalement : celui qui passe au
 * centre de l'écran est net, ceux qui s'en éloignent s'estompent. Rien n'est
 * épinglé, le défilement reste continu.
 *
 * Sur mobile on garde l'empilement de cartes de travers avec leur dérive
 * parallaxe, plus lisible qu'une mise en page en deux colonnes écrasée.
 */
export default function Stats() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      revealLines("[data-stats-title] > span > span", { trigger: el, start: "top 80%" })

      const mm = gsap.matchMedia()

      mm.add("(min-width: 640px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stat-row]").forEach((row) => {
          // Deux courses opposées : la carte gagne en netteté jusqu'au centre
          // de l'écran, puis la perd en s'éloignant.
          gsap.fromTo(
            row,
            { opacity: 0.18, scale: 0.92 },
            {
              opacity: 1,
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: row, start: "top bottom", end: "center center", scrub: 0.5 },
            },
          )
          gsap.fromTo(
            row,
            { opacity: 1, scale: 1 },
            {
              opacity: 0.18,
              scale: 0.92,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { trigger: row, start: "center center", end: "bottom top", scrub: 0.5 },
            },
          )
        })
      })

      mm.add("(max-width: 639px)", () => {
        gsap.utils.toArray<HTMLElement>("[data-stat-card]").forEach((card, i) => {
          const tilt = i % 2 ? 7 : -7

          reveal(
            card,
            { yPercent: 60, rotate: tilt * 1.6, scale: 0.86, opacity: 0 },
            {
              yPercent: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.9,
              ease: "back.out(1.7)",
            },
            { trigger: card, start: "top 88%" },
          )

          gsap.fromTo(
            card,
            { y: 70 + i * 30, rotate: tilt },
            {
              y: -70 - i * 30,
              rotate: -tilt,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
            },
          )
        })
      })

      return () => mm.revert()
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="relative overflow-hidden bg-cream px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-[1200px]">
        <h2
          data-stats-title
          className="display display-3d text-center text-[clamp(2.6rem,6vw,4.25rem)] sm:text-left"
        >
          <span className="line-mask">
            <span className="block">
              {content.stats.title[0]} {content.stats.title[1]}
            </span>
          </span>
        </h2>

        {/* Grand écran : carré du chiffre + carte d'explication */}
        <div className="mt-16 hidden space-y-8 sm:block">
          {ITEMS.map((item) => {
            const tone = TONES[item.color] ?? TONES.green
            return (
              <div
                key={item.label}
                data-stat-row
                className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] gap-6 will-change-transform"
              >
                <div
                  className={`sticker-lg flex aspect-square items-center justify-center rounded-[2rem] ${tone.box}`}
                >
                  <p className={`display text-[clamp(3rem,8vw,5rem)] tabular-nums ${tone.text}`}>
                    {item.prefix}
                    {item.value}
                    {item.suffix}
                  </p>
                </div>

                <div className="sticker-lg relative flex flex-col justify-center overflow-hidden rounded-[2rem] bg-cream p-8 sm:p-10">
                  <Sticker
                    name={item.icon}
                    size={150}
                    className="absolute -right-6 -bottom-6 opacity-10"
                  />
                  <p className="display text-[clamp(1.75rem,3.4vw,2.75rem)]">{item.label}</p>
                  <p className="prose-balanced mt-3 max-w-md text-lg leading-relaxed font-medium text-ink/70">
                    {item.note}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Mobile : cartes empilées, de travers, avec dérive parallaxe */}
        <div className="mt-12 space-y-6 sm:hidden">
          {ITEMS.map((item) => {
            const tone = TONES[item.color] ?? TONES.green
            return (
              <article
                key={item.label}
                data-stat-card
                className={`sticker-lg relative overflow-hidden rounded-[2rem] p-7 will-change-transform ${tone.box} ${tone.text}`}
              >
                <Sticker name={item.icon} size={90} className="absolute -top-4 -right-4 opacity-25" />

                <p className="display text-[clamp(3rem,15vw,4.5rem)] tabular-nums">
                  {item.prefix}
                  {item.value}
                  {item.suffix}
                </p>
                <p className="mt-3 text-xl leading-tight font-bold">{item.label}</p>
                <p className="prose-balanced mt-2 text-base leading-snug font-medium opacity-80">
                  {item.note}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
