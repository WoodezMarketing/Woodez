import { NextResponse } from "next/server"

/**
 * Enregistre une demande du formulaire.
 *
 * L'insertion passe par l'API REST de Supabase avec la clé de service, jamais
 * exposée au navigateur. Pas de dépendance ajoutée : un simple `fetch` suffit.
 *
 * Table attendue (SQL fourni dans le README) :
 *   demandes(id, cree_le, parcours, prenom, entreprise, courriel, reponses)
 */

const URL_SUPABASE = process.env.SUPABASE_URL
const CLE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY

type Corps = {
  parcours?: string
  reponses?: Record<string, string>
}

export async function POST(request: Request) {
  if (!URL_SUPABASE || !CLE_SERVICE) {
    return NextResponse.json(
      { erreur: "Enregistrement non configuré." },
      { status: 503 },
    )
  }

  let corps: Corps
  try {
    corps = await request.json()
  } catch {
    return NextResponse.json({ erreur: "Requête illisible." }, { status: 400 })
  }

  const reponses = corps.reponses ?? {}
  const courriel = reponses.courriel?.trim()

  if (!corps.parcours || !courriel) {
    return NextResponse.json({ erreur: "Demande incomplète." }, { status: 400 })
  }

  const reponse = await fetch(`${URL_SUPABASE}/rest/v1/demandes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: CLE_SERVICE,
      Authorization: `Bearer ${CLE_SERVICE}`,
      Prefer: "return=minimal",
    },
    body: JSON.stringify({
      parcours: corps.parcours,
      prenom: reponses.prenom ?? null,
      entreprise: reponses.entreprise ?? null,
      courriel,
      reponses,
    }),
  })

  if (!reponse.ok) {
    // Le détail reste côté serveur : il peut contenir des informations sur le
    // schéma de la base.
    console.error("Supabase a refusé l'insertion :", reponse.status, await reponse.text())
    return NextResponse.json({ erreur: "Enregistrement impossible." }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
