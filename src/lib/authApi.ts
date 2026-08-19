const apiUrl = import.meta.env.VITE_API_URL ?? '/api'

export type ApiUser = { id: string; name: string; username?: string; email?: string; phone?: string }

type AuthResponse = { token: string; user: ApiUser }

async function request<T>(path: string, body: Record<string, string>) {
     let response: Response
     try {
          response = await fetch(`${apiUrl}${path}`, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               credentials: 'include',
               body: JSON.stringify(body),
          })
     } catch {
          throw new Error('Unable to reach the API. Start the backend on port 5000 and try again.')
     }
     const data = (await response.json().catch(() => ({}))) as { message?: string; user?: ApiUser }
     if (!response.ok) {
          throw new Error(data.message ?? 'The API returned an unexpected response. Check the backend terminal.')
     }
     return data as T
}

export function requestPhoneOtp(phone: string, purpose: 'sign-in' | 'sign-up') {
     return request<{ message?: string }>('/auth/phone/request-otp', { phone, purpose })
}

export function verifyPhoneOtp(phone: string, code: string, purpose: 'sign-in' | 'sign-up') {
     return request<{ user?: ApiUser }>('/auth/phone/verify-otp', { phone, code, purpose })
}

export function registerUser(data: { name: string; username: string; email: string; password: string }) {
     return request<AuthResponse>('/auth/register', data)
}

export function loginUser(data: { identifier: string; password: string }) {
     return request<AuthResponse>('/auth/login', data)
}
