import {createAsyncThunk, createSlice, isAnyOf} from '@reduxjs/toolkit'
import {toast} from 'react-toastify'
import {history} from '../..'
import accountApi from '../../app/api/account'
import {LoginInput, RegisterInput, User} from '../../app/models/account'
import {Status} from '../../app/store/types'

interface AccountState {
  status: Status
  user: User | null
  fetchUserStatus: Status
  registerErrors: string[]
}

const initialState: AccountState = {
  status: 'idle',
  user: null,
  fetchUserStatus: 'idle',
  registerErrors: [],
}

export const loginAsync = createAsyncThunk<User, LoginInput>(
  'account/loginAsync',
  async (values, thunkAPI) => {
    try {
      const res = await accountApi.login(values)
      localStorage.setItem('user', JSON.stringify(res.data))
      return res.data
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
      return res.data
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
      state.user = action.payload
      state.fetchUserStatus = 'succeeded'
    })
    builder.addCase(fetchUserAsync.rejected, (state, action) => {
      state.user = null
      state.fetchUserStatus = 'failed'
    })

    // Login & Register
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.user = action.payload
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
