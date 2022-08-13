import {Checkbox, FormControlLabel, Grid, TextField, Typography} from '@mui/material'
import {useFormContext} from 'react-hook-form'
import RhfTextField from '../../app/components/RhfTextField'

const PaymentForm = () => {
  const {control} = useFormContext()
  return (
    <>
      <Typography component='span' variant='h6' gutterBottom>
        Payment method
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <RhfTextField control={control} name='cardName' label='Name on card' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth id='cardNumber' label='Card number *' variant='standard' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth id='expiryDate' label='Expiry date *' variant='standard' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            id='cvv'
            label='CVV *'
            variant='standard'
            helperText='Last three digits on signature strip'
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label='Remember credit card details for next time'
          />
        </Grid>
      </Grid>
    </>
  )
}

export default PaymentForm
