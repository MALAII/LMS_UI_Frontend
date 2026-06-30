import React, { useState, useEffect } from 'react';
import { FiMail, FiLock, FiArrowRight, FiShield, FiX, FiUser } from 'react-icons/fi';
import { FaGoogle, FaLinkedinIn } from 'react-icons/fa';
import { loginService, signUpService } from '../../services/auth';
import './Login.css';

export default function Login({ onLogin, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [activeRole, setActiveRole] = useState('student'); // 'student' | 'admin'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically pre-fill credentials when activeRole tab changes (only in Sign In mode)
  useEffect(() => {
    setError('');
    if (isSignUp) {
      setEmail('');
      setPassword('');
      setFullName('');
    } else {
      if (activeRole === 'student') {
        setEmail('student@gmail.com');
        setPassword('student123');
      } else {
        setEmail('admin@eduvantage.com');
        setPassword('admin123');
      }
    }
  }, [activeRole, isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let userData;
      if (isSignUp) {
        userData = await signUpService(fullName, email, password, activeRole);
      } else {
        userData = await loginService(email, password);
      }
      setLoading(false);
      onLogin(userData);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please try again.');
    }
  };

  const handleSocialLogin = (provider) => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (activeRole === 'admin') {
        onLogin({
          name: 'Alex Morgan',
          email: 'alex.morgan@eduvantage.com',
          role: 'admin',
          roleLabel: 'Administrator',
          initials: 'AM'
        });
      } else {
        onLogin({
          name: 'Sarah Jenkins',
          email: 'sarah.j@gmail.com',
          role: 'student',
          roleLabel: 'Student Member',
          initials: 'SJ'
        });
      }
    }, 600);
  };

  return (
    <div className="login-page-container">
      {/* Background Glows */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>

      <div className="login-card-centered glassmorphism">
        {onClose && (
          <button type="button" className="login-modal-close-btn" onClick={onClose} aria-label="Close modal">
            <FiX size={18} />
          </button>
        )}
        {/* Logo and Branding header */}
        <div className="login-brand-header">
          <div className="brand-logo-circle"></div>
          <span className="brand-name">RedBack<span className="brand-accent">.</span></span>
        </div>

        <div className="login-card-title-group">
          <h2 className="login-title">{isSignUp ? 'Create RedBack Account' : 'Login / Sign up to RedBack'}</h2>
          <p className="login-subtitle">Connect. Collaborate. Showcase. Get Skilled.</p>
        </div>

        {/* Dynamic Persona Selector Tabs (Unstop style) */}
        <div className="persona-tabs-container">
          <button 
            type="button" 
            className={`persona-tab-btn ${activeRole === 'student' ? 'active' : ''}`}
            onClick={() => setActiveRole('student')}
          >
            <span>Student</span>
          </button>
          <button 
            type="button" 
            className={`persona-tab-btn ${activeRole === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveRole('admin')}
          >
            <span>Admin</span>
          </button>
        </div>

        {/* Social logins */}
        <div className="social-login-grid">
          <button 
            type="button" 
            className="social-btn google-btn"
            onClick={() => handleSocialLogin('Google')}
            disabled={loading}
          >
            <FaGoogle className="social-icon" size={16} />
            <span>Continue with Google</span>
          </button>
          <button 
            type="button" 
            className="social-btn linkedin-btn"
            onClick={() => handleSocialLogin('LinkedIn')}
            disabled={loading}
          >
            <FaLinkedinIn className="social-icon" size={16} />
            <span>Continue with LinkedIn</span>
          </button>
        </div>

        {/* Divider */}
        <div className="login-divider">
          <span>or</span>
        </div>

        {/* Error message */}
        {error && <div className="login-error-alert">{error}</div>}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <div className="login-form-group">
              <label htmlFor="login-name">Full Name</label>
              <div className="input-with-icon">
                <FiUser className="input-field-icon" size={16} />
                <input 
                  type="text" 
                  id="login-name" 
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          )}

          <div className="login-form-group">
            <label htmlFor="login-email">Email Address</label>
            <div className="input-with-icon">
              <FiMail className="input-field-icon" size={16} />
              <input 
                type="email" 
                id="login-email" 
                placeholder="Enter email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <div className="password-label-row">
              <label htmlFor="login-password">Password</label>
              {!isSignUp && <button type="button" className="forgot-password-link">Forgot Password?</button>}
            </div>
            <div className="input-with-icon">
              <FiLock className="input-field-icon" size={16} />
              <input 
                type="password" 
                id="login-password" 
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              <>
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                <FiArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Switch Mode Toggle Row */}
        <div className="login-mode-toggle-row">
          <span>{isSignUp ? 'Already have an account?' : 'New to RedBack?'}</span>
          <button 
            type="button" 
            className="toggle-mode-btn"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Register Now'}
          </button>
        </div>

        {/* Form Footer */}
        <div className="login-card-footer">
          <div className="security-badge-centered">
            <FiShield size={14} />
            <span>Session Secure via SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
