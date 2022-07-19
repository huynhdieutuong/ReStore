import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material'
import {Basket} from '../../app/models/basket'
import {currencyFormat} from '../../app/utils/util'

interface Props {
  basket: Basket
}

const BasketSummary = ({basket}: Props) => {
  const subTotal = basket.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )
  const deliveryFee = subTotal > 10000 ? 0 : 500

  return (
    <>
      <TableContainer component={Paper} variant='outlined'>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>Subtotal</TableCell>
              <TableCell align='right'>{currencyFormat(subTotal)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Delivery fee*</TableCell>
              <TableCell align='right'>{currencyFormat(deliveryFee)}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell align='right'>
                {currencyFormat(subTotal + deliveryFee)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <span style={{fontStyle: 'italic'}}>
                  *Orders over $100 qualify for free delivery
                </span>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default BasketSummary
