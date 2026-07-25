"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { content } from "@/lib/content"
import { Sticker } from "./ui"

/**
 * Bandeau défilant infini. La vitesse et le sens réagissent au défilement de
 * la page — un détail qui rend le scroll vivant sans être bruyant.
 */
export default function Marquee() {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      // Le contenu est dupliqué : on ne translate que d'une moitié, donc la
      // boucle est invisible.
      const loop = gsap.to(el, {
        xPercent: -50,
        duration: 22,
        ease: "none",
        repeat: -1,
      })

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const v = self.getVelocity()
          loop.timeScale(gsap.utils.clamp(-4, 4, 1 + v / 900) || 1)
        },
      })

      // Sans défilement, on revient doucement à la vitesse de croisière.
      const idle = gsap.ticker.add(() => {
        const ts = loop.timeScale()
        if (Math.abs(ts - 1) > 0.01) loop.timeScale(ts + (1 - ts) * 0.06)
      })

      return () => {
        trigger.kill()
        gsap.ticker.remove(idle)
      }
    }, el)

    return () => ctx.revert()
  }, [])

  const items = [...content.marquee, ...content.marquee]

  return (
    <div className="relative overflow-hidden border-y-4 border-ink bg-green py-4">
      <div ref={track} className="flex w-max items-center gap-8 will-change-transform">
        {items.map((word, i) => (
          <span key={`${word}-${i}`} className="flex items-center gap-8">
            <span className="display text-2xl whitespace-nowrap text-cream sm:text-3xl">{word}</span>
            <Sticker name={i % 2 ? "ball" : "bone"} size={28} className="shrink-0" />
          </span>
        ))}
      </div>
    </div>
  )
}
