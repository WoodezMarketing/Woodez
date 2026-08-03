import { NextResponse } from "next/server"

/**
 * Enregistre une demande du formulaire, puis prévient par courriel.
 *
 * L'enregistrement fait foi : il passe par l'API REST de Supabase avec la clé
 * de service, jamais exposée au navigateur. Le courriel n'est qu'une
 * notification — s'il échoue, la demande reste en base et la réponse au
 * visiteur est quand même un succès.
 */

const URL_SUPABASE = process.env.SUPABASE_URL
const CLE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY
const CLE_RESEND = process.env.RESEND_API_KEY
const DESTINATAIRE = process.env.COURRIEL_DESTINATAIRE ?? "info@woodez.ca"
const EXPEDITEUR = process.env.COURRIEL_EXPEDITEUR ?? "Woodez <onboarding@resend.dev>"

type Ligne = { question: string; reponse: string }
type Corps = {
  parcours?: string
  reponses?: Record<string, string>
  detail?: Ligne[]
}

const echapper = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

function courrielHtml(parcours: string, detail: Ligne[], reponses: Record<string, string>) {
  const lignes = detail
    .map(
      ({ question, reponse }) => `
        <tr>
          <td style="padding:14px 20px;border-bottom:2px solid #e8efec;color:#5b6560;font-size:13px;width:45%;vertical-align:top">
            ${echapper(question)}
          </td>
          <td style="padding:14px 20px;border-bottom:2px solid #e8efec;color:#141715;font-size:15px;font-weight:700;vertical-align:top">
            ${echapper(reponse) || "—"}
          </td>
        </tr>`,
    )
    .join("")

  const nom = echapper(reponses.prenom ?? "")
  const entreprise = echapper(reponses.entreprise ?? "")
  const courriel = echapper(reponses.courriel ?? "")

  return `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:24px;background:#f7fbfa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto">
    <tr>
      <td style="background:#16b57c;border:3px solid #141715;border-radius:20px 20px 0 0;padding:26px 24px">
        <p style="margin:0;color:#f7fbfa;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:700">
          Nouvelle demande
        </p>
        <p style="margin:6px 0 0;color:#ffffff;font-size:26px;font-weight:800">
          ${echapper(parcours)}
        </p>
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;border:3px solid #141715;border-top:0;padding:24px">
        <p style="margin:0 0 4px;font-size:20px;font-weight:800;color:#141715">${nom || "Sans nom"}</p>
        <p style="margin:0;color:#5b6560;font-size:15px">${entreprise || "Entreprise non précisée"}</p>
        ${
          courriel
            ? `<p style="margin:18px 0 0">
                 <a href="mailto:${courriel}" style="display:inline-block;background:#141715;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:15px">
                   Répondre à ${courriel}
                 </a>
               </p>`
            : ""
        }
      </td>
    </tr>

    <tr>
      <td style="background:#ffffff;border:3px solid #141715;border-top:0;border-radius:0 0 20px 20px;padding:0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${lignes}
        </table>
      </td>
    </tr>

    <tr>
      <td style="padding:18px 4px;color:#8a938e;font-size:12px">
        Envoyé depuis le formulaire de woodez.ca
      </td>
    </tr>
  </table>
</body>
</html>`
}

async function prevenirParCourriel(parcours: string, detail: Ligne[], reponses: Record<string, string>) {
  if (!CLE_RESEND) return

  const entreprise = reponses.entreprise?.trim()
  const sujet = `Nouvelle demande — ${parcours}${entreprise ? ` — ${entreprise}` : ""}`

  const reponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${CLE_RESEND}`,
    },
    body: JSON.stringify({
      from: EXPEDITEUR,
      to: [DESTINATAIRE],
      // Le bouton « Répondre » du client courriel écrit directement au visiteur.
      reply_to: reponses.courriel ? [reponses.courriel] : undefined,
      subject: sujet,
      html: courrielHtml(parcours, detail, reponses),
      text: [
        sujet,
        "",
        ...detail.map((l) => `${l.question}\n${l.reponse || "—"}`),
      ].join("\n\n"),
    }),
  })

  if (!reponse.ok) throw new Error(`Resend ${reponse.status}: ${await reponse.text()}`)
}

export async function POST(request: Request) {
  if (!URL_SUPABASE || !CLE_SERVICE) {
    return NextResponse.json({ erreur: "Enregistrement non configuré." }, { status: 503 })
  }

  let corps: Corps
  try {
    corps = await request.json()
  } catch {
    return NextResponse.json({ erreur: "Requête illisible." }, { status: 400 })
  }

  const reponses = corps.reponses ?? {}
  const detail = corps.detail ?? []
  const courriel = reponses.courriel?.trim()

  if (!corps.parcours || !courriel) {
    return NextResponse.json({ erreur: "Demande incomplète." }, { status: 400 })
  }

  const enregistrement = await fetch(`${URL_SUPABASE}/rest/v1/demandes`, {
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

  if (!enregistrement.ok) {
    // Le détail reste côté serveur : il peut décrire le schéma de la base.
    console.error("Supabase a refusé l'insertion :", enregistrement.status, await enregistrement.text())
    return NextResponse.json({ erreur: "Enregistrement impossible." }, { status: 502 })
  }

  // La demande est sauvée : un courriel qui échoue ne doit pas faire croire au
  // visiteur que son envoi n'est pas passé.
  try {
    await prevenirParCourriel(corps.parcours, detail, reponses)
  } catch (erreur) {
    console.error("Notification par courriel impossible :", erreur)
  }

  return NextResponse.json({ ok: true })
}
