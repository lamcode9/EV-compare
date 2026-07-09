'use client'

import { useEffect, useRef } from 'react'
import { lerp, ramp, useScrollFraction, usePrefersReducedMotion } from '../_lib/useScroll'

/**
 * SunriseSky — the fixed, full-viewport canvas backdrop for "The Long
 * Sunrise". v2: a scene, not a gradient.
 *
 * Three layers, all keyed to story progress (0..1, piped in via `remap`):
 *   1. Sky — an ordered keyframe table (fire → combustion → false dawn →
 *      first light → risen → space → morning → paper); every draw lerps the
 *      bracketing pair. The arc lives in the data, not in if/else.
 *   2. World — a dark ground plane on a fixed horizon plus per-act silhouette
 *      scenes that crossfade as the story moves (hills → mill town → pylons →
 *      rooftops → gigafactory → Earth's curvature from orbit → a morning
 *      skyline). ONE sun rises physically from behind the horizon: drawn
 *      before the ground so its lower limb is occluded until it clears the
 *      line. During the space passage the sky's sun stands down entirely —
 *      the Kardashev ladder owns that frame with its own sun.
 *   3. Film grain — a seeded noise tile composited soft-light over the frame.
 *      It breaks up gradient banding and fades out into the paper handoff.
 */

type RGB = readonly [number, number, number]

interface SkyKeyframe {
  /** Story progress (0..1) this keyframe is pinned at. */
  p: number
  top: RGB
  mid: RGB
  horizon: RGB
  starAlpha: number
  /** Horizon accent glow: dull rust, cold pre-dawn band, or warm amber. */
  accentColor: RGB
  accentAlpha: number
  sunAlpha: number
  sunCenterYFrac: number
  sunRadiusFrac: number
  sunCore: RGB
  sunEdge: RGB
  sunGlowAlpha: number
}

interface StarPoint {
  xFrac: number
  yFrac: number
  r: number
  alpha: number
}

const HORIZON_FRAC = 0.78
const PAPER: RGB = [251, 247, 238]

// Sun parked just below the horizon while dormant, so fading in never pops.
const DORMANT_SUN = {
  sunCenterYFrac: HORIZON_FRAC + 0.09,
  sunRadiusFrac: 0.058,
  sunCore: [255, 200, 120] as RGB,
  sunEdge: [224, 120, 40] as RGB,
  sunGlowAlpha: 0.3,
}

