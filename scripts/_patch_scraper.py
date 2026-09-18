"""scrape_market.py içindeki sb_delete/sb_insert bloğunu güncelle"""
import re

with open('scripts/scrape_market.py', 'r', encoding='utf-8') as f:
    content = f.read()

old = """    # Supabase \u2014 DELETE + INSERT (temiz veri)
    if all_listings:
        t0 = time.time()
        sb_delete(db_key)
        n = sb_insert(all_listings)"""

new = """    # Supabase — ASC: DELETE+INSERT, DESC: sadece INSERT (pahalı itemlar biriksin)
    if all_listings:
        t0 = time.time()
        if order_type == 0:
            log.info(f'[{db_key}] ASC modu: DELETE + INSERT')
            sb_delete(db_key)
        else:
            log.info(f'[{db_key}] DESC modu: sadece INSERT (birikim)')
        n = sb_insert(all_listings)"""

# Encoding-agnostic replace
content_new = content.replace(
    "    # Supabase \u00e2\u20ac\u201d DELETE + INSERT (temiz veri)\n    if all_listings:\n        t0 = time.time()\n        sb_delete(db_key)\n        n = sb_insert(all_listings)",
    new
)

if content_new == content:
    # try alternate
    content_new = re.sub(
        r'    # Supabase .{0,10} DELETE \+ INSERT.*?\n    if all_listings:\n        t0 = time\.time\(\)\n        sb_delete\(db_key\)\n        n = sb_insert\(all_listings\)',
        new,
        content,
        flags=re.DOTALL
    )

if content_new != content:
    with open('scripts/scrape_market.py', 'w', encoding='utf-8') as f:
        f.write(content_new)
    print("Basariyla degistirildi")
else:
    print("Degistirilemedi, manuel bakis gerekli")
    # ham bul
    idx = content.find("sb_delete(db_key)")
    print(f"sb_delete satir yakini: {repr(content[max(0,idx-100):idx+50])}")
