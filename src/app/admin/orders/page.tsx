import AdminLayout from '@/components/admin/AdminLayout'
import Orders from './Orders'

export const metadata = {
  robots: { index: false, follow: false },  title: 'Admin Orders',}

const AdminOrdersPage = () => {
  return (
    <AdminLayout activeItem="orders">
      <Orders />
    </AdminLayout>
  )
}
export default AdminOrdersPage