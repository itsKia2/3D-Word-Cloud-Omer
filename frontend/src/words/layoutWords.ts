import type { WordItem } from '../types'

// logic for how we spread out the labels and spacing
// contains AI generated code, lots of math involved

export type PlacedWord = {
  item: WordItem
  position: [number, number, number]
  band: 'red' | 'green'
  /** 0–1 within that band (for lerping color) */
  colorT: number
}

function medianOf(nums: number[]): number {
  if (nums.length === 0) return 0
  const a = [...nums].sort((x, y) => x - y)
  const mid = Math.floor(a.length / 2)
  return a.length % 2 === 1 ? a[mid]! : (a[mid - 1]! + a[mid]!) / 2
}

function bandAndT(w: number, minW: number, maxW: number, med: number): { band: 'red' | 'green'; t: number } {
  const flat = maxW - minW < 1e-9
  if (flat) {
    return { band: 'red', t: 0.5 }
  }
  if (w >= med) {
    const denom = maxW - med || 1e-9
    return { band: 'red', t: (w - med) / denom }
  }
  const denom = med - minW || 1e-9
  return { band: 'green', t: (w - minW) / denom }
}

// spread points on a sphere — fibonacci lattice
function fibonacciSphere(n: number, radius: number): [number, number, number][] {
  if (n <= 0) return []
  if (n === 1) return [[radius, 0, 0]]

  const pts: [number, number, number][] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const r = Math.sqrt(Math.max(0, 1 - y * y))
    const theta = golden * i
    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r
    pts.push([x * radius, y * radius, z * radius])
  }
  return pts
}

function shellPositionsForRest(count: number): [number, number, number][] {
  if (count <= 0) return []
  const nInner = Math.ceil(count / 2)
  const nOuter = count - nInner
  const innerR = 5.0
  const outerR = 6.9
  const inner = fibonacciSphere(nInner, innerR)
  const outer = fibonacciSphere(nOuter, outerR)
  return [...inner, ...outer]
}

export function layoutWords(words: WordItem[], maxWords = 48): PlacedWord[] {
  const sorted = [...words].sort((a, b) => b.weight - a.weight).slice(0, maxWords)
  if (sorted.length === 0) return []

  const vals = sorted.map((x) => x.weight)
  const minW = Math.min(...vals)
  const maxW = Math.max(...vals)
  const med = medianOf(vals)

  const top = sorted[0]!
  const rest = sorted.slice(1)
  const shell = shellPositionsForRest(rest.length)

  const mk = (item: WordItem, pos: [number, number, number]): PlacedWord => {
    const { band, t } = bandAndT(item.weight, minW, maxW, med)
    return { item, position: pos, band, colorT: Math.max(0, Math.min(1, t)) }
  }

  const out: PlacedWord[] = [mk(top, [0, 0.42, 6.6])]
  for (let i = 0; i < rest.length; i++) {
    out.push(mk(rest[i]!, shell[i]!))
  }
  return out
}
