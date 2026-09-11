"""GitHub Actions run durumunu izle ve log'u goster"""
import urllib.request, json, time, sys

TOKEN = "GITHUB_TOKEN_REMOVEDI4E0cFQC6njp2odpNB"
REPO  = "musaagll/MSGKO"

def gh(path):
    req = urllib.request.Request(
        f"https://api.github.com{path}",
        headers={
            "Authorization": f"Bearer {TOKEN}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "MSGKO/1.0",
        }
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

# En yeni run'ı bul (30 sn içinde başlamalı)
print("Run bekleniyor...")
time.sleep(15)

target_run = None
for attempt in range(40):
    runs = gh(f"/repos/{REPO}/actions/runs?per_page=5")["workflow_runs"]
    # En yeni in_progress veya queued run'ı bul
    for run in runs:
        if run["status"] in ("in_progress", "queued", "waiting"):
            target_run = run
            break
    if target_run:
        print(f"Run bulundu: #{target_run['run_number']} - {target_run['created_at']}")
        break
    print(f"  [{attempt+1}] Bekliyor... (son run: {runs[0]['status']} {runs[0]['created_at']})")
    time.sleep(20)

if not target_run:
    # En yeni run al
    runs = gh(f"/repos/{REPO}/actions/runs?per_page=1")["workflow_runs"]
    target_run = runs[0]
    print(f"En yeni run: #{target_run['run_number']}")

# Bitene kadar izle
print(f"\nRun #{target_run['run_number']} izleniyor...")
for i in range(50):
    time.sleep(20)
    run = gh(f"/repos/{REPO}/actions/runs/{target_run['id']}")
    print(f"  [{i+1}] {run['status']} | {run.get('conclusion','')}")
    if run["status"] == "completed":
        print(f"\nSONUC: {run['conclusion'].upper()}")
        print(f"URL: {run['html_url']}")
        
        # Job log'unu cek
        jobs = gh(f"/repos/{REPO}/actions/runs/{target_run['id']}/jobs")
        for job in jobs["jobs"]:
            print(f"\nJob: {job['name']} - {job['conclusion']}")
            for step in job["steps"]:
                icon = "OK" if step["conclusion"] == "success" else ("FAIL" if step.get("conclusion") == "failure" else "...")
                print(f"  [{icon}] {step['name']}")
        break
