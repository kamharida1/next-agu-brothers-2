import AdminLayout from '@/components/admin/AdminLayout'
import Settings from './Settings'
import productServices from '@/lib/services/productService'
import { getSiteSettings } from '@/lib/services/siteSettingsService'

export const metadata = {
  robots: { index: false, follow: false },  title: 'Admin Settings',}
export default async function AdminSettingsPage() {
  const [latestProducts, siteSettings] = await Promise.all([
    productServices.getLatest(),
    getSiteSettings(),
  ])

  return (
    <AdminLayout activeItem="settings">
      <Settings
        products={latestProducts}
        autoCategoryBlogEnabled={siteSettings.autoCategoryBlogEnabled}
      />
    </AdminLayout>
  )
}


