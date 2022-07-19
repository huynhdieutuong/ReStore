import axiosClient from './axiosClient'

const url = 'basket'

const basketApi = {
  get: () => axiosClient.get(url),
  addItem: (productId: number, quantity: number = 1) =>
    axiosClient.post(`${url}?productId=${productId}&quantity=${quantity}`),
  removeItem: (productId: number, quantity: number = 1) =>
    axiosClient.delete(`${url}?productId=${productId}&quantity=${quantity}`),
}

export default basketApi
