"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { content } from "@/lib/content"
import { Button, Sticker } from "./ui"

/**
 * Les stickers vivent dans la moitié droite, autour de la mascotte : la
 * colonne de texte à gauche reste propre, sans rien derrière les lettres.
 */
const FLOATERS = [
  { name: "paper-plane", size: 92, className: "right-[3%] top-[13%] rotate-[10deg]", depth: 1.3 },
  { name: "target", size: 62, className: "right-[29%] top-[9%] rotate-[6deg]", depth: 1.6 },
  { name: "enveloppe", size: 84, className: "right-[36%] top-[42%] rotate-[-14deg]", depth: 0.9 },
  { name: "ball", size: 54, className: "right-[6%] bottom-[27%] rotate-[-18deg]", depth: 1.7 },
  { name: "chat", size: 74, className: "right-[31%] bottom-[13%] rotate-[-8deg]", depth: 0.8 },
  { name: "heart", size: 60, className: "right-[13%] bottom-[8%] rotate-[12deg]", depth: 1.1 },
] as const

export default function Hero() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      // Entrée : le titre monte ligne par ligne, puis les stickers arrivent.
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from("[data-hero-line] > span", {
          yPercent: 115,
          duration: 0.9,
          stagger: 0.08,
        })
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 0.6, stagger: 0.1 }, "-=0.4")
        .from(
          "[data-floater]",
          { scale: 0, rotate: -45, opacity: 0, duration: 0.7, stagger: 0.06, ease: "back.out(2)" },
          "-=0.5",
        )
        .from("[data-hero-mascot]", { scale: 0.7, opacity: 0, duration: 0.8, ease: "back.out(1.6)" }, "-=0.6")

      // Chaque sticker respire à son propre rythme.
      gsap.utils.toArray<HTMLElement>("[data-floater]").forEach((node, i) => {
        gsap.to(node, {
          y: i % 2 ? 18 : -18,
          rotation: `+=${i % 2 ? 6 : -6}`,
          duration: 2.6 + i * 0.25,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        })
      })

      // Parallaxe à la souris : chaque élément suit selon sa profondeur.
      const movers = gsap.utils.toArray<HTMLElement>("[data-depth]")
      const setters = movers.map((node) => ({
        depth: Number(node.dataset.depth) || 1,
        x: gsap.quickTo(node, "x", { duration: 0.8, ease: "power3" }),
        y: gsap.quickTo(node, "y", { duration: 0.8, ease: "power3" }),
      }))

      const onMove = (e: PointerEvent) => {
        const dx = (e.clientX / window.innerWidth - 0.5) * 2
        const dy = (e.clientY / window.innerHeight - 0.5) * 2
        for (const s of setters) {
          s.x(dx * 22 * s.depth)
          s.y(dy * 18 * s.depth)
        }
      }

      window.addEventListener("pointermove", onMove)
      return () => window.removeEventListener("pointermove", onMove)
    }, el)

    return () => ctx.revert()
  }, [])

  const [before, accent, after] = content.hero.title

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-mint px-5 pt-24 pb-12 sm:px-8 sm:pt-28 sm:pb-20 xl:px-14"
    >
      {/* Grille très discrète en fond */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(#141715 1px, transparent 1px), linear-gradient(90deg, #141715 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Stickers flottants — cachés sur mobile, l'espace y est trop précieux */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden md:block">
        {FLOATERS.map((f) => (
          <div key={f.name} data-floater data-depth={f.depth} className={`absolute ${f.className}`}>
            <Sticker name={f.name} size={f.size} />
          </div>
        ))}
      </div>

      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_1fr]">
          <div>
            <div data-hero-fade>
              <span className="sticker inline-block rounded-full bg-cream px-4 py-2 text-xs font-bold tracking-[0.12em] uppercase">
                {content.hero.eyebrow}
              </span>
            </div>

            <h1 className="display mt-6 text-[clamp(2.35rem,5.4vw,4.5rem)]">
              {[before, accent, after].map((line, i) => (
                <span key={line} data-hero-line className="block overflow-hidden pb-[0.06em]">
                  <span className="block">
                    {i === 1 ? (
                      <mark className="bg-transparent text-green">{line}</mark>
                    ) : (
                      line
                    )}
                  </span>
                </span>
              ))}
            </h1>

            <p
              data-hero-fade
              className="mt-5 max-w-xl leading-relaxed font-medium text-ink/80 sm:mt-7 sm:text-lg lg:text-xl"
            >
              {content.hero.lead}
            </p>

            <div data-hero-fade className="mt-7 flex flex-wrap items-center gap-3 sm:mt-9">
              <Button href="#contact" tone="ink" className="text-lg">
                {content.hero.cta}
              </Button>
              {/* Sur mobile, un seul appel à l'action : l'écran est trop court
                  pour deux boutons empilés sans repousser la mascotte. */}
              <span className="hidden sm:block">
                <Button href="#creations" tone="cream">
                  {content.hero.ctaSecondary}
                </Button>
              </span>
            </div>
          </div>

          {/* Mascotte */}
          <div className="relative flex justify-center lg:justify-end">
            <div data-hero-mascot data-depth="0.5" className="relative">
              <div
                aria-hidden
                className="absolute inset-0 -z-10 scale-[1.18] rounded-full bg-green/25 blur-2xl"
              />
              <Image
                src="/brand/mascot.svg"
                alt="Woodez, la mascotte"
                width={520}
                height={520}
                priority
                className="w-[min(40vw,11rem)] drop-shadow-[8px_10px_0_rgba(20,23,21,0.12)] sm:w-[min(50vw,17rem)] lg:w-[min(28vw,25rem)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de défilement */}
      <a
        href="#services"
        data-hero-fade
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-[0.65rem] font-bold tracking-[0.2em] uppercase xl:flex"
      >
        {content.hero.scroll}
        <span className="sticker flex size-9 items-center justify-center rounded-full bg-cream">
          <span className="animate-bounce text-sm leading-none">↓</span>
        </span>
      </a>
    </section>
  )
}
