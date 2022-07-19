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
import {useState} from 'react'
import {Link} from 'react-router-dom'
import basketApi from '../../app/api/basket'
import {useStoreContext} from '../../app/context/StoreContext'
import {Product} from '../../app/models/product'
import {currencyFormat} from '../../app/utils/util'

interface Props {
  product: Product
}

const ProductCard = ({product}: Props) => {
  const [loading, setLoading] = useState(false)
  const {setBasket} = useStoreContext()

  const handleAddItem = async (productId: number) => {
    setLoading(true)
    const res = await basketApi.addItem(productId)
    setBasket(res.data)
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar sx={{bgcolor: 'secondary.main'}}>
            {product.name.charAt(0).toUpperCase()}
          </Avatar>
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
          loading={loading}
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
