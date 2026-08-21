import { getCurrentUser } from './auth'

export type ReadingAnswerEntry = {
  id: string | number
  label?: string
  statement?: string
  question?: string
  prompt?: string
  answer?: string
  options?: Record<string, string>
}

export type ReadingQuestionGroup = {
  qtype: string
  sectionLabel?: string
  timeMinutes?: number
  instructions?: string
  headings?: string[]
  questions?: ReadingAnswerEntry[]
  items?: ReadingAnswerEntry[]
}

export type ReadingPassage = {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  timeMinutes?: number
  passage: string
  questions: ReadingQuestionGroup[]
}

export type ReadingTest = {
  id: string
  totalDurationSeconds: number
  totalQuestions: number
  passages: ReadingPassage[]
  createdAt: string
}

const apiUrl = import.meta.env.VITE_API_URL ?? '/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const user = getCurrentUser()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers ? Object.fromEntries(new Headers(init.headers).entries()) : {}),
  }

  if (user?.token) {
    headers.Authorization = `Bearer ${user.token}`
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error((data as { message?: string }).message ?? 'The API returned an unexpected response.')
  }

  return data as T
}

export function fetchReadingTest() {
  return request<ReadingTest>('/reading/test')
}

export function submitReadingTest(test: ReadingTest, answers: Record<string, string>) {
  return request<{ score: number; total: number; percentage: number; passed: boolean }>('/reading/submit', {
    method: 'POST',
    body: JSON.stringify({ test, answers }),
  })
}
