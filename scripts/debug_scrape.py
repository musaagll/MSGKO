"""
Adim adim debug - 96 kayit secimi ve satir parse testi
"""
import asyncio, os, json, re
from playwright.async_api import async_playwright, TimeoutError as PWTimeout

_base = os.path.dirname(os.path.abspath(__file__))

def parse_price(raw):
    cleaned = re.sub(r'[^\d]', '', str(raw))
    return int(cleaned) if cleaned else None

def parse_upgrade(text):
    m = re.search(r'\(\+(\d+)\)', text)
    if m:
        return text[:m.start()].strip(), int(m.group(1))
    return text.strip(), None

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/152.0.0.0 Safari/537.36',
            locale='tr-TR',
        )
        await ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = await ctx.new_page()

        print("1. Sayfa aciliyor...")
        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(5000)

        # Modal kapat
        for sel in ['text=Bugünlük kapat']:
            el = page.locator(sel)
            if await el.count() > 0:
                await el.first.click()
                await page.wait_for_timeout(800)
                print("  Modal kapatildi")
                break

        print("2. Sayfa hazir, satirlar kontrol ediliyor (varsayilan durum)...")
        rows = await page.query_selector_all('tbody tr')
        print(f"  Varsayilan satir sayisi: {len(rows)}")
        if rows:
            row0 = rows[0]
            cells = await row0.query_selector_all('td')
            texts = [(await c.inner_text()).strip() for c in cells]
            print(f"  Ilk satir hucreleri: {texts[:4]}")
            spans3 = await cells[3].query_selector_all('span')
            print(f"  [3] Ucret spans: {[(await s.inner_text()).strip() for s in spans3]}")
            img = await cells[0].query_selector('img')
            print(f"  [0] img src: {await img.get_attribute('src') if img else 'YOK'}")

        print("\n3. ZERO 3 seciliyor...")
        zero3 = page.locator('button:has-text("ZERO 3"), span:has-text("ZERO 3")')
        if await zero3.count() > 0:
            await zero3.first.evaluate('el => el.click()')
            await page.wait_for_timeout(3000)
            rows_after = await page.query_selector_all('tbody tr')
            print(f"  ZERO 3 sonrasi satir sayisi: {len(rows_after)}")
        else:
            print("  ZERO 3 butonu bulunamadi!")

        print("\n4. Kayit sayisi dropdown'u bulunuyor...")
        # Tum select elementlerini listele
        selects = await page.query_selector_all('select')
        print(f"  Select sayisi: {len(selects)}")
        for i, sel in enumerate(selects):
            options = await sel.query_selector_all('option')
            opt_texts = [(await o.inner_text()).strip() for o in options]
            print(f"  Select[{i}]: {opt_texts[:6]}")

        # "24 Kayit" yazan elementi bul
        kayit_els = page.locator('*:has-text("24 Kayıt")')
        count = await kayit_els.count()
        print(f"  '24 Kayit' elementi sayisi: {count}")
        for i in range(min(count, 5)):
            el = kayit_els.nth(i)
            tag = await el.evaluate('el => el.tagName')
            cls = await el.get_attribute('class') or ''
            print(f"    [{i}] tag={tag} class={cls[:40]}")

        print("\n5. 96 kayit secmeyi deniyoruz...")
        # Kayit boyutunu degistir — onceki calisan yontemi kullan
        # select[option] varsa dogrudan sec
        for sel_el in selects:
            options = await sel_el.query_selector_all('option')
            for opt in options:
                t = (await opt.inner_text()).strip()
                if '96' in t:
                    val = await opt.get_attribute('value') or '96'
                    await page.evaluate(
                        '''(args) => {
                            const sel = args[0];
                            sel.value = args[1];
                            sel.dispatchEvent(new Event('change', {bubbles: true}));
                        }''',
                        [sel_el, val]
                    )
                    print(f"  96 kayit secildi (value={val})")
                    await page.wait_for_timeout(3000)
                    break

        # Satirlari tekrar kontrol et
        rows_96 = await page.query_selector_all('tbody tr')
        print(f"  96 kayit sonrasi satir sayisi: {len(rows_96)}")

        # Screenshot
        await page.screenshot(path=os.path.join(_base, 'debug_96.png'))
        print("  Screenshot: debug_96.png")

        if rows_96:
            print("\n6. Ilk 3 satir detayli parse:")
            for i, row in enumerate(rows_96[:3]):
                cells = await row.query_selector_all('td')
                if len(cells) < 4:
                    continue

                # [0] item adi + img
                img = await cells[0].query_selector('img')
                img_url = await img.get_attribute('src') if img else None
                spans0 = await cells[0].query_selector_all('span')
                names = [(await s.inner_text()).strip() for s in spans0 if (await s.inner_text()).strip()]

                # [1] satici
                seller = (await cells[1].inner_text()).strip()

                # [2] lokasyon (koordinat)
                lokasyon = (await cells[2].inner_text()).strip()

                # [3] ucret
                spans3 = await cells[3].query_selector_all('span')
                ucret_spans = [(await s.inner_text()).strip() for s in spans3]
                cell3_text = (await cells[3].inner_text()).strip()

                # Fiyat - ilk span'dan al
                fiyat_raw = ucret_spans[0] if ucret_spans else cell3_text.split('\n')[0]
                fiyat = parse_price(fiyat_raw)

                # Item adi
                raw_name = names[0] if names else ''
                item_name, upgrade = parse_upgrade(raw_name)

                print(f"\n  Satir {i+1}:")
                print(f"    Item: '{item_name}' upgrade={upgrade}")
                print(f"    IMG: {img_url}")
                print(f"    Satici: '{seller}'")
                print(f"    Lokasyon (koordinat): '{lokasyon}'")
                print(f"    Ucret spans: {ucret_spans}")
                print(f"    Fiyat parse: {fiyat}")
                print(f"    -1 fiyat: {fiyat-1 if fiyat else None}")

        print("\n7. Pagination kontrol:")
        # Sayfa bilgisi
        page_info = page.locator('[class*="page"]')
        pg_count = await page_info.count()
        print(f"  page class elementi: {pg_count}")
        for i in range(min(pg_count, 10)):
            el = page_info.nth(i)
            t = (await el.inner_text()).strip()
            tag = await el.evaluate('el => el.tagName')
            if t:
                print(f"    [{i}] {tag}: '{t[:30]}'")

        await browser.close()

asyncio.run(main())
