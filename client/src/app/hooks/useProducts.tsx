import {useEffect} from 'react'
import {
  fetchFiltersAsync,
  fetchProductsAsync,
  productSelectors,
  resetProductParams,
} from '../../features/catalog/catalogSlice'
import {useAppDispatch, useAppSelector} from '../store/hooks'

const useProducts = () => {
  const dispatch = useAppDispatch()
  const {status, productParams, filterStatus, filters, metaData} = useAppSelector(
    (state) => state.catalog
  )
  const products = useAppSelector(productSelectors.selectAll)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProductsAsync())
    if (filterStatus === 'idle') dispatch(fetchFiltersAsync())
  }, [filterStatus, status, dispatch])

  useEffect(() => {
    dispatch(resetProductParams())
  }, [dispatch])

  return {
    products,
    status,
    productParams,
    filterStatus,
    filters,
    metaData,
  }
}

export default useProducts
