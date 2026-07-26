"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"

/**
 * Bande de nuages qui dérive vers la gauche en continu.
 *
 * La bande est doublée et translatée de -50 % : comme l'illustration réserve
 * une marge vide à gauche et à droite, le raccord de boucle est invisible.
 * C'est le seul mouvement présent dès l'arrivée sur la page — la scène, elle,
 * reste fixe.
 */
export default function Clouds({
  src,
  width,
  duration,
  className = "",
  opacity = 1,
}: {
  src: string
  /** Largeur d'une bande, en vw. Deux bandes sont rendues bout à bout. */
  width: number
  /** Secondes pour un cycle complet. Plus long = plus loin. */
  duration: number
  className?: string
  opacity?: number
}) {
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = track.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const tween = gsap.to(el, { xPercent: -50, duration, ease: "none", repeat: -1 })
    return () => {
      tween.kill()
    }
  }, [duration])

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute overflow-hidden ${className}`}
      style={{ opacity }}
    >
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1].map((i) => (
          <Image
            key={i}
            src={src}
            alt=""
            width={2400}
            height={1018}
            priority={i === 0}
            className="h-auto max-w-none"
            style={{ width: `${width}vw` }}
          />
        ))}
      </div>
    </div>
  )
}
