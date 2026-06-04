import AdminLayout from '@/components/admin/AdminLayout'
import CategoryCreateForm from './CategoryCreateForm'


export const metadata = {
  title: 'Admin Category Create',
}
const AdminCategoriesPage = () => {
  return (
    <AdminLayout activeItem="categories">
      <CategoryCreateForm />
    </AdminLayout>
  )
}

export default AdminCategoriesPage
