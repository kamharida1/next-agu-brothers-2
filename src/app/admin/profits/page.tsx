import AdminLayout from '@/components/admin/AdminLayout'
import Profits from './Profits'

export const metadata = {
  robots: { index: false, follow: false },  title: 'Admin Settings',}
export default async function AdminProfitsPage() {
  return (
    <AdminLayout activeItem="profits">
      <Profits  />
    </AdminLayout>
  )
}
