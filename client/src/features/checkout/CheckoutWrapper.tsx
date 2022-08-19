import {Elements} from '@stripe/react-stripe-js'
import {loadStripe} from '@stripe/stripe-js'
import CheckoutPage from './CheckoutPage'

const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY!)

const CheckoutWrapper = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  )
}

export default CheckoutWrapper
