import {Button, Divider, Paper, Typography} from '@mui/material'
import {Container} from '@mui/system'
import {useNavigate} from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <Container component={Paper} sx={{height: 400}}>
      <Typography variant='h3' sx={{py: 3}}>
        Oops - we could not find what you are looking for
      </Typography>
      <Divider />
      <Button
        size='large'
        fullWidth
        sx={{mt: 3}}
        onClick={() => navigate('../catalog')}
      >
        Go back to shop
      </Button>
    </Container>
  )
}

export default NotFound
