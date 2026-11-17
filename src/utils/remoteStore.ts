import type { FocusFlowSnapshot } from '../types'

export async function loadRemoteState(token: string): Promise<FocusFlowSnapshot | null> {
  const response = await fetch('/api/state', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store'
  })
  const result = await response.json() as { state?: FocusFlowSnapshot | null; error?: string }

  if (!response.ok) throw new Error(result.error || 'Could not load your saved data.')
  return result.state ?? null
}

export async function saveRemoteState(token: string, state: FocusFlowSnapshot): Promise<void> {
  const response = await fetch('/api/state', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ state })
  })
  const result = await response.json() as { error?: string }

  if (!response.ok) throw new Error(result.error || 'Could not save your data.')
}

export async function deleteRemoteState(token: string): Promise<void> {
  const response = await fetch('/api/state', {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  })
  const result = await response.json() as { error?: string }

  if (!response.ok) throw new Error(result.error || 'Could not delete your saved data.')
}
