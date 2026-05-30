import AdminLayout from '@/components/admin/AdminLayout'
import Jobs from './Jobs'

export const metadata = {
  robots: { index: false, follow: false },  title: 'Admin Jobs',}

const JobsPage = () => {
  return (
    <AdminLayout activeItem="jobs">
      <Jobs />
    </AdminLayout>
  )
}
export default JobsPage
