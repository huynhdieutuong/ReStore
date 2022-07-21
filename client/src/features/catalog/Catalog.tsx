import {useEffect} from 'react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import {fetchProductsAsync, productSelectors} from './catalogSlice'
import ProductList from './ProductList'

const Catalog = () => {
  const dispatch = useAppDispatch()
  const {status} = useAppSelector((state) => state.catalog)
  const products = useAppSelector(productSelectors.selectAll)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProductsAsync())
  }, [status, dispatch])

  if (status === 'pending') return <LoadingComponent message='Loading products...' />

  return <ProductList products={products} />
}

export default Catalog
