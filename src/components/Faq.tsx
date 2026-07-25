"use client"

import { useState } from "react"
import { content } from "@/lib/content"
import { Eyebrow, Sticker } from "./ui"

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="bg-cream px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow tone="lemon">{content.faq.eyebrow}</Eyebrow>
          <h2 className="display mt-5 text-[clamp(2rem,6vw,4.5rem)]">
            {content.faq.title[0]} <span className="text-green">{content.faq.title[1]}</span>
          </h2>
          <Sticker name="exclamation" size={110} className="mt-8 hidden lg:block" />
        </div>

        <div className="space-y-3">
          {content.faq.items.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className={`sticker overflow-hidden rounded-3xl transition-colors ${
                  isOpen ? "bg-mint" : "bg-cream"
                }`}
              >
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-lg font-bold">{item.q}</span>
                    <span
                      aria-hidden
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full border-[3px] border-ink text-xl leading-none transition-transform duration-300 ${
                        isOpen ? "rotate-45 bg-green text-cream" : "bg-cream"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>

                <div
                  id={`faq-panel-${i}`}
                  hidden={!isOpen}
                  className="px-6 pb-6 text-base leading-relaxed font-medium text-ink/80"
                >
                  {item.a}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
