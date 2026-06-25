// src/components/auth/Register.jsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authService } from '../../services/authService';
import { setCredentials } from '../../store/authSlice';
import styles from '../../styles/Register.module.css';

// ── Simple SVG icons ──────────────────────────────────────────
const IconUser = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

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

/**
 * Returns 0–3 strength score for a password.
 * 0 = weak, 1 = fair, 2 = good, 3 = strong
 */
const getPasswordStrength = (pw) => {
  if (!pw) return -1;
  let score = 0;
  if (pw.length >= 8)  score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw))   score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score - 1, 3); // 0-indexed
};

const STRENGTH_LABELS = ['Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_SEGMENTS = 4;

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showPw, setShowPw]     = useState(false);
  const [ripples, setRipples]   = useState([]);
  const btnRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const strengthScore = getPasswordStrength(formData.password);

  const handleRipple = (e) => {
    const btn = btnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const id   = Date.now();
    setRipples((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.register(formData);
      // If registration returns a token, auto-login
      if (response.token) {
        const tokenData = authService.decodeToken(response.token);
        dispatch(setCredentials({
          token: response.token,
          user: {
            sub: tokenData.userId,
            email: formData.email,
            userId: tokenData.userId,
            name: formData.name
          }
        }));
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
        <h1 className={styles.heading}>Create account</h1>
        <p className={styles.subheading}>
          Start your fitness journey today.<br />
          Track workouts, get AI recommendations.
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
          {/* Full Name */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="reg-name">Full Name</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><IconUser /></span>
              <input
                id="reg-name"
                type="text"
                className={styles.input}
                placeholder="Shubham Yadav"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                autoComplete="name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="reg-email">Email</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><IconEmail /></span>
              <input
                id="reg-email"
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
            <label className={styles.label} htmlFor="reg-password">Password</label>
            <div className={styles.inputWrapper}>
              <span className={styles.inputIcon}><IconLock /></span>
              <input
                id="reg-password"
                type={showPw ? 'text' : 'password'}
                className={styles.input}
                placeholder="Min. 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                autoComplete="new-password"
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

            {/* Password Strength Meter */}
            {formData.password.length > 0 && (
              <>
                <div className={styles.strengthBar} role="progressbar" aria-valuenow={strengthScore + 1} aria-valuemin={0} aria-valuemax={4}>
                  {Array.from({ length: STRENGTH_SEGMENTS }).map((_, i) => (
                    <div
                      key={i}
                      className={[
                        styles.strengthSegment,
                        i <= strengthScore ? styles.active : '',
                        i <= strengthScore ? styles[`strength${strengthScore}`] : '',
                      ].join(' ')}
                    />
                  ))}
                </div>
                {strengthScore >= 0 && (
                  <span className={`${styles.strengthLabel} ${styles[`strength${strengthScore}`]}`}>
                    {STRENGTH_LABELS[strengthScore]}
                  </span>
                )}
              </>
            )}
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
                <>Create Account <IconArrow /></>
              )}
            </span>
          </button>
        </form>

        {/* Terms */}
        <p className={styles.terms}>
          By creating an account you agree to our{' '}
          <span className={styles.termsLink}>Terms of Service</span> and{' '}
          <span className={styles.termsLink}>Privacy Policy</span>.
        </p>

        {/* Footer */}
        <p className={styles.footer}>
          Already have an account?
          <span
            className={styles.footerLink}
            role="button"
            tabIndex={0}
            onClick={() => navigate('/login')}
            onKeyDown={(e) => e.key === 'Enter' && navigate('/login')}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;