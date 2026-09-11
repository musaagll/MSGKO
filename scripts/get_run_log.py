"""Run #8 log detaylarini cek"""
import urllib.request, json

TOKEN  = "GITHUB_TOKEN_REMOVEDI4E0cFQC6njp2odpNB"
RUN_ID = "34621222106"

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

# Job detayları
jobs = gh(f"/repos/musaagll/MSGKO/actions/runs/{RUN_ID}/jobs")
for job in jobs["jobs"]:
    print(f"\nJob: {job['name']} | {job['status']} | {job['conclusion']}")
    print(f"Baslangic: {job['started_at']} | Bitis: {job['completed_at']}")
    print("Steps:")
    for step in job["steps"]:
        icon = "OK" if step["conclusion"] == "success" else ("FAIL" if step.get("conclusion") == "failure" else "SKIP")
        dur = ""
        if step.get("started_at") and step.get("completed_at"):
            from datetime import datetime
            s = datetime.fromisoformat(step["started_at"].replace("Z", "+00:00"))
            e = datetime.fromisoformat(step["completed_at"].replace("Z", "+00:00"))
            dur = f" ({int((e-s).total_seconds())}sn)"
        print(f"  [{icon}] {step['name']}{dur}")
