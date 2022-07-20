import {LoadingButton} from '@mui/lab'
import {
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import {useEffect, useState} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {toast} from 'react-toastify'
import catalogApi from '../../app/api/catalog'
import LoadingComponent from '../../app/layout/LoadingComponent'
import {BasketItem} from '../../app/models/basket'
import {Product} from '../../app/models/product'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import {addBasketItemAsync, removeBasketItemAsync} from '../basket/basketSlice'

const ProductDetails = () => {
  const {productId} = useParams<{productId: string}>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const {basket, status} = useAppSelector((state) => state.basket)
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState(1)
  const item = basket?.items.find((item: BasketItem) => item.productId.toString() === productId)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await catalogApi.getProductById(productId as string)
        setProduct(res.data)
        setLoading(false)
      } catch (error) {
        const errors = error as Array<string>
        toast.error(errors[0])
        navigate('..')
      }
    }

    fetchData()
    if (item) setQuantity(item.quantity)
  }, [productId, navigate, item])

  const handleInputChange = (e: any) => {
    const value = e.target.value
    if (value > 0) setQuantity(parseInt(value))
  }

  const handleUpdateCart = () => {
    if (!item || item.quantity < quantity) {
      const updateQuantity = item ? quantity - item.quantity : quantity
      dispatch(
        addBasketItemAsync({
          name: `update-cart`,
          productId: product?.id!,
          quantity: updateQuantity,
        })
      )
    } else {
      const updateQuantity = item.quantity - quantity
      dispatch(
        removeBasketItemAsync({
          name: `update-cart`,
          productId: product?.id!,
          quantity: updateQuantity,
        })
      )
    }
  }

  if (loading) return <LoadingComponent message='Loading product...' />

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img src={product?.pictureUrl} alt={product?.name} style={{width: '100%'}} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant='h3'>{product?.name}</Typography>
        <Divider sx={{mb: 2}} />
        <Typography variant='h4' color='secondary'>
          ${(product?.price! / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product?.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product?.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product?.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product?.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              variant='outlined'
              type='number'
              label='Quantity in Cart'
              fullWidth
              value={quantity}
              onChange={handleInputChange}
              disabled={!item}
            />
          </Grid>
          <Grid item xs={6}>
            <LoadingButton
              sx={{height: '55px'}}
              color='primary'
              size='large'
              variant='contained'
              fullWidth
              disabled={item?.quantity === quantity}
              loading={status === 'update-cart'}
              onClick={handleUpdateCart}
            >
              {item ? 'Update Quantity' : 'Add to Cart'}
            </LoadingButton>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default ProductDetails
