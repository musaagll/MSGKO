import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET ?? 'fallback-secret-change-in-prod'
)
const COOKIE = 'msgko_admin_session'
const EXPIRES_IN = 60 * 60 * 24 * 7 // 7 gün

export async function createSession(): Promise<string> {
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES_IN}s`)
    .sign(SECRET)
}

export async function verifySession(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, SECRET)
    return true
  } catch {
    return false
  }
}

export async function getSessionFromCookies(): Promise<string | null> {
  const store = await cookies()
  return store.get(COOKIE)?.value ?? null
}

export async function isAuthenticated(): Promise<boolean> {
  const token = await getSessionFromCookies()
  if (!token) return false
  return verifySession(token)
}

export { COOKIE, EXPIRES_IN }
