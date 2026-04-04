from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from fetch import FetchError, fetch_url
from extract import html_to_text
from analyze import keywords_from_text

# default port is 8000

app = FastAPI(title="3D Word Cloud API")

# allow requests from frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    url: str = Field(..., description="article URL to analyze")

class WordItem(BaseModel):
    word: str
    weight: float

class WordResponse(BaseModel):
    words: list[WordItem]

@app.get("/health")
def health():
    return {"ok": True}

# here is POST /analyze endpoint
# weights are between 0-1 (stub until TF-IDF in a later phase)
@app.post("/analyze", response_model=WordResponse)
def analyze(body: AnalyzeRequest):
    try:
        html = fetch_url(body.url)
    except FetchError as e:
        raise HTTPException(status_code=400, detail=e.message)

    text = html_to_text(html)
    if not text:
        raise HTTPException(
            status_code=400,
            detail="no text could be extracted from the page",
        )

    words = keywords_from_text(text)
    return WordResponse(words=[
        WordItem(word=word, weight=weight) for word, weight in words])