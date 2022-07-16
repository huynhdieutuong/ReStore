import {Button, Divider, Paper, Typography} from '@mui/material'
import {Container} from '@mui/system'
import {useLocation, useNavigate} from 'react-router-dom'

const ServerError = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as any
  return (
    <Container component={Paper}>
      {state?.error ? (
        <>
          <Typography variant='h3' color='error' gutterBottom>
            {state.error.title}
          </Typography>
          <Divider />
          <Typography>
            {state.error.detail || 'Internal server error'}
          </Typography>
        </>
      ) : (
        <Typography variant='h5' gutterBottom>
          Server Error
        </Typography>
      )}
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

export default ServerError
