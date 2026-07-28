"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { content } from "@/lib/content"
import { Button } from "./ui"

/**
 * Réduite au strict minimum : le logo et un seul bouton.
 *
 * Sur grand écran les deux restent visibles en permanence. Sur mobile la barre
 * s'efface quand on descend et revient quand on remonte, pour rendre l'écran
 * au contenu.
 */
export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!window.matchMedia("(max-width: 1023px)").matches) return

    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 40) return // il faut un geste franc
      const next = y > last && y > 200
      last = y
      setHidden((prev) => (prev === next ? prev : next))
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // Pas de `gsap.context` ici : son `revert()` de nettoyage réinitialise les
    // styles à chaque bascule, ce qui coupait l'animation en cours et faisait
    // sauter la barre au lieu de la faire glisser.
    const parts = el.querySelectorAll("[data-nav-part]")
    const tween = gsap.to(parts, {
      y: hidden ? -110 : 0,
      opacity: hidden ? 0 : 1,
      duration: hidden ? 0.45 : 0.9,
      ease: hidden ? "power2.in" : "power3.out",
      stagger: hidden ? 0.06 : { each: 0.1, from: "end" },
      pointerEvents: hidden ? "none" : "auto",
      overwrite: "auto",
    })

    return () => {
      tween.kill()
    }
  }, [hidden])

  return (
    <header ref={root} className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-start justify-between gap-4 px-4 py-4 sm:px-6">
        <a
          href="#top"
          aria-label="Woodez, retour en haut"
          data-nav-part
          // Logo plus grand, rembourrage réduit d'autant : la pastille garde
          // exactement la même hauteur que le bouton (60 px au total).
          className="sticker pointer-events-auto flex items-center rounded-full bg-cream px-5 pt-3 pb-2.5"
        >
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Woodez"
            width={140}
            height={48}
            priority
            className="h-8 w-auto"
          />
        </a>

        <span data-nav-part className="pointer-events-auto">
          <Button href="#contact" tone="green">
            {/* Libellé court sur mobile : la barre doit rester légère. */}
            <span className="sm:hidden">{content.nav.ctaShort}</span>
            <span className="hidden sm:inline">{content.nav.cta}</span>
            <svg
              viewBox="0 0 24 24"
              aria-hidden
              className="size-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h13M12 5l7 7-7 7" />
            </svg>
          </Button>
        </span>
      </div>
    </header>
  )
}
