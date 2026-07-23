# ELTIF Term Sheet — Azure Backend Reference

Reference for the Azure Function (`create_pdf`) that receives the frontend submit payload, generates a bilingual PDF, and emails it to the contact person.

Authoritative field semantics: [`ELTIF_Field_Model_FINAL.md`](./ELTIF_Field_Model_FINAL.md).  
Payload builder (source of truth for shape): `src/lib/api/buildPayload.ts`.  
Enum keys: `src/constants/enums.ts`.

---

## What the form does

The web app is a **multi-step ELTIF term sheet wizard** (CZ / EN) for a **Czech retail-only ELTIF** (SICAV or open-ended mutual fund / OPF).

On final submit it:

1. Validates all steps (including an in-browser redemptions **simulation** used only as a UI teaching tool).
2. Computes derived redemption and portfolio values (RTS 2024/2759 tables, eligible %).
3. POSTs a JSON payload to the Azure Function — a **summary of principal terms** (fund structuring choices), not the simulation scenario.
4. Expects the Function to **generate a PDF** (locale from the request) and **email it** to `contact.email` / legacy `form_data.email`.

The frontend does **not** generate the PDF. The in-browser redemptions simulation stays in the UI only and is **not** included in the submit payload (aligned with EHP-style term-sheet PDFs: principal terms + disclaimer, no worked payout schedule).

---

## HTTP contract (current testing envelope)

```http
POST /api/create_pdf
Content-Type: application/json
x-functions-key: <function key>
```

### Outer envelope (WordPress-compatible wrapper)

```json
{
  "form_data": { /* nested term sheet — see below */ },
  "language": "cs",
  "locale": "cs_CZ",
  "email": "user@example.com"
}
```

| Key | Type | Notes |
|---|---|---|
| `form_data` | object | Full nested payload (`meta`, `fund`, …). Also mirrored fields for legacy. |
| `language` | `"cs"` \| `"en"` | Short UI language. |
| `locale` | `"cs_CZ"` \| `"en_US"` | Full locale for PDF / email i18n. |
| `form_data.email` | string | **Legacy:** duplicated from `form_data.contact.email` so older Function code `form_data.get("email")` still works. Prefer `form_data.contact.email`. |

**Suggested Function resolution:**

```python
form_data = body["form_data"]
locale = body.get("locale") or body.get("language") or "en"
contact = form_data.get("contact") or {}
recipient = form_data.get("email") or contact.get("email")
```

### Expected Function behaviour

| Step | Action |
|---|---|
| 1 | Parse JSON; require `form_data` and recipient email. |
| 2 | Pick PDF / email strings from `locale` / `language` (`cs` vs `en`). |
| 3 | Render PDF from structured sections (fund → contact + portfolio + redemptions). |
| 4 | Email PDF to recipient. |
| 5 | Return **HTTP 200** on success (plain text or `{ "ok": true }` both work for the UI today). Non-200 → user sees a generic retry message. |

---

## Wizard sections → payload keys

Order matches the UI wizard. Field-model section numbers are from `ELTIF_Field_Model_FINAL.md`.

| Wizard step | Payload key | Field model | Responsibility |
|---|---|---|---|
| 1 Fund | `fund` | §1 Základní údaje | Legal wrapper, managers, depositary, reference currency |
| 2 Duration | `duration` | §2 Doba trvání | Undetermined vs limited life |
| 3 Strategy | `strategy` | §3 Investiční strategie | IOAS text, UCITS/eligible limits, SFDR, ramp-up |
| 4 Leverage | `investors_leverage` | §4 Cíloví investoři a páka | Retail-only + borrowing / AIFMD leverage |
| 5 Share classes | `share_classes` | §5 Třídy podílů | Repeater: accumulation/distribution classes |
| 6 Fees | `fees` | §6 Vstupní/výstupní poplatky | Subscription / redemption fee + anti-dilution tools |
| 7 Subscriptions | `subscriptions` | §7 Úpisy | Frequency, cut-off, payment, NAV date |
| 8 Redemptions | `redemptions` | §8 Odkupy | Calibration, capacity, terms (no simulation) |
| 9 Portfolio | `portfolio` | §10 Portfolio | Asset classes + capital/NAV + derived % |
| 10 Contact | `contact` | §9 Kontakt | Recipient for PDF + GDPR consent |

Plus top-level `meta` (not a wizard step).

---

## Top-level payload (`form_data`)

```ts
{
  meta: { ... },
  fund: { ... },
  duration: { ... },
  strategy: { ... },
  investors_leverage: { ... },
  share_classes: [ ... ],
  fees: { ... },
  subscriptions: { ... },
  redemptions: { ... },
  contact: { ... },
  portfolio: { ... },
  email?: string   // legacy duplicate of contact.email
}
```

`schemaVersion` is currently `"1.0"`.