const KEYFRAMES: SkyKeyframe[] = [
  {
    // "Fire" — near-black, stars out; the only light is the page's ember.
    p: 0,
    top: [5, 5, 5],
    mid: [8, 7, 6],
    horizon: [12, 10, 7],
    starAlpha: 0.65,
    accentColor: [224, 163, 60],
    accentAlpha: 0,
    sunAlpha: 0,
    ...DORMANT_SUN,
  },
  {
    // "Combustion" — smoky charcoal, dull rust glow, smog-dimmed stars.
    p: 0.14,
    top: [11, 10, 8],
    mid: [19, 14, 9],
    horizon: [34, 22, 11],
    starAlpha: 0.15,
    accentColor: [122, 59, 16],
    accentAlpha: 0.14,
    sunAlpha: 0,
    ...DORMANT_SUN,
  },
  {
    // "False Dawn" — cold pre-dawn blue, thin pale band on the horizon.
    p: 0.3,
    top: [6, 11, 20],
    mid: [10, 18, 32],
    horizon: [16, 26, 40],
    starAlpha: 0.35,
    accentColor: [184, 198, 216],
    accentAlpha: 0.18,
    sunAlpha: 0,
    ...DORMANT_SUN,
  },
  {
    // "First Light" — the sun's upper limb breaks the horizon: big, deep
    // amber, heavily scattered. Its lower limb is occluded by the ground.
    p: 0.44,
    top: [13, 27, 51],
    mid: [27, 48, 80],
    horizon: [122, 72, 22],
    starAlpha: 0.12,
    accentColor: [224, 163, 60],
    accentAlpha: 0.5,
    sunAlpha: 0.95,
    sunCenterYFrac: HORIZON_FRAC + 0.021,
    sunRadiusFrac: 0.058,
    sunCore: [255, 208, 130],
    sunEdge: [230, 130, 44],
    sunGlowAlpha: 0.42,
  },
  {
    // "Risen" — blue morning; the sun is high, small, and near-white.
    p: 0.58,
    top: [42, 74, 107],
    mid: [74, 110, 147],
    horizon: [214, 178, 116],
    starAlpha: 0,
    accentColor: [224, 163, 60],
    accentAlpha: 0.16,
    sunAlpha: 1,
    sunCenterYFrac: 0.28,
    sunRadiusFrac: 0.04,
    sunCore: [255, 246, 228],
    sunEdge: [244, 209, 138],
    sunGlowAlpha: 0.3,
  },
  {
    // Sun handoff — fully faded before the sky darkens toward space, so no
    // half-transparent ghost disc lingers over the star field.
    p: 0.645,
    top: [30, 55, 85],
    mid: [55, 85, 118],
    horizon: [150, 130, 95],
    starAlpha: 0.1,
    accentColor: [224, 163, 60],
    accentAlpha: 0.08,
    sunAlpha: 0,
    sunCenterYFrac: 0.24,
    sunRadiusFrac: 0.04,
    sunCore: [255, 246, 228],
    sunEdge: [244, 209, 138],
    sunGlowAlpha: 0,
  },
  {
    // "Space" — the sky's sun stands down; the Kardashev ladder owns this
    // frame with its own sun. Sky supplies black + hard stars + Earth below.
    p: 0.72,
    top: [2, 3, 10],
    mid: [4, 6, 15],
    horizon: [5, 10, 20],
    starAlpha: 0.9,
    accentColor: [224, 163, 60],
    accentAlpha: 0,
    sunAlpha: 0,
    sunCenterYFrac: 0.24,
    sunRadiusFrac: 0.04,
    sunCore: [255, 247, 224],
    sunEdge: [245, 181, 69],
    sunGlowAlpha: 0,
  },
  {
    // "Morning, Everywhere" — back on Earth, bright daylight, soft high sun.
    p: 0.88,
    top: [127, 168, 201],
    mid: [191, 211, 224],
    horizon: [244, 232, 204],
    starAlpha: 0,
    accentColor: [224, 163, 60],
    accentAlpha: 0,
    sunAlpha: 0.4,
    sunCenterYFrac: 0.16,
    sunRadiusFrac: 0.05,
    sunCore: [255, 253, 246],
    sunEdge: [253, 232, 176],
    sunGlowAlpha: 0.5,
  },
  {
    // "Paper" — everything settles into the flat site paper color.
    p: 0.97,
    top: PAPER,
    mid: PAPER,
    horizon: PAPER,
    starAlpha: 0,
    accentColor: PAPER,
    accentAlpha: 0,
    sunAlpha: 0,
    sunCenterYFrac: 0.16,
    sunRadiusFrac: 0.05,
    sunCore: PAPER,
    sunEdge: PAPER,
    sunGlowAlpha: 0,
  },
]

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

function lerpRGB(a: RGB, b: RGB, t: number): RGB {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]
}

function rgba(c: RGB, alpha: number): string {
  const a = Math.min(1, Math.max(0, alpha))
  return `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${a})`
}

/** Trapezoid envelope: 0 before a, rises a→b, holds 1, falls c→d, 0 after. */
function env(p: number, a: number, b: number, c: number, d: number): number {
  return Math.min(smoothstep(ramp(p, a, b)), 1 - smoothstep(ramp(p, c, d)))
}

interface ResolvedSky {
  top: RGB
  mid: RGB
  horizon: RGB
  starAlpha: number
  accentColor: RGB
  accentAlpha: number
  sunAlpha: number
  sunCenterYFrac: number
  sunRadiusFrac: number
  sunCore: RGB
  sunEdge: RGB
  sunGlowAlpha: number
}

