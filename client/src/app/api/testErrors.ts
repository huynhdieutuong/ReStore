import axiosClient from './axiosClient'

const url = 'buggy'

const testErrors = {
  get400Error: () => axiosClient.get(`${url}/bad-request`),
  get401Error: () => axiosClient.get(`${url}/unauthorized`),
  get404Error: () => axiosClient.get(`${url}/not-found`),
  get500Error: () => axiosClient.get(`${url}/server-error`),
  getValidationError: () => axiosClient.get(`${url}/validation-error`),
}

export default testErrors
