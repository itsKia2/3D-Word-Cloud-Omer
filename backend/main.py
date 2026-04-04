from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from fetch import FetchError, fetch_url
from extract import html_to_text
from analyze import build_analysis

app = FastAPI(title="3D Word Cloud API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
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


class TopicItem(BaseModel):
    id: int
    label: str
    words: list[WordItem]


class AnalyzeResponse(BaseModel):
    words: list[WordItem]
    topics: list[TopicItem]


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/analyze", response_model=AnalyzeResponse)
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

    raw = build_analysis(text)
    if not raw["words"]:
        raise HTTPException(
            status_code=400,
            detail="could not extract keywords from the page",
        )

    return AnalyzeResponse(
        words=[WordItem(word=w["word"], weight=w["weight"]) for w in raw["words"]],
        topics=[
            TopicItem(
                id=t["id"],
                label=t["label"],
                words=[WordItem(word=w["word"], weight=w["weight"]) for w in t["words"]],
            )
            for t in raw["topics"]
        ],
    )
