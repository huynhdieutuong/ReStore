import {ProductParams} from '../models/product'
import axiosClient from './axiosClient'

const url = 'products'

const catalogApi = {
  getProducts: (params: URLSearchParams) => axiosClient.get(url, {params}),
  getProductById: (id: string) => axiosClient.get(`${url}/${id}`),
  getFilters: () => axiosClient.get(`${url}/filters`),
}

export const getAxiosParams = (productParams: ProductParams) => {
  const params = new URLSearchParams()
  params.append('orderBy', productParams.orderBy)
  params.append('pageNumber', productParams.pageNumber.toString())
  params.append('pageSize', productParams.pageSize.toString())
  if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm)
  if (productParams.brands.length > 0) params.append('brands', productParams.brands.toString())
  if (productParams.types.length > 0) params.append('types', productParams.types.toString())
  return params
}

export const initParams = (): ProductParams => ({
  orderBy: 'name',
  searchTerm: '',
  brands: [],
  types: [],
  pageNumber: 1,
  pageSize: 6,
})

export default catalogApi
