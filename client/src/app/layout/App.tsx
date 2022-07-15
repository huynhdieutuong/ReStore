import {createTheme, CssBaseline, ThemeProvider} from '@mui/material'
import {Container} from '@mui/system'
import {useState} from 'react'
import {Outlet} from 'react-router-dom'
import Header from './Header'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const handleThemeChange = () => setDarkMode(!darkMode)

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#121212' : '#eaeaea',
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  )
}

export default App
