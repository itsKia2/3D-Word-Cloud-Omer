import re
from bs4 import BeautifulSoup

# converts html to text that we can read and understand

# strip these tags entirely before taking visible text
TAGS_TO_REMOVE = ("script", "style", "noscript", "meta")


def html_to_text(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")

    for name in TAGS_TO_REMOVE:
        for tag in soup.find_all(name):
            tag.decompose()

    # one string per <p>, joined with blank lines 
    # needed for lda chunks otherwise it is one big string
    paras: list[str] = []
    for p in soup.find_all("p"):
        t = " ".join(p.get_text().split())
        if t:
            paras.append(t)

    if len(paras) >= 2:
        return "\n\n".join(paras)

    raw = soup.get_text(separator=" ")
    return re.sub(r"\s+", " ", raw).strip()
