// Capture le site à plusieurs profondeurs de défilement, animations comprises.
// Usage: node scripts/shots.mjs [url] [dossier] [largeur] [hauteur]

import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const [url = 'http://localhost:4321', dir = './shots', w = '1440', h = '900'] = process.argv.slice(2)

mkdirSync(dir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--hide-scrollbars', '--disable-gpu'],
})

const page = await browser.newPage()
await page.setViewport({ width: Number(w), height: Number(h), deviceScaleFactor: 1 })
await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 })
await page.evaluate(() => document.fonts.ready)
await new Promise((r) => setTimeout(r, 2500)) // laisse jouer l'animation d'entrée

// Lenis pilote le défilement : `window.scrollTo` ne le touche pas et laisse
// ScrollTrigger figé sur l'état de départ. On envoie donc de vrais événements
// de molette, sinon les captures montrent des sections vides à tort.
await page.mouse.move(Number(w) / 2, Number(h) / 2)

const step = Number(h)
const total = await page.evaluate(() => document.documentElement.scrollHeight)
const frames = Math.min(24, Math.ceil(total / step))

for (let i = 0; i < frames; i++) {
  if (i > 0) {
    let moved = 0
    while (moved < step) {
      const chunk = Math.min(400, step - moved)
      await page.mouse.wheel({ deltaY: chunk })
      moved += chunk
      await new Promise((r) => setTimeout(r, 60))
    }
  }
  await new Promise((r) => setTimeout(r, 1100)) // Lenis + ScrollTrigger se stabilisent
  await page.screenshot({ path: `${dir}/${String(i).padStart(2, '0')}.png` })
}

console.log(`✓ ${frames} captures dans ${dir} (page de ${total}px)`)
await browser.close()
