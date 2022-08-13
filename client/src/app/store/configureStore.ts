import {configureStore} from '@reduxjs/toolkit'
import counterReducer from '../../features/about/counterSlice'
import basketReducer from '../../features/basket/basketSlice'
import catalogReducer from '../../features/catalog/catalogSlice'
import accountReducer from '../../features/account/accountSlice'
import checkoutReducer from '../../features/checkout/checkoutSlice'
import orderReducer from '../../features/order/orderSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    basket: basketReducer,
    catalog: catalogReducer,
    account: accountReducer,
    checkout: checkoutReducer,
    order: orderReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
