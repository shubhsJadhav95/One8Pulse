// src/components/common/Navbar.jsx
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { logout } from '../../store/authSlice';
import { authService } from '../../services/authService';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlinedIcon sx={{ fontSize: 17 }} /> },
  { label: 'Activities', path: '/activities', icon: <DirectionsRunIcon sx={{ fontSize: 17 }} /> },
  { label: 'Profile',    path: '/profile',    icon: <PersonOutlineIcon sx={{ fontSize: 17 }} /> },
];

const NavLink = ({ to, icon, label, active }) => (
  <Box
    component={Link}
    to={to}
    sx={{
      display: 'flex', alignItems: 'center', gap: '6px',
      px: '12px', py: '6px', borderRadius: 2,
      fontSize: 13, textDecoration: 'none',
      color: active ? 'text.primary' : 'text.secondary',
      bgcolor: active ? 'action.hover' : 'transparent',
      transition: 'background 0.15s, color 0.15s',
      '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
    }}
  >
    {icon}
    {label}
  </Box>
);

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(state => state.auth.token);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => { setIsAuthenticated(!!token); }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    authService.logout();
    navigate('/login');
  };

  return (
    <Box
      component="nav"
      sx={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        height: 56, px: 2.5,
        bgcolor: 'background.paper',
        borderBottom: '0.5px solid', borderColor: 'divider',
      }}
    >
      {/* Brand */}
      <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none' }}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#E24B4A', flexShrink: 0 }} />
        <Typography sx={{ fontSize: 13, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'text.primary' }}>
          one8pulse
        </Typography>
      </Box>

      {/* Right side */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {isAuthenticated ? (
          <>
            {NAV_LINKS.map(({ label, path, icon }) => (
              <NavLink key={path} to={path} icon={icon} label={label} active={location.pathname === path} />
            ))}

            <Box sx={{ width: '0.5px', height: 18, bgcolor: 'divider', mx: '6px' }} />

            <Box
              component="button"
              onClick={handleLogout}
              sx={{
                display: 'flex', alignItems: 'center', gap: '6px',
                px: '14px', py: '6px', borderRadius: 2,
                fontSize: 13, fontWeight: 400, cursor: 'pointer',
                color: '#A32D2D', bgcolor: '#FCEBEB',
                border: '0.5px solid #F0959580',
                transition: 'background 0.15s',
                '&:hover': { bgcolor: '#F7C1C1' },
              }}
            >
              <LogoutIcon sx={{ fontSize: 15 }} />
              Logout
            </Box>
          </>
        ) : (
          <Box
            component="button"
            onClick={() => navigate('/login')}
            sx={{
              display: 'flex', alignItems: 'center', gap: '6px',
              px: '14px', py: '6px', borderRadius: 2,
              fontSize: 13, fontWeight: 400, cursor: 'pointer',
              color: '#fff', bgcolor: '#E24B4A', border: 'none',
              '&:hover': { bgcolor: '#C93B3A' },
            }}
          >
            <LoginIcon sx={{ fontSize: 15 }} />
            Login
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Navbar;