export function formatMinutesToHours(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  const hours = Math.floor(minutes / 60)
  const remMinutes = minutes % 60
  if (remMinutes === 0) {
    return `${hours}h`
  }
  return `${hours}h ${remMinutes}m`
}

export function formatSecondsToMMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function getTodayDateString(): string {
  const d = new Date()
  return d.toISOString().split('T')[0]
}

export function getFormattedToday(): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date())
}

export function calculatePercentage(part: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((part / total) * 100))
}
