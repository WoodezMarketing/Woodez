"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { reveal, revealLines } from "@/lib/anim"
import { Eyebrow, Sticker } from "./ui"

/** Un sticker différent par question : il apparaît quand la réponse s'ouvre. */
const ICONS = ["exclamation", "chat", "target", "bone", "heart", "ball"] as const

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      revealLines("[data-faq-heading] > span > span", { trigger: el, start: "top 72%" })

      reveal(
        "[data-faq-item]",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "back.out(1.5)" },
        { trigger: el, start: "top 65%" },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="faq" className="bg-cream px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow tone="lemon">{content.faq.eyebrow}</Eyebrow>
          <h2 data-faq-heading className="display mt-6 text-[clamp(2.2rem,6vw,4.5rem)]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block">{content.faq.title[0]}</span>
            </span>
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block text-green">{content.faq.title[1]}</span>
            </span>
          </h2>

          {/* Le sticker change selon la question ouverte. */}
          <div className="relative mt-10 hidden h-32 lg:block">
            {ICONS.map((icon, i) => (
              <div
                key={icon}
                className={`absolute transition-all duration-500 ${
                  open === i
                    ? "scale-100 rotate-0 opacity-100"
                    : "scale-50 -rotate-45 opacity-0"
                }`}
              >
                <Sticker name={icon} size={120} />
              </div>
            ))}
          </div>
        </div>

        <div data-faq-list className="space-y-3">
          {content.faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                data-faq-item
                className={`sticker overflow-hidden rounded-3xl transition-all duration-300 ${
                  isOpen ? "bg-mint" : "bg-cream hover:-translate-y-0.5 hover:bg-mint/40"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="group flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                  >
                    <span
                      className={`display flex size-9 shrink-0 items-center justify-center rounded-full text-sm transition-colors ${
                        isOpen ? "bg-green text-cream" : "bg-ink/8 text-ink/50"
                      }`}
                      aria-hidden
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="flex-1 text-lg leading-snug font-bold">{item.q}</span>

                    <span
                      aria-hidden
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full border-[3px] border-ink text-xl leading-none transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-green text-cream" : "bg-cream group-hover:rotate-90"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                {/* Grille 0fr → 1fr : la réponse se déplie en douceur, sans
                    avoir à mesurer sa hauteur en JavaScript. */}
                <div
                  id={`faq-panel-${i}`}
                  className={`grid transition-all duration-400 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="prose-balanced px-5 pb-6 pl-[4.25rem] text-base leading-relaxed font-medium text-ink/80 sm:px-6 sm:pl-[4.75rem]">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
