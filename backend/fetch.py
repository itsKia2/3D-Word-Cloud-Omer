import httpx

# downloads raw html, used by /analyze

DEFAULT_TIMEOUT_SEC = 30.0
DEFAULT_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (compatible; SparrowFetcher/0.1; +https://example.local)"
    ),
}

# just returns error message for now
# may be extended later on
class FetchError(Exception):
    def __init__(self, message: str):
        super().__init__(message)
        self.message = message

def fetch_url(url: str) -> str:
    # uses url to try and fetch html
    # returns html as response 
    # error handling includes timeout, status error, or request error
    u = url.strip()
    if not u.startswith(("http://", "https://")):
        raise FetchError("only http:// and https:// URLs work")

    try:
        with httpx.Client(
            timeout=DEFAULT_TIMEOUT_SEC,
            follow_redirects=True,
        ) as client:
            resp = client.get(u, headers=DEFAULT_HEADERS)
            resp.raise_for_status()
            return resp.text
    except httpx.TimeoutException:
        raise FetchError("request timed out")
    except httpx.HTTPStatusError as e:
        code = e.response.status_code
        raise FetchError(f"server returned HTTP {code}")
    except httpx.RequestError as e:
        raise FetchError(f"could not fetch URL: {e!s}")
