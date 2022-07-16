import {Backdrop, CircularProgress, Typography} from '@mui/material'
import {Box} from '@mui/system'

interface Props {
  message?: string
}

const LoadingComponent = ({message = 'Loading...'}: Props) => {
  return (
    <Backdrop open={true} invisible={true}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress size={50} color='secondary' />
        <Typography variant='h4' sx={{mt: 5}}>
          {message}
        </Typography>
      </Box>
    </Backdrop>
  )
}

export default LoadingComponent
