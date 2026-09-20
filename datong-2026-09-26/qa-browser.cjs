const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const url = 'http://127.0.0.1:50223/index.html';
  const result = { tested_url: url, desktop: {}, mobile: {}, interactions: {} };

  const desktopPage = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
  await desktopPage.goto(url, { waitUntil: 'networkidle' });
  result.desktop = await desktopPage.evaluate(() => ({
    inner_width: innerWidth,
    inner_height: innerHeight,
    horizontal_overflow: document.documentElement.scrollWidth > innerWidth,
    cover_visible: !!document.querySelector('.hero'),
    contents_present: !!document.querySelector('#contents')
  }));
  const disclosure = desktopPage.locator('details.day').first();
  await disclosure.locator(':scope > summary').click();
  const disclosureOpened = await disclosure.getAttribute('open') !== null;
  await disclosure.locator(':scope > summary').click();
  const disclosureClosed = await disclosure.getAttribute('open') === null;
  result.interactions.disclosures = disclosureOpened && disclosureClosed;
  await desktopPage.screenshot({ path: 'work/datong-2026-09-26/qa/browser-desktop.png', fullPage: false });

  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  await mobilePage.goto(url, { waitUntil: 'networkidle' });
  result.mobile = await mobilePage.evaluate(() => ({
    inner_width: innerWidth,
    inner_height: innerHeight,
    horizontal_overflow: document.documentElement.scrollWidth > innerWidth,
    match_media_mobile: matchMedia('(max-width: 560px)').matches,
    sight_cards: document.querySelectorAll('#sights .sight-card, #sights article').length
  }));
  await mobilePage.locator('#sights').scrollIntoViewIfNeeded();
  await mobilePage.locator('.trip-mode-launch').click();
  const tripOpened = await mobilePage.locator('.trip-mode-overlay').isVisible();
  const dayButtons = mobilePage.locator('.trip-mode-day');
  const before = await mobilePage.locator('.trip-mode-intro h2').innerText();
  await dayButtons.nth(1).click();
  const after = await mobilePage.locator('.trip-mode-intro h2').innerText();
  const stopCount = await mobilePage.locator('.trip-stop-list > *').count();
  result.interactions.trip_mode = tripOpened;
  result.interactions.trip_day_switch = before !== after && stopCount > 0;
  result.mobile.trip_day_before = before;
  result.mobile.trip_day_after = after;
  result.mobile.trip_day_stop_count = stopCount;
  await mobilePage.screenshot({ path: 'work/datong-2026-09-26/qa/browser-mobile.png', fullPage: false });
  await mobilePage.locator('.trip-mode-close').click();
  result.interactions.trip_mode_closed = !(await mobilePage.locator('.trip-mode-overlay').count());

  await browser.close();
  process.stdout.write(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
