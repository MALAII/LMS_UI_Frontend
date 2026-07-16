import React, { useState, useEffect } from 'react';
import { FiMail, FiLock, FiArrowRight, FiShield, FiX, FiUser } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import { loginService, signUpService, forgotPasswordService } from '../../services/auth';
import './Login.css';

export default function Login({ onLogin, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [activeRole, setActiveRole] = useState('candidate'); // 'candidate' | 'recruiter'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Automatically pre-fill credentials when activeRole tab changes (only in Sign In mode)
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    if (isSignUp || isForgotPassword) {
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setFullName('');
    } else {
      if (activeRole === 'candidate') {
        setEmail('student@gmail.com');
        setPassword('student123');
      } else {
        setEmail('admin@eduvantage.com');
        setPassword('admin123');
      }
    }
  }, [activeRole, isSignUp, isForgotPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Handle Forgot Password Submission
    if (isForgotPassword) {
      if (!email) {
        setError('Please enter your email address.');
        return;
      }
      setError('');
      setSuccessMsg('');
      setLoading(true);
      try {
        const forgotResponse = await forgotPasswordService(email);
        setLoading(false);
        setSuccessMsg(forgotResponse.message || 'Reset link sent! Please check your email.');
        setEmail('');
      } catch (err) {
        setLoading(false);
        if (err.response && err.response.data) {
          setError(err.response.data.message || 'Failed to send reset link.');
        } else {
          setError(err.message || 'Failed to connect to the server.');
        }
      }
      return;
    }

    // 2. Handle Login / Sign Up Submission
    if (isSignUp && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (isSignUp && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isSignUp) {
        const regResponse = await signUpService(fullName, email, activeRole, password, confirmPassword);
        setLoading(false);
        setSuccessMsg(regResponse.message || 'Registered successfully. Please verify your email.');
        setIsSignUp(false); // Switch back to Sign In
        // Clear sign up fields
        setFullName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        const responseData = await loginService(email, password);
        setLoading(false);
        
        // Map the backend Laravel Sanctum response structure to frontend model
        const userRole = responseData.user.roles?.[0]?.name?.toLowerCase() || 'student';
        const mappedRole = (userRole === 'admin' || userRole === 'recruiter' || userRole === 'employer') ? 'recruiter' : 'candidate';
        
        const nameParts = responseData.user.name.split(/\s+/);
        const initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2) || 'U';
        
        const processedUser = {
          id: responseData.user.id,
          name: responseData.user.name,
          email: responseData.user.email,
          role: mappedRole,
          roleLabel: responseData.user.roles?.[0]?.name || 'Student',
          initials: initials,
          token: responseData.token
        };
        onLogin(processedUser);
      }
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data) {
        const status = err.response.status;
        const data = err.response.data;
        if (status === 422) {
          if (data.errors && typeof data.errors === 'object') {
            const errorMsgs = Object.values(data.errors).flat().join(' ');
            setError(errorMsgs || data.message || 'Validation failed.');
          } else {
            setError(data.message || 'Incorrect email or password.');
          }
        } else if (status === 403) {
          setError(data.message || 'Your account has been blocked, contact support.');
        } else if (status === 429) {
          setError(data.message || 'Too many attempts, please wait a minute and try again.');
        } else {
          setError(data.message || 'Authentication failed. Please try again.');
        }
      } else {
        setError(err.message || 'Failed to connect to the server.');
      }
    }
  };

  const handleSocialLogin = (provider) => {
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setError('Social login is not configured on the live server yet.');
    }, 400);
  };

  // Render Forgot Password Screen
  if (isForgotPassword) {
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
            <img src="/redback_logo.png" alt="RedBack Logo" className="login-logo-img" />
          </div>

          <div className="login-card-title-group">
            <h2 className="login-title">Forgot Password</h2>
            <p className="login-subtitle">Enter your email address to receive a password reset link.</p>
          </div>

          {/* Success Alert Banner */}
          {successMsg && <div className="login-success-alert">{successMsg}</div>}

          {/* Error Alert Banner */}
          {error && <div className="login-error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="login-form-group">
              <label htmlFor="reset-email">Email Address</label>
              <div className="input-with-icon">
                <FiMail className="input-field-icon" size={16} />
                <input 
                  type="email" 
                  id="reset-email" 
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  <span>Send Reset Link</span>
                  <FiArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Back to Login Toggle */}
          <div className="login-mode-toggle-row">
            <button 
              type="button" 
              className="toggle-mode-btn"
              onClick={() => {
                setIsForgotPassword(false);
                setIsSignUp(false);
              }}
            >
              Back to Login
            </button>
          </div>

          {/* Form Footer */}
          <div className="login-card-footer">
            <div className="security-badge-centered">
              <FiShield size={14} />
              <span>Secure SSL Encrypted Connection</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Standard Login / Sign Up Screen
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
          <img src="/redback_logo.png" alt="RedBack Logo" className="login-logo-img" />
        </div>

        <div className="login-card-title-group">
          <h2 className="login-title">{isSignUp ? 'Create RedBack Account' : 'Login / Sign up to RedBack'}</h2>
          <p className="login-subtitle">Connect. Collaborate. Showcase. Get Skilled.</p>
        </div>

        {/* Dynamic Persona Selector Tabs (Unstop style) */}
        <div className="persona-tabs-container">
          <button 
            type="button" 
            className={`persona-tab-btn ${activeRole === 'candidate' ? 'active' : ''}`}
            onClick={() => setActiveRole('candidate')}
          >
            <span>Candidate</span>
          </button>
          <button 
            type="button" 
            className={`persona-tab-btn ${activeRole === 'recruiter' ? 'active' : ''}`}
            onClick={() => setActiveRole('recruiter')}
          >
            <span>Recruiter</span>
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
        </div>

        {/* Divider */}
        <div className="login-divider">
          <span>or</span>
        </div>

        {/* Success Alert Banner */}
        {successMsg && <div className="login-success-alert">{successMsg}</div>}

        {/* Error Alert Banner */}
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
              {!isSignUp && (
                <button 
                  type="button" 
                  className="forgot-password-link"
                  onClick={() => setIsForgotPassword(true)}
                >
                  Forgot Password?
                </button>
              )}
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

          {isSignUp && (
            <div className="login-form-group">
              <label htmlFor="login-confirm-password">Confirm Password</label>
              <div className="input-with-icon">
                <FiLock className="input-field-icon" size={16} />
                <input 
                  type="password" 
                  id="login-confirm-password" 
                  placeholder="Confirm your password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
            </div>
          )}

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
            <span>Secure SSL Encrypted Connection</span>
          </div>
        </div>
      </div>
    </div>
  );
}
