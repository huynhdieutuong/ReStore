import {Grid, TextField, Typography} from '@mui/material'
import {CardCvcElement, CardExpiryElement, CardNumberElement} from '@stripe/react-stripe-js'
import {useFormContext} from 'react-hook-form'
import RhfTextField from '../../app/components/RhfTextField'
import StripeInput from '../../app/components/StripeInput'
import {CardState} from './CheckoutPage'

interface Props {
  cardState: CardState
  onCardInputChange: (event: any) => void
}

const PaymentForm = ({cardState, onCardInputChange}: Props) => {
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
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardNumber}
            helperText={cardState.elementError.cardNumber}
            fullWidth
            id='cardNumber'
            label='Card number *'
            variant='standard'
            InputLabelProps={{shrink: true}}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardNumberElement,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardExpiry}
            helperText={cardState.elementError.cardExpiry}
            fullWidth
            id='expiryDate'
            label='Expiry date *'
            variant='standard'
            InputLabelProps={{shrink: true}}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardExpiryElement,
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            onChange={onCardInputChange}
            error={!!cardState.elementError.cardCvc}
            helperText={cardState.elementError.cardCvc}
            fullWidth
            id='cvc'
            label='CVC'
            variant='standard'
            InputLabelProps={{shrink: true}}
            InputProps={{
              inputComponent: StripeInput,
              inputProps: {
                component: CardCvcElement,
              },
            }}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default PaymentForm
