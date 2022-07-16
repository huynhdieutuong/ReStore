import {useEffect, useState} from 'react'
import catalogApi from '../../app/api/catalog'
import LoadingComponent from '../../app/layout/LoadingComponent'
import {Product} from '../../app/models/product'
import ProductList from './ProductList'

const Catalog = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await catalogApi.getProducts()
      setProducts(res.data)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) return <LoadingComponent message='Loading products...' />

  return <ProductList products={products} />
}

export default Catalog
