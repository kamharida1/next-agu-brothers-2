import AdminLayout from '@/components/admin/AdminLayout'
import ProductCreateForm from './ProductCreateForm'

export const metadata = {
  title: 'Admin Product Create',
}
const AdminProductsPage = () => {
  return (
    <AdminLayout activeItem="products">
      <ProductCreateForm />
    </AdminLayout>
  )
}

export default AdminProductsPage
