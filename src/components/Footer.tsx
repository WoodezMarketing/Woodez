"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CONTACT, content } from "@/lib/content"
import { Sticker } from "./ui"

/** Stickers posés sur le grand mot du bas, comme des autocollants collés dessus. */
const STUCK = [
  { name: "heart", size: 78, className: "left-[8%] top-[6%] -rotate-12" },
  { name: "chat", size: 66, className: "left-[31%] top-[52%] rotate-6" },
  { name: "target", size: 72, className: "left-[52%] top-[2%] rotate-12" },
  { name: "ball", size: 58, className: "left-[70%] top-[58%] -rotate-6" },
  { name: "paper-plane", size: 76, className: "left-[86%] top-[10%] rotate-3" },
] as const

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "TikTok", href: "https://tiktok.com" },
]

export default function Footer() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      gsap.from("[data-stuck]", {
        scale: 0,
        rotate: -50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.09,
        ease: "back.out(2.4)",
        scrollTrigger: { trigger: "[data-wordmark]", start: "top 92%" },
      })

      gsap.from("[data-wordmark-text]", {
        yPercent: 30,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-wordmark]", start: "top 95%" },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={root} className="bg-cream px-4 pt-6 pb-6 sm:px-6">
      {/* Un grand bloc arrondi, comme une carte posée sur la page */}
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] border-4 border-ink bg-green">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-3 lg:gap-8">
          <div>
            <span className="sticker inline-block rounded-full bg-cream px-3 py-1 text-xs font-bold tracking-[0.12em] uppercase">
              Écris-nous
            </span>
            <a
              href={`mailto:${CONTACT.email}`}
              className="display mt-4 block text-[clamp(1.5rem,3vw,2.25rem)] text-cream transition-colors hover:text-ink"
            >
              {CONTACT.email}
            </a>
            <a
              href={CONTACT.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-lg font-bold text-cream/85 underline decoration-2 underline-offset-4 transition-colors hover:text-ink"
            >
              ou écris-nous sur WhatsApp
            </a>
          </div>

          <div>
            <span className="sticker inline-block rounded-full bg-cream px-3 py-1 text-xs font-bold tracking-[0.12em] uppercase">
              Au téléphone
            </span>
            <a
              href={CONTACT.phoneHref}
              className="display mt-4 block text-[clamp(1.5rem,3vw,2.25rem)] text-cream transition-colors hover:text-ink"
            >
              {CONTACT.phone}
            </a>
            <p className="mt-2 text-sm font-semibold text-cream/70">{content.footer.madeIn} 🍁</p>
          </div>

          <div>
            <span className="sticker inline-block rounded-full bg-cream px-3 py-1 text-xs font-bold tracking-[0.12em] uppercase">
              Nous suivre
            </span>
            <ul className="mt-4 flex flex-wrap gap-2">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="sticker inline-block rounded-full bg-cream px-4 py-2 text-sm font-bold transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="prose-balanced mt-5 max-w-xs text-sm leading-snug font-medium text-cream/70">
              {content.footer.tagline}
            </p>
          </div>
        </div>

        {/* Le nom en très grand, avec des autocollants collés par-dessus */}
        <div data-wordmark className="relative px-4 pb-2">
          <p
            data-wordmark-text
            aria-hidden
            className="display w-full text-center text-[clamp(4rem,21vw,17rem)] leading-[0.8] text-cream select-none"
          >
            Woodez
          </p>

          <div aria-hidden className="pointer-events-none absolute inset-0 hidden sm:block">
            {STUCK.map((s) => (
              <div key={s.name} data-stuck className={`absolute ${s.className}`}>
                <Sticker name={s.name} size={s.size} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t-4 border-ink/15 px-8 py-5 text-sm font-semibold text-cream/70 sm:flex-row sm:px-12">
          <p>
            © {new Date().getFullYear()} Woodez. {content.footer.rights}
          </p>
          <p>Conçu et codé à la main.</p>
        </div>
      </div>
    </footer>
  )
}
