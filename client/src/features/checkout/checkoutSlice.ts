import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import orderApi from '../../app/api/order'
import {CreateOrder} from '../../app/models/order'
import {Status} from '../../app/store/types'
import {clearBasket} from '../basket/basketSlice'

interface CheckoutState {
  status: Status
  createdOrderId: string | null
}

const initialState: CheckoutState = {
  status: 'idle',
  createdOrderId: null,
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
  },
})

export default checkoutSlice.reducer
