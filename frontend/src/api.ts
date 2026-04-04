import type { AnalyzeResponse } from './types'

// override with VITE_API_BASE in .env if your API runs elsewhere
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://127.0.0.1:8000'

export async function analyzeUrl(url: string): Promise<AnalyzeResponse> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  })

  if (!res.ok) {
    let message = res.statusText
    try {
      const body: unknown = await res.json()
      if (
        body &&
        typeof body === 'object' &&
        'detail' in body &&
        typeof (body as { detail: unknown }).detail === 'string'
      ) {
        message = (body as { detail: string }).detail
      }
    } catch {
      // keep statusText
    }
    throw new Error(message || `request failed (${res.status})`)
  }

  return res.json() as Promise<AnalyzeResponse>
}
