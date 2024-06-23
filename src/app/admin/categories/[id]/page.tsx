import AdminLayout from '@/components/admin/AdminLayout'
import CategoryCreateOrEditForm from './Form'

export const metadata = {
  title: 'Admin Category Create',
}
const AdminCategoriesPage = ({ params }: { params: { id: string } }) => {
  return (
    <AdminLayout activeItem="categories">
      <CategoryCreateOrEditForm categoryId={params.id} />
    </AdminLayout>
  )
}

export default AdminCategoriesPage
