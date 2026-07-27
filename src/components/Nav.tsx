"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { content } from "@/lib/content"
import { Button } from "./ui"

export default function Nav() {
  const [collapsed, setCollapsed] = useState(false)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLElement>(null)
  // Créé une seule fois : recréer le matchMedia à chaque rendu relancerait
  // ses fonctions et empilerait les animations.
  const [mm] = useState(() => gsap.matchMedia())

  // Repli au défilement vers le bas, retour au défilement vers le haut.
  // Uniquement sur grand écran : en mobile la barre est déjà minimale.
  useEffect(() => {
    if (!window.matchMedia("(min-width: 1024px)").matches) return

    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      // Seuil plus large qu'une simple anti-oscillation : il faut un geste
      // franc pour basculer, sinon la barre clignote au moindre soubresaut.
      if (Math.abs(y - last) < 40) return
      const next = y > last && y > 200
      last = y
      setCollapsed((prev) => {
        if (prev === next) return prev
        if (next) setOpen(false) // on ne replie pas sur un menu resté ouvert
        return next
      })
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Le « sploosh » : les pastilles s'écrasent en partant, la bulle du logo
  // rebondit. Sans ça la bascule ressemble à un simple display:none.
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      const parts = gsap.utils.toArray<HTMLElement>("[data-nav-part]")

      // Le repli aspire les pastilles vers la droite ; le retour les fait
      // rebondir depuis ce même point, dans l'ordre inverse. Sans le décalage
      // inversé, la barre se contentait de réapparaître.
      // Le repli aspire les pastilles vers la droite ; le retour les ramène en
      // glissant depuis le haut, sans rebond, avec un fondu long. Le rebond
      // précédent faisait « apparaître » la barre d'un coup.
      gsap.to(parts, {
        scaleX: collapsed ? 0.4 : 1,
        scaleY: collapsed ? 0.82 : 1,
        x: collapsed ? 32 : 0,
        y: collapsed ? -6 : 0,
        opacity: collapsed ? 0 : 1,
        duration: collapsed ? 0.42 : 0.85,
        ease: collapsed ? "power2.in" : "power3.out",
        stagger: collapsed ? 0.06 : { each: 0.09, from: "end" },
        pointerEvents: collapsed ? "none" : "auto",
      })

      gsap.to("[data-nav-logo]", {
        scaleX: 1,
        scaleY: 1,
        duration: 0.7,
        ease: "power3.out",
      })

      // La bulle du menu est animée plutôt que masquée par une classe : sans
      // ça elle apparaissait et disparaissait d'un coup, en rupture avec le
      // reste de la barre.
      mm.add("(min-width: 1024px)", () => {
        gsap.to("[data-nav-bubble]", {
          scale: collapsed ? 1 : 0.4,
          opacity: collapsed ? 1 : 0,
          duration: collapsed ? 0.6 : 0.4,
          ease: "power3.out",
          delay: collapsed ? 0.18 : 0,
          pointerEvents: collapsed ? "auto" : "none",
        })
      })
    }, el)

    return () => {
      ctx.revert()
      mm.revert()
    }
  }, [collapsed, mm])

  const links = content.nav.links

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-50">
      <div className="relative mx-auto flex max-w-[1400px] items-start justify-between gap-4 px-4 py-4 sm:px-6">
        <a
          href="#top"
          aria-label="Woodez, retour en haut"
          data-nav-logo
          className="sticker flex items-center rounded-full bg-cream px-4 py-2"
        >
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Woodez"
            width={140}
            height={48}
            priority
            className="h-7 w-auto"
          />
        </a>

        {/* Centrée sur la page et non entre le logo et le bouton : ces deux-là
            n'ont pas la même largeur, la barre paraissait décalée. */}
        <nav
          data-nav-part
          className="sticker absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-cream px-2 py-2 lg:flex"
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-mint"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-start gap-2">
          <span data-nav-part className="hidden sm:block">
            <Button href="#contact" tone="green">
              {content.nav.cta}
            </Button>
          </span>

          {/* La bulle du menu. Sur grand écran elle s'étire vers la gauche et
              les liens apparaissent en ligne ; sur mobile elle reste un rond
              et le menu se déplie à la verticale en dessous.
              La transition porte sur `max-width` et non `width`, qui ne
              s'anime pas depuis `auto`. */}
          <div
            data-nav-bubble
            className={`sticker flex h-12 origin-right items-center justify-end overflow-hidden rounded-full bg-cream transition-[max-width] duration-500 ${
              open ? "max-w-12 lg:max-w-[46rem]" : "max-w-12"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.4, 0.5, 1)" }}
          >
            <nav
              className={`hidden items-center gap-2 pl-5 whitespace-nowrap transition-opacity duration-300 lg:flex ${
                open ? "opacity-100 delay-150" : "pointer-events-none opacity-0"
              }`}
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-full px-3.5 py-2 text-sm font-semibold transition-colors hover:bg-mint"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="ml-1 rounded-full bg-green px-4 py-2.5 text-sm font-bold text-cream"
              >
                {content.nav.cta}
              </a>
            </nav>

            {/* Le bouton prend la hauteur intérieure de la bulle et reste
                carré : à 48 px fixes il débordait des 42 px de contenu (le
                contour en mange 3 de chaque côté) et l'icône se retrouvait
                décalée vers la gauche. */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="flex aspect-square shrink-0 items-center justify-center self-stretch"
            >
              <span className="relative block h-4 w-5">
                <span
                  className={`absolute left-0 h-[3px] w-5 rounded-full bg-ink transition-all duration-300 ${
                    open ? "top-1.5 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute top-1.5 left-0 h-[3px] w-5 rounded-full bg-ink transition-opacity duration-200 ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute left-0 h-[3px] w-5 rounded-full bg-ink transition-all duration-300 ${
                    open ? "top-1.5 -rotate-45" : "top-3"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu vertical, mobile uniquement : sur un écran étroit une rangée de
          liens ne tiendrait pas. Grille 0fr → 1fr pour déplier en douceur sans
          mesurer la hauteur en JavaScript. */}
      <div
        className={`mx-4 grid transition-all duration-400 lg:hidden ${
          open ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <nav className="sticker mt-1 flex flex-col gap-1 rounded-3xl bg-cream p-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-center font-semibold transition-colors hover:bg-mint"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-1 rounded-2xl bg-green px-4 py-3.5 text-center font-bold text-cream"
            >
              {content.nav.cta}
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
