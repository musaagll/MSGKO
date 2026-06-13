/**
 * TOTP (Google Authenticator) yardımcıları
 * RFC 6238 uyumlu — otpauth kütüphanesi kullanır
 */

export function generateTotpSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let secret = ''
  const arr = new Uint8Array(32)
  crypto.getRandomValues(arr)
  for (const b of arr) secret += chars[b % 32]
  return secret
}

export function getTotpUri(secret: string, label = 'MSGKO Admin'): string {
  return `otpauth://totp/${encodeURIComponent(label)}?secret=${secret}&issuer=MSGKO&algorithm=SHA1&digits=6&period=30`
}

/**
 * TOTP kodu doğrula — server-side kullanım için
 * Zaman kaymasına karşı ±1 periyot toleransı var
 */
export async function verifyTotp(secret: string, code: string): Promise<boolean> {
  const { TOTP } = await import('otpauth')
  const totp = new TOTP({
    secret,
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  })
  const delta = totp.validate({ token: code, window: 1 })
  return delta !== null
}
