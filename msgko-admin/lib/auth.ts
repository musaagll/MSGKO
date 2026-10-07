import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE = 'msgko_admin_session'
const EXPIRES_IN = 60 * 60 * 24 * 7 // 7 gün

/**
 * JWT imza anahtarı. Tanımlı değilse (veya çok kısaysa) null döner ve
 * oturum oluşturma/doğrulama başarısız olur — sabit bir yedek anahtar kullanılmaz.
 */
export function getJwtSecret(): Uint8Array | null {
  const raw = process.env.ADMIN_JWT_SECRET
  if (!raw || raw.length < 32) return null
  return new TextEncoder().encode(raw)
}

export async function createSession(): Promise<string> {
  const secret = getJwtSecret()
  if (!secret) throw new Error('ADMIN_JWT_SECRET tanımlı değil veya 32 karakterden kısa')
  return new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${EXPIRES_IN}s`)
    .sign(secret)
}

export async function verifySession(token: string): Promise<boolean> {
  const secret = getJwtSecret()
  if (!secret) return false
  try {
    await jwtVerify(token, secret, { algorithms: ['HS256'] })
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
