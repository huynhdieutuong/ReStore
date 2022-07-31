import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {LoadingButton} from '@mui/lab'
import {Paper} from '@mui/material'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import {Container} from '@mui/system'
import {useEffect} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {Link as RouterLink, Navigate} from 'react-router-dom'
import PasswordField from '../../app/components/PasswordField'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import regex from '../../app/utils/regex'
import {registerAsync} from './accountSlice'

interface FormInput {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const Register = () => {
  const {status, user, registerErrors} = useAppSelector((state) => state.account)
  const dispatch = useAppDispatch()
  const {
    register,
    handleSubmit,
    formState: {errors, isDirty, isValid},
    getValues,
    setError,
  } = useForm<FormInput>({mode: 'all'})
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    dispatch(registerAsync(data))
  }

  useEffect(() => {
    if (registerErrors.length) {
      registerErrors.forEach((error) => {
        if (error.includes('Username')) setError('username', {message: error})
        if (error.includes('Email')) setError('email', {message: error})
        if (error.includes('Password')) setError('password', {message: error})
      })
    }
  }, [registerErrors, setError])

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
        Register
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
        <TextField
          margin='normal'
          fullWidth
          id='email'
          label='Email Address'
          autoComplete='email'
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: regex.email,
              message: 'Not a valid email address',
            },
          })}
          error={!!errors.email}
          helperText={errors?.email?.message}
        />
        <PasswordField
          error={errors?.password}
          register={register}
          label='Password'
          name='password'
        />
        <PasswordField
          error={errors?.confirmPassword}
          register={register}
          label='Confirm Password'
          name='confirmPassword'
          isConfirmPassword
          password={getValues().password}
        />
        <LoadingButton
          fullWidth
          variant='contained'
          sx={{mt: 3, mb: 2}}
          type='submit'
          disabled={!isDirty || !isValid}
          loading={status === 'pending'}
        >
          Register
        </LoadingButton>
        <Grid container>
          <Grid item>
            <Link variant='body2' component={RouterLink} to='../login'>
              {'Already have an account? Login'}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Register
