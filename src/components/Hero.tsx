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
        {/* Bandes plus larges donc nuages plus petits, et placées haut : plus
            bas elles se chevauchaient et écrasaient la scène. */}
        {/* La largeur de bande commande la taille des nuages : plus la bande
            est étroite, plus les nuages sont petits. Elle doit malgré tout
            rester au-dessus de 100 vw, sinon la boucle laisse un trou. */}
        <Clouds
          src="/hero/clouds-b-v2.png"
          width={135}
          duration={190}
          opacity={0.4}
          className="inset-x-0 top-[3%]"
        />
        <Clouds
          src="/hero/clouds-a-v2.png"
          width={115}
          duration={120}
          opacity={0.75}
          className="inset-x-0 top-[26%] sm:top-[22%]"
        />
      </div>

      <div
        data-copy
        className="relative z-20 flex w-full flex-1 flex-col items-center px-5 pt-24 text-center sm:px-8 sm:pt-28"
      >
        {/* Titre en encre : le vert de marque disparaîtrait sur le coup de
            pinceau vert de la scène juste derrière. */}
        <h1 className="display max-w-[14ch] text-[clamp(2.4rem,5.2vw,4.2rem)] text-ink sm:max-w-none">
          {content.hero.title.map((line) => (
            <span key={line} data-line className="block overflow-hidden pb-[0.08em]">
              <span className="block">{line}</span>
            </span>
          ))}
        </h1>

        <p
          data-fade
          className="prose-balanced mt-5 max-w-[24ch] text-base leading-snug font-bold text-ink sm:max-w-[36ch] sm:text-lg"
        >
          {content.hero.kicker}
        </p>

        <div data-fade className="mt-6">
          <Button href="#contact" tone="cream" className="text-lg">
            {content.hero.cta}
          </Button>
        </div>
      </div>

      {/* La scène, elle, est fixe. Agrandie sur mobile, sinon les personnages
          se réduisent à une frise illisible. */}
      <div
        data-scene
        // Décalée vers le bas pour que la tête de Woodez passe sous le bouton.
        // On ne perd que de l'herbe uniforme en bas de l'image.
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex translate-y-[6%] justify-center lg:translate-y-[16%]"
      >
        <Image
          src="/hero/scene-v3.png"
          alt="Woodez en hoodie salue de la patte, entouré d'une enveloppe portée par un avion de papier, d'une boîte aux lettres renversée et d'un téléphone bavard"
          width={3840}
          height={1629}
          priority
          sizes="(max-width: 640px) 210vw, (max-width: 1024px) 140vw, 100vw"
          className="w-[210%] max-w-none sm:w-[140%] lg:w-full"
        />
      </div>

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
