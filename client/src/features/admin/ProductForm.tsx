import {yupResolver} from '@hookform/resolvers/yup'
import {LoadingButton} from '@mui/lab'
import {Box, Paper, Typography, Grid, Button} from '@mui/material'
import React, {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import RhfDropzone from '../../app/components/RhfDropzone'
import RhfSelect from '../../app/components/RhfSelect'
import RhfTextField from '../../app/components/RhfTextField'
import useProducts from '../../app/hooks/useProducts'
import {Product} from '../../app/models/product'
import {useAppDispatch} from '../../app/store/hooks'
import {createProductAsync, updateProductAsync} from '../catalog/catalogSlice'
import productValidation from './productValidation'

interface Props {
  setOpenForm: (openForm: boolean) => void
  product?: Product
}

const ProductForm = ({setOpenForm, product}: Props) => {
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: {isDirty, isSubmitting, isValid},
  } = useForm({
    mode: 'all',
    resolver: yupResolver(productValidation),
  })
  const {filters} = useProducts()
  const watchFile = watch('file', null)
  const dispatch = useAppDispatch()

  const onSubmit = async (data: any) => {
    if (product) {
      await dispatch(updateProductAsync(data))
    } else {
      await dispatch(createProductAsync(data))
    }
    setOpenForm(false)
  }

  useEffect(() => {
    if (product && !watchFile && !isDirty) reset(product)

    return () => {
      if (watchFile) URL.revokeObjectURL(watchFile.preview)
    }
  }, [product, reset, watchFile, isDirty])

  return (
    <Box component={Paper} sx={{p: 4}}>
      <Typography variant='h4' gutterBottom sx={{mb: 4}}>
        {product ? 'Update Product' : 'Add Product'}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <RhfTextField control={control} name='name' label='Product name' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RhfSelect control={control} items={filters.brands} name='brand' label='Brand' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RhfSelect control={control} items={filters.types} name='type' label='Type' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RhfTextField type='number' control={control} name='price' label='Price' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RhfTextField
              type='number'
              control={control}
              name='quantityInStock'
              label='Quantity in Stock'
            />
          </Grid>
          <Grid item xs={12}>
            <RhfTextField
              multiline={true}
              rows={4}
              control={control}
              name='description'
              label='Description'
            />
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <RhfDropzone control={control} name='file' />
              {watchFile ? (
                <img src={watchFile.preview} alt='preview' style={{maxHeight: 200}} />
              ) : (
                <img src={product?.pictureUrl} alt={product?.name} style={{maxHeight: 200}} />
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between' alignItems='center'></Box>
          </Grid>
        </Grid>
        <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
          <Button onClick={() => setOpenForm(false)} variant='contained' color='inherit'>
            Cancel
          </Button>
          <LoadingButton
            loading={isSubmitting}
            disabled={!isDirty || !isValid}
            type='submit'
            variant='contained'
            color='success'
          >
            Submit
          </LoadingButton>
        </Box>
      </form>
    </Box>
  )
}

export default ProductForm
