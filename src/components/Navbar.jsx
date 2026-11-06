import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, LogOut, Menu, X, Shield, Calendar, Video } from './Icons';

export const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand" onClick={closeMobile}>
          <div className="brand-icon-wrapper">
            <Heart size={24} className="brand-icon" />
          </div>
          <span className="brand-name">
            Medi<span className="brand-accent">Care</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-links">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            Home
          </NavLink>
          <NavLink to="/doctors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Doctors
          </NavLink>
          <NavLink to="/services" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Services
          </NavLink>
          <NavLink to="/consultation" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Online Consultation
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/my-appointments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Appointments
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              My Profile
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link nav-link-admin ${isActive ? 'active' : ''}`}>
              <Shield size={16} /> Admin Dashboard
            </NavLink>
          )}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <Link to="/profile" className="user-badge" title="View Profile">
                <div className="avatar-circle">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-info-text">
                  <span className="user-name-short">{user?.name}</span>
                  <span className="user-role-tag">{isAdmin ? 'Admin' : 'Patient'}</span>
                </div>
              </Link>
              <button onClick={handleLogout} className="btn-logout" title="Sign Out">
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={closeMobile}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="navbar-brand">
                <div className="brand-icon-wrapper">
                  <Heart size={20} className="brand-icon" />
                </div>
                <span className="brand-name">
                  Medi<span className="brand-accent">Care</span>
                </span>
              </div>
              <button className="modal-close-btn" onClick={closeMobile}>
                <X size={22} />
              </button>
            </div>

            {isAuthenticated && (
              <div className="mobile-user-card">
                <div className="avatar-circle">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="user-name-short">{user?.name}</div>
                  <div className="user-role-tag">{user?.email}</div>
                </div>
              </div>
            )}

            <div className="mobile-links-list">
              <Link to="/" onClick={closeMobile} className="mobile-link">
                Home
              </Link>
              <Link to="/doctors" onClick={closeMobile} className="mobile-link">
                Find Doctors
              </Link>
              <Link to="/services" onClick={closeMobile} className="mobile-link">
                Medical Services
              </Link>
              <Link to="/consultation" onClick={closeMobile} className="mobile-link">
                Online Consultation
              </Link>
              {isAuthenticated && (
                <>
                  <Link to="/book-appointment" onClick={closeMobile} className="mobile-link">
                    Book Appointment
                  </Link>
                  <Link to="/my-appointments" onClick={closeMobile} className="mobile-link">
                    My Appointments
                  </Link>
                  <Link to="/profile" onClick={closeMobile} className="mobile-link">
                    My Profile
                  </Link>
                </>
              )}
              {isAdmin && (
                <Link to="/admin" onClick={closeMobile} className="mobile-link mobile-link-admin">
                  <Shield size={18} /> Admin Dashboard
                </Link>
              )}
            </div>

            <div className="mobile-drawer-footer">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn btn-danger btn-block">
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <div className="mobile-auth-actions">
                  <Link to="/login" onClick={closeMobile} className="btn btn-outline btn-block">
                    Login
                  </Link>
                  <Link to="/register" onClick={closeMobile} className="btn btn-primary btn-block">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
