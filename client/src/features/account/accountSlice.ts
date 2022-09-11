import {createAsyncThunk, createSlice, isAnyOf} from '@reduxjs/toolkit'
import {toast} from 'react-toastify'
import {history} from '../..'
import accountApi from '../../app/api/account'
import {LoginInput, RegisterInput, User} from '../../app/models/account'
import {ShippingAddress} from '../../app/models/order'
import {Status} from '../../app/store/types'
import {setBasket} from '../basket/basketSlice'

interface AccountState {
  status: Status
  user: User | null
  fetchUserStatus: Status
  registerErrors: string[]
  userAddress: ShippingAddress | null
}

const initialState: AccountState = {
  status: 'idle',
  user: null,
  fetchUserStatus: 'idle',
  registerErrors: [],
  userAddress: null,
}

export const loginAsync = createAsyncThunk<User, LoginInput>(
  'account/loginAsync',
  async (values, thunkAPI) => {
    try {
      const res = await accountApi.login(values)
      localStorage.setItem('user', JSON.stringify(res.data))
      const {basket, ...user} = res.data
      thunkAPI.dispatch(setBasket(basket))
      return user
    } catch (error) {
      localStorage.removeItem('user')
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const registerAsync = createAsyncThunk<void, RegisterInput>(
  'account/registerAsync',
  async (values, thunkAPI) => {
    try {
      const res = await accountApi.register(values)
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const fetchUserAsync = createAsyncThunk<User>(
  'account/fetchUserAsync',
  async (_, thunkAPI) => {
    try {
      const res = await accountApi.currentUser()
      const {basket, ...user} = res.data
      thunkAPI.dispatch(setBasket(basket))
      return user
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  },
  {
    condition: () => {
      if (!localStorage.getItem('user')) return false
    },
  }
)

export const getUserAddressAsync = createAsyncThunk<ShippingAddress>(
  'account/getUserAddressAsync',
  async (_, thunkAPI) => {
    try {
      const res = await accountApi.getAddress()
      return res.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setLogout: (state) => {
      localStorage.removeItem('user')
      state.user = null
      history.push('../catalog')
    },
  },
  extraReducers: (builder) => {
    // Fetch user
    builder.addCase(fetchUserAsync.pending, (state) => {
      state.fetchUserStatus = 'pending'
    })
    builder.addCase(fetchUserAsync.fulfilled, (state, action) => {
      let claims = JSON.parse(atob(action.payload.token.split('.')[1]))
      let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      state.user = {...action.payload, roles: typeof roles === 'string' ? [roles] : roles}
      state.fetchUserStatus = 'succeeded'
    })
    builder.addCase(fetchUserAsync.rejected, (state, action) => {
      state.user = null
      state.fetchUserStatus = 'failed'
    })

    builder.addCase(getUserAddressAsync.fulfilled, (state, action) => {
      state.userAddress = action.payload
    })

    // Login & Register
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      let claims = JSON.parse(atob(action.payload.token.split('.')[1]))
      let roles = claims['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      state.user = {...action.payload, roles: typeof roles === 'string' ? [roles] : roles}
      state.status = 'succeeded'
    })
    builder.addCase(loginAsync.rejected, (state, action) => {
      console.log(action)
      state.status = 'failed'
    })
    builder.addCase(registerAsync.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.registerErrors = []
      toast.success('Registration successful - you can now login')
      history.push('/login')
    })
    builder.addCase(registerAsync.rejected, (state, action) => {
      state.registerErrors = action.payload as string[]
      state.status = 'failed'
    })
    builder.addMatcher(isAnyOf(loginAsync.pending, registerAsync.pending), (state) => {
      state.status = 'pending'
    })
  },
})

export const {setLogout} = accountSlice.actions

export default accountSlice.reducer
