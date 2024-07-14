import AdminLayout from '@/components/admin/AdminLayout'
import BlogCreateForm from './BlogCreateForm'
import BlogCreate from './BlogCreate'

export const metadata = {
  title: 'Admin Blog Create',
}

const AdminBlogPage = () => {
  return (
    <AdminLayout activeItem="blog">
      <BlogCreate />
    </AdminLayout>
  )
}

export default AdminBlogPage
