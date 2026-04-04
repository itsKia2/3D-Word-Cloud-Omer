import { type FormEvent, useState } from 'react'
import { analyzeUrl } from './api'
import type { AnalyzeResponse } from './types'

// example links we display in case user doesnt want to enter a URL
const exampleLinks = [
  { label: 'Wikipedia — Linux', url: 'https://en.wikipedia.org/wiki/Linux' },
  {
    label: 'Techcrunch — The Facebook insider building content moderation for the AI era',
    url: 'https://techcrunch.com/2026/04/03/moonbounce-fundraise-content-moderation-for-the-ai-era/',
  },
  {
    label: 'New York Post — Yankees have struck gold out of nowhere with Ben Rice',
    url: 'https://nypost.com/2026/04/03/sports/yankees-struck-gold-out-of-nowhere-with-ben-rice-cam-schlittler/',
  },
]

export default function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalyzeResponse | null>(null)

  async function runAnalyze(targetUrl: string) {
    const trimmed = targetUrl.trim()
    if (!trimmed) {
      setError('Paste a URL first.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await analyzeUrl(trimmed)
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void runAnalyze(url)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex max-w-lg flex-col gap-8 px-4 py-12">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Omer's 3D Word Cloud</h1>
          <p className="text-sm text-slate-400">
            Paste a page with text, and we will analyze the text and create a 3D word cloud for you!
          </p>
        </header>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <label htmlFor="url" className="text-sm text-slate-300">
            Enter a URL with text:
          </label>
          <input
            id="url"
            name="url"
            type="url"
            autoComplete="url"
            placeholder="https://…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="rounded-md bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? 'Working…' : 'Analyze'}
          </button>
        </form>

        <section className="space-y-2">
          <p className="text-sm text-slate-400">Or here are some examples I found really cool:</p>
          <ul className="flex flex-col gap-2">
            {exampleLinks.map((ex) => (
              <li key={ex.url}>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setUrl(ex.url)
                    void runAnalyze(ex.url)
                  }}
                  className="text-left text-sm text-sky-400 underline decoration-sky-500/40 underline-offset-2 hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {ex.label}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {error ? (
          <p className="rounded-md border border-red-900/80 bg-red-950/50 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {result ? (
          <section className="space-y-2 rounded-md border border-slate-800 bg-slate-900/50 p-4">
            <p className="text-sm text-slate-300">
              Got <span className="font-medium text-slate-100">{result.words.length}</span> terms
              (preview — 3D cloud later).
            </p>
            <ol className="max-h-48 list-decimal space-y-1 overflow-y-auto pl-5 text-sm text-slate-400">
              {result.words.slice(0, 12).map((w) => (
                <li key={w.word}>
                  <span className="text-slate-200">{w.word}</span>{' '}
                  <span className="text-slate-500">({w.weight.toFixed(2)})</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </main>
    </div>
  )
}
