import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit'
import {history} from '../..'
import orderApi from '../../app/api/order'
import {Order} from '../../app/models/order'
import {RootState} from '../../app/store/configureStore'
import {Status} from '../../app/store/types'

interface OrderState {
  status: Status
  orderStatus: Status
}

const initialState: OrderState = {
  status: 'idle',
  orderStatus: 'idle',
}

const ordersAdapter = createEntityAdapter<Order>()

export const getOrdersAsync = createAsyncThunk<Order[], void, {state: RootState}>(
  'order/getOrdersAsync',
  async (_, thunkAPI) => {
    try {
      const res = await orderApi.getOrders()
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getOrderByIdAsync = createAsyncThunk<Order, string>(
  'order/getOrderByIdAsync',
  async (orderId, thunkAPI) => {
    try {
      const res = await orderApi.getOrderById(orderId)
      return res.data
    } catch (error) {
      history.push('../my-orders')
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const orderSlice = createSlice({
  name: 'order',
  initialState: ordersAdapter.getInitialState<OrderState>(initialState),
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getOrdersAsync.pending, (state) => {
      state.status = 'pending'
    })
    builder.addCase(getOrdersAsync.fulfilled, (state, action) => {
      ordersAdapter.setAll(state, action.payload)
      state.status = 'succeeded'
    })
    builder.addCase(getOrdersAsync.rejected, (state, action) => {
      console.log(action)
      state.status = 'failed'
    })

    builder.addCase(getOrderByIdAsync.pending, (state) => {
      state.orderStatus = 'pending'
    })
    builder.addCase(getOrderByIdAsync.fulfilled, (state, action) => {
      ordersAdapter.upsertOne(state, action.payload)
      state.orderStatus = 'succeeded'
    })
    builder.addCase(getOrderByIdAsync.rejected, (state, action) => {
      console.log(action)
      state.orderStatus = 'failed'
    })
  },
})

export const orderSelectors = ordersAdapter.getSelectors((state: RootState) => state.order)

export default orderSlice.reducer
