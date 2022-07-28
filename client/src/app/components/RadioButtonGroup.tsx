import {FormControl, FormControlLabel, FormLabel, Radio, RadioGroup} from '@mui/material'
import {ChangeEvent} from 'react'

interface RadioItem {
  value: string
  label: string
}

interface Props {
  items: RadioItem[]
  label?: string
  defaultValue: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const RadioButtonGroup = ({items, label, defaultValue, onChange}: Props) => {
  return (
    <FormControl fullWidth>
      {label && <FormLabel>{label}</FormLabel>}
      <RadioGroup name='radio-buttons-group' value={defaultValue} onChange={onChange}>
        {items.length &&
          items.map(({value, label}) => (
            <FormControlLabel key={value} value={value} control={<Radio />} label={label} />
          ))}
      </RadioGroup>
    </FormControl>
  )
}

export default RadioButtonGroup
