import {Card, CardActions, CardContent, CardHeader, Skeleton} from '@mui/material'

const ProductCardSkeleton = () => {
  return (
    <Card>
      <CardHeader
        avatar={<Skeleton animation='wave' variant='circular' width={40} height={40} />}
        title={<Skeleton animation='wave' width='80%' height={10} />}
      />
      <Skeleton animation='wave' variant='rectangular' height={140} />
      <CardContent>
        <Skeleton animation='wave' height={10} width='60%' sx={{mb: 1}} />
        <Skeleton animation='wave' height={10} width='80%' />
      </CardContent>
      <CardActions>
        <Skeleton animation='wave' height={10} width='40%' />
        <Skeleton animation='wave' height={10} width='20%' />
      </CardActions>
    </Card>
  )
}

export default ProductCardSkeleton
