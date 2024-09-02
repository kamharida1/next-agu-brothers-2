import AdminLayout from '@/components/admin/AdminLayout'
import Profits from './Profits'

export const metadata = {
  title: 'Admin Settings',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
}
export default async function AdminProfitsPage() {
  return (
    <AdminLayout activeItem="profits">
      <Profits  />
    </AdminLayout>
  )
}
