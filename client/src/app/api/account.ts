import {LoginInput, RegisterInput} from '../models/account'
import axiosClient from './axiosClient'

const url = 'account'

const accountApi = {
  login: (values: LoginInput) => axiosClient.post(`${url}/login`, values),
  register: (values: RegisterInput) => axiosClient.post(`${url}/register`, values),
  currentUser: () => axiosClient.get(`${url}/currentUser`),
  getAddress: () => axiosClient.get(`${url}/saveAddress`),
}

export default accountApi
