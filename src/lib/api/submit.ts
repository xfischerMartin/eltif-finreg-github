import { buildSubmitPayload } from './buildPayload'

export type SubmitSuccess = {
  ok: true
  message?: string
  referenceId?: string
}

export type SubmitErrorBody = {
  ok?: false
  error?: string
  code?: string
}

export class SubmitError extends Error {
  status?: number
  code?: string

  constructor(message: string, status?: number, code?: string) {
    super(message)
    this.name = 'SubmitError'
    this.status = status
    this.code = code
  }
}

/** Temporary WP-compatible envelope while create_pdf is migrated to the new schema. */
function wrapForCreatePdf(payload: ReturnType<typeof buildSubmitPayload>) {
  const language = payload.meta.locale
  // Legacy create_pdf reads form_data["email"] (flat WP fields); new schema nests it under contact.
  const email =
    typeof payload.contact.email === 'string' ? payload.contact.email : undefined
  return {
    form_data: {
      ...payload,
      email,
    },
    language,
    locale: language === 'cs' ? 'cs_CZ' : 'en_US',
  }
}

export async function submitTermSheet(
  payload: ReturnType<typeof buildSubmitPayload>,
): Promise<SubmitSuccess> {
  const url = import.meta.env.VITE_AZURE_FUNCTION_URL
  if (!url) {
    throw new SubmitError(
      'Missing VITE_AZURE_FUNCTION_URL. Set it in your .env file.',
    )
  }

  const bodyPayload = wrapForCreatePdf(payload)
  console.log('Term sheet submit payload:', JSON.stringify(bodyPayload, null, 2))

  let response: Response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    })
  } catch {
    throw new SubmitError(
      'Network error — could not reach the Azure Function. Check your connection and CORS settings.',
    )
  }

  let body: SubmitSuccess | SubmitErrorBody | null = null
  try {
    body = (await response.json()) as SubmitSuccess | SubmitErrorBody
  } catch {
    body = null
  }

  if (!response.ok) {
    throw new SubmitError(
      body && 'error' in body && body.error
        ? body.error
        : `Request failed with status ${response.status}`,
      response.status,
      body && 'code' in body ? body.code : undefined,
    )
  }

  if (body && 'ok' in body && body.ok === false) {
    throw new SubmitError(
      body.error || 'Azure Function reported failure',
      response.status,
      body.code,
    )
  }

  return {
    ok: true,
    message: body && 'message' in body ? body.message : undefined,
    referenceId:
      body && 'referenceId' in body ? body.referenceId : undefined,
  }
}

export { buildSubmitPayload } from './buildPayload'
