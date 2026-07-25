"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { creations, type Creation } from "@/lib/creations"
import { Eyebrow, Sticker } from "./ui"

const TONES: Record<Creation["tone"], string> = {
  green: "bg-green",
  lemon: "bg-lemon",
  coral: "bg-coral",
  violet: "bg-violet",
  sky: "bg-sky",
  bubble: "bg-bubble",
  mint: "bg-mint",
}

/**
 * Les emails sont très hauts : plutôt que d'en montrer un seul en entier, on
 * les fait défiler horizontalement, chacun à sa propre hauteur, comme un mur
 * de créations qu'on longe.
 */
export default function Creations() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const track = el.querySelector<HTMLElement>("[data-track]")
      const viewport = el.querySelector<HTMLElement>("[data-viewport]")
      if (!track || !viewport) return

      // La distance à parcourir dépend de la largeur réelle du contenu, donc
      // ajouter ou retirer une création ne casse rien.
      const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      // Chaque carte dérive verticalement à son propre rythme : c'est ce qui
      // crée la sensation de parallaxe pendant le défilement horizontal.
      gsap.utils.toArray<HTMLElement>("[data-panel]").forEach((panel, i) => {
        gsap.fromTo(
          panel,
          { y: i % 2 ? 32 : -32 },
          {
            y: i % 2 ? -32 : 32,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        )
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} id="creations" className="relative overflow-hidden bg-ink">
      <div data-viewport className="flex min-h-[100svh] flex-col justify-center py-12">
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
          <Eyebrow tone="lemon">{content.creations.eyebrow}</Eyebrow>
          <h2 className="display mt-5 max-w-3xl text-[clamp(1.9rem,4.6vw,3.5rem)] text-cream">
            {content.creations.title[0]}{" "}
            <span className="text-green">{content.creations.title[1]}</span>{" "}
            {content.creations.title[2]}
          </h2>
          <p className="mt-4 max-w-xl text-base font-medium text-cream/70">{content.creations.lead}</p>
        </div>

        {/* Le padding vertical laisse la place à la dérive parallaxe des cartes */}
        <div className="mt-6 overflow-hidden py-8">
          <div data-track className="flex w-max items-center gap-6 px-4 will-change-transform sm:px-6">
            {creations.map((item, i) => (
              <figure
                key={item.brand}
                data-panel
                className="sticker-lg w-[62vw] shrink-0 overflow-hidden rounded-[1.75rem] bg-cream sm:w-[20rem]"
              >
                <div className="relative h-[20rem] overflow-hidden">
                  {item.src ? (
                    <Image
                      src={item.src}
                      alt={`Email conçu pour ${item.brand}`}
                      fill
                      sizes="(max-width: 640px) 62vw, 20rem"
                      className="object-cover object-top"
                    />
                  ) : (
                    <EmailSkeleton tone={item.tone} seed={i} />
                  )}
                </div>

                <figcaption className="flex items-center justify-between gap-3 border-t-4 border-ink px-5 py-4">
                  <div>
                    <p className="display text-lg leading-tight">{item.brand}</p>
                    <p className="text-sm font-semibold text-ink/60">{item.tag}</p>
                  </div>
                  <Sticker name={i % 2 ? "enveloppe" : "paper-plane"} size={30} className="shrink-0" />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** Maquette d'email affichée tant que la vraie image n'est pas déposée. */
function EmailSkeleton({ tone, seed }: { tone: Creation["tone"]; seed: number }) {
  const bars = [92, 74, 84, 60]
  return (
    <div aria-hidden className={`flex h-full flex-col gap-3 p-5 ${TONES[tone]}`}>
      <div className="h-3 w-16 rounded-full bg-ink/25" />
      <div className="h-9 w-11/12 rounded-lg bg-ink/80" />
      <div className="h-9 w-7/12 rounded-lg bg-ink/80" />
      <div className="mt-1 h-32 rounded-xl border-[3px] border-ink/20 bg-cream/70" />
      <div className="mt-1 space-y-2">
        {bars.map((w, i) => (
          <div
            key={i}
            className="h-2.5 rounded-full bg-ink/20"
            style={{ width: `${w - ((seed + i) % 3) * 6}%` }}
          />
        ))}
      </div>
      <div className="mt-auto h-9 w-40 rounded-full bg-ink" />
    </div>
  )
}
