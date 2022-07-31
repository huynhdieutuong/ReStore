import {Visibility, VisibilityOff} from '@mui/icons-material'
import {
  Alert,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from '@mui/material'
import {ChangeEvent, useState} from 'react'
import {FieldError} from 'react-hook-form'
import regex from '../utils/regex'

interface PasswordErrors {
  minLength: boolean
  lowercaseLetter: boolean
  uppercaseLetter: boolean
  digit: boolean
  specialChar: boolean
}

interface Props {
  error: FieldError | undefined
  register: any
  label: string
  name: string
  isConfirmPassword?: boolean
  password?: string
}

const PasswordField = ({error, register, label, name, isConfirmPassword, password}: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors | null>(null)
  const alertType = (value: boolean) => (value ? 'success' : 'error')

  const preventCopyPaste = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    return false
  }

  return (
    <>
      <FormControl error={!!error} fullWidth margin='normal' variant='outlined'>
        <InputLabel htmlFor={`outlined-adornment-${name}`}>{label}</InputLabel>
        <OutlinedInput
          id={`outlined-adornment-${name}`}
          type={showPassword ? 'text' : 'password'}
          onPaste={preventCopyPaste}
          onCopy={preventCopyPaste}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={() => setShowPassword(!showPassword)}
                edge='end'
              >
                {!showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label={label}
          {...register(name, {
            required: `${label} is required`,
            validate: {
              [name]: (v: string) => {
                if (isConfirmPassword) {
                  return password === v || "Password doesn't match!"
                } else {
                  const isValid = regex.password.test(v)
                  let newErrors: PasswordErrors | null = null
                  if (!isValid) {
                    newErrors = {
                      minLength: v.length >= 8,
                      lowercaseLetter: regex.lowercaseLetter.test(v),
                      uppercaseLetter: regex.uppercaseLetter.test(v),
                      digit: regex.digit.test(v),
                      specialChar: regex.specialChar.test(v),
                    }
                  }
                  setPasswordErrors(newErrors)
                  return isValid
                }
              },
            },
          })}
        />
        {error && <FormHelperText id={name}>{error.message}</FormHelperText>}
      </FormControl>
      {!isConfirmPassword && error?.type !== 'required' && passwordErrors && (
        <Stack sx={{width: '100%'}} spacing={1}>
          <Alert severity={alertType(passwordErrors.minLength)}>Minumum eight characters</Alert>
          <Alert severity={alertType(passwordErrors.uppercaseLetter)}>
            At least one uppercase letter
          </Alert>
          <Alert severity={alertType(passwordErrors.lowercaseLetter)}>
            At least one lowercase letter
          </Alert>
          <Alert severity={alertType(passwordErrors.specialChar)}>
            At least one speacial character (@$!%*?&)
          </Alert>
          <Alert severity={alertType(passwordErrors.digit)}>At least one number</Alert>
        </Stack>
      )}
    </>
  )
}

export default PasswordField
