/**
 * Turns a downloaded paper photograph into a stock texture that tiles down a
 * long sheet without banding.
 *
 * Three things a raw photo cannot do on its own:
 *   1. It has a centre fold crease. Cropped out, because the sheet's type runs
 *      down the middle and a crease through the copy is not a nice detail.
 *   2. Its top and bottom edges do not match, so `repeat-y` shows a hard seam
 *      every tile. Mirroring the crop below itself makes the join exact.
 *   3. It carries a slow luminance gradient, which survives mirroring as a
 *      visible rhythm. That gets flattened before the mirror.
 *
 * Source and licence are recorded in public/media/paper-stock.LICENSE.txt.
 */
import { chromium } from 'playwright'
import { chromiumLaunchOptions } from '../scripts/browser.mjs'
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const src = process.argv[2]
const out = process.argv[3] || 'public/media/paper-stock.jpg'
const buf = readFileSync(src)
const mime = buf.slice(0, 4).toString('ascii') === 'RIFF' ? 'image/webp'
           : buf[0] === 0x89 ? 'image/png' : 'image/jpeg'
const uri = `data:${mime};base64,${buf.toString('base64')}`

const b = await chromium.launch(chromiumLaunchOptions())
const p = await (await b.newContext({ viewport: { width: 400, height: 400 } })).newPage()
await p.setContent('<canvas id="c"></canvas>')

const dataUrl = await p.evaluate(async (u) => {
  const img = new Image()
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = u })
  const SW = img.naturalWidth, SH = img.naturalHeight

  /* crop left of the centre crease, keeping a tall slice */
  const cw = Math.floor(SW * 0.42), ch = SH
  const TW = 900, TH = Math.round(ch * (TW / cw))

  const a = document.createElement('canvas'); a.width = TW; a.height = TH
  const ax = a.getContext('2d', { willReadFrequently: true })
  ax.drawImage(img, 0, 0, cw, ch, 0, 0, TW, TH)

  /* flatten the slow gradient: divide out a heavily blurred copy of itself */
  const blur = document.createElement('canvas'); blur.width = TW; blur.height = TH
  const bx = blur.getContext('2d')
  bx.filter = 'blur(60px)'
  bx.drawImage(a, 0, 0)
  const base = ax.getImageData(0, 0, TW, TH), low = bx.getImageData(0, 0, TW, TH)
  const mean = [0, 0, 0]
  for (let i = 0; i < low.data.length; i += 4) { mean[0] += low.data[i]; mean[1] += low.data[i+1]; mean[2] += low.data[i+2] }
  const n = low.data.length / 4
  mean[0] /= n; mean[1] /= n; mean[2] /= n
  for (let i = 0; i < base.data.length; i += 4) {
    for (let k = 0; k < 3; k++) {
      const lo = low.data[i + k] || 1
      base.data[i + k] = Math.max(0, Math.min(255, base.data[i + k] * (mean[k] / lo)))
    }
  }
  ax.putImageData(base, 0, 0)

  /* mirror below itself so repeat-y joins exactly */
  const t = document.createElement('canvas'); t.width = TW; t.height = TH * 2
  const tx = t.getContext('2d')
  tx.drawImage(a, 0, 0)
  tx.save(); tx.translate(0, TH * 2); tx.scale(1, -1); tx.drawImage(a, 0, 0); tx.restore()

  return t.toDataURL('image/jpeg', 0.82)
}, uri)

const bin = Buffer.from(dataUrl.split(',')[1], 'base64')
writeFileSync(path.resolve(out), bin)
console.log(`${out}  ${(bin.length / 1024).toFixed(0)} KB`)
await b.close()
