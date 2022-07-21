import {createAsyncThunk, createEntityAdapter, createSlice} from '@reduxjs/toolkit'
import {history} from '../..'
import catalogApi from '../../app/api/catalog'
import {Product} from '../../app/models/product'
import {RootState} from '../../app/store/configureStore'
import {Status} from '../../app/store/types'

interface CatalogState {
  status: Status
  productStatus: Status
}

const initialState = {
  status: 'idle',
  productStatus: 'idle',
} as CatalogState

const productsAdapter = createEntityAdapter<Product>()

export const fetchProductsAsync = createAsyncThunk<Product[]>(
  'catalog/fetchProductsAsync',
  async (_, thunkAPI) => {
    try {
      const res = await catalogApi.getProducts()
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchProductByIdAsync = createAsyncThunk<Product, string>(
  'catalog/fetchProductByIdAsync',
  async (productId, thunkAPI) => {
    try {
      const res = await catalogApi.getProductById(productId)
      return res.data
    } catch (error) {
      history.push('../catalog')
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: productsAdapter.getInitialState(initialState),
  reducers: {},
  extraReducers: (builder) => {
    // Get Products
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = 'pending'
    })
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      productsAdapter.setAll(state, action.payload)
      state.status = 'succeeded'
    })
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      console.log(action)
      state.status = 'failed'
    })

    // Get Product by Id
    builder.addCase(fetchProductByIdAsync.pending, (state) => {
      state.productStatus = 'pending'
    })
    builder.addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
      productsAdapter.upsertOne(state, action.payload)
      state.productStatus = 'succeeded'
    })
    builder.addCase(fetchProductByIdAsync.rejected, (state, action) => {
      console.log(action)
      state.productStatus = 'failed'
    })
  },
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog)

export default catalogSlice.reducer
