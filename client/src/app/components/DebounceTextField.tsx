import {debounce, TextField} from '@mui/material'
import {ChangeEvent, useRef, useState} from 'react'

interface Props {
  label: string
  defaultValue: string
  cb: (value: string) => void
  delay?: number
}

const DebounceTextField = ({label, defaultValue, cb, delay = 1000}: Props) => {
  const [value, setValue] = useState(defaultValue)
  const debounceChange = useRef(debounce(cb, delay)).current

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    debounceChange(e.target.value)
  }

  return (
    <TextField
      id='outlined-basic'
      label={label}
      variant='outlined'
      fullWidth
      value={value}
      onChange={handleChange}
    />
  )
}

export default DebounceTextField
