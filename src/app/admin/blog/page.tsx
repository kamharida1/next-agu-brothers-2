import AdminLayout from '@/components/admin/AdminLayout'
import Blog from './Blog'
import { cache } from 'react'

export const metadata = {
  robots: { index: false, follow: false },  title: 'Admin Blog',}
const AdminBlogPage = () => {
  return (
    <AdminLayout activeItem="blog">
      <Blog />
    </AdminLayout>
  )
}

export default AdminBlogPage

