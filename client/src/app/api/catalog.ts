import axiosClient from './axiosClient'

const url = 'products'

const catalogApi = {
  getProducts: () => axiosClient.get(url),
  getProductById: (id: string) => axiosClient.get(`${url}/${id}`),
}

export default catalogApi
