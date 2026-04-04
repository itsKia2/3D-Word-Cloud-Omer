from sklearn.feature_extraction.text import TfidfVectorizer

# converts text into ranked keywords 
# the more a word appears in the text, the higher the score

def keywords_from_text(text: str, max_words: int = 50) -> list[tuple[str, float]]:
    cleaned = text.strip()
    if not cleaned:
        return []

    # treat whole article as one piece of text for now
    corpus = [cleaned]

    # english stop words + lowercase - dont rank words like the
    vectorizer = TfidfVectorizer(
        stop_words="english",
        lowercase=True,
    )
    matrix = vectorizer.fit_transform(corpus)

    row = matrix.toarray()[0]
    names = vectorizer.get_feature_names_out()

    # keep only terms that actually appear (score > 0)
    pairs: list[tuple[str, float]] = []
    for i, score in enumerate(row):
        if score > 0:
            pairs.append((str(names[i]), float(score)))

    if not pairs:
        return []

    # highest scores first, cap list length
    pairs.sort(key=lambda x: x[1], reverse=True)
    pairs = pairs[:max_words]

    # scale so the top weight is 1.0 (easy for the 3D UI)
    top = pairs[0][1]
    if top <= 0:
        return []
    out = [(w, s / top) for w, s in pairs]

    return out
