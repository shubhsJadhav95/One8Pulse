// src/components/auth/Login.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../../services/authService';
import { setCredentials } from '../../store/authSlice';
import styles from '../../styles/Login.module.css';
import { useTheme } from '../../context/ThemeContext';

// ── Simple SVG icons (no extra deps) ─────────────────────────
const IconEmail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3" />
    <polyline points="2,4 12,13 22,4" />
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const IconEye = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconEyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const IconAlert = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);
// ─────────────────────────────────────────────────────────────

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [ripples, setRipples]   = useState([]);
  const btnRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mode } = useTheme();

  // Ripple click effect on submit button
  const handleRipple = (e) => {
    const btn   = btnRef.current;
    if (!btn) return;
    const rect  = btn.getBoundingClientRect();
    const id    = Date.now();
    const x     = e.clientX - rect.left;
    const y     = e.clientY - rect.top;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(formData);
      // Update Redux state with user credentials
      const tokenData = authService.decodeToken(response.token);
      dispatch(setCredentials({
        token: response.token,
        user: {
          sub: tokenData.userId,
          email: tokenData.email,
          userId: tokenData.userId
        }
      }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Animated background blobs */}
      <div className={`${styles.blob} ${styles.blob1}`} />
      <div className={`${styles.blob} ${styles.blob2}`} />
      <div className={`${styles.blob} ${styles.blob3}`} />

      <div className={styles.card}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.brandPulse} />
          <span className={styles.brandText}>one8pulse</span>
        </div>

        {/* Heading */}
        <h1 className={styles.heading}>Welcome back</h1>
        <p className={styles.subheading}>
          Sign in to track your workouts,<br />
          view AI recommendations, and stay on pace.
        </p>

        {/* Error */}
        {error && (
          <div className={styles.errorAlert} role="alert">
            <span className={styles.errorIcon}><IconAlert /></span>
            <span className={styles.errorText}>{error}</span>
          </div>
        )}

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-email">Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><IconEmail /></span>
              <input
                id="login-email"
                type="email"
                className={styles.input}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-password">Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><IconLock /></span>
              <input
                id="login-password"
                type={showPw ? 'text' : 'password'}
                className={styles.input}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
              >
                {showPw ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
          </div>

          {/* Forgot */}
          <div className={styles.forgotRow}>
            <span 
              className={styles.forgotLink} 
              role="button" 
              tabIndex={0}
              onClick={() => navigate('/forgot-password')}
            >
              Forgot password?
            </span>
          </div>

          {/* Submit */}
          <button
            ref={btnRef}
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
            onClick={!loading ? handleRipple : undefined}
          >
            {ripples.map((r) => (
              <span
                key={r.id}
                className={styles.ripple}
                style={{ left: r.x, top: r.y }}
              />
            ))}
            <span className={styles.btnInner}>
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                <>Sign In <IconArrow /></>
              )}
            </span>
          </button>
        </form>

        {/* Footer */}
        <p className={styles.footer}>
          Don't have an account?
          <span
            className={styles.footerLink}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/register')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/register')}
          >
            Get started
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;