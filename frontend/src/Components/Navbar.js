import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import { AuthContext } from '../Authcontext';
import MenuIcon from '@mui/icons-material/Menu';
import { Brightness4, Brightness7 } from '@mui/icons-material';

export default function Navbar({ mode, toggleMode }) {
  const { user, logout } = useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
         <img src="public/logo.jpg" alt="Moodie Logo" style={{ width: '50px', marginRight: '10px' }} />
         Moodie
        </Typography>

        <Button
          color="primary"
          variant="contained"
          sx={{ fontSize: { mx:1} }}
          component={Link}
          to="/"
        >
          Home
        </Button>
        <Button
          color="primary"
          variant="contained"
          sx={{ fontSize: { mx:1 } }}
          component={Link}
          to="/discover"
        >
          Discover
        </Button>

        {user ? (
          <>
            {/* Mobile menu button */}
            <IconButton
              color="inherit"
              edge="start"
              sx={{ display: { md: 'none' } }}
              onClick={() => setMobileOpen(true)}
            >
              <MenuIcon />
            </IconButton>

            {/* Drawer for mobile */}
            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
            >
              <Box sx={{ width: 200, p: 2 }}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  component={Link}
                  to="/favorites"
                  onClick={() => setMobileOpen(false)}
                >
                  Favorites
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: 'primary.main',
                    '&:hover': { bgcolor: 'primary.dark' },
                  }}
                  component={Link}
                  to="/watchlist"
                  onClick={() => setMobileOpen(false)}
                >
                  Watchlist
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  sx={{ mx: 1 }}
                  component={Link}
                  to="/recommendations"
                  onClick={() => setMobileOpen(false)}
                >
                  Recommendation
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  sx={{ mx: 1 }}
                  component={Link}
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                >
                  Profile
                </Button>
                <Button
                  color="secondary"
                  variant="outlined"
                  sx={{ mx: 1 }}
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  Logout
                </Button>
              </Box>
            </Drawer>

            {/* Desktop menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
                component={Link}
                to="/favorites"
              >
                Favorites
              </Button>
              <Button
                variant="contained"
                sx={{
                  bgcolor: 'primary.main',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
                component={Link}
                to="/watchlist"
              >
                Watchlist
              </Button>
              <Button
                color="primary"
                variant="contained"
                sx={{ mx: 1 }}
                component={Link}
                to="/recommendations"
              >
                Recommendation
              </Button>
              <Button
                color="primary"
                variant="contained"
                sx={{ mx: 1 }}
                component={Link}
                to="/profile"
              >
                Profile
              </Button>
              <Button
                color="secondary"
                variant="outlined"
                sx={{ mx: 1 }}
                onClick={logout}
              >
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Button
              color="primary"
              variant="contained"
              sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}
              component={Link}
              to="/login"
            >
              Login
            </Button>
            <Button
              color="primary"
              variant="contained"
              sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}
              component={Link}
              to="/register"
            >
              Register
            </Button>
          </>
        )}

        {/* Theme toggle button */}
        <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}>
          <IconButton color="inherit" onClick={toggleMode}>
            {mode === 'light' ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
