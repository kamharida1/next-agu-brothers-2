import { Metadata } from 'next'
import ProductList from './ProductList'

const BASE_URL = 'https://www.agubrothers.com'

export const metadata: Metadata = {
  title: 'All Products | Agu Brothers Electronics Nigeria',
  description: 'Browse our complete range of electronics and home appliances — TVs, refrigerators, generators, air conditioners, gas cookers, washing machines and more. Fast delivery across Nigeria.',
  alternates: { canonical: `${BASE_URL}/all-products` },
  openGraph: {
    title: 'All Products | Agu Brothers Electronics',
    description: 'Browse all electronics and home appliances at Agu Brothers Nigeria.',
    url: `${BASE_URL}/all-products`,
  },
}

export default async function AllProducts() {
  return <ProductList />
}
