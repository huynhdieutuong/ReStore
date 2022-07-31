import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {LoadingButton} from '@mui/lab'
import {Paper} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import {Link as RouterLink, Navigate} from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {Container} from '@mui/system'
import {SubmitHandler, useForm} from 'react-hook-form'
import PasswordField from '../../app/components/PasswordField'
import {LoginInput} from '../../app/models/account'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import {loginAsync} from './accountSlice'

const Login = () => {
  const {status, user} = useAppSelector((state) => state.account)
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: {errors, isDirty, isValid},
  } = useForm<LoginInput>({mode: 'all'})

  const onSubmit: SubmitHandler<LoginInput> = (data) => {
    dispatch(loginAsync(data))
  }

  if (user) return <Navigate to='../catalog' />

  return (
    <Container
      component={Paper}
      maxWidth='sm'
      sx={{
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 4,
      }}
    >
      <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        Login
      </Typography>
      <Box
        component='form'
        noValidate
        sx={{mt: 1, width: '100%', px: 4}}
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextField
          margin='normal'
          fullWidth
          id='username'
          label='Username'
          autoComplete='username'
          {...register('username', {
            required: 'Username is required',
          })}
          error={!!errors.username}
          helperText={errors?.username?.message}
        />
        <PasswordField
          error={errors?.password}
          register={register}
          label='Password'
          name='password'
        />
        <LoadingButton
          fullWidth
          variant='contained'
          sx={{mt: 3, mb: 2}}
          type='submit'
          disabled={!isDirty || !isValid}
          loading={status === 'pending'}
        >
          Login
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link variant='body2' component={RouterLink} to='../register'>
              {"Don't have an account? Sign Up"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Login
