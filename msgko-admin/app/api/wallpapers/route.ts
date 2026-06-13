import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { isAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('wallpapers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const body = await req.json()
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('wallpapers')
    .insert({ label: body.label, src: body.src, category: body.category ?? 'genel' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  if (!await isAuthenticated()) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { id } = await req.json()
  const supabase = createServiceClient()

  // Storage'dan da sil
  const { data: wp } = await supabase.from('wallpapers').select('src').eq('id', id).single()
  if (wp?.src?.includes('supabase')) {
    const path = wp.src.split('/storage/v1/object/public/wallpapers/')[1]
    if (path) await supabase.storage.from('wallpapers').remove([path])
  }

  const { error } = await supabase.from('wallpapers').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
