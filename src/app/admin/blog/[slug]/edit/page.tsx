import AdminLayout from '@/components/admin/AdminLayout'
import BlogEditForm from './Form'

export function generateMetadata({ params }: { params: { slug: string } }) {
  return {
    title: `Edit Product ${params.slug}`,
  }
}

export default function AdminProductsPage({
  params,
}: {
  params: { slug: string }
}) {
  return (
    <AdminLayout activeItem="blog">
      <BlogEditForm slug={params.slug} />
    </AdminLayout>
  )
}
;``
