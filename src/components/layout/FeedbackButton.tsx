import { useRef, useState, type FormEvent } from 'react'
import { CheckCircle2, MessageSquarePlus, Send, X } from 'lucide-react'

export function FeedbackButton() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [category, setCategory] = useState<'feedback' | 'bug'>('feedback')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  function openDialog() {
    if (status === 'sent') setStatus('idle')
    setError('')
    dialogRef.current?.showModal()
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return
    setError('')
    setStatus('sending')
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, message })
      })
      const result = await response.json() as { error?: string }
      if (!response.ok) throw new Error(result.error || 'Could not submit feedback. Please try again.')
      setMessage('')
      setStatus('sent')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit feedback. Please try again.')
      setStatus('idle')
    }
  }

  return (
    <>
      <button type="button" onClick={openDialog} className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full border border-[#536b90] bg-[#8ab4f8] px-4 py-3 text-sm font-semibold text-[#101828] shadow-xl transition hover:bg-[#aecbfa] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8ab4f8]">
        <MessageSquarePlus size={17} aria-hidden="true" /> Feedback
      </button>
      <dialog ref={dialogRef} aria-labelledby="feedback-title" onClose={() => setError('')} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-[#3c4043] bg-[#1e1f20] p-0 text-[#e3e3e3] shadow-2xl backdrop:bg-black/70">
        <div className="p-6 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#405675] bg-[#8ab4f8]/10 text-[#8ab4f8]"><MessageSquarePlus size={19} aria-hidden="true" /></div>
              <h2 id="feedback-title" className="text-xl font-semibold tracking-tight">Help us improve</h2>
              <p className="mt-1.5 text-sm leading-6 text-[#b4bac1]">Have an idea or found a bug? We&apos;d love to hear about it.</p>
            </div>
            <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Close feedback" className="rounded-lg p-2 text-[#b4bac1] hover:bg-[#303236] hover:text-white focus-visible:outline-2 focus-visible:outline-[#8ab4f8]"><X size={18} /></button>
          </div>
          {status === 'sent' ? (
            <div className="mt-6 rounded-xl border border-[#81c995]/30 bg-[#81c995]/10 p-4" role="status">
              <div className="flex items-center gap-2 font-medium text-[#a8dab5]"><CheckCircle2 size={18} aria-hidden="true" /> Thank you for your feedback</div>
              <p className="mt-2 text-sm leading-6 text-[#c8d3ca]">Your message has been submitted.</p>
              <button type="button" onClick={() => dialogRef.current?.close()} className="mt-4 rounded-lg bg-[#8ab4f8] px-4 py-2 text-sm font-semibold text-[#101828]">Done</button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 space-y-5">
              <fieldset>
                <legend className="mb-2 text-sm font-medium">What is this about?</legend>
                <div className="flex gap-2">
                  {([['feedback', 'Feedback'], ['bug', 'Bug report']] as const).map(([value, label]) => (
                    <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${category === value ? 'border-[#8ab4f8] bg-[#8ab4f8]/10 text-[#d3e3fd]' : 'border-[#484a4d] text-[#c7cbd1] hover:bg-[#303236]'}`}>
                      <input type="radio" name="category" value={value} checked={category === value} onChange={() => setCategory(value)} className="accent-[#8ab4f8]" />{label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="feedback-message" className="block text-sm font-medium">Your message</label>
                <textarea id="feedback-message" value={message} onChange={(event) => setMessage(event.target.value)} required maxLength={2000} rows={4} placeholder="Tell us what’s on your mind..." className="mt-2 w-full resize-y rounded-xl border border-[#484a4d] bg-[#131314] px-3.5 py-3 text-sm text-white placeholder:text-[#90969e] focus:border-[#8ab4f8] focus:outline-none focus:ring-2 focus:ring-[#8ab4f8]/20" />
                <div className="mt-1.5 flex justify-between gap-2 text-xs text-[#b4bac1]"><span>Please don&apos;t include personal information.</span><span>{message.length}/2000</span></div>
              </div>
              {error && <p role="alert" className="text-sm text-[#f28b82]">{error}</p>}
              <div className="flex items-center justify-between gap-3 border-t border-[#3c4043] pt-4">
                <p className="text-xs leading-5 text-[#b4bac1]">No name or email required.</p>
                <button type="submit" disabled={status === 'sending'} className="flex shrink-0 items-center gap-2 rounded-lg bg-[#8ab4f8] px-4 py-2.5 text-sm font-semibold text-[#101828] hover:bg-[#aecbfa] disabled:opacity-60"><Send size={15} aria-hidden="true" />{status === 'sending' ? 'Sending...' : 'Send feedback'}</button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  )
}
