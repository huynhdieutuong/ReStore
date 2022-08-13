import * as yup from 'yup'

const validationSchema = [
  yup.object({
    fullName: yup.string().required('Full name is required'),
    address1: yup.string().required('Address 1 is required'),
    address2: yup.string().required('Address 2 is required'),
    city: yup.string().required('City is required'),
    state: yup.string().required('State is required'),
    zip: yup.string().required('Zip is required'),
    country: yup.string().required('Country is required'),
  }),
  yup.object({}),
  yup.object({
    cardName: yup.string().required('Card name is required'),
  }),
]

export default validationSchema
