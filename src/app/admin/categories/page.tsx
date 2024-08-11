import AdminLayout from '@/components/admin/AdminLayout'
import Categories from './Categories'

export const metadata = {
  title: 'Admin Categories',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
}
const AdminCategoriesPage = () => {
  return (
    <AdminLayout activeItem="categories">
      <Categories />
    </AdminLayout>
  )
}

export default AdminCategoriesPage
