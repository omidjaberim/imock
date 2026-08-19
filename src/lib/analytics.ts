import { getCurrentUser } from './auth'

export type AnalyticsPayload = Record<string, unknown>

async function defaultHeaders() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  const user = getCurrentUser()
  if (user?.token) headers['Authorization'] = `Bearer ${user.token}`
  return headers
}

export async function trackEvent(eventName: string, payload?: AnalyticsPayload) {
  // Minimal analytics helper. In production wire this to your analytics endpoint.
  try {
    const headers = await defaultHeaders()
    // Best-effort fetch. If you have a backend, point this to the analytics endpoint.
    await fetch('/api/analytics', {
      method: 'POST',
      headers,
      body: JSON.stringify({ event: eventName, ts: Date.now(), payload }),
    })
  } catch (err) {
    // If the endpoint isn't present or network fails, fall back to console logging.
    // Do not throw — analytics should be best-effort.
    // eslint-disable-next-line no-console
    console.log('analytics:', eventName, payload)
  }
}

// Post an infractions event to the protected endpoint. This is called on modal close/start.
export async function postInfraction(exam?: string, count?: number, details?: Record<string, unknown>) {
  try {
    const headers = await defaultHeaders()
    await fetch('/api/exams/infractions', {
      method: 'POST',
      headers,
      body: JSON.stringify({ exam, count, details }),
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('postInfraction failed:', err)
  }
}

// Submit an exam (answers etc.) to backend
export async function submitExam(exam: string, answers: unknown, opts?: { durationSec?: number; metadata?: Record<string, unknown> }) {
  try {
    const headers = await defaultHeaders()
    const res = await fetch('/api/exams/submit', {
      method: 'POST',
      headers,
      body: JSON.stringify({ exam, answers, durationSec: opts?.durationSec, metadata: opts?.metadata }),
    })
    return res
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('submitExam failed:', err)
    throw err
  }
}
