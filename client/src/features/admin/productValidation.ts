import * as yup from 'yup'

const validationSchema = yup.object({
  name: yup.string().required('Product name is required'),
  brand: yup.string().required('Brand is required'),
  type: yup.string().required('Type is required'),
  price: yup.number().required('Price is required').moreThan(100),
  quantityInStock: yup.number().required('Quantity is required').min(0).max(200),
  description: yup.string().required('Description is required'),
  file: yup.mixed().when('pictureUrl', {
    is: (value: string) => !value,
    then: yup.mixed().required('Please provide an image'),
  }),
})

export default validationSchema
