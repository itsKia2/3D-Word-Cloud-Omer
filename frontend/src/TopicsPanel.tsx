import type { TopicPayload } from './types'

// this is just how many words we show under the topics
// might reduce later
const PREVIEW_WORDS = 12

type Props = {
  topics: TopicPayload[]
}

export function TopicsPanel({ topics }: Props) {
  return (
    <aside className="absolute left-4 top-4 z-10 max-h-[calc(100%-5rem)] w-72 overflow-y-auto rounded-lg border border-slate-700/90 bg-slate-950/85 p-3 shadow-xl backdrop-blur-md">
      <h2 className="mb-2 border-b border-slate-700 pb-2 text-sm font-semibold text-slate-200">
        Topics (LDA)
      </h2>
      {topics.length === 0 ? (
        <p className="text-xs text-slate-500">No separate topics for this page.</p>
      ) : (
        <ul className="space-y-3">
          {topics.map((t) => (
            <li key={t.id} className="border-b border-slate-800 pb-3 last:border-0 last:pb-0">
              <p className="text-xs font-medium leading-snug text-sky-300">{t.label}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                {t.words
                  .slice(0, PREVIEW_WORDS)
                  .map((w) => w.word)
                  .join(' · ')}
              </p>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
