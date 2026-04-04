// types so that we can match types from backend /analyze endpoint

export type WordItem = {
  word: string
  weight: number
}

export type AnalyzeResponse = {
  words: WordItem[]
}
