import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import VideosClient from './videos-client'

export default async function VideosPage() {
  if (!await isAuthenticated()) redirect('/login')
  return <AdminLayout><VideosClient /></AdminLayout>
}
