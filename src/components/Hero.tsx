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
        .from("[data-line] > span", { y: 34, opacity: 0, duration: 0.8, stagger: 0.1 })
        .from("[data-fade]", { y: 20, opacity: 0, duration: 0.6, stagger: 0.12 }, "-=0.4")
        .from("[data-scene]", { y: 50, opacity: 0, duration: 1, ease: "power2.out" }, "-=1")

      // Le ciel et le texte traînent derrière au défilement, ce qui creuse la
      // profondeur. La scène, elle, ne bouge plus : elle est désormais dans le
      // flux et tout déplacement la ferait sortir de son emplacement.
      const scrub = { trigger: el, start: "top top", end: "bottom top", scrub: true } as const
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
        {/* Sur mobile les bandes descendent bien plus bas : elles doivent
            passer derrière Woodez, jamais derrière le titre ni le bouton, qui
            devenaient illisibles. */}
        <Clouds
          src="/hero/clouds-b-v2.png"
          width={135}
          duration={190}
          opacity={0.4}
          className="inset-x-0 top-[46%] sm:top-[3%]"
        />
        <Clouds
          src="/hero/clouds-a-v2.png"
          width={115}
          duration={120}
          opacity={0.75}
          className="inset-x-0 top-[58%] sm:top-[22%]"
        />
      </div>

      <div
        data-copy
        className="relative z-20 flex w-full flex-1 flex-col items-center px-4 pt-10 text-center sm:px-8 sm:pt-28"
      >
        {/* Sur mobile, le wordmark en relief remplace la barre de navigation,
            qui reste effacée tant qu'on est dans le hero. */}
        <Image
          data-fade
          src="/brand/wordmark-3d-plain.svg"
          alt="Woodez"
          width={480}
          height={144}
          priority
          className="mb-5 h-auto w-[min(31vw,7.5rem)] sm:hidden"
        />

        {/* Deux découpes distinctes : le repli automatique ne tombe pas au bon
            endroit sur petit écran, on impose donc les lignes. */}
        <h1 className="display display-3d text-[clamp(1.9rem,11.6vw,4.2rem)] leading-[0.84] sm:text-[clamp(2.4rem,5.2vw,4.2rem)]">
          <span className="block sm:hidden">
            {content.hero.titleMobile.map((line) => (
              <span key={line} data-line className="reveal-line">
                <span className="block">{line}</span>
              </span>
            ))}
          </span>

          <span className="hidden sm:block">
            {content.hero.title.map((line) => (
              <span key={line} data-line className="reveal-line">
                <span className="block">{line}</span>
              </span>
            ))}
          </span>
        </h1>

        <p
          data-fade
          className="prose-balanced mt-5 max-w-[34ch] text-lg leading-snug font-bold text-ink sm:max-w-[36ch]"
        >
          {content.hero.kicker}
        </p>

        <div data-fade className="mt-6">
          <Button href="/commencer" data-transition tone="cream" className="text-lg">
            {content.hero.cta}
          </Button>
        </div>
      </div>

      {/* La scène est dans le flux, plus posée en absolu au ras du bas : la
          section s'allonge donc pour la contenir en entier. On voit le bas de
          l'illustration en défilant au lieu de la voir coupée aux pattes de
          Woodez par le bandeau qui suit. */}
      {/* Marge négative sur grand écran : le haut de l'illustration n'est que
          du ciel, identique au fond de section. La remonter ne masque donc
          rien et fait gagner autant de personnages au-dessus de la ligne de
          flottaison, sans venir toucher le bouton. */}
      <div
        data-scene
        className="pointer-events-none relative z-10 mt-auto flex w-full justify-center lg:-mt-[4.5vw]"
      >
        <Image
          src="/hero/scene-v3.png"
          alt="Woodez en hoodie salue de la patte, entouré d'une enveloppe portée par un avion de papier, d'une boîte aux lettres renversée et d'un téléphone bavard"
          width={3840}
          height={1629}
          priority
          sizes="(max-width: 640px) 210vw, (max-width: 1024px) 140vw, 100vw"
          className="block w-[210%] max-w-none sm:w-[140%] lg:w-full"
        />
      </div>

    </section>
  )
}
