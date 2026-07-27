"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { CONTACT, content } from "@/lib/content"
import { Button, Sticker } from "./ui"

const CONFETTI = [
  { name: "heart", size: 64, className: "left-[7%] top-[16%]" },
  { name: "paper-plane", size: 68, className: "right-[8%] top-[14%]" },
  { name: "enveloppe", size: 62, className: "left-[15%] bottom-[16%]" },
  { name: "chat", size: 58, className: "right-[15%] bottom-[14%]" },
  { name: "target", size: 52, className: "left-[38%] top-[7%]" },
  { name: "ball", size: 48, className: "right-[36%] bottom-[7%]" },
] as const

export default function FinalCta() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from("[data-confetti]", {
        scale: 0,
        rotate: -60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.07,
        ease: "back.out(2.2)",
        scrollTrigger: { trigger: el, start: "top 70%" },
      })

      gsap.to("[data-confetti]", {
        y: (i) => (i % 2 ? 16 : -16),
        rotation: (i) => (i % 2 ? 10 : -10),
        duration: 2.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.2,
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    // Pas de fond sur la section elle-même : la partie transparente au-dessus
    // des collines laisse voir la section précédente, et le contenu qui suit
    // repose sur le vert du gazon.
    <section ref={root} id="contact" className="relative isolate">
      {/* Ligne de collines. Le bas de l'image est un vert uni, repris à
          l'identique par le bloc en dessous : le raccord est invisible et le
          contenu a l'air posé sur le gazon. */}
      <Image
        src="/footer/Montagnes.png"
        alt=""
        aria-hidden
        width={1536}
        height={281}
        className="block w-full"
      />

      <div className="relative overflow-hidden bg-grass px-4 pt-4 pb-24 sm:px-6 sm:pb-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        {CONFETTI.map((c) => (
          <div key={c.name} data-confetti className={`absolute ${c.className}`}>
            <Sticker name={c.name} size={c.size} />
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="display display-3d text-[clamp(2.6rem,6.4vw,5rem)]">
          {content.cta.title.join(" ")}
        </h2>

        {/* Empilés et pleine largeur sur mobile : deux pastilles de largeurs
            différentes l'une sous l'autre se lisaient mal. */}
        <div className="mx-auto mt-12 flex max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center">
          <Button href={`mailto:${CONTACT.email}`} tone="cream" className="text-lg">
            {content.cta.button}
          </Button>
          <Button href={CONTACT.whatsapp} tone="lemon" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </Button>
        </div>
      </div>
      </div>
    </section>
  )
}
