import {useEffect, useState} from 'react'
import {Outlet, useParams} from 'react-router-dom'
import {Product} from '../../app/models/product'
import ProductList from './ProductList'

const Catalog = () => {
  const {productId} = useParams<{productId: string}>()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  return <>{productId ? <Outlet /> : <ProductList products={products} />}</>
}

export default Catalog
