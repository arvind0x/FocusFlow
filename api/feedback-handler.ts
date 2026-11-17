import { getDatabase } from '../lib/db/index.ts'
import { focusFlowFeedback } from '../lib/db/schema.ts'

const headers = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff'
}

function respond(body: object, status = 200) {
  return new Response(JSON.stringify(body), { status, headers })
}

export async function handleFeedbackRequest(request: Request): Promise<Response> {
  if (request.method !== 'POST') return respond({ error: 'Method not allowed.' }, 405)
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return respond({ error: 'Please send feedback as JSON.' }, 415)
  }
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return respond({ error: 'Invalid request origin.' }, 403)
  if (Number(request.headers.get('content-length') || 0) > 8192) return respond({ error: 'Feedback is too long.' }, 413)

  let data: unknown
  try {
    const body = await request.text()
    if (new TextEncoder().encode(body).byteLength > 8192) return respond({ error: 'Feedback is too long.' }, 413)
    data = JSON.parse(body)
  } catch {
    return respond({ error: 'Invalid feedback format.' }, 400)
  }

  if (!data || typeof data !== 'object' || Array.isArray(data)) return respond({ error: 'Invalid feedback.' }, 400)
  const { category, message } = data as Record<string, unknown>
  if ((category !== 'feedback' && category !== 'bug') || typeof message !== 'string') {
    return respond({ error: 'Please choose a category and enter your feedback.' }, 400)
  }
  const trimmed = message.trim()
  if (!trimmed || trimmed.length > 2000) return respond({ error: 'Feedback must be between 1 and 2,000 characters.' }, 400)

  try {
    await getDatabase().insert(focusFlowFeedback).values({ category, message: trimmed })
    return respond({ ok: true }, 201)
  } catch {
    return respond({ error: 'Could not submit feedback right now. Please try again.' }, 503)
  }
}
