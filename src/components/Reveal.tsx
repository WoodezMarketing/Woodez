"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { reveal } from "@/lib/anim"
import { Sticker } from "./ui"

/** Stickers dispersés autour du paragraphe, hors de la zone de lecture. */
const AROUND = [
  { name: "heart", size: 78, className: "left-[4%] top-[14%] -rotate-12" },
  { name: "paper-plane", size: 86, className: "right-[6%] top-[10%] rotate-12" },
  { name: "target", size: 68, className: "left-[10%] bottom-[16%] rotate-6" },
  { name: "chat", size: 74, className: "right-[9%] bottom-[18%] -rotate-6" },
  { name: "exclamation", size: 62, className: "left-[46%] top-[4%] rotate-3" },
  { name: "bone", size: 70, className: "right-[42%] bottom-[6%] -rotate-12" },
] as const

export default function Reveal() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    gsap.registerPlugin(ScrollTrigger)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set("[data-word]", { opacity: 1 })
      return
    }

    const ctx = gsap.context(() => {
      // Les mots s'allument un à un, calés sur la position de défilement :
      // le lecteur « écrit » la phrase en descendant.
      gsap.to("[data-word]", {
        opacity: 1,
        ease: "none",
        stagger: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          end: "bottom 75%",
          scrub: 0.6,
        },
      })

      reveal(
        "[data-around]",
        { scale: 0, rotate: -40, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "back.out(2.2)" },
        { trigger: el, start: "top 70%" },
      )

      gsap.to("[data-around]", {
        y: (i) => (i % 2 ? 18 : -18),
        duration: 3,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.25,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const words = content.reveal.text.split(" ")
  const isHighlighted = (word: string) =>
    content.reveal.highlight.some((h) => h.split(" ").some((part) => word.includes(part)))

  return (
    // Plein écran : la phrase occupe toute la hauteur et devient un temps
    // d'arrêt dans le défilement, pas une bande de plus.
    <section
      ref={root}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-mint px-5 py-24 sm:px-8"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        {AROUND.map((s) => (
          <div key={s.name} data-around className={`absolute ${s.className}`}>
            <Sticker name={s.name} size={s.size} />
          </div>
        ))}
      </div>

      <p className="prose-balanced relative mx-auto max-w-5xl text-center text-[clamp(2.1rem,4vw,3.25rem)] leading-[1.28] font-bold">
        {words.map((word, i) => (
          <span
            key={`${word}-${i}`}
            data-word
            className={`opacity-15 transition-none ${isHighlighted(word) ? "text-green" : "text-ink"}`}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </section>
  )
}