/** Walk the keyframe table, find the bracketing pair for `p`, ease and lerp. */
function resolveSky(p: number, reducedMotion: boolean): ResolvedSky {
  let i = 0
  while (i < KEYFRAMES.length - 2 && p > KEYFRAMES[i + 1].p) i++
  const a = KEYFRAMES[i]
  const b = KEYFRAMES[i + 1]
  const localP = ramp(p, a.p, b.p)
  const t = reducedMotion ? localP : smoothstep(localP)

  return {
    top: lerpRGB(a.top, b.top, t),
    mid: lerpRGB(a.mid, b.mid, t),
    horizon: lerpRGB(a.horizon, b.horizon, t),
    starAlpha: lerp(a.starAlpha, b.starAlpha, t),
    accentColor: lerpRGB(a.accentColor, b.accentColor, t),
    accentAlpha: lerp(a.accentAlpha, b.accentAlpha, t),
    sunAlpha: lerp(a.sunAlpha, b.sunAlpha, t),
    sunCenterYFrac: lerp(a.sunCenterYFrac, b.sunCenterYFrac, t),
    sunRadiusFrac: lerp(a.sunRadiusFrac, b.sunRadiusFrac, t),
    sunCore: lerpRGB(a.sunCore, b.sunCore, t),
    sunEdge: lerpRGB(a.sunEdge, b.sunEdge, t),
    sunGlowAlpha: lerp(a.sunGlowAlpha, b.sunGlowAlpha, t),
  }
}

/** Ember glow is a firelight cue confined to the very start (p 0..0.1). */
function computeEmberAlpha(p: number): number {
  return 0.06 * (1 - smoothstep(ramp(p, 0, 0.1)))
}

function mulberry32(seed: number): () => number {
  let a = seed
  return function random() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const STAR_COUNT = 140

function generateStars(): StarPoint[] {
  const rand = mulberry32(1337)
  const stars: StarPoint[] = []
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      xFrac: rand(),
      yFrac: rand() * 0.7,
      r: 0.4 + rand() * 0.9,
      alpha: 0.55 + rand() * 0.45,
    })
  }
  return stars
}

/** Seeded film-grain tile, rendered once and pattern-filled every frame. */
function generateGrainTile(): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null
  const tile = document.createElement('canvas')
  tile.width = 128
  tile.height = 128
  const ctx = tile.getContext('2d')
  if (!ctx) return null
  const img = ctx.createImageData(128, 128)
  const rand = mulberry32(9042)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = 96 + Math.floor(rand() * 64) // mid-gray noise for soft-light
    img.data[i] = v
    img.data[i + 1] = v
    img.data[i + 2] = v
    img.data[i + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return tile
}

// ── World geometry ───────────────────────────────────────────────────
// Deterministic silhouette scenes, all drawn in fractions of (w, h) so they
// are resolution-independent. Each has a story-progress alpha envelope; the
// crossfades land on the act boundaries established by the page's remap.

interface WorldRand {
  stackX: number[]
  stackH: number[]
  cityLights: { t: number; d: number; a: number }[]
}

function generateWorldRand(): WorldRand {
  const rand = mulberry32(7311)
  const stackX: number[] = []
  const stackH: number[] = []
  for (let i = 0; i < 6; i++) {
    stackX.push(0.06 + i * 0.16 + (rand() - 0.5) * 0.05)
    stackH.push(0.055 + rand() * 0.05)
  }
  const cityLights: { t: number; d: number; a: number }[] = []
  for (let i = 0; i < 46; i++) {
    cityLights.push({ t: rand(), d: rand(), a: 0.25 + rand() * 0.75 })
  }
  return { stackX, stackH, cityLights }
}

