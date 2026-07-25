// Génère une image via Nano Banana Pro (gemini-3-pro-image).
// Usage: node scripts/generate-image.mjs "<prompt>" <sortie.png> [image-ref1] [image-ref2] ...
// Les images de référence servent à verrouiller le style (mascotte, stickers).

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, extname } from 'node:path'

const KEY = readFileSync(new URL('../.env.local', import.meta.url), 'utf8')
  .match(/GEMINI_API_KEY=(.+)/)?.[1]
  ?.trim()
if (!KEY) throw new Error('GEMINI_API_KEY introuvable dans .env.local')

const [prompt, out, ...refs] = process.argv.slice(2)
if (!prompt || !out) {
  console.error('Usage: node scripts/generate-image.mjs "<prompt>" <sortie.png> [refs...]')
  process.exit(1)
}

const MIME = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }

const parts = [
  ...refs.map((p) => ({
    inline_data: {
      mime_type: MIME[extname(p).toLowerCase()] ?? 'image/png',
      data: readFileSync(p).toString('base64'),
    },
  })),
  { text: prompt },
]

const res = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent?key=${KEY}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: process.env.ASPECT ?? '1:1' },
      },
    }),
  },
)

const json = await res.json()
if (!res.ok) throw new Error(`API ${res.status}: ${JSON.stringify(json).slice(0, 800)}`)

const image = json.candidates?.[0]?.content?.parts?.find((p) => p.inlineData ?? p.inline_data)
const data = image?.inlineData?.data ?? image?.inline_data?.data
if (!data) throw new Error(`Aucune image retournée: ${JSON.stringify(json).slice(0, 800)}`)

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, Buffer.from(data, 'base64'))

const usage = json.usageMetadata ?? {}
console.log(`✓ ${out}  (tokens: ${usage.totalTokenCount ?? '?'})`)
