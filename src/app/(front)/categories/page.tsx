import Link from 'next/link'
import productServices from '@/lib/services/productService'
import { categoryHref, CATEGORY_ICONS } from '@/lib/categorySlugs'
import { staticPageMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = staticPageMetadata({
  title: 'Shop by Department | Agu Brothers Electronics',
  description:
    'Browse electronics and home appliance departments — TVs, refrigerators, air conditioners, generators, freezers, gas cookers, and more. All brand new with nationwide delivery.',
  path: '/categories',
})

export default async function CategoriesIndexPage() {
  const categories = await productServices.getCategories()

  return (
    <div className="bg-[#EAEDED] min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-4">
        <div className="text-sm text-[#565959] mb-3">
          <Link href="/" className="text-[#007185] hover:underline hover:text-[#CC0C39]">
            Home
          </Link>
          <span className="mx-1">›</span>
          <span>Departments</span>
        </div>

        <div className="bg-white rounded-sm shadow-sm p-4 md:p-6 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F1111]">Shop by Department</h1>
          <p className="text-[#565959] mt-2 max-w-2xl">
            Explore brand-new electronics and home appliances by department. Every product includes
            manufacturer warranty and delivery across Nigeria.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {categories.map((cat) => (
            <Link
              key={cat}
              href={categoryHref(cat)}
              className="bg-white rounded-sm shadow-sm p-4 flex flex-col items-center gap-2 text-center border border-transparent hover:border-[#FF9900] transition-colors"
            >
              <span className="text-3xl">{CATEGORY_ICONS[cat] ?? '🛍️'}</span>
              <span className="text-sm font-medium text-[#0F1111]">{cat}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