/** Rolling hills — Act I. Two overlapping layers for depth. */
function drawHills(ctx: CanvasRenderingContext2D, w: number, h: number, hy: number, color: RGB, alpha: number) {
  if (alpha <= 0.004) return
  // Back layer: lower, slightly lifted toward the sky color.
  ctx.globalAlpha = alpha * 0.65
  ctx.fillStyle = rgba(color, 1)
  ctx.beginPath()
  ctx.moveTo(0, hy)
  ctx.quadraticCurveTo(w * 0.18, hy - h * 0.035, w * 0.4, hy - h * 0.012)
  ctx.quadraticCurveTo(w * 0.62, hy + h * 0.008, w * 0.8, hy - h * 0.02)
  ctx.quadraticCurveTo(w * 0.92, hy - h * 0.03, w, hy - h * 0.008)
  ctx.lineTo(w, hy + 2)
  ctx.lineTo(0, hy + 2)
  ctx.closePath()
  ctx.fill()
  // Front layer.
  ctx.globalAlpha = alpha
  ctx.beginPath()
  ctx.moveTo(0, hy - h * 0.01)
  ctx.quadraticCurveTo(w * 0.22, hy - h * 0.045, w * 0.5, hy - h * 0.005)
  ctx.quadraticCurveTo(w * 0.72, hy + h * 0.015, w, hy - h * 0.015)
  ctx.lineTo(w, hy + 2)
  ctx.lineTo(0, hy + 2)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
}

/** Mill town — Act II: blocky roofline, smokestacks, soft smoke smudges. */
function drawMills(ctx: CanvasRenderingContext2D, w: number, h: number, hy: number, color: RGB, alpha: number, world: WorldRand) {
  if (alpha <= 0.004) return
  ctx.globalAlpha = alpha
  ctx.fillStyle = rgba(color, 1)
  // Low industrial roofline: irregular blocks across the width.
  const blocks = [
    [0.0, 0.1, 0.018], [0.1, 0.2, 0.032], [0.2, 0.27, 0.014], [0.27, 0.41, 0.026],
    [0.41, 0.5, 0.012], [0.5, 0.63, 0.03], [0.63, 0.72, 0.02], [0.72, 0.88, 0.034], [0.88, 1, 0.016],
  ] as const
  ctx.beginPath()
  ctx.moveTo(0, hy + 2)
  for (const [x0, x1, bh] of blocks) {
    ctx.lineTo(w * x0, hy - h * bh)
    ctx.lineTo(w * x1, hy - h * bh)
  }
  ctx.lineTo(w, hy + 2)
  ctx.closePath()
  ctx.fill()
  // Smokestacks.
  for (let i = 0; i < world.stackX.length; i++) {
    const sx = w * world.stackX[i]
    const sh = h * world.stackH[i]
    const sw = Math.max(3, w * 0.006)
    ctx.fillRect(sx - sw / 2, hy - sh, sw, sh)
    ctx.fillRect(sx - sw * 0.9, hy - sh, sw * 1.8, Math.max(2, sh * 0.03)) // cap
  }
  // Smoke: soft radial smudges drifting off three of the stacks.
  for (let i = 0; i < 3; i++) {
    const sx = w * world.stackX[i * 2] + w * 0.015
    const sy = hy - h * world.stackH[i * 2] - h * 0.02
    const r = h * (0.045 + i * 0.012)
    const smoke = ctx.createRadialGradient(sx, sy, 0, sx, sy, r)
    smoke.addColorStop(0, rgba(color, alpha * 0.32))
    smoke.addColorStop(1, rgba(color, 0))
    ctx.globalAlpha = 1
    ctx.fillStyle = smoke
    ctx.fillRect(sx - r, sy - r, r * 2, r * 2)
    ctx.globalAlpha = alpha
  }
  ctx.globalAlpha = 1
}

/** Transmission pylons + sagging catenary wires — the False Dawn (the grid). */
function drawPylons(ctx: CanvasRenderingContext2D, w: number, h: number, hy: number, color: RGB, alpha: number) {
  if (alpha <= 0.004) return
  const stroke = rgba(color, alpha)
  ctx.strokeStyle = stroke
  ctx.fillStyle = stroke
  ctx.lineWidth = Math.max(1, w * 0.0012)
  const xs = [0.16, 0.5, 0.84]
  const top = hy - h * 0.105
  for (const fx of xs) {
    const x = w * fx
    const half = w * 0.016
    // Tapered mast: two legs converging to the tip.
    ctx.beginPath()
    ctx.moveTo(x - half, hy)
    ctx.lineTo(x - half * 0.25, top)
    ctx.moveTo(x + half, hy)
    ctx.lineTo(x + half * 0.25, top)
    // Cross arms.
    const armY1 = top + h * 0.018
    const armY2 = top + h * 0.042
    ctx.moveTo(x - half * 1.6, armY1)
    ctx.lineTo(x + half * 1.6, armY1)
    ctx.moveTo(x - half * 1.15, armY2)
    ctx.lineTo(x + half * 1.15, armY2)
    ctx.stroke()
  }
  // Catenaries between arm tips (and off both edges).
  const armY = top + h * 0.018
  const sag = h * 0.028
  ctx.beginPath()
  const px = [-0.18, ...xs, 1.18].map((fx) => w * fx)
  for (let i = 0; i < px.length - 1; i++) {
    ctx.moveTo(px[i] + w * 0.016 * 1.6, armY)
    ctx.quadraticCurveTo((px[i] + px[i + 1]) / 2, armY + sag, px[i + 1] - w * 0.016 * 1.6, armY)
  }
  ctx.stroke()
}

