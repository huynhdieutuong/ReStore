import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import orderApi from '../../app/api/order'
import paymentApi from '../../app/api/payment'
import {CreateOrder} from '../../app/models/order'
import {Status} from '../../app/store/types'
import {clearBasket, setBasket} from '../basket/basketSlice'

interface CheckoutState {
  status: Status
  createdOrderId: string | null
  statusPaymentIntent: Status
}

const initialState: CheckoutState = {
  status: 'idle',
  createdOrderId: null,
  statusPaymentIntent: 'idle',
}

export const createOrderAsync = createAsyncThunk<string, CreateOrder>(
  'checkout/createOrderAsync',
  async (values, thunkAPI) => {
    try {
      const res = await orderApi.create(values)
      thunkAPI.dispatch(clearBasket())
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const createOrUpdatePaymentIntent = createAsyncThunk<void>(
  'payment/createOrUpdatePaymentIntent',
  async (_, thunkAPI) => {
    try {
      const res = await paymentApi.createOrUpdatePaymentIntent()
      thunkAPI.dispatch(setBasket(res.data))
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createOrderAsync.pending, (state) => {
      state.status = 'pending'
    })
    builder.addCase(createOrderAsync.fulfilled, (state, action) => {
      state.createdOrderId = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(createOrderAsync.rejected, (state, action) => {
      console.log(action)
      state.createdOrderId = null
      state.status = 'failed'
    })

    builder.addCase(createOrUpdatePaymentIntent.pending, (state) => {
      state.statusPaymentIntent = 'pending'
    })
    builder.addCase(createOrUpdatePaymentIntent.fulfilled, (state) => {
      state.statusPaymentIntent = 'succeeded'
    })
    builder.addCase(createOrUpdatePaymentIntent.rejected, (state, action) => {
      console.log(action)
      state.statusPaymentIntent = 'failed'
    })
  },
})

export default checkoutSlice.reducer
