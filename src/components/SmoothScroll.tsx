"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

/**
 * Défilement inertiel (Lenis) piloté par le ticker GSAP, pour que Lenis et
 * ScrollTrigger partagent la même horloge — sinon les animations épinglées
 * dérivent d'une frame.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })

    lenis.on("scroll", ScrollTrigger.update)

    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Les positions de déclenchement sont mesurées au montage, avant que les
    // images et la police n'aient fini de charger. La hauteur de page change
    // ensuite, et des sections entières peuvent rester bloquées sur leur état
    // de départ. On recalcule dès que la mise en page est stabilisée.
    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    window.addEventListener("load", refresh)
    const late = window.setTimeout(refresh, 1200)

    return () => {
      window.removeEventListener("load", refresh)
      window.clearTimeout(late)
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  return null
}
