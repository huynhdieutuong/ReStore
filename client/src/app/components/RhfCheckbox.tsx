import {Checkbox, FormControlLabel} from '@mui/material'
import React from 'react'
import {FieldValues, useController, UseControllerProps} from 'react-hook-form'

interface Props<T extends FieldValues> extends UseControllerProps<T> {
  label: string
  disabled: boolean
}

const RhfCheckbox = <T extends FieldValues>(props: Props<T>) => {
  const {field} = useController<T>(props)

  return (
    <FormControlLabel
      control={
        <Checkbox {...field} checked={field.value} color='secondary' disabled={props.disabled} />
      }
      label={props.label}
    />
  )
}

export default RhfCheckbox
