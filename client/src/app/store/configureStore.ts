import {configureStore} from '@reduxjs/toolkit'
import counterReducer from '../../features/about/counterSlice'
import basketReducer from '../../features/basket/basketSlice'
import catalogReducer from '../../features/catalog/catalogSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    basket: basketReducer,
    catalog: catalogReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
