import {
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {Box} from '@mui/system'
import {useEffect} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import LoadingComponent from '../../app/layout/LoadingComponent'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import {currencyFormat} from '../../app/utils/util'
import {getOrderByIdAsync, orderSelectors} from './orderSlice'

const OrderDetails = () => {
  const {orderId} = useParams<{orderId: string}>()
  const dispatch = useAppDispatch()
  const order = useAppSelector((state) => orderSelectors.selectById(state, orderId!))
  const {orderStatus} = useAppSelector((state) => state.order)
  const navigate = useNavigate()

  useEffect(() => {
    if (!order) dispatch(getOrderByIdAsync(orderId!))
  }, [dispatch, order, orderId])

  if (orderStatus === 'pending') return <LoadingComponent message='Loading order...' />

  const {fullName, address1, address2, state, city, country, zip} = order?.shippingAddress || {}

  return (
    <>
      <Box display='flex' alignItems='center' justifyContent='space-between'>
        <Typography sx={{p: 2}} gutterBottom variant='h4'>
          Order# {order?.id!} - {order?.orderStatus!}
        </Typography>
        <Button onClick={() => navigate('..')} size='large' variant='contained'>
          Back to orders
        </Button>
      </Box>
      <Grid container sx={{mb: 2}} spacing={2}>
        <Grid item xs={12} md={4}>
          <Box component={Paper} sx={{p: 2, height: '100%'}}>
            <Typography variant='h5' component='div'>
              {fullName}
            </Typography>
            <Typography variant='body2'>
              Address: {address1} - {address2} <br />
              State: {state} - {zip} <br />
              City: {city} - {country} <br />
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box component={Paper} sx={{p: 2, height: '100%'}}>
            <Typography variant='h5' component='div'>
              Order date: {order?.orderDate.split('T')[0]}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box component={Paper} sx={{p: 2, height: '100%'}}>
            <Typography variant='h5' component='div'>
              Payment
            </Typography>
          </Box>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align='right'>Price</TableCell>
              <TableCell align='center'>Quantity</TableCell>
              <TableCell align='right'>Subtotal</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order?.orderItems.map((item) => (
              <TableRow key={item.productId} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                <TableCell component='th' scope='row'>
                  <Box sx={{display: 'flex', alignItems: 'center'}}>
                    <img
                      src={item.pictureUrl}
                      alt={item.name}
                      style={{height: 50, marginRight: 20}}
                    />
                    <span>{item.name}</span>
                  </Box>
                </TableCell>
                <TableCell align='right'>{currencyFormat(item.price)}</TableCell>
                <TableCell align='center'>{item.quantity}</TableCell>
                <TableCell align='right'>{currencyFormat(item.price * item.quantity)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={12} md={6} />
        <Grid item xs={12} md={6}>
          <TableContainer component={Paper} variant='outlined'>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2}>Subtotal</TableCell>
                  <TableCell align='right'>{currencyFormat(order?.subtotal!)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Delivery fee*</TableCell>
                  <TableCell align='right'>{currencyFormat(order?.deliveryFee!)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>Total</TableCell>
                  <TableCell align='right'>{currencyFormat(order?.total!)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  )
}

export default OrderDetails
