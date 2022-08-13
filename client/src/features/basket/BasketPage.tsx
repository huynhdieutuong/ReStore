import {Add, Delete, Remove} from '@mui/icons-material'
import {LoadingButton} from '@mui/lab'
import {
  Button,
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
import {useNavigate} from 'react-router-dom'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import {currencyFormat} from '../../app/utils/util'
import {addBasketItemAsync, removeBasketItemAsync} from './basketSlice'
import BasketSummary from './BasketSummary'

interface Props {
  isBasket?: boolean
}

const BasketPage = ({isBasket = true}: Props) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const {basket, status} = useAppSelector((state) => state.basket)

  if (!basket || !basket.items.length)
    return <Typography variant='h3'>Your basket is empty</Typography>

  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}}>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell align='right'>Price</TableCell>
              <TableCell align='center'>Quantity</TableCell>
              <TableCell align='right'>Subtotal</TableCell>
              {isBasket && <TableCell align='right'></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
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
                <TableCell align='center'>
                  {isBasket && (
                    <LoadingButton
                      color='error'
                      loading={status === `remove-${item.productId}`}
                      onClick={() =>
                        dispatch(
                          removeBasketItemAsync({
                            name: `remove-${item.productId}`,
                            productId: item.productId,
                            quantity: 1,
                          })
                        )
                      }
                    >
                      <Remove />
                    </LoadingButton>
                  )}
                  {item.quantity}
                  {isBasket && (
                    <LoadingButton
                      color='secondary'
                      loading={status === `add-${item.productId}`}
                      onClick={() =>
                        dispatch(
                          addBasketItemAsync({
                            name: `add-${item.productId}`,
                            productId: item.productId,
                            quantity: 1,
                          })
                        )
                      }
                    >
                      <Add />
                    </LoadingButton>
                  )}
                </TableCell>
                <TableCell align='right'>{currencyFormat(item.price * item.quantity)}</TableCell>
                {isBasket && (
                  <TableCell align='right'>
                    <LoadingButton
                      color='error'
                      loading={status === `delete-${item.productId}`}
                      onClick={() =>
                        dispatch(
                          removeBasketItemAsync({
                            name: `delete-${item.productId}`,
                            productId: item.productId,
                            quantity: item.quantity,
                          })
                        )
                      }
                    >
                      <Delete />
                    </LoadingButton>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary basket={basket} />
          {isBasket && (
            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={() => navigate('../checkout')}
            >
              Checkout
            </Button>
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default BasketPage
