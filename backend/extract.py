import re
from bs4 import BeautifulSoup

# converts html to text that we can read and understand

# strip these tags entirely before taking visible text
TAGS_TO_REMOVE = ("script", "style", "noscript", "meta")


def html_to_text(html: str) -> str:
    # converts html into text using beautifulsoup and lxml
    soup = BeautifulSoup(html, "lxml")

    for name in TAGS_TO_REMOVE:
        for tag in soup.find_all(name):
            tag.decompose()

    raw = soup.get_text(separator=" ")
    # collapse runs of whitespace/newlines
    cleaned = re.sub(r"\s+", " ", raw).strip()
    return cleaned
