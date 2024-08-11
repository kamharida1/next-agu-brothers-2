import AdminLayout from '@/components/admin/AdminLayout'
import Dashboard from './Dashboard'

export const metadata = {
  title: 'Admin Dashboard',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  }
}
const DashboardPage = () => {
  return (
    <AdminLayout activeItem="dashboard">
      <Dashboard />
    </AdminLayout>
  )
}

export default DashboardPage
