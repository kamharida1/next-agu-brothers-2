import AdminLayout from '@/components/admin/AdminLayout'
import CategoryCreateForm from './CategoryCreateForm'


export const metadata = {
  title: 'Admin Category Create',
}
const AdminCategoriesPage = ({ params }: { params: { id: string } }) => {
  return (
    <AdminLayout activeItem="categories">
      <CategoryCreateForm />
    </AdminLayout>
  )
}

export default AdminCategoriesPage
