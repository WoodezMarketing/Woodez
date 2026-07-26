"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { Button } from "./ui"
import Clouds from "./Clouds"

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
        .from("[data-line] > span", { yPercent: 115, duration: 0.9, stagger: 0.12 })
        .from("[data-fade]", { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.4")
        .from("[data-scene]", { y: 50, opacity: 0, duration: 1, ease: "power2.out" }, "-=1")

      // Le décor traîne derrière le texte au défilement : c'est ce décalage de
      // vitesse qui creuse la profondeur.
      const scrub = { trigger: el, start: "top top", end: "bottom top", scrub: true } as const
      gsap.to("[data-scene]", { yPercent: 12, ease: "none", scrollTrigger: scrub })
      gsap.to("[data-sky]", { yPercent: 26, ease: "none", scrollTrigger: scrub })
      gsap.to("[data-copy]", { yPercent: -30, opacity: 0.1, ease: "none", scrollTrigger: scrub })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-scene-sky"
    >
      {/* Ciel : deux bandes de nuages à des vitesses différentes, en mouvement
          dès le chargement. C'est le seul élément animé sans interaction. */}
      <div data-sky aria-hidden className="absolute inset-0 z-0">
        <Clouds
          src="/hero/clouds-b.png"
          width={260}
          duration={150}
          opacity={0.55}
          className="inset-x-0 top-[6%] h-[42%] sm:top-[4%]"
        />
        <Clouds
          src="/hero/clouds-a.png"
          width={190}
          duration={95}
          className="inset-x-0 top-[14%] h-[46%] sm:top-[10%]"
        />
      </div>

      {/* Centré sur mobile ; sur grand écran le bloc se range à gauche, là où
          le ciel est dégagé — sinon il se cogne au chien et au coup de pinceau
          qui occupent le centre. */}
      <div
        data-copy
        className="relative z-20 flex w-full flex-1 flex-col items-center px-5 pt-24 text-center sm:px-8 sm:pt-28 lg:mx-auto lg:max-w-[1400px] lg:items-start lg:px-12 lg:text-left xl:px-16"
      >
        {/* Titre en encre : le vert de marque disparaîtrait sur le coup de
            pinceau vert de la scène juste derrière. */}
        <h1 className="display max-w-full text-[clamp(2rem,4.6vw,3.6rem)] text-ink lg:max-w-[13ch]">
          {content.hero.title.map((line) => (
            <span key={line} data-line className="block overflow-hidden pb-[0.06em]">
              <span className="block">{line}</span>
            </span>
          ))}
        </h1>

        <p
          data-fade
          className="mt-5 max-w-md text-base leading-snug font-semibold text-ink/70 sm:text-lg"
        >
          {content.hero.kicker}
        </p>

        <div data-fade className="mt-7">
          <Button href="#contact" tone="ink" className="text-lg">
            {content.hero.cta}
          </Button>
        </div>
      </div>

      {/* La scène, elle, est fixe. Agrandie sur mobile, sinon les personnages
          se réduisent à une frise illisible. */}
      <div
        data-scene
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-[6%] justify-center"
      >
        <Image
          src="/hero/scene.png"
          alt="Woodez et sa bande : une enveloppe emportée par un avion de papier, une boîte aux lettres renversée et un téléphone curieux"
          width={3840}
          height={1629}
          priority
          sizes="(max-width: 640px) 250vw, (max-width: 1024px) 140vw, 100vw"
          className="w-[250%] max-w-none sm:w-[140%] lg:w-full"
        />
      </div>

      {/* Raccord plein largeur avec la section suivante */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 z-10 h-4 bg-scene-grass" />

      <a
        href="#services"
        data-fade
        className="absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.2em] text-cream uppercase xl:flex"
      >
        {content.hero.scroll}
        <span className="sticker flex size-9 items-center justify-center rounded-full bg-cream text-ink">
          <span className="animate-bounce text-sm leading-none">↓</span>
        </span>
      </a>
    </section>
  )
}
