import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

const ALLOWED_BUCKETS = ['wallpapers'] as const
const ALLOWED_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/avif': 'avif',
}
const MAX_BYTES = 15 * 1024 * 1024 // 15 MB

export async function POST(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const form = await req.formData()
  const file = form.get('file')
  const bucket = String(form.get('bucket') ?? 'wallpapers')

  if (!(file instanceof File)) return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 })
  if (!(ALLOWED_BUCKETS as readonly string[]).includes(bucket)) {
    return NextResponse.json({ error: 'Geçersiz bucket' }, { status: 400 })
  }
  const ext = ALLOWED_TYPES[file.type]
  if (!ext) return NextResponse.json({ error: 'Yalnızca PNG, JPEG, WebP veya AVIF yüklenebilir' }, { status: 415 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'Dosya 15 MB sınırını aşıyor' }, { status: 413 })

  // Uzantı kullanıcının dosya adından değil, doğrulanmış MIME tipinden gelir
  const name = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`
  const buffer = await file.arrayBuffer()

  const supabase = createServiceClient()
  const { error } = await supabase.storage
    .from(bucket)
    .upload(name, buffer, { contentType: file.type, upsert: false })

  if (error) {
    console.error('Upload error:', error.message)
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(name)
  return NextResponse.json({ url: publicUrl, name }, { status: 201 })
}
