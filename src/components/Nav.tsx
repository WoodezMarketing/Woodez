"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { content } from "@/lib/content"
import { Button } from "./ui"

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 transition-all duration-300 sm:px-6 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <a
          href="#top"
          aria-label="Woodez — retour en haut"
          className={`sticker flex items-center rounded-full bg-cream transition-all duration-300 ${
            scrolled ? "px-4 py-2" : "px-5 py-2.5"
          }`}
        >
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Woodez"
            width={140}
            height={48}
            priority
            className={`w-auto transition-all duration-300 ${scrolled ? "h-7" : "h-8"}`}
          />
        </a>

        <nav className="sticker hidden items-center gap-1 rounded-full bg-cream px-2 py-2 lg:flex">
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
          {/* Enveloppé plutôt que masqué par une classe : `hidden` et
              `inline-flex` sont deux utilitaires `display`, et l'ordre du
              stylesheet — pas celui des classes — décide du gagnant. */}
          <span className="hidden sm:block">
            <Button href="#contact" tone="green">
              {content.nav.cta}
            </Button>
          </span>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            className="sticker flex size-12 items-center justify-center rounded-full bg-cream lg:hidden"
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

      {/* Menu mobile */}
      <div
        className={`mx-4 origin-top overflow-hidden transition-all duration-300 lg:hidden ${
          open ? "max-h-96 opacity-100" : "pointer-events-none max-h-0 opacity-0"
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
            className="mt-1 rounded-2xl bg-green px-4 py-3 text-center font-bold text-cream sm:hidden"
          >
            {content.nav.cta}
          </a>
        </nav>
      </div>
    </header>
  )
}
