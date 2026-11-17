import React from 'react'
import { Cloud, CloudOff, Database } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const DatabaseSyncPanel: React.FC = () => {
  const {
    authUser,
    databaseStatus,
    databaseError,
    needsLegacyImport,
    confirmBrowserDataImport,
    startFreshInDatabase,
    retryDatabaseSync,
    profile,
    subjects,
    tasks,
    focusSessions,
    distractionLogs,
    distractionItems
  } = useApp()

  if (!authUser.isAuthenticated) return null

  if (needsLegacyImport) {
    const recordCount = subjects.length + tasks.length + focusSessions.length + distractionLogs.length + distractionItems.length

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm" role="presentation">
        <section
          aria-labelledby="database-import-title"
          aria-modal="true"
          className="w-full max-w-lg rounded-2xl border border-[#333538] bg-[#1e1f20] p-6 shadow-2xl sm:p-8"
          role="dialog"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-[#8ab4f8]/20 bg-[#8ab4f8]/10 text-[#8ab4f8]">
            <Database aria-hidden="true" className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold text-[#e3e3e3]" id="database-import-title">Choose what to do with this browser&apos;s data</h2>
          <p className="mt-3 text-sm leading-6 text-[#9aa0a6]">
            This browser has {recordCount} saved record{recordCount === 1 ? '' : 's'}{profile.name ? ` and a profile for ${profile.name}` : ''}. It may belong to a different person, so FocusFlow won&apos;t attach it to {authUser.name || 'this account'} unless you choose to import it.
          </p>
          <p className="mt-3 text-sm leading-6 text-[#9aa0a6]">
            Import copies the existing data to this account. Starting fresh keeps the account separate and replaces this browser&apos;s FocusFlow data with a blank profile.
          </p>
          {databaseError && <p className="mt-4 rounded-lg border border-[#f28b82]/30 bg-[#f28b82]/10 p-3 text-sm text-[#f28b82]" role="alert">{databaseError}</p>}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              className="rounded-lg border border-[#3c4043] px-4 py-2.5 text-sm font-medium text-[#e3e3e3] transition hover:bg-[#282a2d] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={databaseStatus === 'saving'}
              onClick={startFreshInDatabase}
              type="button"
            >
              Start fresh
            </button>
            <button
              className="rounded-lg bg-[#8ab4f8] px-4 py-2.5 text-sm font-semibold text-[#131314] transition hover:bg-[#aecbfa] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={databaseStatus === 'saving'}
              onClick={() => void confirmBrowserDataImport()}
              type="button"
            >
              {databaseStatus === 'saving' ? 'Importing…' : 'Import browser data'}
            </button>
          </div>
        </section>
      </div>
    )
  }

  if (databaseStatus === 'offline') {
    return (
      <div className="mx-auto mt-4 flex max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8" role="alert">
        <div className="flex min-w-0 flex-1 items-start gap-3 rounded-xl border border-[#fdd663]/25 bg-[#fdd663]/[0.06] p-3 text-sm text-[#fdd663]">
          <CloudOff aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Cloud sync is unavailable</p>
            <p className="mt-1 text-[#c4b77e]">Your browser copy is unchanged. Reconnect to load or save account data.{databaseError ? ` ${databaseError}` : ''}</p>
          </div>
          <button className="shrink-0 rounded-lg border border-[#fdd663]/30 px-3 py-1.5 text-xs font-semibold hover:bg-[#fdd663]/10" onClick={retryDatabaseSync} type="button">
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (databaseStatus === 'saving') {
    return (
      <div className="mx-auto mt-3 flex max-w-7xl items-center gap-2 px-4 text-xs text-[#9aa0a6] sm:px-6 lg:px-8" role="status" aria-live="polite">
        <Cloud aria-hidden="true" className="h-3.5 w-3.5 text-[#8ab4f8]" /> Saving to your account…
      </div>
    )
  }

  return null
}
