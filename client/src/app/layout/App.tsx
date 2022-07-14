import {CssBaseline} from '@mui/material'
import {Container} from '@mui/system'
import Catalog from '../../features/catalog/Catalog'

function App() {
  return (
    <>
      <CssBaseline />
      <h1>Re-Store</h1>
      <Container>
        <Catalog />
      </Container>
    </>
  )
}

export default App
