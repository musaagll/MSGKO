"""
uskopazar.com tam sistem analizi:
- Arama (searchValue)
- Item tipi filtresi
- Upgrade filtresi (Item_Arti)
- Toplam ilan sayısı (tüm kanallar)
- Sayfalama (pageCount)
- Tüm parametreler
"""
import asyncio, sys, io, re, json
from urllib.parse import unquote_plus
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

captured = []

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(
            viewport={'width':1920,'height':1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36',
            locale='tr-TR',
        )
        await ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = await ctx.new_page()

        async def on_request(req):
            if 'getItemList' in req.url:
                body = req.post_data or ''
                params = {}
                for part in body.split('&'):
                    if '=' in part:
                        k, _, v = part.partition('=')
                        params[k] = unquote_plus(v)
                captured.append(params.copy())

        async def on_response(resp):
            if 'getItemList' in resp.url and resp.status == 200:
                try:
                    html = await resp.text()
                    rows = len(re.findall(r'<tr[^>]*>', html))
                    if captured:
                        captured[-1]['_response_rows'] = rows
                        captured[-1]['_response_len'] = len(html)
                except:
                    pass

        page.on('request', on_request)
        page.on('response', on_response)

        print("Sayfa yukleniyor...")
        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(5000)

        el = page.locator('text=Bugünlük kapat')
        if await el.count() > 0:
            await el.first.click()
            await page.wait_for_timeout(500)

        # ── Test 1: Zero 3, varsayilan (24 kayit) ────────────────────────────
        print("\n[Test 1] Zero 3 varsayilan")
        await page.evaluate("document.getElementById('btn_zero3').click()")
        await page.wait_for_timeout(3000)

        # ── Test 2: 192 kayit sec ─────────────────────────────────────────────
        print("[Test 2] 192 kayit")
        await page.evaluate("""
            const s = document.getElementById('btn_top_list');
            if(s){s.value='192';s.dispatchEvent(new Event('change',{bubbles:true}));}
        """)
        await page.wait_for_timeout(3000)

        # ── Test 3: "shard" ara ────────────────────────────────────────────────
        print("[Test 3] 'shard' arama")
        search = page.locator('input[placeholder="Search Text"]')
        await search.fill('shard')
        await page.wait_for_timeout(3000)

        # ── Test 4: shard temizle, "mirage dagger" ara ───────────────────────
        print("[Test 4] 'mirage dagger' arama")
        await search.fill('')
        await page.wait_for_timeout(1000)
        await search.fill('mirage dagger')
        await page.wait_for_timeout(3000)

        # ── Test 5: Upgrade +7 sec ────────────────────────────────────────────
        print("[Test 5] upgrade +7 filtresi")
        await search.fill('')
        await page.wait_for_timeout(1000)
        # Upgrade dropdown'u bul
        upgrade_sel = await page.query_selector_all('select')
        for sel in upgrade_sel:
            opts = await sel.query_selector_all('option')
            opt_texts = [(await o.get_attribute('value'), await o.inner_text()) for o in opts]
            if any('+' in t[1] or 'Arti' in t[1] for t in opt_texts):
                print(f"  Upgrade select options: {opt_texts[:10]}")
                await page.evaluate(f"""
                    arguments[0].value='7';
                    arguments[0].dispatchEvent(new Event('change',{{bubbles:true}}));
                """, sel)
                await page.wait_for_timeout(2000)
                break

        # ── Test 6: Sayfa 2'ye gec ────────────────────────────────────────────
        print("[Test 6] Sayfa 2")
        # pageCount parametresi nasil degisiyor?
        # Pagination elementlerini bul
        pag = await page.query_selector_all('[class*="page"], [class*="paginat"]')
        page2_btn = None
        for el in pag:
            t = (await el.inner_text()).strip()
            if t == '2':
                page2_btn = el
                break
        if page2_btn:
            await page2_btn.click()
            await page.wait_for_timeout(2000)
            print("  Sayfa 2'ye gecildi")
        else:
            # Manuel olarak pageCount=2 gonder
            print("  Pagination butonu bulunamadi, JS ile dene")
            await page.evaluate("""
                // pageCount degiskenini bul ve artir
                if(typeof pageCount !== 'undefined') {
                    pageCount = 2;
                    getItemList();
                }
            """)
            await page.wait_for_timeout(2000)

        # ── Tum yakalanan istekleri goster ────────────────────────────────────
        print(f"\n=== YAKALANAN {len(captured)} ISTEK ===")
        for i, req in enumerate(captured):
            print(f"\n[{i+1}] rows={req.get('_response_rows','?')} len={req.get('_response_len','?')}")
            for k,v in req.items():
                if not k.startswith('_') and v not in ('', '0', 'false', None):
                    print(f"  {k}={v}")

        # ── JS degiskenlerini incele ──────────────────────────────────────────
        print("\n=== JS GLOBAL DEGISKENLER ===")
        try:
            js_vars = await page.evaluate("""() => {
                const result = {};
                ['pageCount','limitType','serverType','searchValue','orderType',
                 'merchantType','Item_Arti','fingerprint','req_token'].forEach(k => {
                    if(typeof window[k] !== 'undefined') result[k] = window[k];
                });
                return result;
            }""")
            print(json.dumps(js_vars, ensure_ascii=False, indent=2))
        except Exception as e:
            print(f"JS vars hatasi: {e}")

        # ── getItemList fonksiyonunu bul ──────────────────────────────────────
        print("\n=== GETITEMLIST FONKSIYON PARAMETRELERI ===")
        try:
            fn_str = await page.evaluate("""() => {
                if(typeof getItemList === 'function') return getItemList.toString().substring(0,1000);
                return 'NOT FOUND';
            }""")
            print(fn_str[:800])
        except:
            pass

        await browser.close()

asyncio.run(main())
