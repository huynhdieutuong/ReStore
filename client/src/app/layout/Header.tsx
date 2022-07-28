import {ShoppingCart} from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuItem,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material'
import {MouseEvent, useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import {useAppSelector} from '../store/hooks'

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

const Header = ({darkMode, handleThemeChange}: Props) => {
  const navigate = useNavigate()
  const {basket} = useAppSelector((state) => state.basket)
  const itemCount = basket?.items.reduce((sum, item) => sum + item.quantity, 0)

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
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

  const renderMenuItem = (links: Link[], closeMenu: () => void) =>
    links.map(({title, path}) => (
      <MenuItem key={path} onClick={closeMenu} component={NavLink} to={path}>
        <Typography sx={{...navStyles, textAlign: 'center', fontSize: '1rem'}}>
          {title.toUpperCase()}
        </Typography>
      </MenuItem>
    ))

  const renderLogo = () => (
    <>
      <Typography variant='h6' component={NavLink} to='/' sx={navStyles}>
        RE-STORE
      </Typography>
      <Switch checked={darkMode} onChange={handleThemeChange} />
    </>
  )

  const renderLeftMenu = () => (
    <>
      <IconButton size='large' onClick={handleOpenNavMenu} color='inherit'>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorElNav}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={Boolean(anchorElNav)}
        onClose={handleCloseNavMenu}
        sx={{
          display: {xs: 'block', md: 'none'},
        }}
      >
        {renderMenuItem(midLinks, handleCloseNavMenu)}
      </Menu>
    </>
  )

  const renderCart = () => (
    <IconButton size='large' sx={{color: 'inherit'}} onClick={() => navigate('basket')}>
      <Badge badgeContent={itemCount} color='secondary'>
        <ShoppingCart />
      </Badge>
    </IconButton>
  )

  const renderRightMenu = () => (
    <>
      <IconButton size='large' color='inherit' onClick={handleOpenUserMenu}>
        <MoreVertIcon />
      </IconButton>
      <Menu
        sx={{mt: '45px'}}
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {renderMenuItem(rightLinks, handleCloseUserMenu)}
      </Menu>
    </>
  )

  const renderLoggedInMenu = () => (
    <>
      <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
        <Avatar alt='Remy Sharp' src='/static/images/avatar/2.jpg' />
      </IconButton>
      <Menu
        sx={{mt: '45px'}}
        id='menu-appbar'
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {renderMenuItem(rightLinks, handleCloseUserMenu)}
      </Menu>
    </>
  )

  return (
    <AppBar position='static' sx={{mb: 4}}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          minHeight: 64,
        }}
      >
        {/* Large screen */}
        <Box sx={{display: {xs: 'none', md: 'flex'}, alignItems: 'center'}}>{renderLogo()}</Box>
        <Box sx={{display: {xs: 'none', md: 'flex'}}}>{renderLinks(midLinks)}</Box>

        {/* Mobile screen */}
        <Box sx={{display: {xs: 'flex', md: 'none'}}}>{renderLeftMenu()}</Box>
        <Box sx={{display: {xs: 'flex', md: 'none'}, alignItems: 'center'}}>{renderLogo()}</Box>

        {/* Right menu */}
        <Box sx={{display: {xs: 'none', sm: 'flex'}}}>
          {renderCart()}
          {renderLinks(rightLinks)}
        </Box>
        <Box sx={{display: {xs: 'flex', sm: 'none'}}}>
          {renderCart()}
          {renderRightMenu()}
          {/* {renderLoggedInMenu()} */}
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header
