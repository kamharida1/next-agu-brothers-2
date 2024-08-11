import AdminLayout from '@/components/admin/AdminLayout'
import Blog from './Blog'
import { cache } from 'react'

export const metadata = {
  title: 'Admin Blog',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  }
}
const AdminBlogPage = () => {
  return (
    <AdminLayout activeItem="blog">
      <Blog />
    </AdminLayout>
  )
}

export default AdminBlogPage

