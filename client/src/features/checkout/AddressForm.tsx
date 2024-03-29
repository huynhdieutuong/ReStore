import {Grid, Typography} from '@mui/material'
import {useFormContext} from 'react-hook-form'
import RhfCheckbox from '../../app/components/RhfCheckbox'
import RhfTextField from '../../app/components/RhfTextField'

const AddressForm = () => {
  const {control, formState} = useFormContext()

  return (
    <>
      <Typography component='span' variant='h6' gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <RhfTextField control={control} name='fullName' label='Full name' />
        </Grid>
        <Grid item xs={12}>
          <RhfTextField control={control} name='address1' label='Address line 1' />
        </Grid>
        <Grid item xs={12}>
          <RhfTextField control={control} name='address2' label='Address line 2' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RhfTextField control={control} name='city' label='City' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RhfTextField control={control} name='state' label='State/Province/Region' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RhfTextField control={control} name='zip' label='Zip / Postal code' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <RhfTextField control={control} name='country' label='Country' />
        </Grid>
        <Grid item xs={12}>
          <RhfCheckbox
            control={control}
            name='saveAddress'
            label='Save this as the default address'
            disabled={!formState.isDirty}
          />
        </Grid>
      </Grid>
    </>
  )
}

export default AddressForm
