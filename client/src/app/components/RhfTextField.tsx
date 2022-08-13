import {TextField} from '@mui/material'
import {FieldValues, useController, UseControllerProps} from 'react-hook-form'

interface Props<T extends FieldValues> extends UseControllerProps<T> {
  label: string
}

const RhfTextField = <T extends FieldValues>(props: Props<T>) => {
  const {field, fieldState} = useController<T>(props)

  return (
    <TextField
      {...props}
      {...field}
      fullWidth
      variant='standard'
      error={!!fieldState.error}
      helperText={fieldState.error?.message}
    />
  )
}

export default RhfTextField
