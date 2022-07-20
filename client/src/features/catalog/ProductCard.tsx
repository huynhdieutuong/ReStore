import {LoadingButton} from '@mui/lab'
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@mui/material'
import {Link} from 'react-router-dom'
import {Product} from '../../app/models/product'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import {currencyFormat} from '../../app/utils/util'
import {addBasketItemAsync} from '../basket/basketSlice'

interface Props {
  product: Product
}

const ProductCard = ({product}: Props) => {
  const {status} = useAppSelector((state) => state.basket)
  const dispatch = useAppDispatch()

  const handleAddItem = async (productId: number) =>
    dispatch(
      addBasketItemAsync({
        productId,
        quantity: 1,
        name: `add-${productId}`,
      })
    )

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{bgcolor: 'secondary.main'}}>{product.name.charAt(0).toUpperCase()}</Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: {fontWeight: 'bold'},
          color: 'primary.main',
        }}
      />
      <CardMedia
        sx={{height: 140, backgroundSize: 'contain', bgcolor: 'primary.light'}}
        image={product.pictureUrl}
        title={product.name}
      />
      <CardContent>
        <Typography variant='h5' color='secondary'>
          {currencyFormat(product.price)}
        </Typography>
        <Typography variant='body2' color='text.secondary'>
          {product.brand} / {product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton
          size='small'
          loading={status === `add-${product.id}`}
          onClick={() => handleAddItem(product.id)}
        >
          Add to cart
        </LoadingButton>
        <Button size='small' component={Link} to={product.id.toString()}>
          View
        </Button>
      </CardActions>
    </Card>
  )
}

export default ProductCard
