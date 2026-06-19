import AdminLayout from '@/components/admin/AdminLayout'
import BlogEditForm from './Form'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return {
    title: `Edit Product ${slug}`,
  }
}

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  return (
    <AdminLayout activeItem="blog">
      <BlogEditForm slug={slug} />
    </AdminLayout>
  )
}
;``
