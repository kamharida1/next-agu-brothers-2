import { Metadata } from 'next'
import ProductList from './ProductList'


export const metadata: Metadata = {
  title: `All Products`
}

export default async function AllProducts() {
  return <ProductList />
}
