import AdminLayout from '@/components/admin/AdminLayout'
import Jobs from './Jobs'

export const metadata = {
  title: 'Admin Jobs',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
}

const JobsPage = () => {
  return (
    <AdminLayout activeItem="jobs">
      <Jobs />
    </AdminLayout>
  )
}
export default JobsPage