/** Rooftops with solar panels — Act III: the revolution lands on houses. */
function drawRooftops(ctx: CanvasRenderingContext2D, w: number, h: number, hy: number, color: RGB, alpha: number) {
  if (alpha <= 0.004) return
  ctx.globalAlpha = alpha
  ctx.fillStyle = rgba(color, 1)
  // A row of gabled houses of varying widths.
  const houses = [
    [0.0, 0.11, 0.02], [0.13, 0.27, 0.03], [0.29, 0.4, 0.024], [0.43, 0.58, 0.034],
    [0.6, 0.71, 0.022], [0.73, 0.87, 0.03], [0.89, 1.0, 0.02],
  ] as const
  ctx.beginPath()
  ctx.moveTo(0, hy + 2)
  for (const [x0, x1, gh] of houses) {
    const wallH = h * 0.012
    const mid = (x0 + x1) / 2
    ctx.lineTo(w * x0, hy - wallH)
    ctx.lineTo(w * mid, hy - wallH - h * gh)
    ctx.lineTo(w * x1, hy - wallH)
  }
  ctx.lineTo(w, hy + 2)
  ctx.closePath()
  ctx.fill()
  // Solar panels: brighter slabs set on three roof slopes.
  ctx.fillStyle = rgba([94, 120, 148], 1)
  for (const idx of [1, 3, 5]) {
    const [x0, x1, gh] = houses[idx]
    const mid = (x0 + x1) / 2
    const baseY = hy - h * 0.012
    const tipY = baseY - h * gh
    // Panel lies on the left slope, inset from both ends.
    const px0 = lerp(w * x0, w * mid, 0.3)
    const py0 = lerp(baseY, tipY, 0.3)
    const px1 = lerp(w * x0, w * mid, 0.8)
    const py1 = lerp(baseY, tipY, 0.8)
    const nx = (py0 - py1) * 0.16
    const ny = (px1 - px0) * 0.16
    ctx.beginPath()
    ctx.moveTo(px0, py0)
    ctx.lineTo(px1, py1)
    ctx.lineTo(px1 - nx, py1 - ny)
    ctx.lineTo(px0 - nx, py0 - ny)
    ctx.closePath()
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

/** Gigafactory — Act IV: one long sawtooth shed, mass over ornament. */
function drawFactory(ctx: CanvasRenderingContext2D, w: number, h: number, hy: number, color: RGB, alpha: number) {
  if (alpha <= 0.004) return
  ctx.globalAlpha = alpha
  ctx.fillStyle = rgba(color, 1)
  const roofY = hy - h * 0.05
  ctx.beginPath()
  ctx.moveTo(w * 0.02, hy + 2)
  ctx.lineTo(w * 0.02, roofY)
  // Sawtooth roofline across most of the width.
  const teeth = 9
  const x0 = w * 0.02
  const x1 = w * 0.86
  for (let i = 0; i < teeth; i++) {
    const tx0 = x0 + ((x1 - x0) * i) / teeth
    const tx1 = x0 + ((x1 - x0) * (i + 1)) / teeth
    ctx.lineTo(tx0 + (tx1 - tx0) * 0.55, roofY - h * 0.016)
    ctx.lineTo(tx1, roofY)
  }
  // Attached taller block + stack at the right end.
  ctx.lineTo(w * 0.86, hy - h * 0.075)
  ctx.lineTo(w * 0.97, hy - h * 0.075)
  ctx.lineTo(w * 0.97, hy + 2)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
}

/** Earth from orbit — the space passage: dark limb, thin atmosphere rim,
 * seeded city lights on the night side. */
function drawEarthCurve(ctx: CanvasRenderingContext2D, w: number, h: number, alpha: number, world: WorldRand) {
  if (alpha <= 0.004) return
  const cx = w * 0.5
  const cy = h * 2.12
  const R = h * 1.5 // limb crests around y ≈ 0.62h at center
  // Planet body.
  ctx.globalAlpha = alpha
  ctx.fillStyle = rgba([4, 7, 13], 1)
  ctx.beginPath()
  ctx.arc(cx, cy, R, 0, Math.PI * 2)
  ctx.fill()
  // Atmosphere rim: a thin scattered-blue band hugging the limb.
  const rim = ctx.createRadialGradient(cx, cy, R - h * 0.01, cx, cy, R + h * 0.025)
  rim.addColorStop(0, rgba([127, 168, 201], 0))
  rim.addColorStop(0.45, rgba([127, 168, 201], alpha * 0.55))
  rim.addColorStop(1, rgba([127, 168, 201], 0))
  ctx.globalAlpha = 1
  ctx.fillStyle = rim
  ctx.fillRect(0, h * 0.5, w, h * 0.5)
  // City lights: gold pinpricks scattered just inside the limb — the story's
  // hearths, seen from orbit.
  ctx.fillStyle = '#F4D18A'
  for (const light of world.cityLights) {
    const ang = -Math.PI / 2 + (light.t - 0.5) * 0.5 // fan around the crest
    const r = R - h * (0.02 + light.d * 0.11)
    const x = cx + Math.cos(ang) * r
    const y = cy + Math.sin(ang) * r
    if (y < h * 0.55 || y > h) continue
    ctx.globalAlpha = alpha * light.a * 0.8
    ctx.fillRect(x, y, 1.4, 1.4)
  }
  ctx.globalAlpha = 1
}

/** Morning skyline — Act V: a light haze of rooftops dissolving into paper. */
function drawMorningRoofs(ctx: CanvasRenderingContext2D, w: number, h: number, hy: number, alpha: number) {
  if (alpha <= 0.004) return
  ctx.globalAlpha = alpha * 0.5
  ctx.fillStyle = rgba([148, 162, 172], 1)
  const houses = [
    [0.04, 0.16, 0.018], [0.2, 0.34, 0.026], [0.38, 0.5, 0.02], [0.54, 0.7, 0.028], [0.74, 0.9, 0.02],
  ] as const
  ctx.beginPath()
  ctx.moveTo(0, hy + 2)
  for (const [x0, x1, gh] of houses) {
    const wallH = h * 0.008
    ctx.lineTo(w * x0, hy - wallH)
    ctx.lineTo(w * ((x0 + x1) / 2), hy - wallH - h * gh)
    ctx.lineTo(w * x1, hy - wallH)
  }
  ctx.lineTo(w, hy + 2)
  ctx.closePath()
  ctx.fill()
  ctx.globalAlpha = 1
}

// ── Frame ────────────────────────────────────────────────────────────

function draw(
  ctx: CanvasRenderingContext2D,
  size: { w: number; h: number },
  p: number,
  reducedMotion: boolean,
  stars: StarPoint[],
  world: WorldRand,
  grain: HTMLCanvasElement | null
): void {
  const { w, h } = size
  if (w <= 0 || h <= 0) return

  const sky = resolveSky(p, reducedMotion)
  const emberAlpha = computeEmberAlpha(p)
  const horizonY = h * HORIZON_FRAC

  ctx.clearRect(0, 0, w, h)

  // Sky gradient: top -> mid -> horizon.
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
  skyGrad.addColorStop(0, rgba(sky.top, 1))
  skyGrad.addColorStop(HORIZON_FRAC * 0.7, rgba(sky.mid, 1))
  skyGrad.addColorStop(HORIZON_FRAC, rgba(sky.horizon, 1))
  skyGrad.addColorStop(1, rgba(sky.horizon, 1))
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, w, h)

  // Star field — deterministic, no time-based twinkle.
  if (sky.starAlpha > 0.002) {
    ctx.fillStyle = '#FFFFFF'
    for (const s of stars) {
      ctx.globalAlpha = sky.starAlpha * s.alpha
      ctx.beginPath()
      ctx.arc(s.xFrac * w, s.yFrac * h, s.r, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.globalAlpha = 1
  }

  // Horizon accent band — rust, cold, or amber glow hugging the horizon.
  if (sky.accentAlpha > 0.002) {
    const bandHalf = h * 0.14
    const bandGrad = ctx.createLinearGradient(0, horizonY - bandHalf, 0, horizonY + bandHalf)
    bandGrad.addColorStop(0, rgba(sky.accentColor, 0))
    bandGrad.addColorStop(0.5, rgba(sky.accentColor, sky.accentAlpha))
    bandGrad.addColorStop(1, rgba(sky.accentColor, 0))
    ctx.fillStyle = bandGrad
    ctx.fillRect(0, horizonY - bandHalf, w, bandHalf * 2)
  }

  // The sun — drawn BEFORE the ground so its lower limb is occluded while it
  // rises. Kept in a right-hand lane clear of the centered prose column.
  if (sky.sunAlpha > 0.002) {
    const cx = w > 900 ? w - Math.min(w * 0.16, 240) : w * 0.85
    const cy = h * sky.sunCenterYFrac
    const r = Math.min(w, h) * sky.sunRadiusFrac

    if (sky.sunGlowAlpha > 0.002) {
      const glowR = r * 5
      const glowGrad = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, glowR)
      glowGrad.addColorStop(0, rgba(sky.sunEdge, sky.sunGlowAlpha * sky.sunAlpha))
      glowGrad.addColorStop(1, rgba(sky.sunEdge, 0))
      ctx.fillStyle = glowGrad
      ctx.fillRect(cx - glowR, cy - glowR, glowR * 2, glowR * 2)
    }

    const discGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
    discGrad.addColorStop(0, rgba(sky.sunCore, 1))
    discGrad.addColorStop(0.55, rgba(sky.sunCore, 1))
    discGrad.addColorStop(1, rgba(sky.sunEdge, 1))
    ctx.globalAlpha = sky.sunAlpha
    ctx.fillStyle = discGrad
    ctx.beginPath()
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }

  // ── The world ──
  // Ground plane: dark through the earthbound acts, absent in space, back as
  // light morning haze, dissolving into paper.
  const groundOut = 1 - smoothstep(ramp(p, 0.645, 0.71))
  const groundBack = smoothstep(ramp(p, 0.84, 0.9))
  const groundAlpha = Math.max(groundOut, groundBack)
  const dayness = smoothstep(ramp(p, 0.84, 0.94))
  if (groundAlpha > 0.004) {
    // Land lifts out of pure black once the sun is up, then goes to morning haze.
    const sunlit = smoothstep(ramp(p, 0.46, 0.6))
    const groundRGB = lerpRGB(lerpRGB([7, 8, 9], [40, 46, 50], sunlit), [222, 219, 206], dayness)
    ctx.globalAlpha = groundAlpha * (1 - smoothstep(ramp(p, 0.94, 0.985)) * dayness)
    ctx.fillStyle = rgba(groundRGB, 1)
    ctx.fillRect(0, horizonY, w, h - horizonY)
    ctx.globalAlpha = 1
  }

  // Silhouette scenes, crossfading on the act boundaries. Night scenes share
  // one near-black ink; the pre-dawn pylons pick up a cold tint.
  const nightSil: RGB = [7, 8, 9]
  drawHills(ctx, w, h, horizonY, nightSil, env(p, -0.01, 0, 0.1, 0.17) * groundAlpha)
  drawMills(ctx, w, h, horizonY, [9, 8, 7], env(p, 0.1, 0.17, 0.27, 0.35) * groundAlpha, world)
  drawPylons(ctx, w, h, horizonY, [10, 14, 20], env(p, 0.28, 0.35, 0.41, 0.48) * groundAlpha)
  drawRooftops(ctx, w, h, horizonY, [12, 14, 18], env(p, 0.42, 0.49, 0.55, 0.62) * groundAlpha)
  drawFactory(ctx, w, h, horizonY, [10, 12, 15], env(p, 0.56, 0.62, 0.645, 0.7) * groundAlpha)
  drawEarthCurve(ctx, w, h, env(p, 0.7, 0.755, 0.8, 0.85), world)
  drawMorningRoofs(ctx, w, h, horizonY, env(p, 0.86, 0.91, 0.94, 0.975))

  // Ember glow — firelight rising from below the fold, over the ground.
  if (emberAlpha > 0.002) {
    const emberGrad = ctx.createRadialGradient(w * 0.5, h * 0.95, 0, w * 0.5, h * 0.95, Math.max(w, h) * 0.45)
    emberGrad.addColorStop(0, rgba([224, 163, 60], emberAlpha))
    emberGrad.addColorStop(1, rgba([224, 163, 60], 0))
    ctx.fillStyle = emberGrad
    ctx.fillRect(0, 0, w, h)
  }

  // Film grain — soft-light noise over the whole frame; fades into paper.
  if (grain) {
    const grainAlpha = 0.22 * (1 - smoothstep(ramp(p, 0.9, 0.985)))
    if (grainAlpha > 0.01) {
      const pattern = ctx.createPattern(grain, 'repeat')
      if (pattern) {
        ctx.globalCompositeOperation = 'soft-light'
        ctx.globalAlpha = grainAlpha
        ctx.fillStyle = pattern
        ctx.fillRect(0, 0, w, h)
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
      }
    }
  }
}

export default function SunriseSky({
  className,
  remap,
}: {
  className?: string
  /**
   * Optional document-fraction → story-progress remap. The page measures its
   * act anchors at runtime and pipes scroll through this so the sky's
   * keyframes land on the acts regardless of viewport-dependent layout.
   */
  remap?: (f: number) => number
}) {
  const rawFraction = useScrollFraction()
  const fraction = remap ? remap(rawFraction) : rawFraction
  const reducedMotion = usePrefersReducedMotion()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const sizeRef = useRef({ w: 0, h: 0 })
  const lastDrawnRef = useRef(-1)
  const fractionRef = useRef(0)
  const starsRef = useRef<StarPoint[] | null>(null)
  const worldRef = useRef<WorldRand | null>(null)
  const grainRef = useRef<HTMLCanvasElement | null>(null)

  if (!starsRef.current) starsRef.current = generateStars()
  if (!worldRef.current) worldRef.current = generateWorldRand()

  // Mount + resize: (re)size the canvas for devicePixelRatio and redraw.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctxRef.current = ctx
    if (!grainRef.current) grainRef.current = generateGrainTile()

    const applySize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sizeRef.current = { w, h }
      draw(ctx, sizeRef.current, fractionRef.current, reducedMotion, starsRef.current as StarPoint[], worldRef.current as WorldRand, grainRef.current)
      lastDrawnRef.current = fractionRef.current
    }

    applySize()
    window.addEventListener('resize', applySize, { passive: true })
    return () => window.removeEventListener('resize', applySize)
  }, [reducedMotion])

  // Redraw only when the scroll fraction moves meaningfully.
  useEffect(() => {
    fractionRef.current = fraction
    const ctx = ctxRef.current
    if (!ctx) return
    if (lastDrawnRef.current >= 0 && Math.abs(fraction - lastDrawnRef.current) <= 0.0015) return
    lastDrawnRef.current = fraction
    draw(ctx, sizeRef.current, fraction, reducedMotion, starsRef.current as StarPoint[], worldRef.current as WorldRand, grainRef.current)
  }, [fraction, reducedMotion])

  // z-0 (not negative): a negative-z fixed child would paint beneath the
  // opaque background of <main>; the page lifts its content above at z-10.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`fixed inset-0 z-0 h-full w-full pointer-events-none ${className ?? ''}`}
    />
  )
}
