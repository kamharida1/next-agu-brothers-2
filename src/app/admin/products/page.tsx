import AdminLayout from '@/components/admin/AdminLayout'
import Products from './Products'

export const metadata = {
  robots: { index: false, follow: false },  title: 'Admin Products',}
const AdminProductsPage = () => {
  return (
    <AdminLayout activeItem="products">
      <Products />
    </AdminLayout>
  )
}

export default AdminProductsPage
