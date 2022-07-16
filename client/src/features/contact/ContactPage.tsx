import {
  Alert,
  AlertTitle,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import {Container} from '@mui/system'
import {useState} from 'react'
import testErrors from '../../app/api/testErrors'

const ContactPage = () => {
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const getValidationError = async () => {
    try {
      await testErrors.getValidationError()
    } catch (error) {
      setValidationErrors(error as Array<string>)
    }
  }
  return (
    <Container>
      <Typography gutterBottom variant='h2'>
        Errors for testing purposes
      </Typography>
      <ButtonGroup fullWidth variant='contained'>
        <Button onClick={testErrors.get400Error}>Test 400 Error</Button>
        <Button onClick={testErrors.get401Error}>Test 401 Error</Button>
        <Button onClick={testErrors.get404Error}>Test 404 Error</Button>
        <Button onClick={testErrors.get500Error}>Test 500 Error</Button>
        <Button onClick={getValidationError}>Test Validation Error</Button>
      </ButtonGroup>
      {validationErrors.length > 0 && (
        <Alert severity='error'>
          <AlertTitle>Validation Errors</AlertTitle>
          <List>
            {validationErrors.map((error) => (
              <ListItem key={error}>
                <ListItemText>{error}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}
    </Container>
  )
}

export default ContactPage
