import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppBar, Box, Button, Divider, Drawer, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded';
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { AuthContext } from '../Authcontext';
import './Navbar.css';

const navItems = [{ to: '/', label: 'Home', icon: <AutoAwesomeRoundedIcon /> }, { to: '/discover', label: 'Discover', icon: <ExploreRoundedIcon /> }];
export default function Navbar({ mode, toggleMode }) {
  const { user, logout } = useContext(AuthContext); const { pathname } = useLocation(); const [mobileOpen, setMobileOpen] = useState(false);
  const protectedItems = user ? [{ to: '/favorites', label: 'Favorites', icon: <FavoriteBorderRoundedIcon /> }, { to: '/watchlist', label: 'Watchlist', icon: <BookmarkBorderRoundedIcon /> }, { to: '/recommendations', label: 'For you', icon: <AutoAwesomeRoundedIcon /> }] : [];
  const items = [...navItems, ...protectedItems]; const isActive = (to) => to === '/' ? pathname === '/' : pathname.startsWith(to); const close = () => setMobileOpen(false);
  return <AppBar position="sticky" elevation={0} className="app-nav"><Toolbar className="app-nav__toolbar"><Typography component={Link} to="/" className="app-nav__brand"><Box className="app-nav__mark">M</Box><span>Moodie</span></Typography><Stack direction="row" spacing={.4} className="app-nav__links">{items.map((item) => <Button key={item.to} component={Link} to={item.to} className={isActive(item.to) ? 'app-nav__link app-nav__link--active' : 'app-nav__link'}>{item.label}</Button>)}</Stack><Box sx={{ flexGrow: 1 }} /><Tooltip title={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}><IconButton onClick={toggleMode} className="app-nav__icon">{mode === 'light' ? <DarkModeRoundedIcon /> : <LightModeRoundedIcon />}</IconButton></Tooltip>{user ? <><Button component={Link} to="/profile" className="app-nav__profile" startIcon={<AccountCircleRoundedIcon />}>{user.username || 'Profile'}</Button><Tooltip title="Log out"><IconButton onClick={logout} className="app-nav__icon"><LogoutRoundedIcon /></IconButton></Tooltip></> : <Stack direction="row" spacing={.75} className="app-nav__auth"><Button component={Link} to="/login" className="app-nav__login">Log in</Button><Button component={Link} to="/register" variant="contained" className="app-nav__join">Join Moodie</Button></Stack>}<IconButton className="app-nav__menu" onClick={() => setMobileOpen(true)}><MenuRoundedIcon /></IconButton></Toolbar><Drawer anchor="right" open={mobileOpen} onClose={close} PaperProps={{ className: 'app-nav__drawer' }}><Box sx={{ p: 2.5, minWidth: 280 }}><Typography className="app-nav__brand"><Box className="app-nav__mark">M</Box><span>Moodie</span></Typography><Divider sx={{ my: 2 }} /><Stack spacing={.75}>{items.map((item) => <Button key={item.to} component={Link} to={item.to} onClick={close} startIcon={item.icon} className={isActive(item.to) ? 'app-nav__drawer-link app-nav__drawer-link--active' : 'app-nav__drawer-link'}>{item.label}</Button>)}{user && <Button component={Link} to="/profile" onClick={close} startIcon={<AccountCircleRoundedIcon />} className="app-nav__drawer-link">Profile</Button>}<Divider sx={{ my: 1 }} />{user ? <Button onClick={() => { logout(); close(); }} startIcon={<LogoutRoundedIcon />} className="app-nav__drawer-link">Log out</Button> : <><Button component={Link} to="/login" onClick={close} className="app-nav__drawer-link">Log in</Button><Button component={Link} to="/register" onClick={close} variant="contained">Join Moodie</Button></>}</Stack></Box></Drawer></AppBar>;
}
