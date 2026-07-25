"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CONTACT, content } from "@/lib/content"
import { Button, Sticker } from "./ui"

// Sur fond jaune, les stickers vert + contour noir ressortent au maximum.
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
    <section
      ref={root}
      id="contact"
      className="relative isolate overflow-hidden bg-lemon px-4 py-24 sm:px-6 sm:py-32"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        {CONFETTI.map((c) => (
          <div key={c.name} data-confetti className={`absolute ${c.className}`}>
            <Sticker name={c.name} size={c.size} />
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <h2 className="display text-[clamp(2.2rem,6.4vw,5rem)]">
          {content.cta.title[0]}{" "}
          <span className="text-green">{content.cta.title[1]}</span>{" "}
          {content.cta.title[2]}
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed font-medium text-ink/75">
          {content.cta.lead}
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={`mailto:${CONTACT.email}`} tone="green" className="text-lg">
            {content.cta.button}
          </Button>
          <Button href={CONTACT.whatsapp} tone="cream" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </Button>
        </div>

        <p className="mt-8 text-sm font-semibold text-ink/70">
          {content.cta.or}{" "}
          <a href={`mailto:${CONTACT.email}`} className="underline decoration-2 underline-offset-4 hover:text-green">
            {CONTACT.email}
          </a>{" "}
          ·{" "}
          <a href={CONTACT.phoneHref} className="underline decoration-2 underline-offset-4 hover:text-green">
            {CONTACT.phone}
          </a>
        </p>
      </div>
    </section>
  )
}
