import AdminLayout from '@/components/admin/AdminLayout'
import Settings from './Settings'
import productServices from '@/lib/services/productService'

export const metadata = {
  robots: { index: false, follow: false },  title: 'Admin Settings',}
export default async function AdminSettingsPage() {
  const latestProducts = await productServices.getLatest()

  return (
    <AdminLayout activeItem="settings">
      <Settings products={latestProducts} />
    </AdminLayout>
  )
}


