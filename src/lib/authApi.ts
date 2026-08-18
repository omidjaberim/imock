const apiUrl = import.meta.env.VITE_API_URL ?? '/api'

type ApiUser = { name?: string; phone?: string }

async function request<T>(path: string, body: Record<string, string>) {
     const response = await fetch(`${apiUrl}${path}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
     })
     const data = (await response.json().catch(() => ({}))) as { message?: string; user?: ApiUser }
     if (!response.ok) throw new Error(data.message ?? 'Something went wrong. Please try again.')
     return data as T
}

export function requestPhoneOtp(phone: string, purpose: 'sign-in' | 'sign-up') {
     return request<{ message?: string }>('/auth/phone/request-otp', { phone, purpose })
}

export function verifyPhoneOtp(phone: string, code: string, purpose: 'sign-in' | 'sign-up') {
     return request<{ user?: ApiUser }>('/auth/phone/verify-otp', { phone, code, purpose })
}
