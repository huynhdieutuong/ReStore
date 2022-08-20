import {createTheme, CssBaseline, ThemeProvider} from '@mui/material'
import {Container} from '@mui/system'
import {useEffect, useState} from 'react'
import {Outlet, useLocation} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {fetchUserAsync} from '../../features/account/accountSlice'
import {getBasketAsync} from '../../features/basket/basketSlice'
import {useAppDispatch, useAppSelector} from '../store/hooks'
import Header from './Header'
import LoadingComponent from './LoadingComponent'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const handleThemeChange = () => setDarkMode(!darkMode)
  const dispatch = useAppDispatch()
  const {loading} = useAppSelector((state) => state.basket)
  const {fetchUserStatus} = useAppSelector((state) => state.account)
  const location = useLocation()

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#eaeaea',
      },
    },
  })

  useEffect(() => {
    dispatch(getBasketAsync())
    dispatch(fetchUserAsync())
  }, [dispatch])

  if (loading === 'pending' || fetchUserStatus === 'pending')
    return <LoadingComponent message='Initializing app...' />

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      {location.pathname === '/' ? (
        <Outlet />
      ) : (
        <Container sx={{mt: 4}}>
          <Outlet />
        </Container>
      )}
    </ThemeProvider>
  )
}

export default App
