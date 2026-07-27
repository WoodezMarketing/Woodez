"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { Sticker } from "./ui"

const TONES: Record<string, { card: string; chip: string }> = {
  green: { card: "bg-green text-cream", chip: "bg-cream text-ink" },
  sky: { card: "bg-sky text-ink", chip: "bg-cream text-ink" },
  coral: { card: "bg-coral text-ink", chip: "bg-cream text-ink" },
}

/** Inclinaison de repos de chaque carte, en degrés. Assez faible pour rester
 *  lisible, assez marquée pour qu'on la remarque. */
const TILTS = [-1.8, 1.4, -1.1]

export default function Services() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-card]").forEach((card, i, all) => {
        // Chaque carte est posée de travers, dans un sens différent de sa
        // voisine : le paquet a l'air empilé à la main plutôt qu'aligné au
        // cordeau. La rotation passe par GSAP pour qu'elle survive au tween
        // d'échelle, qui réécrit sinon toute la transformation.
        gsap.set(card, { rotate: TILTS[i % TILTS.length] })

        if (i === all.length - 1) return

        // La carte rétrécit et se redresse quand la suivante vient la
        // recouvrir : c'est ce qui creuse la profondeur du paquet.
        gsap.to(card, {
          scale: 0.94 - (all.length - 2 - i) * 0.02,
          rotate: TILTS[i % TILTS.length] * 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: all[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        })
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="services" className="bg-cream px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-14 text-center">
          <h2 className="display display-3d mx-auto mt-5 max-w-4xl text-[clamp(2.6rem,6vw,4.5rem)]">
            {content.services.title.join(" ")}
          </h2>
        </div>

        <div className="space-y-8">
          {content.services.items.map((service, i) => {
            const tone = TONES[service.color] ?? TONES.green
            return (
              <article
                key={service.n}
                data-card
                style={{ top: `calc(6rem + ${i * 1.5}rem)` }}
                className={`sticker-lg sticky origin-top rounded-[2.5rem] p-7 sm:p-12 ${tone.card}`}
              >
                <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-4">
                      <span
                        className={`sticker display flex size-14 items-center justify-center rounded-full text-xl ${tone.chip}`}
                      >
                        {service.n}
                      </span>
                      <h3 className="display text-[clamp(1.9rem,4.5vw,3.25rem)]">{service.title}</h3>
                    </div>

                    <p className="mt-6 max-w-2xl text-lg leading-relaxed font-medium opacity-90">
                      {service.text}
                    </p>

                    <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                      {service.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5 font-semibold">
                          <span
                            className={`sticker mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-xs ${tone.chip}`}
                            aria-hidden
                          >
                            ✓
                          </span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Sticker
                    name={service.icon}
                    size={150}
                    className="hidden w-32 justify-self-end lg:block xl:w-40"
                  />
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
