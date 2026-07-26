// Rend transparent le ciel uni d'une illustration, pour pouvoir glisser des
// calques animés (nuages) derrière.
//
// Usage: node scripts/chroma-key.mjs <entrée.png> <sortie.png> [tolérance]
//
// On remplit depuis les bords plutôt que de filtrer par couleur : seule la
// zone de ciel CONNECTÉE au bord disparaît, donc une teinte proche à
// l'intérieur d'un personnage n'est jamais percée.

import puppeteer from 'puppeteer-core'
import { readFileSync, writeFileSync } from 'node:fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const [input, output, tol = '45'] = process.argv.slice(2)
if (!input || !output) {
  console.error('Usage: node scripts/chroma-key.mjs <entrée.png> <sortie.png> [tolérance]')
  process.exit(1)
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'shell' })
const page = await browser.newPage()

const b64 = readFileSync(input).toString('base64')
await page.setContent(`<img id="i" src="data:image/png;base64,${b64}">`)
await page.waitForFunction(() => {
  const i = document.getElementById('i')
  return i.complete && i.naturalWidth > 0
})

const result = await page.evaluate((tolerance) => {
  const img = document.getElementById('i')
  const w = img.naturalWidth
  const h = img.naturalHeight
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0)

  const image = ctx.getImageData(0, 0, w, h)
  const px = image.data

  // La couleur de ciel est celle du coin supérieur gauche.
  const kr = px[0]
  const kg = px[1]
  const kb = px[2]
  const tol2 = tolerance * tolerance

  const matches = (idx) => {
    const dr = px[idx] - kr
    const dg = px[idx + 1] - kg
    const db = px[idx + 2] - kb
    return dr * dr + dg * dg + db * db <= tol2
  }

  // Remplissage par diffusion depuis tout le pourtour de l'image.
  const seen = new Uint8Array(w * h)
  const stack = new Int32Array(w * h)
  let top = 0

  const push = (p) => {
    if (!seen[p] && matches(p * 4)) {
      seen[p] = 1
      stack[top++] = p
    }
  }

  for (let x = 0; x < w; x++) {
    push(x)
    push((h - 1) * w + x)
  }
  for (let y = 0; y < h; y++) {
    push(y * w)
    push(y * w + w - 1)
  }

  let cleared = 0
  while (top > 0) {
    const p = stack[--top]
    px[p * 4 + 3] = 0
    cleared++

    const x = p % w
    const y = (p - x) / w
    if (x > 0) push(p - 1)
    if (x < w - 1) push(p + 1)
    if (y > 0) push(p - w)
    if (y < h - 1) push(p + w)
  }

  ctx.putImageData(image, 0, 0)
  return {
    dataUrl: canvas.toDataURL('image/png'),
    w,
    h,
    cle: `rgb(${kr}, ${kg}, ${kb})`,
    pourcentEfface: Math.round((cleared / (w * h)) * 100),
  }
}, Number(tol))

writeFileSync(output, Buffer.from(result.dataUrl.split(',')[1], 'base64'))
console.log(
  `✓ ${output} — ${result.w}×${result.h}, clé ${result.cle}, ${result.pourcentEfface} % rendu transparent`,
)

await browser.close()
