"""Sayfadaki tum buton ID ve metinlerini listele"""
import asyncio, sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(headless=True, args=['--no-sandbox'])
        ctx = await browser.new_context(
            viewport={'width':1920,'height':1080},
            user_agent='Mozilla/5.0 Chrome/152.0.0.0',
            locale='tr-TR'
        )
        await ctx.add_init_script("Object.defineProperty(navigator,'webdriver',{get:()=>undefined});")
        page = await ctx.new_page()
        await page.goto('https://www.uskopazar.com/', wait_until='domcontentloaded', timeout=30000)
        await page.wait_for_timeout(5000)
        
        el = page.locator('text=Bugünlük kapat')
        if await el.count() > 0:
            await el.first.click()
            await page.wait_for_timeout(500)

        print("=== ID'li elementler ===")
        all_els = await page.query_selector_all('[id]')
        for e in all_els:
            eid = await e.get_attribute('id') or ''
            txt = (await e.inner_text()).strip()[:50]
            tag = await e.evaluate('el => el.tagName')
            if 'btn' in eid.lower() or 'server' in eid.lower():
                print(f"  id={eid!r} tag={tag} text={txt!r}")

        print("\n=== TUM * metni iceren elementler ===")
        tum_els = await page.query_selector_all('button, span, a, li')
        for e in tum_els:
            txt = (await e.inner_text()).strip()
            if 'TUM' in txt.upper() or 'TÜM' in txt.upper():
                eid = await e.get_attribute('id') or ''
                tag = await e.evaluate('el => el.tagName')
                cls = (await e.get_attribute('class') or '')[:40]
                print(f"  id={eid!r} tag={tag} text={txt[:40]!r} class={cls!r}")

        await browser.close()

asyncio.run(main())
