import {yupResolver} from '@hookform/resolvers/yup'
import {LoadingButton} from '@mui/lab'
import {Paper} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import {useEffect, useState} from 'react'
import {FieldValues, FormProvider, useForm} from 'react-hook-form'
import {Link, Navigate} from 'react-router-dom'
import {CreateOrder, ShippingAddress} from '../../app/models/order'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import {getUserAddressAsync} from '../account/accountSlice'
import BasketPage from '../basket/BasketPage'
import AddressForm from './AddressForm'
import {createOrderAsync} from './checkoutSlice'
import validationSchema from './checkoutValidation'
import PaymentForm from './PaymentForm'

const steps = ['Shipping address', 'Review your order', 'Payment details']

const CheckoutPage = () => {
  const {basket} = useAppSelector((state) => state.basket)
  const {createdOrderId, status} = useAppSelector((state) => state.checkout)
  const {userAddress} = useAppSelector((state) => state.account)
  const dispatch = useAppDispatch()
  const [activeStep, setActiveStep] = useState(0)
  const currentValidationSchema = validationSchema[activeStep]

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(currentValidationSchema),
    defaultValues: {
      saveAddress: true,
      fullName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      country: '',
      cardName: '',
    },
  })

  useEffect(() => {
    if (userAddress) {
      methods.reset({
        ...methods.getValues(),
        ...userAddress,
        saveAddress: false,
      })
    } else {
      dispatch(getUserAddressAsync())
    }
  }, [dispatch, methods, userAddress])

  const handleNext = async (data: FieldValues) => {
    if (activeStep === steps.length - 1) {
      const {saveAddress, cardName, ...shippingAddress} = data
      const values: CreateOrder = {
        isSaveAddress: saveAddress,
        shippingAddress: shippingAddress as ShippingAddress,
      }

      await dispatch(createOrderAsync(values))
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <AddressForm />
      case 1:
        return <BasketPage isBasket={false} />
      case 2:
        return <PaymentForm />
      default:
        throw new Error('Unknown step')
    }
  }

  if (!basket && activeStep === 0) return <Navigate to='../basket' />

  return (
    <Paper sx={{my: {xs: 3, md: 6}, p: {xs: 2, md: 3}}} variant='outlined'>
      <Typography component='h1' variant='h4' align='center'>
        Checkout
      </Typography>
      <Stepper activeStep={activeStep} sx={{pt: 3, pb: 5}}>
        {steps.map((label) => {
          return (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          )
        })}
      </Stepper>
      {activeStep === steps.length ? (
        <Box>
          <Typography component='span' variant='h5'>
            Thank you for your order.
          </Typography>
          <Typography sx={{mt: 2, mb: 1}}>
            Your order number is <Link to={`/my-orders/${createdOrderId}`}>#{createdOrderId}</Link>.
            We have emailed your order confirmation, and will send you an update when your order has
            shipped.
          </Typography>
        </Box>
      ) : (
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleNext)}>
            <Typography component='span' sx={{mt: 2, mb: 1}}>
              {renderStepContent()}
            </Typography>
            <Box sx={{display: 'flex', flexDirection: 'row', pt: 2}}>
              <Box sx={{flex: '1 1 auto'}} />
              <Button color='inherit' disabled={activeStep === 0} onClick={handleBack} sx={{mr: 1}}>
                Back
              </Button>
              <LoadingButton
                loading={status === 'pending'}
                disabled={!methods.formState.isValid}
                type='submit'
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </LoadingButton>
            </Box>
          </form>
        </FormProvider>
      )}
    </Paper>
  )
}

export default CheckoutPage
