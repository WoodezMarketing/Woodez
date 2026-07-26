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

  // Repli au défilement vers le bas, retour au défilement vers le haut.
  // Uniquement sur grand écran : en mobile la barre est déjà minimale.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)")
    if (!desktop.matches) return

    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 12) return // ignore la micro-oscillation
      const next = y > last && y > 160
      last = y
      setCollapsed((prev) => (prev === next ? prev : next))
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Le « sploosh » : les pastilles s'écrasent en partant, rebondissent en
  // revenant. Sans ça la bascule ressemble à un simple display:none.
  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      const parts = gsap.utils.toArray<HTMLElement>("[data-nav-part]")
      const burger = el.querySelector("[data-nav-burger]")

      if (collapsed) {
        gsap.to(parts, {
          scaleX: 0.35,
          scaleY: 0.8,
          opacity: 0,
          duration: 0.32,
          ease: "power3.in",
          stagger: 0.04,
          pointerEvents: "none",
        })
        gsap.fromTo(
          burger,
          { scale: 0, rotate: -90 },
          { scale: 1, rotate: 0, duration: 0.5, ease: "back.out(2.6)", delay: 0.12 },
        )
        gsap.fromTo(
          "[data-nav-logo]",
          { scaleX: 1.25, scaleY: 0.78 },
          { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.45)", delay: 0.2 },
        )
      } else {
        gsap.to(parts, {
          scaleX: 1,
          scaleY: 1,
          opacity: 1,
          duration: 0.55,
          ease: "back.out(1.8)",
          stagger: 0.06,
          pointerEvents: "auto",
        })
        gsap.to(burger, { scale: 0, rotate: 90, duration: 0.28, ease: "power3.in" })
        gsap.fromTo(
          "[data-nav-logo]",
          { scaleX: 0.82, scaleY: 1.18 },
          { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.45)" },
        )
      }
    }, el)

    return () => ctx.revert()
  }, [collapsed])

  const burgerOpen = open

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
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

        <nav
          data-nav-part
          className="sticker hidden items-center gap-1 rounded-full bg-cream px-2 py-2 lg:flex"
        >
          {content.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold transition-colors hover:bg-mint"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span data-nav-part className="hidden sm:block">
            <Button href="#contact" tone="green">
              {content.nav.cta}
            </Button>
          </span>

          {/* Toujours présent : simplement caché derrière une échelle 0 sur
              grand écran tant que la barre complète est déployée. */}
          <button
            type="button"
            data-nav-burger
            onClick={() => setOpen((v) => !v)}
            aria-expanded={burgerOpen}
            aria-label={burgerOpen ? "Fermer le menu" : "Ouvrir le menu"}
            className={`sticker flex size-12 items-center justify-center rounded-full bg-cream ${
              collapsed ? "lg:flex" : "lg:hidden"
            }`}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 h-[3px] w-5 rounded-full bg-ink transition-all duration-300 ${
                  burgerOpen ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute top-1.5 left-0 h-[3px] w-5 rounded-full bg-ink transition-opacity duration-200 ${
                  burgerOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-[3px] w-5 rounded-full bg-ink transition-all duration-300 ${
                  burgerOpen ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        className={`mx-4 origin-top overflow-hidden transition-all duration-300 ${
          burgerOpen ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <nav className="sticker flex flex-col gap-1 rounded-3xl bg-cream p-3">
          {content.nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 font-semibold transition-colors hover:bg-mint"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-2xl bg-green px-4 py-3 text-center font-bold text-cream"
          >
            {content.nav.cta}
          </a>
        </nav>
      </div>
    </header>
  )
}
