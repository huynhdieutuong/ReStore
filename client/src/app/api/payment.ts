import axiosClient from './axiosClient'

const url = 'payments'

const paymentApi = {
  createOrUpdatePaymentIntent: () => axiosClient.post(url),
}

export default paymentApi
