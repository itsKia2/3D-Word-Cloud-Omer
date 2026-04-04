import re

import numpy as np
from sklearn.decomposition import LatentDirichletAllocation
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer

# if i increase max para then we can get more topics
MAX_PARAGRAPHS = 4
MIN_PARAGRAPH_CHARS = 50

# limited right now, experiment later
CLOUD_WORDS = 50
TOPIC_WORDS = 36
RANDOM_STATE = 0

def split_paragraphs(text: str) -> list[str]:
    raw = text.strip()
    if not raw:
        return []

    parts = re.split(r"\n\s*\n+", raw)
    chunks: list[str] = []
    for p in parts:
        s = " ".join(p.split())
        if len(s) >= MIN_PARAGRAPH_CHARS:
            chunks.append(s)

    if not chunks:
        single = " ".join(raw.split())
        if len(single) >= 10:
            return [single]
        return []

    return chunks[:MAX_PARAGRAPHS]


def _normalize_top_pairs(pairs: list[tuple[str, float]], cap: int) -> list[tuple[str, float]]:
    if not pairs:
        return []
    pairs.sort(key=lambda x: x[1], reverse=True)
    pairs = pairs[:cap]
    top = pairs[0][1]
    if top <= 0:
        return []
    return [(w, s / top) for w, s in pairs]


def keywords_from_text(text: str, max_words: int = CLOUD_WORDS) -> list[tuple[str, float]]:
    cleaned = text.strip()
    if not cleaned:
        return []

    vectorizer = TfidfVectorizer(stop_words="english", lowercase=True)
    matrix = vectorizer.fit_transform([cleaned])
    row = matrix.toarray()[0]
    names = vectorizer.get_feature_names_out()

    pairs: list[tuple[str, float]] = []
    for i, score in enumerate(row):
        if score > 0:
            pairs.append((str(names[i]), float(score)))

    return _normalize_top_pairs(pairs, max_words)


def lda_topics_from_paragraphs(chunks: list[str], max_topics: int = 4, words_per_topic: int = TOPIC_WORDS):
    K = min(max_topics, len(chunks))
    if K < 1:
        return []

    vectorizer = CountVectorizer(
        stop_words="english",
        lowercase=True,
        max_features=3000,
        max_df=0.95,
        min_df=1,
    )
    X = vectorizer.fit_transform(chunks)
    names = vectorizer.get_feature_names_out()

    if X.shape[1] < 2:
        return []

    lda = LatentDirichletAllocation(
        n_components=K,
        random_state=RANDOM_STATE,
        max_iter=40,
    )
    lda.fit(X)

    out: list[tuple[str, list[tuple[str, float]]]] = []
    for k in range(K):
        comp = lda.components_[k]
        idx = np.argsort(-comp)[:words_per_topic]
        raw_pairs = [(str(names[i]), float(comp[i])) for i in idx if comp[i] > 0]
        pairs = _normalize_top_pairs(raw_pairs, words_per_topic)
        top3 = [p[0] for p in pairs[:3]]
        label = f"Topic {k + 1}: {', '.join(top3)}" if top3 else f"Topic {k + 1}"
        out.append((label, pairs))

    return out


def build_topics(full_text: str) -> list[dict]:
    chunks = split_paragraphs(full_text)
    if not chunks:
        return []

    if len(chunks) == 1:
        pairs = keywords_from_text(chunks[0], max_words=TOPIC_WORDS)
        if not pairs:
            return []
        return [
            {
                "id": 0,
                "label": "Article",
                "words": [{"word": w, "weight": wt} for w, wt in pairs],
            }
        ]

    topics = lda_topics_from_paragraphs(chunks, max_topics=min(4, len(chunks)))
    if not topics:
        pairs = keywords_from_text(full_text, max_words=TOPIC_WORDS)
        if not pairs:
            return []
        return [
            {
                "id": 0,
                "label": "Article",
                "words": [{"word": w, "weight": wt} for w, wt in pairs],
            }
        ]

    clusters: list[dict] = []
    for i, (label, pairs) in enumerate(topics):
        if not pairs:
            continue
        clusters.append(
            {
                "id": i,
                "label": label,
                "words": [{"word": w, "weight": wt} for w, wt in pairs],
            }
        )

    return clusters


def build_analysis(full_text: str) -> dict:
    # creates single word cloud but multiple topics
    words_pairs = keywords_from_text(full_text, max_words=CLOUD_WORDS)
    topics_raw = build_topics(full_text)

    if not words_pairs:
        return {"words": [], "topics": []}

    return {
        "words": [{"word": w, "weight": wt} for w, wt in words_pairs],
        "topics": topics_raw,
    }
