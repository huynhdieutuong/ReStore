import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import basketApi from '../../app/api/basket'
import {Basket} from '../../app/models/basket'
import {Status} from '../../app/store/types'
import {getCookie} from '../../app/utils/util'

interface BasketState {
  basket: Basket | null
  loading: Status
  status: string
}

interface UpdateItemType {
  name: string
  productId: number
  quantity: number
}

const initialState: BasketState = {
  basket: null,
  loading: 'idle',
  status: '',
}

export const getBasketAsync = createAsyncThunk<Basket>(
  'basket/getBasketAsync',
  async (_, thunkAPI) => {
    try {
      const res = await basketApi.get()
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
  {
    condition: () => {
      if (!getCookie('buyerId')) return false
    },
  }
)

export const addBasketItemAsync = createAsyncThunk<Basket, UpdateItemType>(
  'basket/addBasketItemAsync',
  async ({productId, quantity}, thunkAPI) => {
    try {
      const res = await basketApi.addItem(productId, quantity)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const removeBasketItemAsync = createAsyncThunk<void, UpdateItemType>(
  'basket/removeBasketItemAsync',
  async ({productId, quantity}, thunkAPI) => {
    try {
      await basketApi.removeItem(productId, quantity)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getBasketAsync
    builder.addCase(getBasketAsync.pending, (state) => {
      state.loading = 'pending'
    })
    builder.addCase(getBasketAsync.fulfilled, (state, action) => {
      state.basket = action.payload
      state.loading = 'succeeded'
    })
    builder.addCase(getBasketAsync.rejected, (state, action) => {
      console.log(action)
      state.loading = 'failed'
    })

    // addBasketItemAsync
    builder.addCase(addBasketItemAsync.pending, (state, action) => {
      state.status = action.meta.arg.name
    })
    builder.addCase(addBasketItemAsync.fulfilled, (state, action) => {
      state.basket = action.payload
      state.status = ''
    })
    builder.addCase(addBasketItemAsync.rejected, (state, action) => {
      console.log(action)
      state.status = ''
    })

    // removeBasketItemAsync
    builder.addCase(removeBasketItemAsync.pending, (state, action) => {
      state.status = action.meta.arg.name
    })
    builder.addCase(removeBasketItemAsync.fulfilled, (state, action) => {
      const {productId, quantity} = action.meta.arg
      if (!state.basket) return
      const itemIndex = state.basket.items.findIndex((item) => item.productId === productId)
      if (itemIndex === -1) return
      state.basket.items[itemIndex].quantity -= quantity
      if (state.basket.items[itemIndex].quantity <= 0) state.basket.items.splice(itemIndex, 1)
      state.status = ''
    })
    builder.addCase(removeBasketItemAsync.rejected, (state, action) => {
      console.log(action)
      state.status = ''
    })
  },
})

export default basketSlice.reducer
