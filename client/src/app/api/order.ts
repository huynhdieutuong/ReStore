import {CreateOrder} from '../models/order'
import axiosClient from './axiosClient'

const url = 'orders'

const orderApi = {
  getOrders: () => axiosClient.get(url),
  getOrderById: (id: string) => axiosClient.get(`${url}/${id}`),
  create: (values: CreateOrder) => axiosClient.post(url, values),
}

export default orderApi
