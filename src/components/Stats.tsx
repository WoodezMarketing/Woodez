"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { revealLines } from "@/lib/anim"
import { Sticker } from "./ui"

const TONES: Record<string, { box: string; number: string }> = {
  green: { box: "bg-green", number: "text-cream" },
  lemon: { box: "bg-lemon", number: "text-ink" },
  coral: { box: "bg-coral", number: "text-cream" },
  violet: { box: "bg-violet", number: "text-cream" },
}

const ITEMS = content.stats.items

/**
 * Une statistique à la fois. La section est épinglée le temps de la traverser
 * et le chiffre change au fil du défilement : le carré de couleur porte la
 * valeur, la carte claire l'explique. Les chiffres voisins restent visibles en
 * filigrane au-dessus et en dessous, ce qui montre où l'on en est.
 */
export default function Stats() {
  const root = useRef<HTMLElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const el = root.current
    if (!el) return

    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      revealLines("[data-stats-title] > span > span", { trigger: el, start: "top 80%" })

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          // La progression est découpée en autant de paliers que de chiffres.
          const index = Math.min(ITEMS.length - 1, Math.floor(self.progress * ITEMS.length * 0.99))
          setActive((prev) => (prev === index ? prev : index))
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  // Le compteur repart de zéro à chaque changement de statistique.
  useEffect(() => {
    const node = numberRef.current
    if (!node) return
    const target = ITEMS[active].value

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.textContent = String(target)
      return
    }

    const counter = { v: 0 }
    const tween = gsap.to(counter, {
      v: target,
      duration: 0.9,
      ease: "power2.out",
      onUpdate: () => {
        node.textContent = String(Math.round(counter.v))
      },
    })
    return () => {
      tween.kill()
    }
  }, [active])

  const item = ITEMS[active]
  const tone = TONES[item.color] ?? TONES.green
  const previous = ITEMS[active - 1]
  const next = ITEMS[active + 1]

  return (
    <section ref={root} className="relative bg-cream" style={{ height: `${ITEMS.length * 100}svh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden px-4 sm:px-6">
        <div className="mx-auto w-full max-w-[1200px]">
          <h2
            data-stats-title
            className="display display-3d text-center text-[clamp(2rem,5vw,3.75rem)] sm:text-left"
          >
            <span className="line-mask">
              <span className="block">
                {content.stats.title[0]} <span className="text-green">{content.stats.title[1]}</span>
              </span>
            </span>
          </h2>

          {/* Marge haute généreuse : le chiffre fantôme du dessus vient s'y
              loger sans mordre le titre. */}
          <div className="relative mt-20 sm:mt-24">
            {/* Chiffres voisins en filigrane : on voit d'où l'on vient et où
                l'on va, comme sur un compteur qui défile. */}
            <p
              aria-hidden
              className="display pointer-events-none absolute -top-14 left-2 text-[clamp(3rem,7vw,5rem)] text-ink/[0.07] select-none sm:-top-20"
            >
              {previous ? `${previous.prefix}${previous.value}${previous.suffix}` : ""}
            </p>
            <p
              aria-hidden
              className="display pointer-events-none absolute -bottom-14 left-2 text-[clamp(3rem,7vw,5rem)] text-ink/[0.07] select-none sm:-bottom-20"
            >
              {next ? `${next.prefix}${next.value}${next.suffix}` : ""}
            </p>

            <div className="grid gap-4 sm:grid-cols-[minmax(0,0.85fr)_minmax(0,2fr)] sm:gap-6">
              {/* Le carré de couleur porte le chiffre */}
              <div
                key={`box-${active}`}
                className={`sticker-lg flex aspect-square items-center justify-center rounded-[2rem] ${tone.box}`}
              >
                <p className={`display text-[clamp(3.25rem,11vw,6rem)] tabular-nums ${tone.number}`}>
                  {item.prefix}
                  <span ref={numberRef}>{item.value}</span>
                  {item.suffix}
                </p>
              </div>

              {/* La carte claire l'explique */}
              <div
                key={`card-${active}`}
                className="sticker-lg relative flex flex-col justify-center overflow-hidden rounded-[2rem] bg-cream p-7 sm:p-10"
              >
                <Sticker
                  name={item.icon}
                  size={140}
                  className="absolute -right-6 -bottom-6 opacity-10"
                />

                <p className="display text-[clamp(1.6rem,3.6vw,2.75rem)]">{item.label}</p>
                <p className="prose-balanced mt-3 max-w-md text-base leading-relaxed font-medium text-ink/70 sm:text-lg">
                  {item.note}
                </p>

                {/* Progression : une pastille par statistique */}
                <div className="mt-7 flex items-center gap-2">
                  {ITEMS.map((s, i) => (
                    <span
                      key={s.label}
                      aria-hidden
                      className={`h-2 rounded-full border-2 border-ink transition-all duration-300 ${
                        i === active ? "w-9 bg-green" : "w-2 bg-cream"
                      }`}
                    />
                  ))}
                  <span className="sr-only">
                    Statistique {active + 1} sur {ITEMS.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
