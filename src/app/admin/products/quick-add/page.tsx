import AdminLayout from '@/components/admin/AdminLayout'
import QuickAddForm from './QuickAddForm'

export const metadata = {
  title: 'Quick Add Product',
}

export default function QuickAddProductPage() {
  return (
    <AdminLayout activeItem="products">
      <QuickAddForm />
    </AdminLayout>
  )
}
