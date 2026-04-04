from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# default port is 8000

app = FastAPI(title="3D Word Cloud API")

# allow requests from frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
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
# weights are between 0-1
@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(body: AnalyzeRequest):
    # TODO: replace with real data later on
    _ = body.url
    return WordResponse(
        words=[
            WordItem(word="stub", weight=1.0),
            WordItem(word="demo", weight=0.5),
            WordItem(word="topic", weight=0.25),
        ]
    )