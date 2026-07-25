"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { Button } from "./ui"

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-line] > span", { yPercent: 115, duration: 0.9, stagger: 0.1 })
        .from("[data-fade]", { y: 24, opacity: 0, duration: 0.6 }, "-=0.45")
        .from("[data-scene]", { y: 60, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.9")

      // Parallaxe au défilement : la scène traîne derrière le titre, ce qui
      // creuse la profondeur entre le texte et le décor.
      gsap.to("[data-scene]", {
        yPercent: 14,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      })
      gsap.to("[data-copy]", {
        yPercent: -34,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
      })

      // Parallaxe à la souris, très légère : la scène respire sous le curseur.
      const scene = el.querySelector<HTMLElement>("[data-scene]")
      if (!scene) return
      const toX = gsap.quickTo(scene, "x", { duration: 1, ease: "power3" })

      const onMove = (e: PointerEvent) => toX((e.clientX / window.innerWidth - 0.5) * 26)
      window.addEventListener("pointermove", onMove)
      return () => window.removeEventListener("pointermove", onMove)
    }, el)

    return () => ctx.revert()
  }, [])

  const lines = content.hero.title

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-scene-sky"
    >
      <div
        data-copy
        className="relative z-10 flex w-full flex-1 flex-col items-center px-5 pt-28 text-center sm:px-8 sm:pt-32"
      >
        {/* Tout le titre est en encre : le vert de marque disparaîtrait sur le
            swoosh vert de la scène juste derrière. */}
        <h1 className="display max-w-full text-[clamp(1.75rem,5.2vw,4rem)] text-ink">
          {lines.map((line) => (
            <span key={line} data-line className="block overflow-hidden pb-[0.06em]">
              <span className="block">{line}</span>
            </span>
          ))}
        </h1>

        <div data-fade className="mt-8">
          <Button href="#contact" tone="ink" className="text-lg">
            {content.hero.cta}
          </Button>
        </div>
      </div>

      {/* La scène est ancrée en bas et légèrement débordante : on perd un peu
          d'herbe uniforme en bas, ce qui dégage d'autant le ciel pour le titre.
          Sur mobile elle est agrandie, sinon les personnages deviennent
          illisibles sur une frise de 165 px. */}
      <div
        data-scene
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex translate-y-[8%] justify-center"
      >
        <Image
          src="/hero/scene.png"
          alt="Woodez et sa bande : une enveloppe emportée par un avion de papier, une boîte aux lettres renversée et un téléphone curieux"
          width={1584}
          height={672}
          priority
          className="w-[195%] max-w-none sm:w-[130%] lg:w-full"
        />
      </div>

      {/* Bande de raccord : évite tout liseré clair entre l'herbe et la section suivante */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-0 h-3 bg-scene-grass" />

      <a
        href="#services"
        data-fade
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.2em] text-cream uppercase xl:flex"
      >
        {content.hero.scroll}
        <span className="sticker flex size-9 items-center justify-center rounded-full bg-cream text-ink">
          <span className="animate-bounce text-sm leading-none">↓</span>
        </span>
      </a>
    </section>
  )
}
