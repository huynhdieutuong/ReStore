import {Checkbox, FormControlLabel, FormGroup, FormLabel} from '@mui/material'
import {useState} from 'react'

interface Props {
  label?: string
  items: string[]
  checked: string[]
  onChange: (checked: string[]) => void
}

const CheckboxButtons = ({label, items, checked, onChange}: Props) => {
  const [checkedItems, setCheckedItems] = useState<string[]>(checked)

  const handleChange = (item: string) => {
    const index = checkedItems.indexOf(item)
    const newChecked: string[] = [...checkedItems]
    if (index === -1) {
      newChecked.push(item)
    } else {
      newChecked.splice(index, 1)
    }
    setCheckedItems(newChecked)
    onChange(newChecked)
  }

  return (
    <FormGroup>
      {label && <FormLabel>{label}</FormLabel>}
      {items.length &&
        items.map((item, index) => (
          <FormControlLabel
            key={index}
            control={
              <Checkbox
                checked={checkedItems.indexOf(item) !== -1}
                onChange={() => handleChange(item)}
              />
            }
            label={item}
          />
        ))}
    </FormGroup>
  )
}

export default CheckboxButtons
