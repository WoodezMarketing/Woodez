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
    // Sur grand écran la page est figée à la hauteur de l'écran et ne défile
    // pas. Sur mobile elle défile normalement : le contenu y dépasse presque
    // toujours, et une zone à défilement interne rendait le bas des questions
    // inatteignable.
    <main className="relative isolate flex min-h-[100svh] flex-col bg-scene-sky lg:h-[100svh] lg:overflow-hidden">
      <header className="relative z-20 shrink-0 px-4 py-4 sm:px-6">
        <Link
          href="/"
          data-transition
          aria-label="Retour au site"
          className="sticker inline-flex items-center gap-3 rounded-full bg-cream py-2.5 pr-5 pl-4 transition-transform duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          <svg
            viewBox="0 0 24 24"
            aria-hidden
            className="size-5 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H6M12 5l-7 7 7 7" />
          </svg>
          <Image
            src="/brand/logo-horizontal.svg"
            alt="Woodez"
            width={140}
            height={48}
            priority
            className="h-7 w-auto"
          />
        </Link>
      </header>

      {/* `items-start` avec `my-auto` sur l'enfant plutôt que `items-center` :
          un enfant centré dans un conteneur qui défile voit son haut devenir
          inatteignable. Là, il se centre quand il tient et se cale en haut
          quand il déborde. */}
      <div className="relative z-10 flex flex-1 items-start px-4 py-8 sm:px-6 lg:min-h-0 lg:overflow-y-auto lg:py-10">
        <div className="my-auto w-full">
          <StartForm />
        </div>
      </div>

      {/* Ligne de collines : on reste dans le même monde que le site. Sa
          hauteur est plafonnée et l'image recadrée par le haut, sinon elle
          mangeait un tiers de l'écran sur un téléphone. */}
      <div className="relative z-0 max-h-[18svh] shrink-0 overflow-hidden lg:max-h-[22svh]">
        <Image
          src="/footer/montagnes-dodo-v2.png"
          alt=""
          aria-hidden
          width={3840}
          height={944}
          className="pointer-events-none block h-full w-full object-cover object-top select-none"
        />
      </div>
    </main>
  )
}
