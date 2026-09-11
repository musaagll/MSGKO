"""GitHub Actions workflow'unu manuel tetikle"""
import urllib.request, json, sys

TOKEN = "GITHUB_TOKEN_REMOVEDI4E0cFQC6njp2odpNB"
URL   = "https://api.github.com/repos/musaagll/MSGKO/actions/workflows/market-scraper.yml/dispatches"

req = urllib.request.Request(
    URL,
    data=json.dumps({"ref": "main"}).encode(),
    headers={
        "Authorization": f"Bearer {TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        "Content-Type": "application/json",
        "User-Agent": "MSGKO/1.0",
    },
    method="POST"
)
try:
    with urllib.request.urlopen(req) as r:
        print(f"OK - Status: {r.status}")
except urllib.error.HTTPError as e:
    body = e.read().decode()
    print(f"HATA: {e.code} - {body[:200]}")
