import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import LoadingComponent from '../../app/layout/LoadingComponent'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import {currencyFormat} from '../../app/utils/util'
import {getOrdersAsync, orderSelectors} from './orderSlice'

const OrdersPage = () => {
  const dispatch = useAppDispatch()
  const {status} = useAppSelector((state) => state.order)
  const orders = useAppSelector(orderSelectors.selectAll)
  const navigate = useNavigate()

  useEffect(() => {
    if (status === 'idle') dispatch(getOrdersAsync())
  }, [dispatch, status])

  if (status === 'pending') return <LoadingComponent message='Loading orders' />

  return (
    <TableContainer component={Paper}>
      <Table sx={{minWidth: 650}} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Order number</TableCell>
            <TableCell align='right'>Total</TableCell>
            <TableCell align='right'>Order Date</TableCell>
            <TableCell align='right'>Order Status</TableCell>
            <TableCell align='right'></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
              <TableCell component='th' scope='row'>
                {order.id}
              </TableCell>
              <TableCell align='right'>{currencyFormat(order.total)}</TableCell>
              <TableCell align='right'>{order.orderDate.split('T')[0]}</TableCell>
              <TableCell align='right'>{order.orderStatus}</TableCell>
              <TableCell align='right'>
                <Button onClick={() => navigate(order.id.toString())}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default OrdersPage
