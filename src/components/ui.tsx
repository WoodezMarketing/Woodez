import Image from "next/image"
import type { ComponentProps } from "react"

// `ink` est volontairement absent des boutons : un fond noir sous un contour
// et une ombre noirs donne un bloc illisible. Le bouton principal est blanc.
const TONES = {
  green: "bg-green text-cream",
  ink: "bg-ink text-cream",
  cream: "bg-cream text-ink",
  lemon: "bg-lemon text-ink",
  coral: "bg-coral text-ink",
} as const

export function Button({
  tone = "green",
  className = "",
  ...props
}: ComponentProps<"a"> & { tone?: keyof typeof TONES }) {
  return (
    <a
      {...props}
      className={`sticker inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-bold transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none ${TONES[tone]} ${className}`}
    />
  )
}

/** Un des 12 éléments graphiques de la marque, en SVG. */
export function Sticker({
  name,
  size = 80,
  className = "",
  alt = "",
}: {
  name: string
  size?: number
  className?: string
  alt?: string
}) {
  return (
    <Image
      src={`/brand/${name}.svg`}
      alt={alt}
      width={size}
      height={size}
      aria-hidden={alt === "" || undefined}
      className={`pointer-events-none select-none ${className}`}
    />
  )
}

/** Petite étiquette majuscule au-dessus des titres de section. */
export function Eyebrow({ children, tone = "green" }: { children: string; tone?: keyof typeof TONES }) {
  return (
    <span
      className={`sticker inline-block rounded-full px-4 py-1.5 text-xs font-bold tracking-[0.14em] uppercase ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
