import {createBrowserHistory} from 'history'
import React from 'react'
import ReactDOM from 'react-dom/client'
import {Provider} from 'react-redux'
import {Route, Routes, unstable_HistoryRouter as HistoryRouter} from 'react-router-dom'
import NotFound from './app/errors/NotFound'
import ServerError from './app/errors/ServerError'
import App from './app/layout/App'
import PrivateRoute from './app/layout/PrivateRoute'
import './app/layout/styles.css'
import {store} from './app/store/configureStore'
import AboutPage from './features/about/AboutPage'
import Login from './features/account/Login'
import Logout from './features/account/Logout'
import Register from './features/account/Register'
import BasketPage from './features/basket/BasketPage'
import Catalog from './features/catalog/Catalog'
import ProductDetails from './features/catalog/ProductDetails'
import CheckoutPage from './features/checkout/CheckoutPage'
import ContactPage from './features/contact/ContactPage'
import HomePage from './features/home/HomePage'
import reportWebVitals from './reportWebVitals'

export const history = createBrowserHistory({window})

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <HistoryRouter history={history}>
      <Provider store={store}>
        <Routes>
          <Route path='/' element={<App />}>
            <Route index element={<HomePage />} />
            <Route path='catalog'>
              <Route index element={<Catalog />} />
              <Route path=':productId' element={<ProductDetails />} />
            </Route>
            <Route path='about' element={<AboutPage />} />
            <Route path='contact' element={<ContactPage />} />
            <Route path='server-error' element={<ServerError />} />
            <Route path='basket' element={<BasketPage />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='logout' element={<Logout />} />
            <Route element={<PrivateRoute />}>
              <Route path='checkout' element={<CheckoutPage />} />
            </Route>
            <Route path='*' element={<NotFound />} />
          </Route>
        </Routes>
      </Provider>
    </HistoryRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
