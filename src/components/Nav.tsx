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
    if (!window.matchMedia("(min-width: 1024px)").matches) return

    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < 12) return // ignore la micro-oscillation
      const next = y > last && y > 160
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

      gsap.to(parts, {
        scaleX: collapsed ? 0.35 : 1,
        scaleY: collapsed ? 0.8 : 1,
        opacity: collapsed ? 0 : 1,
        duration: collapsed ? 0.32 : 0.55,
        ease: collapsed ? "power3.in" : "back.out(1.8)",
        stagger: collapsed ? 0.04 : 0.06,
        pointerEvents: collapsed ? "none" : "auto",
      })

      gsap.fromTo(
        "[data-nav-logo]",
        collapsed ? { scaleX: 1.25, scaleY: 0.78 } : { scaleX: 0.82, scaleY: 1.18 },
        { scaleX: 1, scaleY: 1, duration: 0.7, ease: "elastic.out(1, 0.45)", delay: 0.15 },
      )
    }, el)

    return () => ctx.revert()
  }, [collapsed])

  const links = content.nav.links

  return (
    <header ref={root} className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-start justify-between gap-4 px-4 py-4 sm:px-6">
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

          {/* La bulle du menu : refermée c'est un simple rond, ouverte elle
              s'étire vers le bas et laisse apparaître les liens. Ce n'est pas
              un panneau séparé, c'est la même pastille qui grandit. */}
          <div
            className={`sticker overflow-hidden rounded-[1.75rem] bg-cream transition-all duration-500 ${
              open ? "w-64" : "w-12"
            } ${collapsed ? "lg:block" : "lg:hidden"}`}
            style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.4, 0.5, 1)" }}
          >
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="flex h-12 w-full items-center justify-end pr-[0.9rem]"
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

            <div
              className={`grid transition-all duration-500 ${
                open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <nav className="flex flex-col gap-1 px-3 pb-3">
                  {links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="rounded-2xl px-4 py-3 text-right font-semibold whitespace-nowrap transition-colors hover:bg-mint"
                    >
                      {link.label}
                    </a>
                  ))}
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className="mt-1 rounded-2xl bg-green px-4 py-3 text-center font-bold whitespace-nowrap text-cream"
                  >
                    {content.nav.cta}
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