---

## Section details

### `meta`

| Field | Type | Notes |
|---|---|---|
| `locale` | `"cs"` \| `"en"` | PDF / copy language |
| `submittedAt` | ISO-8601 string | UTC timestamp |
| `schemaVersion` | `"1.0"` | Bump when breaking shape |

---

### `fund` — §1 Fund basics

| Field | Type | Values / notes |
|---|---|---|
| `name_of_eltif` | string | Required |
| `legal_form` | string | `"SICAV"` \| `"OPF"` — main branching |
| `self_managed` | boolean \| null | Only when SICAV; else `null` |
| `name_of_aifm` | string \| null | SICAV + not self-managed |
| `name_of_management_company` | string \| null | OPF only |
| `name_of_investment_manager` | string \| null | Optional |
| `name_of_administrator` | string \| null | Optional |
| `name_of_depositary` | string | Required |
| `fund_reference_currency` | string | `"CZK"` \| `"EUR"` \| `"USD"` |

**PDF hint:** SICAV → investment shares; OPF → units. Self-managed vs external AIFM changes the narrative sentence.

---

### `duration` — §2

| Field | Type | Values |
|---|---|---|
| `duration` | string | `"undetermined"` \| `"limited"` |
| `duration_limited_to` | number \| null | Years; only when `limited` |

---

### `strategy` — §3

| Field | Type | Notes |
|---|---|---|
| `strategy_ioas` | string \| null | Free text IOAS |
| `strategy_tatuea` | number | Target UCITS-eligible allocation % (cap 45) |
| `strategy_ilseeia` | number | Single eligible asset limit % (cap 20) |
| `strategy_ilsuea` | number | Single UCITS issuer limit % (cap 10) |
| `strategy_apac` | string \| null | Extra allocation notes |
| `strategy_ramp_up_period` | string \| null | `"less_than_1"` \| `"1"` … `"5"` |
| `sfdr_category` | string \| null | `"6"` \| `"8"` \| `"9"` |

Retail ELTIF: ≥ 55 % capital in eligible assets ⇒ UCITS sleeve ≤ 45 %.

---

### `investors_leverage` — §4

| Field | Type | Notes |
|---|---|---|
| `target_investors` | string | Always `"retail"` (locked) |
| `leverage_borrowing_amount` | number | % of NAV; max 50 |
| `leverage_borrowing_maturity` | string | Free text |
| `leverage_aifmd_commitment_method` | string | Free text / figure |
| `leverage_aifmd_gross_method` | string | Free text / figure |

---

### `share_classes` — §5 (array)

Each element:

| Field | Type | Notes |
|---|---|---|
| `share_class` | string | `"accumulation"` \| `"distribution"` |
| `currency` | string | `"CZK"` \| `"EUR"` \| `"USD"` |
| `minimum_subscription_amount` | number | |
| `management_fee` | number | % |
| `performance_fee` | string \| null | Free text template |
| `distribution_frequency` | string \| null | `"monthly"` \| `"quarterly"`; only if distribution |

---

### `fees` — §6

| Field | Type | Notes |
|---|---|---|
| `subscription_fee` | number | % (0–5) |
| `redemption_fee` | number | % (0–11) |
| `anti_dilution_lmt` | string[] | Subset of `"anti_dilution_levy"`, `"swing_pricing"`, `"redemption_fee"` |

---

### `subscriptions` — §7

| Field | Type | Notes |
|---|---|---|
| `subscription_frequency` | string | Free text, e.g. dealing day description |
| `subscription_cut_off_time` | number | Days before |
| `subscription_payment_date` | number | Days before |
| `nav_calculation_date` | string | Free text |

---

### `redemptions` — §8

User inputs + **derived** fields from RTS Annex I / II.  
The UI redemptions **simulation** (investor scenario / payout schedule) is **not** part of this payload and must not be rendered in the PDF.

#### Terms & calibration

| Field | Type | Notes |
|---|---|---|
| `redemption_calibration_method` | string | `"annex_i"` \| `"annex_ii"` |
| `redemption_frequency` | string | See enum below |
| `redemption_notice_period` | string \| null | Annex I only; else `null` |
| `min_liquid_assets_pct` | number \| null | Annex II derived; else `null` |
| `max_redemption_pct` | number | **Derived** from RTS tables |
| `liquid_assets_amount` | number | Art. 9(1)(b) liquid assets |
| `expected_cashflow_12m` | number | Prudent 12m CF |
| `redemption_base` | number | **Derived** `liquid + cashflow` |
| `max_redemption_amount` | number | **Derived** `max_redemption_pct × base` |
| `redemption_cut_off` | number | Days before dealing |
| `redemption_dealing_date` | string | Free text dealing day |
| `payment_of_redemption_proceeds` | number | Days after dealing |
| `carry_policy` | string | `"automatic_carry_over"` \| `"new_request"` \| `"investor_choice"` |
| `min_holding_period` | number \| null | Months |
| `redemption_in_kind` | boolean \| null | |

