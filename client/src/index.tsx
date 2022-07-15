import React from 'react'
import ReactDOM from 'react-dom/client'
import './app/layout/styles.css'
import App from './app/layout/App'
import reportWebVitals from './reportWebVitals'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import HomePage from './features/home/HomePage'
import Catalog from './features/catalog/Catalog'
import AboutPage from './features/about/AboutPage'
import ContactPage from './features/contact/ContactPage'
import NotFoundPage from './features/notfound/NotFoundPage'
import ProductDetails from './features/catalog/ProductDetails'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<HomePage />} />
          <Route path='catalog' element={<Catalog />}>
            <Route path=':productId' element={<ProductDetails />} />
          </Route>
          <Route path='about' element={<AboutPage />} />
          <Route path='contact' element={<ContactPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
