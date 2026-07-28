import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import StartForm from "@/components/StartForm"

export const metadata: Metadata = {
  title: "Commencer — Woodez",
  description: "Quelques questions pour comprendre ton commerce, et on te revient avec un plan.",
}

export default function Commencer() {
  return (
    <main className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-scene-sky">
      <header className="relative z-20 px-4 py-4 sm:px-6">
        <Link
          href="/"
          data-transition
          aria-label="Woodez, retour à l'accueil"
          className="sticker inline-flex items-center rounded-full bg-cream px-5 pt-3 pb-2.5"
        >
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Woodez"
            width={140}
            height={48}
            priority
            className="h-8 w-auto"
          />
        </Link>
      </header>

      <div className="relative z-10 flex flex-1 items-center px-4 py-12 sm:px-6 sm:py-16">
        <StartForm />
      </div>

      {/* Ligne de collines en pied de page : on reste dans le même monde que
          le site, sans reprendre toute la scène du hero. */}
      <Image
        src="/footer/montagnes-dodo-v2.png"
        alt=""
        aria-hidden
        width={3840}
        height={944}
        className="pointer-events-none relative z-0 -mb-px block w-full select-none"
      />
    </main>
  )
}
