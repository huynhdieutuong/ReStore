import {yupResolver} from '@hookform/resolvers/yup'
import {LoadingButton} from '@mui/lab'
import {Paper} from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import Typography from '@mui/material/Typography'
import {CardNumberElement, useElements, useStripe} from '@stripe/react-stripe-js'
import {StripeElementType} from '@stripe/stripe-js'
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
export interface CardState {
  elementError: {[key in StripeElementType]?: string}
}

const CheckoutPage = () => {
  const {basket} = useAppSelector((state) => state.basket)
  const {createdOrderId} = useAppSelector((state) => state.checkout)
  const {userAddress} = useAppSelector((state) => state.account)
  const dispatch = useAppDispatch()
  const [activeStep, setActiveStep] = useState(0)
  const currentValidationSchema = validationSchema[activeStep]
  const [cardState, setCardState] = useState<CardState>({elementError: {}})
  const [cardComplete, setCardComplete] = useState<any>({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  })
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [paymentSucceeded, setPaymentSucceeded] = useState(false)
  const [paymentMessage, setPaymentMessage] = useState('')

  const onCardInputChange = (e: any) => {
    setCardState({
      elementError: {
        ...cardState.elementError,
        [e.elementType]: e.error?.message,
      },
    })
    setCardComplete({
      ...cardComplete,
      [e.elementType]: e.complete,
    })
  }

  const submitDisabled = () => {
    if (activeStep === steps.length - 1) {
      const {cardNumber, cardExpiry, cardCvc} = cardComplete
      return !methods.formState.isValid || !cardNumber || !cardExpiry || !cardCvc
    }

    return !methods.formState.isValid
  }

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

  const submitOrder = async (data: FieldValues) => {
    if (!stripe || !elements) return

    setLoading(true)
    const {saveAddress, cardName, ...shippingAddress} = data
    const values: CreateOrder = {
      isSaveAddress: saveAddress,
      shippingAddress: shippingAddress as ShippingAddress,
    }

    try {
      const cardElement = elements.getElement(CardNumberElement)
      const paymentResult = await stripe.confirmCardPayment(basket?.clientSecret!, {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: cardName,
          },
        },
      })
      console.log(paymentResult)

      if (paymentResult.paymentIntent?.status === 'succeeded') {
        await dispatch(createOrderAsync(values))
        setPaymentSucceeded(true)
        setPaymentMessage('Thank you - we have received your payment')
      } else {
        setPaymentSucceeded(false)
        setPaymentMessage(paymentResult.error?.message!)
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const handleNext = async (data: FieldValues) => {
    if (activeStep === steps.length - 1) {
      await submitOrder(data)
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
        return <PaymentForm cardState={cardState} onCardInputChange={onCardInputChange} />
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
          <Typography variant='h5' gutterBottom>
            {paymentMessage}
          </Typography>
          {paymentSucceeded ? (
            <Typography sx={{mt: 2, mb: 1}}>
              Your order number is{' '}
              <Link to={`/my-orders/${createdOrderId}`}>#{createdOrderId}</Link>. We have emailed
              your order confirmation, and will send you an update when your order has shipped.
            </Typography>
          ) : (
            <Button variant='contained' onClick={handleBack}>
              Go back and try again
            </Button>
          )}
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
              <LoadingButton loading={loading} disabled={submitDisabled()} type='submit'>
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
