import AdminLayout from '@/components/admin/AdminLayout'
import Products from './Products'

export const metadata = {
  title: 'Admin Products',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
}
const AdminProductsPage = () => {
  return (
    <AdminLayout activeItem="products">
      <Products />
    </AdminLayout>
  )
}

export default AdminProductsPage
