import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import WallpapersClient from './wallpapers-client'

export default async function WallpapersPage() {
  if (!await isAuthenticated()) redirect('/login')
  return <AdminLayout><WallpapersClient /></AdminLayout>
}
