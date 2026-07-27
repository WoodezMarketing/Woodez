"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { reveal, revealLines } from "@/lib/anim"

export default function Faq() {
  const [open, setOpen] = useState<number | null>(2)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      revealLines("[data-faq-heading] > span > span", { trigger: el, start: "top 75%" })

      reveal(
        "[data-faq-badge]",
        { scale: 0, rotate: 12 },
        { scale: 1, rotate: -3, duration: 0.7, ease: "back.out(2.2)", delay: 0.2 },
        { trigger: el, start: "top 75%" },
      )

      reveal(
        "[data-faq-visual]",
        { x: -40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        { trigger: el, start: "top 65%" },
      )

      reveal(
        "[data-faq-item]",
        { y: 34, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.5)" },
        { trigger: el, start: "top 60%" },
      )
    }, el)

    return () => ctx.revert()
  }, [])

  const [line1, line2] = content.faq.title

  return (
    <section ref={root} id="faq" className="bg-cream px-4 py-24 sm:px-6 sm:py-32">
      <div className="mx-auto max-w-[1200px]">
        {/* Titre centré, second mot dans une pastille de travers */}
        <h2 data-faq-heading className="display display-3d text-center text-[clamp(2.9rem,6vw,4.5rem)]">
          <span className="line-mask">
            <span className="block">{line1}</span>
          </span>
          <span className="line-mask mt-2">
            <span className="block">
              <span
                data-faq-badge
                className="sticker-lg inline-block rounded-2xl bg-green px-6 pt-3 pb-2 text-cream"
              >
                {line2}
              </span>
            </span>
          </span>
        </h2>

        <div className="mt-16 grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          {/* L'illustration reste en vue pendant qu'on parcourt les questions */}
          <div data-faq-visual className="lg:sticky lg:top-28">
            <div className="sticker-lg overflow-hidden rounded-[2.5rem]">
              <Image
                src="/faq/woodez-questions.png"
                alt="Woodez assis dans l'herbe, la patte sous le menton, entouré de points d'interrogation et d'enveloppes"
                width={1611}
                height={2000}
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="space-y-5">
            {content.faq.items.map((item, i) => {
              const isOpen = open === i
              return (
                <div key={item.q} data-faq-item className="relative pt-7">
                  {/* Languette : c'est elle qui donne la silhouette d'un dossier
                      dont on tire une lettre. Placée derrière la carte, seule
                      sa partie haute reste visible. */}
                  <span
                    aria-hidden
                    className={`absolute top-0 left-7 z-0 flex h-8 items-center rounded-t-2xl border-[3px] border-b-0 border-ink px-5 text-xs font-bold transition-colors duration-300 ${
                      isOpen ? "bg-green text-cream" : "bg-lemon text-ink"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  {/* La réponse sort par le haut, comme une lettre qu'on tire de
                      l'enveloppe. Sa marge basse négative la fait passer
                      derrière la carte. */}
                  <div
                    id={`faq-panel-${i}`}
                    className={`relative z-0 grid transition-all duration-500 ease-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="sticker mx-2 -mb-7 rounded-2xl bg-cream px-6 pt-5 pb-11">
                        <p className="text-base leading-relaxed font-medium text-ink/80">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Devant de l'enveloppe */}
                  <h3
                    className={`sticker-lg relative z-10 rounded-2xl transition-colors duration-300 ${
                      isOpen ? "bg-green text-cream" : "bg-lemon text-ink"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-7"
                    >
                      <span className="text-lg leading-snug font-bold sm:text-xl">{item.q}</span>
                      <span
                        aria-hidden
                        className={`relative flex size-7 shrink-0 items-center justify-center transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      >
                        <span className="absolute h-[3px] w-6 rounded-full bg-current" />
                        <span className="absolute h-6 w-[3px] rounded-full bg-current" />
                      </span>
                    </button>
                  </h3>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
