import {Delete, Edit} from '@mui/icons-material'
import {LoadingButton} from '@mui/lab'
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {useState} from 'react'
import PaginationGroup from '../../app/components/PaginationGroup'
import useProducts from '../../app/hooks/useProducts'
import {Product} from '../../app/models/product'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import {currencyFormat} from '../../app/utils/util'
import {deleteProductAsync, setPageNumber, setProductParams} from '../catalog/catalogSlice'
import ProductForm from './ProductForm'

const Inventory = () => {
  const dispatch = useAppDispatch()
  const {products, metaData, productParams} = useProducts()
  const {productStatus} = useAppSelector((state) => state.catalog)
  const [openForm, setOpenForm] = useState(false)
  const [target, setTarget] = useState(0)
  const [product, setProduct] = useState<Product | undefined>(undefined)

  const handleClickAdd = () => {
    setOpenForm(true)
    setProduct(undefined)
  }

  const handleClickEdit = (product: Product) => {
    setOpenForm(true)
    setProduct(product)
  }

  const handleDeleteProduct = (productId: number) => {
    setTarget(productId)
    dispatch(deleteProductAsync(productId.toString()))
  }

  if (openForm) return <ProductForm setOpenForm={setOpenForm} product={product} />

  return (
    <>
      <Box display='flex' justifyContent='space-between'>
        <Typography sx={{p: 2}} variant='h4'>
          Inventory
        </Typography>
        <Button onClick={handleClickAdd} sx={{m: 2}} size='large' variant='contained'>
          Create
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell align='left'>Product</TableCell>
              <TableCell align='right'>Price</TableCell>
              <TableCell align='center'>Type</TableCell>
              <TableCell align='center'>Brand</TableCell>
              <TableCell align='center'>Quantity</TableCell>
              <TableCell align='right'></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product: Product) => (
              <TableRow key={product.id} sx={{'&:last-child td, &:last-child th': {border: 0}}}>
                <TableCell component='th' scope='row'>
                  {product.id}
                </TableCell>
                <TableCell align='left'>
                  <Box display='flex' alignItems='center'>
                    <img
                      src={product.pictureUrl}
                      alt={product.name}
                      style={{height: 50, marginRight: 20}}
                    />
                    <span>{product.name}</span>
                  </Box>
                </TableCell>
                <TableCell align='right'>{currencyFormat(product.price)}</TableCell>
                <TableCell align='center'>{product.type}</TableCell>
                <TableCell align='center'>{product.brand}</TableCell>
                <TableCell align='center'>{product.quantityInStock}</TableCell>
                <TableCell align='right'>
                  <Button onClick={() => handleClickEdit(product)} startIcon={<Edit />} />
                  <LoadingButton
                    loading={productStatus === 'pending' && target === product.id}
                    onClick={() => handleDeleteProduct(product.id)}
                    startIcon={<Delete />}
                    color='error'
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {metaData && (
        <PaginationGroup
          metaData={metaData}
          size={productParams.pageSize}
          onPageChange={(page: number) => dispatch(setPageNumber(page))}
          onSizeChange={(size: number) => dispatch(setProductParams({pageSize: size}))}
        />
      )}
    </>
  )
}

export default Inventory
