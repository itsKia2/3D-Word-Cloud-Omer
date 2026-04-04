export type WordItem = {
  word: string
  weight: number
}

export type TopicPayload = {
  id: number
  label: string
  words: WordItem[]
}

export type AnalyzeResponse = {
  // word cloud
  words: WordItem[]
  // topics in floating panel
  topics: TopicPayload[]
}
