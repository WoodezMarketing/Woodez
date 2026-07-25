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

const total = await page.evaluate(() => document.documentElement.scrollHeight)
const step = Number(h)
const frames = Math.min(24, Math.ceil(total / step))

for (let i = 0; i < frames; i++) {
  const y = i * step
  await page.evaluate((to) => window.scrollTo({ top: to, behavior: 'instant' }), y)
  await new Promise((r) => setTimeout(r, 1100)) // Lenis + ScrollTrigger se stabilisent
  await page.screenshot({ path: `${dir}/${String(i).padStart(2, '0')}.png` })
}

console.log(`✓ ${frames} captures dans ${dir} (page de ${total}px)`)
await browser.close()
