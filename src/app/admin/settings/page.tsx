import AdminLayout from '@/components/admin/AdminLayout'
import Settings from './Settings'
import productServices from '@/lib/services/productService'

export const metadata = {
  title: 'Admin Settings',
  robots: {
    index: false,
    follow: true,
    nocache: true,
  },
}
export default async function AdminSettingsPage() {
  const latestProducts = await productServices.getLatest()

  return (
    <AdminLayout activeItem="settings">
      <Settings products={latestProducts} />
    </AdminLayout>
  )
}


