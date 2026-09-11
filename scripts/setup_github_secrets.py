"""GitHub Actions Secrets ayarla"""
import sys, base64, json
import requests
from nacl import encoding, public

GITHUB_TOKEN = os.environ.get('GITHUB_TOKEN', '')
REPO         = "musaagll/MSGKO"
SUPABASE_URL = os.environ.get('SUPABASE_URL', '')
SUPABASE_KEY = os.environ.get('SUPABASE_SERVICE_KEY', '')

HEADERS = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}

def encrypt_secret(public_key_str: str, secret_value: str) -> str:
    """GitHub'ın public key'i ile secret'ı şifrele."""
    pk = public.PublicKey(public_key_str.encode(), encoding.Base64Encoder())
    box = public.SealedBox(pk)
    encrypted = box.encrypt(secret_value.encode())
    return base64.b64encode(encrypted).decode()

def set_secret(name: str, value: str, key_id: str, pub_key: str):
    encrypted = encrypt_secret(pub_key, value)
    r = requests.put(
        f"https://api.github.com/repos/{REPO}/actions/secrets/{name}",
        headers=HEADERS,
        json={"encrypted_value": encrypted, "key_id": key_id},
        timeout=15,
    )
    if r.status_code in (201, 204):
        print(f"  {name} -> OK")
    else:
        print(f"  {name} -> HATA: {r.status_code} {r.text}")

# 1. Public key al
r = requests.get(
    f"https://api.github.com/repos/{REPO}/actions/secrets/public-key",
    headers=HEADERS, timeout=15,
)
r.raise_for_status()
data = r.json()
key_id  = data["key_id"]
pub_key = data["key"]
print(f"Public key alindi (id={key_id})")

# 2. Secrets'lari ayarla
print("\nSecrets ayarlaniyor...")
set_secret("SUPABASE_URL",         SUPABASE_URL, key_id, pub_key)
set_secret("SUPABASE_SERVICE_KEY", SUPABASE_KEY, key_id, pub_key)

print("\nTamamlandi! GitHub Actions artik Supabase'e baglanabilir.")
