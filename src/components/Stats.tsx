"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { Sticker } from "./ui"

const TONES: Record<string, string> = {
  green: "bg-green text-cream",
  lemon: "bg-lemon text-ink",
  coral: "bg-coral text-ink",
  violet: "bg-violet text-cream",
}

/**
 * Les quatre chiffres arrivent l'un après l'autre plutôt qu'en bloc : chaque
 * carte est épinglée le temps d'un écran, se met en place, puis cède la sienne
 * à la suivante. Le fond dérive plus lentement que les cartes, ce qui donne la
 * profondeur.
 */
export default function Stats() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    gsap.registerPlugin(ScrollTrigger)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduced) return

    const ctx = gsap.context(() => {
      gsap.from("[data-stats-title] > span", {
        yPercent: 110,
        duration: 0.9,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      })

      gsap.utils.toArray<HTMLElement>("[data-stat]").forEach((card, i) => {
        const number = card.querySelector<HTMLElement>("[data-count]")
        const target = Number(card.dataset.value)

        // Entrée : la carte monte, se redresse et rebondit.
        gsap.from(card, {
          yPercent: 45,
          rotate: i % 2 ? 7 : -7,
          scale: 0.85,
          opacity: 0,
          duration: 0.8,
          ease: "back.out(1.6)",
          scrollTrigger: { trigger: card, start: "top 88%" },
        })

        // Dérive continue pendant la traversée : chaque carte à sa vitesse.
        gsap.fromTo(
          card,
          { y: 40 + i * 14 },
          {
            y: -40 - i * 14,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1 },
          },
        )

        if (number) {
          const counter = { v: 0 }
          gsap.to(counter, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
            onUpdate: () => {
              number.textContent = String(Math.round(counter.v))
            },
          })
        }
      })

      // Les stickers de fond remontent doucement, plus lentement que tout.
      gsap.to("[data-stat-bg]", {
        yPercent: -22,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.4 },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const [line1, line2] = content.stats.title

  return (
    <section ref={root} className="relative overflow-hidden bg-cream px-4 py-24 sm:px-6 sm:py-32">
      {/* Stickers de marque en très grand, presque effacés : ils donnent de la
          matière au fond sans jamais concurrencer les chiffres. */}
      <div data-stat-bg aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <div className="absolute -left-10 top-10 rotate-12">
          <Sticker name="bone" size={280} />
        </div>
        <div className="absolute right-0 top-1/3 -rotate-12">
          <Sticker name="ball" size={240} />
        </div>
        <div className="absolute bottom-0 left-1/3">
          <Sticker name="bowl" size={300} />
        </div>
      </div>

      <div className="relative mx-auto max-w-[1300px]">
        <h2
          data-stats-title
          className="display mx-auto max-w-[14ch] text-center text-[clamp(2.2rem,6vw,4.5rem)]"
        >
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="block">{line1}</span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="block text-green">{line2}</span>
          </span>
        </h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.items.map((stat) => (
            <article
              key={stat.label}
              data-stat
              data-value={stat.value}
              className={`sticker-lg relative flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-[2rem] p-7 ${
                TONES[stat.color] ?? TONES.green
              }`}
            >
              <Sticker
                name={stat.icon}
                size={90}
                className="absolute -right-3 -top-3 opacity-25"
              />

              <p className="display text-[clamp(2.75rem,6vw,3.75rem)] tabular-nums">
                {stat.prefix}
                <span data-count>{stat.value}</span>
                {stat.suffix}
              </p>

              <div>
                <p className="text-lg leading-tight font-bold">{stat.label}</p>
                <p className="prose-balanced mt-2 text-sm leading-snug font-medium opacity-80">
                  {stat.note}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
