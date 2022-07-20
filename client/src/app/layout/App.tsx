import {createTheme, CssBaseline, ThemeProvider} from '@mui/material'
import {Container} from '@mui/system'
import {useEffect, useState} from 'react'
import {Outlet} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {getBasketAsync} from '../../features/basket/basketSlice'
import {useAppDispatch, useAppSelector} from '../store/hooks'
import {getCookie} from '../utils/util'
import Header from './Header'
import LoadingComponent from './LoadingComponent'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const handleThemeChange = () => setDarkMode(!darkMode)
  const dispatch = useAppDispatch()
  const {loading} = useAppSelector((state) => state.basket)

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#eaeaea',
      },
    },
  })

  useEffect(() => {
    const buyerId = getCookie('buyerId')
    if (buyerId) dispatch(getBasketAsync())
  }, [dispatch])

  if (loading === 'pending') return <LoadingComponent message='Initializing app...' />

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
