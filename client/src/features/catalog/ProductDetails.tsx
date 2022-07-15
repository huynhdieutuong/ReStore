import {
  CircularProgress,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material'
import {Box} from '@mui/system'
import {useEffect, useState} from 'react'
import {Navigate, useParams} from 'react-router-dom'
import {Product} from '../../app/models/product'

const ProductDetails = () => {
  const {productId} = useParams<{productId: string}>()
  const [loading, setLoading] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/id?id=${productId}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .finally(() => setLoading(false))
  }, [productId])

  if (loading)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '80vh',
        }}
      >
        <CircularProgress />
      </Box>
    )

  if (!product) return <Navigate to='..' />

  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          src={product.pictureUrl}
          alt={product.name}
          style={{width: '100%'}}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant='h3'>{product.name}</Typography>
        <Divider sx={{mb: 2}} />
        <Typography variant='h4' color='secondary'>
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <TableContainer>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>{product.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>{product.description}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>{product.type}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Brand</TableCell>
                <TableCell>{product.brand}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Quantity in stock</TableCell>
                <TableCell>{product.quantityInStock}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}

export default ProductDetails
