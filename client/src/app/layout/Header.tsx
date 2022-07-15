import {ShoppingCart} from '@mui/icons-material'
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material'
import {NavLink} from 'react-router-dom'

interface Props {
  darkMode: boolean
  handleThemeChange: () => void
}

interface Link {
  title: string
  path: string
}

const midLinks: Link[] = [
  {title: 'catalog', path: 'catalog'},
  {title: 'about', path: 'about'},
  {title: 'contact', path: 'contact'},
]

const rightLinks: Link[] = [
  {title: 'login', path: 'login'},
  {title: 'register', path: 'register'},
]

const navStyles = {
  color: 'inherit',
  textDecoration: 'none',
  typography: 'h6',
  '&:hover': {
    color: 'grey.500',
  },
  '&.active': {
    color: 'text.secondary',
  },
}

const renderLinks = (links: Link[]) => (
  <List sx={{display: 'flex'}}>
    {links.map(({title, path}) => (
      <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
        {title.toUpperCase()}
      </ListItem>
    ))}
  </List>
)

const Header = ({darkMode, handleThemeChange}: Props) => {
  return (
    <AppBar position='static' sx={{mb: 4}}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{display: 'flex'}}>
          <Typography variant='h6' component={NavLink} to='/' sx={navStyles}>
            RE-STORE
          </Typography>
          <Switch checked={darkMode} onChange={handleThemeChange} />
        </Box>
        <Box>{renderLinks(midLinks)}</Box>
        <Box sx={{display: 'flex'}}>
          <IconButton size='large' sx={{color: 'inherit'}}>
            <Badge badgeContent={4} color='secondary'>
              <ShoppingCart />
            </Badge>
          </IconButton>
          {renderLinks(rightLinks)}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
