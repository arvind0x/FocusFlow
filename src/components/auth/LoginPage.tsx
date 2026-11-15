import React, { useState } from 'react'
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const LoginPage: React.FC = () => {
  const { login, setActiveTab } = useApp()

  const [isSignUp, setIsSignUp] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }
    setErrorMsg(null)
    setSubmitting(true)
    try {
      await login(email.trim(), password, isSignUp, name)
    } catch (error) {
      const code = typeof error === 'object' && error !== null && 'code' in error ? error.code : ''
      const messages: Record<string, string> = {
        'auth/invalid-credential': 'Incorrect email or password.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/weak-password': 'Please choose a stronger password.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Could not connect. Check your internet connection and try again.',
        'auth/operation-not-allowed': 'Email/password sign-in is not enabled in Firebase.',
        'auth/api-key-not-valid': 'Firebase configuration is invalid. Please contact the app administrator.'
      }
      setErrorMsg(messages[String(code)] || (error instanceof Error && !code ? error.message : 'Unable to sign in. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#131314] text-[#e3e3e3] flex flex-col justify-center items-center px-4 py-12 relative selection:bg-[#8ab4f8]/20 selection:text-white">
      {/* Subtle Studio grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(#2e3135_1px,transparent_1px)] [background-size:24px_24px] opacity-30 pointer-events-none" />

      {/* Top Brand Link */}
      <button
        onClick={() => setActiveTab('landing')}
        className="mb-8 flex items-center space-x-2.5 text-[#9aa0a6] hover:text-white transition group z-10"
      >
        <div className="w-8 h-8 rounded-lg bg-[#1e1f20] border border-[#3c4043] flex items-center justify-center text-white group-hover:border-[#8ab4f8] transition">
          <Sparkles className="w-4 h-4 text-[#8ab4f8]" />
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-base tracking-tight text-[#e3e3e3]">FocusFlow</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1e1f20] border border-[#333538] text-[#9aa0a6]">
            Studio v2.4
          </span>
        </div>
      </button>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-[#1e1f20] rounded-2xl border border-[#333538] p-8 shadow-2xl relative z-10 animate-fade-rise">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-[#e3e3e3]">
            {isSignUp ? 'Create your Student Account' : 'Welcome to FocusFlow Studio'}
          </h2>
          <p className="text-xs text-[#9aa0a6] mt-1.5">
            {isSignUp
              ? 'Start building deep focus habits with smart scheduling'
              : 'Sign in to access your timetables, focus history, and analytics'}
          </p>
        </div>

        {errorMsg && (
          <div role="alert" className="mb-4 p-3 rounded-xl bg-[#f28b82]/10 border border-[#f28b82]/30 flex items-center space-x-2 text-xs text-[#f28b82]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-medium text-[#9aa0a6] mb-1">
                Display Name
              </label>
              <input
                id="auth-name"
                autoComplete="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aarav Sharma"
                className="w-full px-3 py-2 rounded-xl bg-[#131314] border border-[#333538] focus:border-[#8ab4f8] text-xs text-[#e3e3e3] outline-none transition"
              />
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-medium text-[#9aa0a6] mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5f6368] absolute left-3 top-2.5" />
              <input
                id="auth-email"
                autoComplete="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.edu"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131314] border border-[#333538] focus:border-[#8ab4f8] text-xs text-[#e3e3e3] outline-none transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-medium text-[#9aa0a6] mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5f6368] absolute left-3 top-2.5" />
              <input
                id="auth-password"
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#131314] border border-[#333538] focus:border-[#8ab4f8] text-xs text-[#e3e3e3] outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 rounded-xl bg-[#8ab4f8] hover:bg-[#aecbfa] disabled:opacity-60 text-[#131314] font-medium text-xs transition flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>{submitting ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="text-center mt-5 text-xs text-[#9aa0a6]">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => { setIsSignUp(false); setErrorMsg(null) }}
                className="text-[#8ab4f8] hover:underline font-medium"
              >
                Sign in
              </button>
            </span>
          ) : (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => { setIsSignUp(true); setErrorMsg(null) }}
                className="text-[#8ab4f8] hover:underline font-medium"
              >
                Create one now
              </button>
            </span>
          )}
        </div>

        {/* Privacy Note */}
        <div className="mt-6 pt-4 border-t border-[#2e3135] text-center">
          <p className="text-[10px] text-[#5f6368] flex items-center justify-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#81c995]" />
            <span>Firebase handles sign-in. Study data stays in this browser and may be visible to other people using it.</span>
          </p>
        </div>
      </div>
    </div>
  )
}
