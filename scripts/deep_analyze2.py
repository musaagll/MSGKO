"""
uskopazar.com getItemList tam parametre analizi
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
            user_agent='Mozilla/5.0 Chrome/152.0.0.0',
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
                    rows = len(re.findall(r'<tbody[^>]*>.*?<tr[^>]*>', html, re.DOTALL))
                    if not rows:
                        rows = html.count('<tr')
                    if captured:
                        captured[-1]['_rows'] = rows
                        captured[-1]['_len'] = len(html)
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

        # Zero 3 sec
        await page.evaluate("document.getElementById('btn_zero3').click()")
        await page.wait_for_timeout(3000)

        # 192 kayit
        await page.evaluate("""
            const s=document.getElementById('btn_top_list');
            if(s){s.value='192';s.dispatchEvent(new Event('change',{bubbles:true}));}
        """)
        await page.wait_for_timeout(2000)

        # "shard" ara
        print("'shard' aranıyor...")
        await page.locator('input[placeholder="Search Text"]').fill('shard')
        await page.wait_for_timeout(3000)

        # Temizle, "mirage" ara
        print("'mirage' aranıyor...")
        await page.locator('input[placeholder="Search Text"]').fill('')
        await page.wait_for_timeout(1000)
        await page.locator('input[placeholder="Search Text"]').fill('mirage')
        await page.wait_for_timeout(3000)

        # Upgrade +7
        print("+7 upgrade seciliyor...")
        await page.locator('input[placeholder="Search Text"]').fill('')
        await page.wait_for_timeout(500)
        # Item_Arti select
        all_sels = await page.query_selector_all('select')
        for sel in all_sels:
            opts = await sel.query_selector_all('option')
            texts = [await o.inner_text() for o in opts]
            if any('+' in t for t in texts):
                await page.evaluate("""(sel) => {
                    sel.value = '7';
                    sel.dispatchEvent(new Event('change', {bubbles: true}));
                }""", sel)
                print(f"  Upgrade select bulundu: {texts[:5]}")
                await page.wait_for_timeout(2000)
                break

        # Sayfa 2
        print("Sayfa 2 deneniyor...")
        # JS'deki getItemList fonksiyonunu bul
        fn = await page.evaluate("""() => {
            if(typeof getItemList==='function') return getItemList.toString().slice(0,2000);
            // window objesinde tara
            for(const k in window){
                if(typeof window[k]==='function' && window[k].toString().includes('pageCount')){
                    return k + ': ' + window[k].toString().slice(0,500);
                }
            }
            return 'NOT FOUND';
        }""")
        print(f"\ngetItemList fonksiyonu:\n{fn[:600]}")

        # Global degiskenler
        gvars = await page.evaluate("""() => {
            const keys = ['pageCount','limitType','serverType','searchValue',
                          'orderType','merchantType','Item_Arti','itemType',
                          'minVal','maxVal','tarih','searchType','weaponChecked'];
            const r={};
            keys.forEach(k=>{if(typeof window[k]!=='undefined')r[k]=window[k];});
            return r;
        }""")
        print(f"\nGlobal degiskenler: {json.dumps(gvars, ensure_ascii=False)}")

        # Tum select elementlerini listele
        print("\nTum select elementleri:")
        sels = await page.query_selector_all('select')
        for i, sel in enumerate(sels):
            sid = await sel.get_attribute('id') or ''
            sname = await sel.get_attribute('name') or ''
            opts = await sel.query_selector_all('option')
            opt_vals = [(await o.get_attribute('value'), (await o.inner_text()).strip()) for o in opts[:5]]
            print(f"  [{i}] id={sid} name={sname} opts={opt_vals}")

        # Yakalanan istekler
        print(f"\n=== {len(captured)} ISTEK YAKALANDI ===")
        for i, req in enumerate(captured):
            rows = req.get('_rows', '?')
            length = req.get('_len', '?')
            filtered = {k:v for k,v in req.items() if not k.startswith('_') and v not in ('','0','false',None,'0.00')}
            print(f"\n[{i+1}] rows~{rows} html_len={length}")
            print(f"  {json.dumps(filtered, ensure_ascii=False)}")

        await browser.close()

asyncio.run(main())
