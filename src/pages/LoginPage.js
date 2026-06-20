import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { DEMO_ACCOUNTS } from '../data/mockData';
import './LoginPage.css';

export default function LoginPage() {
  const { signIn, isAuthenticated, loading, error, setError, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Redirect destination after login (defaults to home)
  const from = location.state?.from?.pathname || '/';

  // Already logged in — redirect away
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Clear Amplify auth error when user types
  useEffect(() => {
    if (error) setError(null);
    // eslint-disable-next-line
  }, [email, password]);

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }
    setFormErrors({});

    try {
      await signIn(email.trim(), password);
      // AuthContext will update isAuthenticated → useEffect will redirect
    } catch {
      // Error is set inside AuthContext's signIn
    }
  };

  // Quick-fill demo credentials
  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setFormErrors({});
    if (setError) setError(null);
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-layout">
          {/* ── Left: Login form ── */}
          <div className="login-panel">
            <div className="login-logo" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                  fill="#2E86C1"
                  opacity="0.9"
                />
                <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h1 className="login-title">Sign In</h1>
            <p className="login-subtitle">
              ChildGuard AI Platform
            </p>

            {/* Demo mode notice */}
            <div className="demo-mode-notice" role="note">
              <span className="demo-pill">DEMO MODE</span>
              Use the quick-fill buttons below to sign in with a test account.
              Real Cognito authentication activates after AWS Amplify setup.
            </div>

            <form
              className="login-form"
              onSubmit={handleSubmit}
              noValidate
              aria-label="Sign in form"
            >
              {/* Server/Cognito error */}
              {error && (
                <div className="login-error" role="alert">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="form-field">
                <label htmlFor="login-email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="login-email"
                  className={`form-input ${formErrors.email ? 'input-error' : ''}`}
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formErrors.email) setFormErrors((p) => ({ ...p, email: '' }));
                  }}
                  autoComplete="email"
                  aria-required="true"
                  aria-describedby={formErrors.email ? 'email-err' : undefined}
                />
                {formErrors.email && (
                  <p id="email-err" className="field-error" role="alert">{formErrors.email}</p>
                )}
              </div>

              <div className="form-field">
                <div className="password-label-row">
                  <label htmlFor="login-password" className="form-label">Password</label>
                  <button
                    type="button"
                    className="forgot-link"
                    onClick={() => alert('Password reset — connect real Cognito to enable this.')}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    className={`form-input ${formErrors.password ? 'input-error' : ''}`}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (formErrors.password) setFormErrors((p) => ({ ...p, password: '' }));
                    }}
                    autoComplete="current-password"
                    aria-required="true"
                    aria-describedby={formErrors.password ? 'pw-err' : undefined}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeLinecap="round" />
                        <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p id="pw-err" className="field-error" role="alert">{formErrors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg login-submit"
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="login-links">
              <Link to="/gallery" className="login-nav-link">← Browse Gallery Without Signing In</Link>
            </div>

            {/* AWS Cognito note */}
            <div className="cognito-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <div>
                <strong>Secured by Amazon Cognito</strong>
                <p>Role-based access: Public · Law Enforcement · Admin</p>
              </div>
            </div>
          </div>

          {/* ── Right: Demo accounts ── */}
          <div className="demo-accounts-panel">
            <div className="demo-accounts-header">
              <h2>Demo Test Accounts</h2>
              <p>
                Click any account to auto-fill credentials. These accounts are pre-configured
                for the demo environment only.
              </p>
            </div>

            <div className="demo-accounts-list">
              {DEMO_ACCOUNTS.map((account) => (
                <button
                  key={account.role}
                  className={`demo-account-card role-${account.role}`}
                  onClick={() => fillDemo(account)}
                  aria-label={`Sign in as ${account.role} — ${account.displayName}`}
                >
                  <div className="demo-account-header">
                    <div className={`demo-role-badge role-${account.role}`}>
                      {account.role === 'law_enforcement' ? 'Law Enforcement' :
                       account.role.charAt(0).toUpperCase() + account.role.slice(1)}
                    </div>
                    <span className="click-hint">Click to fill →</span>
                  </div>
                  <div className="demo-account-name">{account.displayName}</div>
                  {account.agency && (
                    <div className="demo-account-agency">{account.agency} · Badge {account.badgeNumber}</div>
                  )}
                  <div className="demo-account-creds">
                    <div className="cred-row">
                      <span className="cred-label">Email</span>
                      <code className="cred-value">{account.email}</code>
                    </div>
                    <div className="cred-row">
                      <span className="cred-label">Password</span>
                      <code className="cred-value">{account.password}</code>
                    </div>
                  </div>
                  <div className="demo-account-desc">{account.description}</div>
                </button>
              ))}
            </div>

            {/* Role permission matrix */}
            <div className="permissions-table">
              <h3 className="permissions-title">Role Permissions</h3>
              <table aria-label="Role permissions matrix">
                <thead>
                  <tr>
                    <th>Permission</th>
                    <th>Public</th>
                    <th>LE</th>
                    <th>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Browse gallery', true, true, true],
                    ['Submit sightings', true, true, true],
                    ['View contact info', false, true, true],
                    ['Full case details', false, true, true],
                    ['Download reports', false, true, true],
                    ['Manage cases', false, false, true],
                    ['Manage users', false, false, true],
                    ['View audit logs', false, false, true],
                  ].map(([perm, pub, le, adm]) => (
                    <tr key={perm}>
                      <td>{perm}</td>
                      <td className={pub ? 'perm-yes' : 'perm-no'} aria-label={pub ? 'Allowed' : 'Not allowed'}>{pub ? '✓' : '✗'}</td>
                      <td className={le ? 'perm-yes' : 'perm-no'} aria-label={le ? 'Allowed' : 'Not allowed'}>{le ? '✓' : '✗'}</td>
                      <td className={adm ? 'perm-yes' : 'perm-no'} aria-label={adm ? 'Allowed' : 'Not allowed'}>{adm ? '✓' : '✗'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
