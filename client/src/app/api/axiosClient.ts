import axios, {AxiosError} from 'axios'
import {toast} from 'react-toastify'
import {history} from '../../index'
import {PaginatedResponse} from '../models/pagination'

interface DataError {
  type: string
  title: string
  status: number
  traceId: string
  errors: any
}

const sleep = () => new Promise((resolve) => setTimeout(resolve, 500))

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
})

axiosClient.interceptors.request.use(
  (config) => {
    let token = null
    if (localStorage.getItem('user')) token = JSON.parse(localStorage.getItem('user')!).token
    if (token) config.headers = {Authorization: `Bearer ${token}`}
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosClient.interceptors.response.use(
  async (response) => {
    await sleep()

    const pagination = response.headers['pagination']
    if (pagination) response.data = new PaginatedResponse(response.data, JSON.parse(pagination))

    return response
  },
  (error: AxiosError) => {
    const {data, status} = error.response!
    const dataError = data as DataError
    switch (status) {
      case 400:
        if (dataError.errors) {
          const modelStateErrors: string[] = []
          for (const key in dataError.errors) {
            if (dataError.errors[key]) modelStateErrors.push(dataError.errors[key])
          }
          throw modelStateErrors.flat()
        }
        toast.error(dataError.title)
        break
      case 401:
        toast.error(dataError.title)
        break
      case 404:
        toast.error(data as string)
        break
      case 500:
        history.push('../server-error', {error: dataError})
        toast.error(dataError.title)
        break
      default:
        break
    }
    return Promise.reject(error)
  }
)

export default axiosClient
