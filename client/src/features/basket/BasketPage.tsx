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
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import basketApi from '../../app/api/basket'
import {useStoreContext} from '../../app/context/StoreContext'
import {currencyFormat} from '../../app/utils/util'
import BasketSummary from './BasketSummary'

interface UpdateItem {
  name: string
  productId: number
  quantity?: number
}

const BasketPage = () => {
  const navigate = useNavigate()
  const {basket, setBasket, removeItem} = useStoreContext()
  const [clicked, setClicked] = useState('')

  const handleAddItem = async ({name, productId, quantity = 1}: UpdateItem) => {
    setClicked(name)
    const res = await basketApi.addItem(productId, quantity)
    setBasket(res.data)
    setClicked('')
  }

  const handleRemoveItem = async ({
    name,
    productId,
    quantity = 1,
  }: UpdateItem) => {
    setClicked(name)
    await basketApi.removeItem(productId, quantity)
    removeItem(productId, quantity)
    setClicked('')
  }

  if (!basket) return <Typography variant='h3'>Your basket is empty</Typography>

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
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {basket.items.map((item) => (
              <TableRow
                key={item.productId}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
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
                <TableCell align='right'>
                  {currencyFormat(item.price)}
                </TableCell>
                <TableCell align='center'>
                  <LoadingButton
                    color='error'
                    loading={clicked === `remove-${item.productId}`}
                    onClick={() =>
                      handleRemoveItem({
                        name: `remove-${item.productId}`,
                        productId: item.productId,
                      })
                    }
                  >
                    <Remove />
                  </LoadingButton>
                  {item.quantity}
                  <LoadingButton
                    color='secondary'
                    loading={clicked === `add-${item.productId}`}
                    onClick={() =>
                      handleAddItem({
                        name: `add-${item.productId}`,
                        productId: item.productId,
                      })
                    }
                  >
                    <Add />
                  </LoadingButton>
                </TableCell>
                <TableCell align='right'>
                  {currencyFormat(item.price * item.quantity)}
                </TableCell>
                <TableCell align='right'>
                  <LoadingButton
                    color='error'
                    loading={clicked === `delete-${item.productId}`}
                    onClick={() =>
                      handleRemoveItem({
                        name: `delete-${item.productId}`,
                        productId: item.productId,
                        quantity: item.quantity,
                      })
                    }
                  >
                    <Delete />
                  </LoadingButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary basket={basket} />
          <Button
            variant='contained'
            size='large'
            fullWidth
            onClick={() => navigate('../checkout')}
          >
            Checkout
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default BasketPage
