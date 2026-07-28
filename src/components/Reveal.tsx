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
      gsap.set("[data-word]", { "--wipe": "0%" })
      return
    }

    const ctx = gsap.context(() => {
      // Chaque mot est balayé de gauche à droite, l'un après l'autre, au
      // rythme du défilement : la phrase se colore comme on la lirait.
      // Durée plus longue que le décalage : deux ou trois mots sont toujours
      // en cours de balayage, ce qui donne un bord souple plutôt qu'un mot qui
      // bascule d'un coup.
      gsap.to("[data-word]", {
        "--wipe": "0%",
        ease: "none",
        duration: 2.5,
        stagger: 1,
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "bottom 80%",
          scrub: 0.5,
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

      {/* Sur mobile la taille suit la largeur d'écran : la phrase se déploie
          alors sur une douzaine de lignes et occupe toute la hauteur de la
          section, au lieu de flotter au milieu sur six lignes. */}
      <p className="display relative mx-auto max-w-5xl text-center text-[clamp(2.3rem,10.2vw,3rem)] leading-[1.12] sm:text-[clamp(1.65rem,3.6vw,3rem)] sm:leading-[1.18]">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} data-word className="wipe">
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </section>
  )
}
