import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'

const OUT = path.resolve('tmp/screenshots')
const BASE = 'http://127.0.0.1:4173'

async function clickContinue(page) {
  await page.getByRole('button', { name: /Pokračovat|Continue/i }).click()
  await page.waitForTimeout(350)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  })
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  })
  await page.goto(BASE, { waitUntil: 'networkidle' })

  // Section 1 — minimal valid path
  await page.locator('#name_of_eltif').fill('Test ELTIF Fund')
  await page.locator('#legal_form').selectOption('SICAV')
  await page.waitForTimeout(200)
  await page.getByRole('radio', { name: /^Ano$|^Yes$/i }).first().check()
  await page.locator('#name_of_depositary').fill('Test Depositary')
  await page.locator('#fund_reference_currency').selectOption('EUR')
  await clickContinue(page)

  // Section 2 duration
  await page.getByRole('radio', { name: /neurčitou|Undetermined/i }).check()
  await clickContinue(page)

  // Section 3 strategy — optional, continue
  await clickContinue(page)

  // Section 4 leverage
  await page.locator('#leverage_borrowing_amount').fill('20')
  await page.locator('#leverage_borrowing_maturity').fill('5 years')
  await page.locator('#leverage_aifmd_commitment_method').fill('1.0')
  await page.locator('#leverage_aifmd_gross_method').fill('1.0')
  await clickContinue(page)

  // Section 5 — add several share class rows
  for (let i = 0; i < 3; i++) {
    await page
      .getByRole('button', { name: /Přidat třídu|Add share class/i })
      .click()
    await page.waitForTimeout(200)
  }
  // Fill first row enough to continue
  const shareClassRadios = page.locator(
    'input[type="radio"][name^="share_classes."][name$=".share_class"]',
  )
  const currencyRadios = page.locator(
    'input[type="radio"][name^="share_classes."][name$=".currency"]',
  )
  // Fill all rows minimally
  const rowCount = await page.locator('[role="group"][aria-labelledby$="-heading"]').count()
  // Simpler: fill via known field ids for index 0..n
  for (let i = 0; i < 4; i++) {
    await page
      .locator(`input[name="share_classes.${i}.share_class"][value="accumulation"]`)
      .check()
      .catch(() => {})
    await page
      .locator(`#share_classes\\.${i}\\.share_class-accumulation`)
      .check()
      .catch(async () => {
        await page
          .locator(`label[for="share_classes.${i}.share_class-accumulation"]`)
          .click()
      })
    await page
      .locator(`label[for="share_classes.${i}.currency-EUR"]`)
      .click()
      .catch(() => {})
    await page
      .locator(`#share_classes\\.${i}\\.minimum_subscription_amount`)
      .fill('1000')
    await page.locator(`#share_classes\\.${i}\\.management_fee`).fill('1.5')
  }

  await page.screenshot({
    path: path.join(OUT, '01-section5-repeaters.png'),
    fullPage: true,
  })
  // Also viewport shot to show sticky left panel
  await page.screenshot({
    path: path.join(OUT, '01-section5-repeaters-viewport.png'),
    fullPage: false,
  })

  await clickContinue(page)

  // Section 6 fees
  await page.locator('#subscription_fee').fill('1')
  await page.locator('#redemption_fee').fill('2')
  await clickContinue(page)

  // Section 7 subscriptions
  await page
    .locator('#subscription_frequency')
    .fill('[first calendar day of each month]')
  await page.locator('#subscription_cut_off_time').fill('5')
  await page.locator('#subscription_payment_date').fill('3')
  await page
    .locator('#nav_calculation_date')
    .fill('[end of the immediately preceding month]')
  await clickContinue(page)

  // Section 8 redemptions + simulation
  await page.locator('#redemption_calibration_method').selectOption('annex_i')
  await page.waitForTimeout(200)
  await page.locator('#redemption_frequency').selectOption('monthly')
  await page.waitForTimeout(200)
  await page.locator('#redemption_notice_period').selectOption('3_months')
  await page.locator('#liquid_assets_amount').fill('1000000')
  await page.locator('#expected_cashflow_12m').fill('200000')
  await page.locator('#redemption_cut_off').fill('5')
  await page
    .locator('#redemption_dealing_date')
    .fill('[first calendar day of each month]')
  await page.locator('#payment_of_redemption_proceeds').fill('5')
  await page
    .locator('label[for="carry_policy-automatic_carry_over"]')
    .click()

  await page.locator('#sim_investor_amount').fill('50000')
  await page.locator('#sim_investor_request_date').fill('2026-03-15')
  await page.locator('#sim_aggregate_demand').fill('150000')
  await page.waitForTimeout(500)

  await page.screenshot({
    path: path.join(OUT, '02-section8-simulation.png'),
    fullPage: true,
  })
  await page.screenshot({
    path: path.join(OUT, '02-section8-simulation-viewport.png'),
    fullPage: false,
  })

  // Measure left panel vs viewport — must stay ~viewport tall, not document tall
  const metrics = await page.evaluate(() => {
    const left = document.querySelector('aside.sticky')
    const rect = left?.getBoundingClientRect()
    return {
      viewportH: window.innerHeight,
      leftH: rect?.height ?? null,
      leftTop: rect?.top ?? null,
      docH: document.documentElement.scrollHeight,
    }
  })
  console.log('layout metrics before scroll', metrics)

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(400)

  const metricsAfter = await page.evaluate(() => {
    const left = document.querySelector('aside.sticky')
    const rect = left?.getBoundingClientRect()
    return {
      viewportH: window.innerHeight,
      leftH: rect?.height ?? null,
      leftTop: rect?.top ?? null,
      scrollY: window.scrollY,
    }
  })
  console.log('layout metrics after scroll', metricsAfter)

  await page.screenshot({
    path: path.join(OUT, '03-section8-scrolled-left-static.png'),
    fullPage: false,
  })

  // Table should be scrollable, not expanding past card
  const tableBox = await page.evaluate(() => {
    const wrap = document.querySelector('.isolate.overflow-x-auto')
    const card = document.querySelector('.rounded-xl.bg-paper')
    if (!wrap || !card) return null
    const w = wrap.getBoundingClientRect()
    const c = card.getBoundingClientRect()
    return {
      wrapW: w.width,
      cardW: c.width,
      wrapOverflow: wrap.scrollWidth > wrap.clientWidth,
    }
  })
  console.log('table containment', tableBox)

  await browser.close()
  console.log('Screenshots written to', OUT)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
