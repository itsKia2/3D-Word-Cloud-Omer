import { type FormEvent, useState } from 'react'
import { analyzeUrl } from './api'
import type { AnalyzeResponse } from './types'
import { WordCloud } from './words/WordCloud'

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

type Screen = 'home' | 'cloud'

export default function App() {
  const [screen, setScreen] = useState<Screen>('home')
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
      setScreen('cloud')
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

  function goHome() {
    setScreen('home')
    setResult(null)
    setError(null)
  }

  if (screen === 'cloud' && result) {
    return (
      <div className="flex h-dvh flex-col bg-slate-950 text-slate-100">
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-800 px-4 py-3">
          <button
            type="button"
            onClick={goHome}
            className="rounded-md border border-slate-600 bg-slate-900 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-800"
          >
            ← Back
          </button>
          <p className="text-sm text-slate-400">
            <span className="font-medium text-slate-200">{result.words.length}</span> terms —{' '}
            <span className="font-medium text-slate-200">{result.topics.length}</span> topics — drag to
            rotate, scroll to zoom
          </p>
        </header>

        <div className="relative min-h-0 flex-1">
          {/* floating topic list — separate from the 3D cloud (TF-IDF words) */}
          <aside className="absolute left-4 top-4 z-10 max-h-[calc(100%-5rem)] w-72 overflow-y-auto rounded-lg border border-slate-700/90 bg-slate-950/85 p-3 shadow-xl backdrop-blur-md">
            <h2 className="mb-2 border-b border-slate-700 pb-2 text-sm font-semibold text-slate-200">
              Topics (LDA)
            </h2>
            {result.topics.length === 0 ? (
              <p className="text-xs text-slate-500">No separate topics for this page.</p>
            ) : (
              <ul className="space-y-3">
                {result.topics.map((t) => (
                  <li key={t.id} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
                    <p className="text-xs font-medium leading-snug text-sky-300">{t.label}</p>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                      {t.words
                        .slice(0, 12)
                        .map((w) => w.word)
                        .join(' · ')}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          <div className="h-full min-h-0">
            <WordCloud words={result.words} fill />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-12">
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
      </main>
    </div>
  )
}
