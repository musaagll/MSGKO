import urllib.request, json

TOKEN = "GITHUB_TOKEN_REMOVEDI4E0cFQC6njp2odpNB"

def gh(path):
    req = urllib.request.Request(
        f"https://api.github.com{path}",
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "MSGKO/1.0"
        }
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

runs = gh("/repos/musaagll/MSGKO/actions/runs?per_page=5")["workflow_runs"]
print("Son 5 run:")
for r in runs:
    print(f"  #{r['run_number']} | {r['status']:12} | {r['conclusion'] or '':10} | {r['created_at']}")
    print(f"         {r['html_url']}")
