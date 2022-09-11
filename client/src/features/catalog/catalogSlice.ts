import {createAsyncThunk, createEntityAdapter, createSlice, isAnyOf} from '@reduxjs/toolkit'
import {history} from '../..'
import catalogApi, {getAxiosParams, initParams} from '../../app/api/catalog'
import {MetaData} from '../../app/models/pagination'
import {CreateProduct, Product, ProductParams, UpdateProduct} from '../../app/models/product'
import {RootState} from '../../app/store/configureStore'
import {Status} from '../../app/store/types'

interface Filters {
  brands: string[]
  types: string[]
}
interface CatalogState {
  status: Status
  productStatus: Status
  filterStatus: Status
  productParams: ProductParams
  filters: Filters
  metaData: MetaData | null
}

const initialState = {
  status: 'idle',
  productStatus: 'idle',
  filterStatus: 'idle',
  productParams: initParams(),
  filters: {
    brands: [],
    types: [],
  },
  metaData: null,
} as CatalogState

const productsAdapter = createEntityAdapter<Product>()

export const fetchProductsAsync = createAsyncThunk<Product[], void, {state: RootState}>(
  'catalog/fetchProductsAsync',
  async (_, thunkAPI) => {
    const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
    try {
      const res = await catalogApi.getProducts(params)
      thunkAPI.dispatch(setMetaData(res.data.metaData))
      return res.data.items
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const createProductAsync = createAsyncThunk<Product, CreateProduct>(
  'catalog/createProductAsync',
  async (product, thunkAPI) => {
    try {
      const res = await catalogApi.createProduct(product)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const updateProductAsync = createAsyncThunk<Product, UpdateProduct>(
  'catalog/updateProductAsync',
  async (product, thunkAPI) => {
    try {
      const res = await catalogApi.updateProduct(product)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const deleteProductAsync = createAsyncThunk<string, string>(
  'catalog/deleteProductAsync',
  async (productId, thunkAPI) => {
    try {
      await catalogApi.deleteProduct(productId)
      return productId
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

export const fetchFiltersAsync = createAsyncThunk<Filters>(
  'catalog/fetchFilters',
  async (_, thunkAPI) => {
    try {
      const res = await catalogApi.getFilters()
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const catalogSlice = createSlice({
  name: 'catalog',
  initialState: productsAdapter.getInitialState<CatalogState>(initialState),
  reducers: {
    setProductParams: (state, action) => {
      state.productParams = {...state.productParams, ...action.payload, pageNumber: 1}
      state.status = 'idle'
    },
    setPageNumber: (state, action) => {
      state.productParams.pageNumber = action.payload
      state.status = 'idle'
    },
    resetProductParams: (state) => {
      state.productParams = initParams()
      state.status = 'idle'
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload
    },
  },
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

    // Get filters
    builder.addCase(fetchFiltersAsync.pending, (state) => {
      state.filterStatus = 'pending'
    })
    builder.addCase(fetchFiltersAsync.fulfilled, (state, action) => {
      state.filters = action.payload
      state.filterStatus = 'succeeded'
    })
    builder.addCase(fetchFiltersAsync.rejected, (state, action) => {
      console.log(action)
      state.filterStatus = 'failed'
    })

    // Delete Product by Id
    builder.addCase(deleteProductAsync.pending, (state) => {
      state.productStatus = 'pending'
    })
    builder.addCase(deleteProductAsync.fulfilled, (state, action) => {
      productsAdapter.removeOne(state, action.payload)
      state.productStatus = 'succeeded'
      state.status = 'idle'
    })
    builder.addCase(deleteProductAsync.rejected, (state, action) => {
      console.log(action)
      state.productStatus = 'failed'
    })

    // Create or Update Product
    builder.addMatcher(
      isAnyOf(createProductAsync.fulfilled, updateProductAsync.fulfilled),
      (state, action) => {
        productsAdapter.upsertOne(state, action.payload)
        state.status = 'idle'
      }
    )
  },
})

export const productSelectors = productsAdapter.getSelectors((state: RootState) => state.catalog)
export const {setProductParams, resetProductParams, setMetaData, setPageNumber} =
  catalogSlice.actions

export default catalogSlice.reducer
