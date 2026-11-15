import { useState, type FormEvent } from 'react'
import { AlertCircle, ArrowRight } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export function GuestAccessForm() {
  const { loginAsGuest } = useApp()
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      await loginAsGuest(name)
    } catch (caught) {
      const code = typeof caught === 'object' && caught !== null && 'code' in caught ? caught.code : ''
      const messages: Record<string, string> = {
        'auth/operation-not-allowed': 'Guest sign-in is not enabled in Firebase. Please contact the app administrator.',
        'auth/admin-restricted-operation': 'Guest sign-in is unavailable. An administrator must enable Anonymous sign-in and allow account creation in Firebase Authentication.',
        'auth/network-request-failed': 'Could not connect. Check your internet connection and try again.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.'
      }
      setError(messages[String(code)] || (caught instanceof Error && !code ? caught.message : 'Unable to continue as a guest. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="guest-title" className="mt-6 pt-5 border-t border-[#333538]">
      <h3 id="guest-title" className="text-sm font-semibold text-[#e3e3e3]">Continue with just your name</h3>
      <p className="mt-1 text-xs leading-relaxed text-[#9aa0a6]">No Google account, email, or password needed. Your name is sent to Firebase to create a guest session.</p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <label htmlFor="guest-name" className="block text-xs font-medium text-[#9aa0a6]">Your name</label>
        <input
          id="guest-name"
          type="text"
          autoComplete="name"
          maxLength={60}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter your name"
          className="w-full px-3 py-2 rounded-xl bg-[#131314] border border-[#333538] focus:border-[#8ab4f8] text-xs text-[#e3e3e3] outline-none transition"
        />
        {error && <p role="alert" className="flex items-center gap-2 text-xs text-[#f28b82]"><AlertCircle className="w-4 h-4 shrink-0" />{error}</p>}
        <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 rounded-xl border border-[#3c4043] bg-[#282a2d] px-4 py-2.5 text-xs font-medium text-[#e3e3e3] transition hover:border-[#8ab4f8] disabled:opacity-60">
          {submitting ? 'Please wait...' : 'Continue as guest'} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>
      <p className="mt-3 text-xs leading-relaxed text-[#9aa0a6]">Guest sessions cannot be recovered by name after sign-out or clearing browser data. Study data is stored in this browser and is not private from other people using it.</p>
    </section>
  )
}
