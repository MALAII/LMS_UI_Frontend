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

  // Reset fields when views change
  useEffect(() => {
    setError('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
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
        
        // Handle both direct response data and data-nested response schemas
        const loginData = responseData.data || responseData;
        const userObj = loginData.user || responseData.user;
        const tokenVal = loginData.token || responseData.token;
        
        if (!userObj) {
          throw new Error("Invalid response schema from authentication backend.");
        }
        
        // Map the backend Laravel Sanctum response structure to frontend model
        const userRole = userObj.roles?.[0]?.name?.toLowerCase() || userObj.role?.toLowerCase() || 'student';
        const mappedRole = (userRole === 'admin' || userRole === 'recruiter' || userRole === 'employer') ? 'recruiter' : 'candidate';
        
        const nameParts = (userObj.name || '').split(/\s+/);
        const initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2) || 'U';
        
        const processedUser = {
          id: userObj.id,
          name: userObj.name,
          email: userObj.email,
          role: mappedRole,
          roleLabel: userObj.roles?.[0]?.name || (mappedRole === 'recruiter' ? 'Recruiter' : 'Student'),
          initials: initials,
          token: tokenVal,
          email_verified_at: userObj.email_verified_at,
          
          // Candidate / Student profile fields
          profession: userObj.profession || userObj.profile?.profession || userObj.candidate_profile?.profession || null,
          institution: userObj.institution || userObj.profile?.institution || userObj.candidate_profile?.institution || null,
          phone: userObj.phone || null,
          about: userObj.about || userObj.profile?.about || userObj.candidate_profile?.about || null,
          avatar: userObj.avatar || null,
          skills: userObj.skills || userObj.profile?.skills || userObj.candidate_profile?.skills || null,
          education: userObj.education || userObj.profile?.education || userObj.candidate_profile?.education || null,
          work_experience: userObj.work_experience || userObj.profile?.work_experience || userObj.candidate_profile?.work_experience || null,
          resume_path: userObj.resume_path || userObj.profile?.resume_path || userObj.candidate_profile?.resume_path || null,
          responsibilities: userObj.responsibilities || userObj.profile?.responsibilities || userObj.candidate_profile?.responsibilities || null,
          certificates: userObj.certificates || userObj.profile?.certificates || userObj.candidate_profile?.certificates || null,
          projects: userObj.projects || userObj.profile?.projects || userObj.candidate_profile?.projects || null,
          achievements: userObj.achievements || userObj.profile?.achievements || userObj.candidate_profile?.achievements || null,
          social_links: userObj.social_links || userObj.profile?.social_links || userObj.candidate_profile?.social_links || null,
          
          // Recruiter / Company profile fields
          designation: userObj.designation || userObj.profile?.designation || userObj.recruiter_profile?.designation || null,
          department: userObj.department || userObj.profile?.department || userObj.recruiter_profile?.department || null,
          phone_extension: userObj.phone_extension || userObj.profile?.phone_extension || userObj.recruiter_profile?.phone_extension || null,
          
          // Nested company relation fields
          company_name: userObj.company_name || userObj.profile?.company?.company_name || userObj.recruiter_profile?.company?.company_name || userObj.company?.company_name || null,
          company_logo: userObj.company_logo || userObj.profile?.company?.logo || userObj.recruiter_profile?.company?.logo || userObj.company?.logo || null,
          company_website: userObj.company_website || userObj.profile?.company?.website || userObj.recruiter_profile?.company?.website || userObj.company?.website || null,
          company_industry: userObj.company_industry || userObj.profile?.company?.industry || userObj.recruiter_profile?.company?.industry || userObj.company?.industry || null,
          company_size: userObj.company_size || userObj.profile?.company?.company_size || userObj.recruiter_profile?.company?.company_size || userObj.company?.company_size || null,
          company_description: userObj.company_description || userObj.profile?.company?.description || userObj.recruiter_profile?.company?.description || userObj.company?.description || null,
          company_gst: userObj.company_gst || userObj.profile?.company?.gst_number || userObj.recruiter_profile?.company?.gst_number || userObj.company?.gst_number || null,
          company_head_office: userObj.company_head_office || userObj.profile?.company?.head_office || userObj.recruiter_profile?.company?.head_office || userObj.company?.head_office || null
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
