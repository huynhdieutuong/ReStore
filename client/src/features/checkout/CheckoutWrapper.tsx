import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import {useEffect} from 'react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import {useAppDispatch, useAppSelector} from '../../app/store/hooks'
import CheckoutPage from './CheckoutPage'
import {createOrUpdatePaymentIntent} from './checkoutSlice'

const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY!)

const CheckoutWrapper = () => {
  const dispatch = useAppDispatch()
  const {statusPaymentIntent} = useAppSelector((state) => state.checkout)

  useEffect(() => {
    dispatch(createOrUpdatePaymentIntent())
  }, [dispatch])

  if (statusPaymentIntent === 'pending') return <LoadingComponent message='Loading checkout...' />

  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  )
}

export default CheckoutWrapper
