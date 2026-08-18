export type AuthUser = {
     name: string
     provider: 'password' | 'phone' | 'google'
}

const sessionKey = 'imock-auth-user'

export function getCurrentUser(): AuthUser | null {
     const storedUser = localStorage.getItem(sessionKey)

     if (!storedUser) return null

     try {
          return JSON.parse(storedUser) as AuthUser
     } catch {
          localStorage.removeItem(sessionKey)
          return null
     }
}

export function startSession(user: AuthUser) {
     localStorage.setItem(sessionKey, JSON.stringify(user))
}

export function isLoggedIn() {
     return getCurrentUser() !== null
}
