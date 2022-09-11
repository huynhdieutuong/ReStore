import {Grid, Paper} from '@mui/material'
import {ChangeEvent} from 'react'
import CheckboxButtons from '../../app/components/CheckboxButtons'
import DebounceTextField from '../../app/components/DebounceTextField'
import PaginationGroup from '../../app/components/PaginationGroup'
import RadioButtonGroup from '../../app/components/RadioButtonGroup'
import useProducts from '../../app/hooks/useProducts'
import LoadingComponent from '../../app/layout/LoadingComponent'
import {useAppDispatch} from '../../app/store/hooks'
import {setPageNumber, setProductParams} from './catalogSlice'
import ProductList from './ProductList'

const sortOptions = [
  {label: 'Alphabetical', value: 'name'},
  {label: 'Price - High to low', value: 'priceDesc'},
  {label: 'Price - Low to high', value: 'price'},
]

const Catalog = () => {
  const dispatch = useAppDispatch()
  const {products, status, productParams, filterStatus, filters, metaData} = useProducts()

  if (filterStatus === 'pending') return <LoadingComponent message='Loading products...' />

  return (
    <>
      <Grid container columnSpacing={4}>
        <Grid item sm={12} md={3} sx={{flexBasis: '100%'}}>
          <Paper sx={{mb: 2}}>
            <DebounceTextField
              label='Search products'
              defaultValue={productParams.searchTerm}
              cb={(value) => dispatch(setProductParams({searchTerm: value}))}
            />
          </Paper>
          <Paper sx={{mb: 2, p: 2}}>
            <RadioButtonGroup
              items={sortOptions}
              defaultValue={productParams.orderBy}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                dispatch(setProductParams({orderBy: e.target.value}))
              }
            />
          </Paper>
          <Paper sx={{mb: 2, p: 2}}>
            <CheckboxButtons
              label='Brands:'
              items={filters.brands}
              checked={productParams.brands}
              onChange={(checked: string[]) => dispatch(setProductParams({brands: checked}))}
            />
          </Paper>
          <Paper sx={{mb: 2, p: 2}}>
            <CheckboxButtons
              label='Types:'
              items={filters.types}
              checked={productParams.types}
              onChange={(checked: string[]) => dispatch(setProductParams({types: checked}))}
            />
          </Paper>
        </Grid>
        <Grid item sm={12} md={9}>
          <ProductList products={products} status={status} />
        </Grid>
        <Grid item md={3} sx={{display: {xs: 'none', md: 'block'}}} />
        <Grid item xs={12} md={9}>
          {metaData && (
            <PaginationGroup
              metaData={metaData}
              size={productParams.pageSize}
              onPageChange={(page: number) => dispatch(setPageNumber(page))}
              onSizeChange={(size: number) => dispatch(setProductParams({pageSize: size}))}
            />
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default Catalog
