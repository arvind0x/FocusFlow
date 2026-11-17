import { eq } from 'drizzle-orm'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { getDatabase } from '../lib/db/index.ts'
import { focusFlowUserState } from '../lib/db/schema.ts'
import type { FocusFlowSnapshot } from '../src/types/index.ts'

const firebaseProjectId = process.env.FIREBASE_PROJECT_ID || 'focusflow-b883c'
const firebaseKeys = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
)
const maxPayloadBytes = 512 * 1024
const privateCacheHeaders = {
  'Cache-Control': 'private, no-store',
  'Content-Type': 'application/json; charset=utf-8',
  'X-Content-Type-Options': 'nosniff'
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: privateCacheHeaders })
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isSnapshot(value: unknown): value is FocusFlowSnapshot {
  const expectedKeys = [
    'profile',
    'subjects',
    'tasks',
    'focusSessions',
    'distractionLogs',
    'distractionItems',
    'settings'
  ]
  if (
    !isRecord(value) ||
    Object.keys(value).length !== expectedKeys.length ||
    !expectedKeys.every((key) => key in value) ||
    !isRecord(value.profile) ||
    !isRecord(value.settings)
  ) return false

  const arrays = [
    value.subjects,
    value.tasks,
    value.focusSessions,
    value.distractionLogs,
    value.distractionItems
  ]

  return arrays.every((items) =>
    Array.isArray(items) && items.length <= 10_000 && items.every(isRecord)
  )
}

async function getFirebaseUserId(request: Request): Promise<string | null> {
  const authorization = request.headers.get('authorization')
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, firebaseKeys, {
      audience: firebaseProjectId,
      issuer: `https://securetoken.google.com/${firebaseProjectId}`
    })
    return typeof payload.sub === 'string' && payload.sub.length <= 128 ? payload.sub : null
  } catch {
    return null
  }
}

export async function handleStateRequest(request: Request): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'PUT' && request.method !== 'DELETE') {
    return jsonResponse({ error: 'Method not allowed' }, 405)
  }

  const userId = await getFirebaseUserId(request)
  if (!userId) return jsonResponse({ error: 'Sign in to access your saved data.' }, 401)

  try {
    const database = getDatabase()

    if (request.method === 'GET') {
      const [record] = await database
        .select({ state: focusFlowUserState.state, updatedAt: focusFlowUserState.updatedAt })
        .from(focusFlowUserState)
        .where(eq(focusFlowUserState.userId, userId))
        .limit(1)
      return jsonResponse({ state: record?.state ?? null, updatedAt: record?.updatedAt ?? null })
    }

    if (request.method === 'DELETE') {
      await database.delete(focusFlowUserState).where(eq(focusFlowUserState.userId, userId))
      return jsonResponse({ ok: true })
    }

    const contentLength = Number(request.headers.get('content-length') || 0)
    if (contentLength > maxPayloadBytes) return jsonResponse({ error: 'Data is too large to save.' }, 413)

    const rawBody = await request.text()
    if (new TextEncoder().encode(rawBody).byteLength > maxPayloadBytes) {
      return jsonResponse({ error: 'Data is too large to save.' }, 413)
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(rawBody)
    } catch {
      return jsonResponse({ error: 'The data format is invalid.' }, 400)
    }

    if (!isRecord(parsed) || !isSnapshot(parsed.state)) {
      return jsonResponse({ error: 'The saved data is incomplete or invalid.' }, 400)
    }

    const now = new Date()
    await database
      .insert(focusFlowUserState)
      .values({ userId, state: parsed.state, updatedAt: now })
      .onConflictDoUpdate({
        target: focusFlowUserState.userId,
        set: { state: parsed.state, updatedAt: now }
      })

    return jsonResponse({ ok: true, updatedAt: now.toISOString() })
  } catch {
    return jsonResponse({ error: 'The database is temporarily unavailable. Your browser copy is unchanged.' }, 503)
  }
}
