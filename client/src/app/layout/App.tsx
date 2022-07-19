import {createTheme, CssBaseline, ThemeProvider} from '@mui/material'
import {Container} from '@mui/system'
import {useEffect, useState} from 'react'
import {Outlet} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import basketApi from '../api/basket'
import {useStoreContext} from '../context/StoreContext'
import {getCookie} from '../utils/util'
import Header from './Header'
import LoadingComponent from './LoadingComponent'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const handleThemeChange = () => setDarkMode(!darkMode)
  const {setBasket} = useStoreContext()
  const [loading, setLoading] = useState(true)

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#eaeaea',
      },
    },
  })

  useEffect(() => {
    const fetchData = async () => {
      const buyerId = getCookie('buyerId')
      if (buyerId) {
        const res = await basketApi.get()
        setBasket(res.data)
      }
      setLoading(false)
    }
    fetchData()
  }, [setBasket])

  if (loading) return <LoadingComponent message='Initializing app...' />

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
