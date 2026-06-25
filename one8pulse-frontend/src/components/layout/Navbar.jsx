// src/components/layout/Navbar.jsx
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from '../../store/authSlice';
import { authService } from '../../services/authService';
import { useTheme as useCustomTheme } from '../../context/ThemeContext';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import styles from '../../styles/dashboard/navbar.module.css';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlinedIcon sx={{ fontSize: 17 }} /> },
  { label: 'Activities', path: '/activities', icon: <DirectionsRunIcon sx={{ fontSize: 17 }} /> },
  { label: 'Profile',    path: '/profile',    icon: <PersonOutlineIcon sx={{ fontSize: 17 }} /> },
];

const NavLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
  >
    {icon}
    {label}
  </Link>
);

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = useSelector(state => state.auth.token);
  const { mode, toggleTheme } = useCustomTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);

  useEffect(() => { setIsAuthenticated(!!token); }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      {/* Brand */}
      <Link to="/" className={styles.brand}>
        <span className={styles.brandDot} />
        <span className={styles.brandText}>one8pulse</span>
      </Link>

      {/* Right side */}
      <div className={styles.navRight}>
        {isAuthenticated ? (
          <>
            {NAV_LINKS.map(({ label, path, icon }) => (
              <NavLink
                key={path}
                to={path}
                icon={icon}
                label={label}
                active={location.pathname === path}
              />
            ))}

            <div className={styles.divider} />

            <button onClick={toggleTheme} className={styles.themeButton}>
              {mode === 'dark' ? <Brightness7Icon sx={{ fontSize: 15 }} /> : <Brightness4Icon sx={{ fontSize: 15 }} />}
            </button>

            <button onClick={handleLogout} className={styles.logoutButton}>
              <LogoutIcon sx={{ fontSize: 15 }} />
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} className={styles.loginButton}>
            <LoginIcon sx={{ fontSize: 15 }} />
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;