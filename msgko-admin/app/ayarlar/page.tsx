import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import AyarlarClient from './ayarlar-client'

export default async function AyarlarPage() {
  if (!await isAuthenticated()) redirect('/login')
  return <AdminLayout><AyarlarClient /></AdminLayout>
}
