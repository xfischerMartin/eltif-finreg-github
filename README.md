# ELTIF Term Sheet Generator (FINREG PARTNERS)

Bilingual (CZ/EN) multi-step web app for generating an ELTIF term sheet payload and simulating redemptions under RTS 2024/2759. Static frontend that POSTs a complete JSON payload to an Azure Function.

## Stack

- Vite + React + TypeScript
- Tailwind CSS
- react-hook-form + Zod
- react-i18next (default language: Czech)

## Getting started

```bash
# Node 20+ recommended (project developed against Node 22)
npm install
cp .env.example .env   # then set VITE_AZURE_FUNCTION_URL
npm run dev
```

| Script | Purpose |
|--------|---------|
| `npm run dev` | Local development server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview the production build |
| `npm test` | Unit tests (redemption/portfolio math) |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_AZURE_FUNCTION_URL` | Yes | Full HTTPS URL of the Azure Function that accepts the term sheet JSON |

- `.env.example` is committed (placeholders only).
- `.env` and `.env.production` are gitignored — set real URLs there for local / production builds.

## Azure Function contract

### Request

`POST` `VITE_AZURE_FUNCTION_URL`  
`Content-Type: application/json`

Body: term-sheet sections including derived values (`max_redemption_pct`, portfolio totals, etc.) and `meta.locale` (`cs` | `en`). The in-browser redemptions simulation is **not** sent. Schema version is in `meta.schemaVersion`. See [`docs/AZURE_BACKEND_REFERENCE.md`](docs/AZURE_BACKEND_REFERENCE.md) for the exact shape.

### Success response (2xx)

```json
{
  "ok": true,
  "message": "Term sheet processed and sent."
}
```

Optional: `referenceId`. The UI treats any 2xx with `ok: true` (or a bare 2xx) as confirmation that Azure processed and sent the term sheet.

### Error response (non-2xx)

```json
{
  "ok": false,
  "error": "Human-readable error message",
  "code": "OPTIONAL_CODE"
}
```

Network failures and non-2xx responses are shown in the UI with retry — they are never silent.

### CORS (Azure resource owner)

This repo cannot configure Azure CORS. Whoever owns the Function App must allow the deployed frontend origin (e.g. Azure Static Web Apps URL) under Function App → CORS. For local `npm run dev`, also allow `http://localhost:5173`.

## Deployment

Build outputs a static site in `dist/`. Natural fit: **Azure Static Web Apps** (same cloud as the Function). Also works on Vercel / Netlify: set `VITE_AZURE_FUNCTION_URL` in the host’s environment and deploy the Vite build.

## Spec

Authoritative field model: [`docs/ELTIF_Field_Model_FINAL.md`](docs/ELTIF_Field_Model_FINAL.md).

Azure Function payload / sections reference (for PDF + email backend): [`docs/AZURE_BACKEND_REFERENCE.md`](docs/AZURE_BACKEND_REFERENCE.md).
