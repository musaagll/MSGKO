import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { isAuthenticated } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { newPassword } = await req.json()
  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: 'Şifre en az 8 karakter olmalı' }, { status: 400 })
  }

  const newHash = await hash(newPassword, 12)
  // Hash'i döndür — admin .env.local'e elle ekleyecek
  return NextResponse.json({
    success: true,
    hash: newHash,
    instruction: `Bu hash değerini .env.local dosyasındaki ADMIN_PASSWORD_HASH alanına kopyalayın:\n\nADMIN_PASSWORD_HASH=${newHash}`,
  })
}