**Frequencies:** `weekly`, `bi_weekly`, `monthly`, `bimonthly`, `quarterly`, `semiannual`, `annual`.

**Notice periods:** `none`, `2_weeks`, `1_month`, `3_months`, `6_months`, `9_months`, `12_months`.

#### `advisories` (booleans for PDF / compliance notes)

| Field | Meaning |
|---|---|
| `notice_period_below_3_months` | NCA notify / justify (Art. 5(8)) |
| `frequency_more_often_than_quarterly` | NCA justify (Art. 5(4)) |

Calibration tables (if you recompute `max_redemption_pct`): Field Model **Příloha A**.

---

### `portfolio` — §10

| Field | Type | Notes |
|---|---|---|
| `asset_classes` | array | `{ asset_class, amount }` |
| `eltif_capital` | number | Capital base (Art. 13) |
| `nav` | number | NAV base (Art. 16 / leverage) |
| `total_assets` | number | **Derived** Σ amounts |
| `total_eligible_pct` | number | **Derived** eligible ÷ capital (need ≥ 55) |
| `liquid_pct` | number | **Derived** liquid ÷ capital |
| `avg_liquidity_pct` | number | **Derived** |
| `avg_liquidity_windows` | number | Redemption windows / year |
| `redemptions_per_year` | number | From frequency |

**`asset_class` keys:**

| Key | Meaning |
|---|---|
| `equity_quasi_equity` | Equity / quasi-equity |
| `debt_instruments` | Debt instruments |
| `loans` | Loans |
| `units_in_other_funds` | Units in other funds |
| `real_assets` | Real assets |
| `sts_securitisation` | STS securitisation |
| `green_bonds` | Green bonds |
| `liquid_assets_art_9_1_b` | Liquid assets Art. 9(1)(b) — **not** counted in eligible % |

First seven = ELTIF eligible (Art. 10); last = liquid reserve.

---

### `contact` — §9

| Field | Type | Notes |
|---|---|---|
| `title` | string | `"ms"` \| `"mr"` |
| `last_name` | string \| null | |
| `first_name` | string \| null | |
| `email` | string | **PDF recipient** |
| `company` | string \| null | |
| `agreement` | `true` | GDPR consent; submit only if true |

---

## Branching cheat sheet (for PDF narrative)

1. **`fund.legal_form`**
   - `SICAV` → self-managed? → AIFM name; securities = investment shares.
   - `OPF` → management company; securities = units.
2. **`duration.duration`** = `limited` → show years.
3. **Share class** = `distribution` → show `distribution_frequency`.
4. **`redemptions.redemption_calibration_method`**
   - `annex_i` → notice period + Annex I table story.
   - `annex_ii` → min liquid % + Annex II story.
5. **`redemptions.advisories.*`** → optional compliance footnotes.
6. **`meta.locale` / outer `locale`** → entire PDF language.

---

## What is computed on the frontend (do not require user input)

Safe to **trust and render** as already calculated:

- `redemptions.max_redemption_pct`
- `redemptions.min_liquid_assets_pct` (Annex II)
- `redemptions.redemption_base`
- `redemptions.max_redemption_amount`
- `redemptions.advisories`
- `portfolio.total_assets`, `total_eligible_pct`, `liquid_pct`, `avg_liquidity_*`, `redemptions_per_year`

Recompute only if you need independent verification; tables live in Field Model Příloha A and `src/lib/redemption/lookup.ts`.

---

## Minimal Function checklist

- [ ] Read `form_data` + resolve email (`contact.email` or legacy top-level `email`)
- [ ] Choose CZ vs EN template from `locale` / `language` / `meta.locale`
- [ ] Map enum keys → human labels (do not print raw keys like `annex_i` in the PDF)
- [ ] Render sections as a **summary of principal terms** (portfolio often before contact)
- [ ] Do **not** include the UI redemptions simulation / payout schedule
- [ ] Attach PDF and send to recipient
- [ ] Return HTTP 200 on success

---

## Related files in this repo

| File | Role |
|---|---|
| `docs/ELTIF_Field_Model_FINAL.md` | Business / regulatory field model |
| `src/lib/api/buildPayload.ts` | Exact JSON shape |
| `src/lib/api/submit.ts` | HTTP POST + temporary WP envelope |
| `src/constants/enums.ts` | Allowed option keys |
| `src/lib/redemption/*` | RTS lookup (+ UI-only simulation) |
| `src/lib/portfolio/calculate.ts` | Portfolio derived metrics |
| `src/i18n/{cs,en}/fields.json` | Labels / help texts for UI (reuse for PDF if useful) |
