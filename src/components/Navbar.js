import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, signOut, isAuthenticated, isAdmin, isLawEnforcement } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Add background shadow when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path) =>
    location.pathname === path ? 'nav-link active' : 'nav-link';

  const roleLabel = () => {
    if (!user) return null;
    const labels = {
      admin: { text: 'ADMIN', className: 'role-badge role-admin' },
      law_enforcement: { text: 'LAW ENFORCEMENT', className: 'role-badge role-le' },
      public: { text: 'PUBLIC', className: 'role-badge role-public' },
    };
    return labels[user.role] || null;
  };

  const badge = roleLabel();

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="navbar-inner container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" aria-label="ChildGuard AI Home">
          <div className="brand-shield" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z"
                fill="#2E86C1"
                opacity="0.9"
              />
              <path
                d="M9 12l2 2 4-4"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">ChildGuard</span>
            <span className="brand-ai">AI</span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <ul className="nav-links" role="list">
          <li><Link to="/" className={isActive('/')}>Home</Link></li>
          <li><Link to="/gallery" className={isActive('/gallery')}>Missing Children</Link></li>
          <li><Link to="/submit-sighting" className={isActive('/submit-sighting')}>Submit Sighting</Link></li>
          <li><Link to="/about" className={isActive('/about')}>About</Link></li>
          {isAdmin && <li><Link to="/admin/dashboard" className={isActive("/admin/dashboard")}>Dashboard</Link></li>}
          {isAdmin && <li><Link to="/admin/create-case" className={isActive("/admin/create-case")}>Create Case</Link></li>}
        </ul>

        {/* Auth area */}
        <div className="nav-auth">
          {isAuthenticated ? (
            <div className="user-menu">
              {badge && (
                <span className={badge.className} aria-label={`Role: ${badge.text}`}>
                  {badge.text}
                </span>
              )}
              <span className="user-name">{user.name}</span>
              <button
                className="btn btn-outline btn-sm"
                onClick={handleSignOut}
                aria-label="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul role="list">
          <li><Link to="/" className="nav-link">Home</Link></li>
          <li><Link to="/gallery" className="nav-link">Missing Children</Link></li>
          <li><Link to="/submit-sighting" className="nav-link">Submit Sighting</Link></li>
          <li><Link to="/about" className="nav-link">About</Link></li>
          {isAdmin && <li><Link to="/admin/dashboard" className="nav-link">Dashboard</Link></li>}
          {isAdmin && <li><Link to="/admin/create-case" className="nav-link">Create Case</Link></li>}
          <li className="mobile-divider" />
          {isAuthenticated ? (
            <>
              {badge && (
                <li>
                  <span className={badge.className}>{badge.text}</span>
                </li>
              )}
              <li>
                <button className="btn btn-outline btn-sm mobile-signout" onClick={handleSignOut}>
                  Sign Out ({user.name})
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}
