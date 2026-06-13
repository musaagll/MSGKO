import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AdminLayout from '@/components/AdminLayout'
import DashboardClient from './dashboard-client'

export default async function DashboardPage() {
  if (!await isAuthenticated()) redirect('/login')
  return (
    <AdminLayout>
      <DashboardClient />
    </AdminLayout>
  )
}
