import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Drawer, IconButton, Box, Tooltip, Divider
} from '@mui/material';
import { AuthContext } from '../Authcontext';
import MenuIcon from '@mui/icons-material/Menu';
import { Brightness4, Brightness7, Favorite, Bookmark, AccountCircle, Logout, Movie } from '@mui/icons-material';

export default function Navbar({ mode, toggleMode }) {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppBar position="sticky" color="primary" elevation={4}>
      <Toolbar>
        <Typography
          variant="h5"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            textDecoration: 'none',
            color: 'inherit',
            cursor: 'pointer',
          }}
          component={Link}
          to="/"
        >
          🎬 Moodie
        </Typography>

        {/* Desktop Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
          <Button component={Link} to="/" color="inherit">Home</Button>
          <Button component={Link} to="/discover" color="inherit">Discover</Button>

          {user && (
            <>
              <Button component={Link} to="/favorites" color="inherit" startIcon={<Favorite />}>
                Favorites
              </Button>
              <Button component={Link} to="/watchlist" color="inherit" startIcon={<Bookmark />}>
                Watchlist
              </Button>
              <Button component={Link} to="/recommendations" color="inherit">
                Recommendation
              </Button>
              <Button component={Link} to="/profile" color="inherit" startIcon={<AccountCircle />}>
                Profile
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                onClick={logout}
                sx={{ ml: 1 }}
              >
                Logout
              </Button>
            </>
          )}

          {!user && (
            <>
              <Button component={Link} to="/login" color="inherit">Login</Button>
              <Button component={Link} to="/register" color="inherit">Register</Button>
            </>
          )}
        </Box>

        {/* Mobile Menu Button */}
        <IconButton
          color="inherit"
          sx={{ display: { md: 'none' } }}
          onClick={() => setMobileOpen(true)}
        >
          <MenuIcon />
        </IconButton>

        {/* Theme Toggle */}
        <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
          <IconButton color="inherit" onClick={toggleMode}>
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Tooltip>
      </Toolbar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)}>
        <Box sx={{ width: 250, p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Moodie Menu
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Button fullWidth component={Link} to="/" onClick={() => setMobileOpen(false)}>
            Home
          </Button>
          <Button fullWidth component={Link} to="/discover" onClick={() => setMobileOpen(false)}>
            Discover
          </Button>
          {user ? (
            <>
              <Button fullWidth startIcon={<Favorite />} component={Link} to="/favorites" onClick={() => setMobileOpen(false)}>
                Favorites
              </Button>
              <Button fullWidth startIcon={<Bookmark />} component={Link} to="/watchlist" onClick={() => setMobileOpen(false)}>
                Watchlist
              </Button>
              <Button fullWidth component={Link} to="/recommendations" onClick={() => setMobileOpen(false)}>
                Recommendation
              </Button>
              <Button fullWidth startIcon={<AccountCircle />} component={Link} to="/profile" onClick={() => setMobileOpen(false)}>
                Profile
              </Button>
              <Button
                fullWidth
                color="secondary"
                startIcon={<Logout />}
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button fullWidth component={Link} to="/login" onClick={() => setMobileOpen(false)}>
                Login
              </Button>
              <Button fullWidth component={Link} to="/register" onClick={() => setMobileOpen(false)}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
