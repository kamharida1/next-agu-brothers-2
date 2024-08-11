import AdminLayout from '@/components/admin/AdminLayout'
import Users from './Users'

export const metadata = {
  title: 'Admin Users',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
}
const AdminUsersPage = () => {
  return (
    <AdminLayout activeItem="users">
      <Users />
    </AdminLayout>
  )
}

export default AdminUsersPage
