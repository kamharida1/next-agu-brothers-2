import AdminLayout from '@/components/admin/AdminLayout'
import CategoryCreateOrEditForm from './Form'

export const metadata = {
  title: 'Admin Category Create',
}
const AdminCategoriesPage = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params
  return (
    <AdminLayout activeItem="categories">
      <CategoryCreateOrEditForm categoryId={id} />
    </AdminLayout>
  )
}

export default AdminCategoriesPage
