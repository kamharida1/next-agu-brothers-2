import AdminLayout from '@/components/admin/AdminLayout'
import Blog from './Blog'

export const metadata = {
  title: 'Admin Blog',
}
const AdminBlogPage = () => {
  return (
    <AdminLayout activeItem="blog">
      <Blog />
    </AdminLayout>
  )
}

export default AdminBlogPage

