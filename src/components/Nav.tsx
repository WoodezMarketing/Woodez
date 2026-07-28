"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { content } from "@/lib/content"
import { Button } from "./ui"

/**
 * Réduite au strict minimum : le logo et un seul bouton.
 *
 * Sur grand écran les deux restent visibles en permanence. Sur mobile la barre
 * n'apparaît qu'une fois le hero passé, puis s'efface quand on descend et
 * revient quand on remonte.
 *
 * L'état masqué de départ est posé en CSS et non en JavaScript : le serveur
 * envoie la page avec la barre déjà escamotée. Sinon elle s'affichait le temps
 * d'une image avant de s'animer pour disparaître, ce qui se voyait à chaque
 * arrivée sur l'accueil.
 */
export default function Nav() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return

    const parts = el.querySelectorAll<HTMLElement>("[data-nav-part]")
    const mobile = window.matchMedia("(max-width: 1023px)")
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // `cache` suit l'état courant hors de React : la barre n'a aucune raison
    // de provoquer un rendu, et une valeur d'état créerait un décalage d'une
    // image entre le défilement et l'animation.
    let cache = mobile.matches
    let premier = true

    const appliquer = (masque: boolean) => {
      const reglages = {
        y: masque ? -110 : 0,
        opacity: masque ? 0 : 1,
        pointerEvents: masque ? "none" : "auto",
      }
      if (premier || reduit) gsap.set(parts, reglages)
      else
        gsap.to(parts, {
          ...reglages,
          duration: masque ? 0.45 : 0.9,
          ease: masque ? "power2.in" : "power3.out",
          stagger: masque ? 0.06 : { each: 0.1, from: "end" },
          overwrite: "auto",
        })
      premier = false
      cache = masque
    }

    const hero = document.getElementById("top")
    const dansLeHero = () => Boolean(hero) && window.scrollY < hero!.offsetHeight - 140

    let last = window.scrollY
    const onScroll = () => {
      if (!mobile.matches) return
      const y = window.scrollY
      let voulu = cache
      if (dansLeHero()) voulu = true
      else if (Math.abs(y - last) >= 40) {
        voulu = y > last
        last = y
      }
      if (voulu !== cache) appliquer(voulu)
    }

    appliquer(mobile.matches && dansLeHero())

    window.addEventListener("scroll", onScroll, { passive: true })
    mobile.addEventListener("change", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      mobile.removeEventListener("change", onScroll)
    }
  }, [])

  return (
    <header ref={root} className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-start justify-between gap-4 px-4 py-4 sm:px-6">
        <a
          href="#top"
          aria-label="Woodez, retour en haut"
          data-nav-part
          className="sticker pointer-events-auto flex -translate-y-28 items-center rounded-full bg-cream px-5 pt-3 pb-2.5 opacity-0 lg:translate-y-0 lg:opacity-100"
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

        <span
          data-nav-part
          className="pointer-events-auto -translate-y-28 opacity-0 lg:translate-y-0 lg:opacity-100"
        >
          <Button href="/commencer" data-transition tone="green">
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
