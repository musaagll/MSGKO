import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const PUBLIC_PATHS = ['/login', '/api/auth/login', '/api/auth/logout', '/manifest.json']

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public path — geç (tam eşleşme veya alt yol; '/loginx' gibi önek eşleşmeleri değil)
  if (PUBLIC_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Statik dosyalar — geç
  if (pathname.startsWith('/_next/') || pathname.startsWith('/icons/') || pathname === '/favicon.ico') {
    return NextResponse.next()
  }

  const raw = process.env.ADMIN_JWT_SECRET
  const token = req.cookies.get('msgko_admin_session')?.value

  // Secret tanımlı değilse kimse giremez (fail-closed)
  if (!token || !raw || raw.length < 32) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(raw), { algorithms: ['HS256'] })
    return NextResponse.next()
  } catch {
    const res = NextResponse.redirect(new URL('/login', req.url))
    res.cookies.delete('msgko_admin_session')
    return res
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
