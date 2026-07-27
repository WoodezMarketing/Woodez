// Recadre une image par le haut. `sips -c` ignore l'offset demandé, d'où ce
// passage par le canvas.
//
// Usage: node scripts/crop-image.mjs <entrée> <sortie> <pixelsÀRetirerEnHaut>

import puppeteer from 'puppeteer-core'
import { readFileSync, writeFileSync } from 'node:fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const [input, output, top] = process.argv.slice(2)
if (!input || !output || !top) {
  console.error('Usage: node scripts/crop-image.mjs <entrée> <sortie> <hautÀRetirer>')
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

const dataUrl = await page.evaluate((cut) => {
  const img = document.getElementById('i')
  const w = img.naturalWidth
  const h = img.naturalHeight - cut
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d').drawImage(img, 0, cut, w, h, 0, 0, w, h)
  return canvas.toDataURL('image/png')
}, Number(top))

writeFileSync(output, Buffer.from(dataUrl.split(',')[1], 'base64'))
console.log(`✓ ${output} — ${top} px retirés en haut`)

await browser.close()
