"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"

const TONES: Record<string, string> = {
  green: "bg-green text-cream",
  lemon: "bg-lemon text-ink",
  coral: "bg-coral text-ink",
  violet: "bg-violet text-cream",
}

export default function Stats() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    gsap.registerPlugin(ScrollTrigger)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-stat]").forEach((card, i) => {
        const target = Number(card.dataset.value)
        const number = card.querySelector<HTMLElement>("[data-count]")

        // Le chiffre final est déjà dans le HTML : si JS ou l'animation
        // échoue, la vraie valeur reste affichée.
        if (!reduced) {
          gsap.from(card, {
            y: 40,
            opacity: 0,
            rotate: i % 2 ? 2 : -2,
            duration: 0.6,
            ease: "back.out(1.4)",
            scrollTrigger: { trigger: card, start: "top 88%" },
          })
        }

        if (number && !reduced) {
          const counter = { v: 0 }
          gsap.to(counter, {
            v: target,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 85%" },
            onUpdate: () => {
              number.textContent = String(Math.round(counter.v))
            },
          })
        }
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const [line1, line2] = content.stats.title

  return (
    <section ref={root} className="bg-cream px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[1400px]">
        <h2 className="display text-center text-[clamp(2rem,6vw,4.5rem)]">
          {line1} <span className="text-green">{line2}</span>
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {content.stats.items.map((stat) => (
            <div
              key={stat.label}
              data-stat
              data-value={stat.value}
              className={`sticker-lg rounded-[2rem] p-7 ${TONES[stat.color] ?? TONES.green}`}
            >
              <p className="display text-[clamp(2.75rem,7vw,4rem)] tabular-nums">
                {stat.prefix}
                <span data-count>{stat.value}</span>
                {stat.suffix}
              </p>
              <p className="mt-2 text-base leading-snug font-semibold opacity-90">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
