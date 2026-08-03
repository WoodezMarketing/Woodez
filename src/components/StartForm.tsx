"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { CONTACT } from "@/lib/content"
import { PATHS, sansOrphelin, visibleSteps, type Answers, type Path } from "@/lib/form"
import { Sticker } from "./ui"

const TONES: Record<Path["tone"], string> = {
  green: "bg-green text-cream",
  sky: "bg-sky text-ink",
  lemon: "bg-lemon text-ink",
}

export default function StartForm() {
  const [path, setPath] = useState<Path | null>(null)
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [sent, setSent] = useState(false)
  const [envoiEnCours, setEnvoiEnCours] = useState(false)
  const [echec, setEchec] = useState<string | null>(null)
  const [draft, setDraft] = useState("")
  const card = useRef<HTMLDivElement>(null)

  const steps = path ? visibleSteps(path, answers) : []
  const step = steps[index]

  // Chaque changement d'étape rejoue une petite entrée : sans ça le passage
  // d'une question à l'autre est invisible et on doute d'avoir cliqué.
  useEffect(() => {
    const el = card.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const tween = gsap.fromTo(
      el,
      { y: 26, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.5)" },
    )
    return () => {
      tween.kill()
    }
  }, [path, index, sent])

  /**
   * Déplacement d'une étape à l'autre. Le champ texte est réglé ici plutôt que
   * dans un effet : régler l'état depuis un effet déclenche un rendu en
   * cascade, et le champ doit de toute façon se remplir à nouveau quand on
   * revient sur une réponse déjà donnée.
   */
  const allerA = (cible: number, prochaines: Answers, parcours = path) => {
    const liste = parcours ? visibleSteps(parcours, prochaines) : []
    const suivante = liste[cible]
    setIndex(cible)
    setDraft(suivante && suivante.kind === "text" ? (prochaines[suivante.id] ?? "") : "")
  }

  const avancer = (id: string, value: string) => {
    const suite = { ...answers, [id]: value }
    setAnswers(suite)

    const prochaines = path ? visibleSteps(path, suite) : []
    if (index + 1 >= prochaines.length) envoyer(suite)
    else allerA(index + 1, suite)
  }

  const envoyer = async (finales: Answers) => {
    if (!path) return
    setEnvoiEnCours(true)
    setEchec(null)

    // Deux formes du même contenu : `reponses` va dans la base, `detail` sert
    // au courriel, où l'ordre des questions compte autant que les réponses.
    const reponses: Answers = {}
    const detail: { question: string; reponse: string }[] = []
    for (const s of visibleSteps(path, finales)) {
      const brut = finales[s.id] ?? ""
      const lisible =
        s.kind === "choice" ? (s.choices.find((c) => c.value === brut)?.label ?? brut) : brut
      reponses[s.id] = lisible
      detail.push({ question: s.question, reponse: lisible })
    }

    try {
      const reponse = await fetch("/api/demande", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parcours: path.label, reponses, detail }),
      })
      if (!reponse.ok) throw new Error(String(reponse.status))
      setSent(true)
    } catch {
      setEchec(
        "L'envoi n'a pas fonctionné. Réessaie, ou écris-nous directement à " + CONTACT.email + ".",
      )
    } finally {
      setEnvoiEnCours(false)
    }
  }

  const reculer = () => {
    if (index > 0) allerA(index - 1, answers)
    else {
      setPath(null)
      setAnswers({})
      setDraft("")
    }
  }

  /* ---------------------------------------------------------------- Merci */

  if (sent) {
    return (
      <div ref={card} className="mx-auto max-w-xl text-center">
        <Sticker name="paper-plane" size={120} className="mx-auto" />
        <h1 className="display display-3d mt-8 text-[clamp(2.4rem,7vw,4rem)]">C&apos;est parti&nbsp;!</h1>
        <p className="prose-balanced mx-auto mt-6 max-w-md text-lg leading-relaxed font-medium text-ink/75">
          Ta demande est en route. On regarde ça et on te revient en moins de 24 heures ouvrables.
        </p>
        <Link
          href="/"
          data-transition
          className="sticker display mt-10 inline-flex rounded-full bg-green px-7 pt-4 pb-3.5 text-base text-cream"
        >
          Revenir au site
        </Link>
      </div>
    )
  }

  /* ------------------------------------------------------------ Le choix */

  if (!path) {
    return (
      <div ref={card} className="mx-auto max-w-3xl text-center">
        <h1 className="display display-3d text-[clamp(2.2rem,6.5vw,4rem)]">
          On commence par quoi ?
        </h1>
        <p className="prose-balanced mx-auto mt-5 max-w-md text-lg leading-relaxed font-medium text-ink/75">
          Choisis ce qui te ressemble le plus. Ça prend deux minutes, promis.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {PATHS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setPath(p)
                allerA(0, answers, p)
              }}
              className={`sticker-lg group flex flex-col items-center gap-3 rounded-[2rem] p-7 text-center transition-transform duration-150 hover:-translate-x-1 hover:-translate-y-1 active:translate-x-1 active:translate-y-1 active:shadow-none ${TONES[p.tone]}`}
            >
              <Sticker name={p.icon} size={68} className="transition-transform group-hover:scale-110" />
              <span className="display text-xl">{p.label}</span>
              <span className="text-sm leading-snug font-semibold opacity-80">{p.blurb}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  /* --------------------------------------------------------- Les étapes */

  if (!step) return null

  const dernier = index + 1 === steps.length
  const valide = step.kind === "text" ? draft.trim().length > 1 : true

  return (
    <div className="mx-auto w-full max-w-2xl">
      {/* Progression : une pastille par étape du parcours choisi */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <span
            key={s.id}
            aria-hidden
            className={`h-2 rounded-full border-2 border-ink transition-all duration-300 ${
              i === index ? "w-8 bg-green" : i < index ? "w-2 bg-green" : "w-2 bg-cream"
            }`}
          />
        ))}
        <span className="sr-only">
          Étape {index + 1} sur {steps.length}
        </span>
      </div>

      <div ref={card}>
        <h1 className="display display-3d text-center text-[clamp(1.9rem,5.5vw,3.25rem)]">
          {sansOrphelin(step.question)}
        </h1>
        {step.hint && (
          <p className="prose-balanced mx-auto mt-4 max-w-md text-center text-base leading-relaxed font-medium text-ink/65">
            {step.hint}
          </p>
        )}

        {step.kind === "choice" ? (
          <div className={`mt-10 grid gap-3 ${step.grille ? "sm:grid-cols-2" : ""}`}>
            {step.choices.map((choice) => (
              <button
                key={choice.value}
                type="button"
                onClick={() => avancer(step.id, choice.value)}
                className={`sticker rounded-2xl px-6 py-5 text-left text-lg font-bold transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-mint active:translate-x-1 active:translate-y-1 active:shadow-none ${
                  answers[step.id] === choice.value ? "bg-green text-cream" : "bg-cream"
                }`}
              >
                {choice.label}
              </button>
            ))}
          </div>
        ) : (
          <form
            className="mt-10"
            onSubmit={(e) => {
              e.preventDefault()
              if (valide) avancer(step.id, draft.trim())
            }}
          >
            {step.multiline ? (
              <textarea
                autoFocus
                rows={5}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={step.placeholder}
                className="sticker w-full resize-none rounded-2xl bg-cream px-6 py-5 text-lg font-semibold outline-none placeholder:text-ink/35 focus:bg-mint"
              />
            ) : (
              <input
                autoFocus
                type={step.inputType ?? "text"}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={step.placeholder}
                className="sticker w-full rounded-2xl bg-cream px-6 py-5 text-lg font-semibold outline-none placeholder:text-ink/35 focus:bg-mint"
              />
            )}

            <button
              type="submit"
              disabled={!valide || envoiEnCours}
              className="sticker display mt-5 w-full rounded-full bg-green px-7 pt-4 pb-3.5 text-base text-cream transition-transform duration-150 enabled:hover:-translate-x-0.5 enabled:hover:-translate-y-0.5 enabled:active:translate-x-1 enabled:active:translate-y-1 enabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-40"
            >
              {envoiEnCours ? "Envoi…" : dernier ? "Envoyer ma demande" : "Continuer"}
            </button>

            {echec && (
              <p className="prose-balanced mt-4 text-center text-sm font-bold text-coral">
                {echec}
              </p>
            )}
          </form>
        )}
      </div>

      <button
        type="button"
        onClick={reculer}
        className="mx-auto mt-8 block text-sm font-bold text-ink/55 underline decoration-2 underline-offset-4 transition-colors hover:text-ink"
      >
        {index === 0 ? "Changer de sujet" : "Revenir à la question précédente"}
      </button>
    </div>
  )
}
