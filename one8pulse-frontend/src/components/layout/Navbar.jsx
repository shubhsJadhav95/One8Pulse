// src/components/common/Navbar.jsx
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from '../../store/authSlice';
import { authService } from '../../services/authService';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmergencyIcon from '@mui/icons-material/Emergency';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import styles from '../../styles/dashboard/navbar.module.css';

const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard', icon: <DashboardOutlinedIcon sx={{ fontSize: 17 }} /> },
  { label: 'Activities', path: '/activities', icon: <DirectionsRunIcon sx={{ fontSize: 17 }} /> },
  { label: 'SOS',        path: '/sos',        icon: <EmergencyIcon sx={{ fontSize: 17 }} /> },
  { label: 'Profile',    path: '/profile',    icon: <PersonOutlineIcon sx={{ fontSize: 17 }} /> },
];

const NavLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`${styles.navLink} ${active ? styles.navLinkActive : ''}`}
    aria-label={label}
    title={label}
  >
    {icon}
    <span className={styles.navLabel}>{label}</span>
  </Link>
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

            <button onClick={handleLogout} className={styles.logoutButton} aria-label="Logout" title="Logout">
              <LogoutIcon sx={{ fontSize: 15 }} />
              <span className={styles.navLabel}>Logout</span>
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