import {Grid} from '@mui/material'
import {Product} from '../../app/models/product'
import ProductCard from './ProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'

interface Props {
  products: Product[]
  status: string
}

const ProductList = ({products, status}: Props) => {
  return (
    <>
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            {status === 'pending' ? <ProductCardSkeleton /> : <ProductCard product={product} />}
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default ProductList
