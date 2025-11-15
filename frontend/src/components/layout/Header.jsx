import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';

const Header = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    // Call logout API
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch('http://localhost:5005/user/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    }

    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          AirBrB
        </Typography>

        {isAuthenticated ? (
          <Box>
            <Button
              color="inherit"
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
            >
              All Listings
            </Button>
            <Button
              color="inherit"
              startIcon={<ListAltIcon />}
              onClick={() => navigate('/my-listings')}
            >
              My Listings
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
