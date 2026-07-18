import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { verifyEmailService } from '../../services/auth';
import './EmailVerify.css';

export default function EmailVerify() {
  const { id, hash } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const hasCalled = useRef(false);

  useEffect(() => {
    // Prevent double invocation in React StrictMode
    if (hasCalled.current) return;
    hasCalled.current = true;

    const verifyEmail = async () => {
      try {
        const response = await verifyEmailService(id, hash, location.search);
        setStatus('success');
        setMessage(response.message || 'Your email has been verified successfully!');
        
        // Update user state if logged in
        const cachedUser = localStorage.getItem('currentUser');
        if (cachedUser) {
          const userObj = JSON.parse(cachedUser);
          userObj.email_verified_at = new Date().toISOString();
          localStorage.setItem('currentUser', JSON.stringify(userObj));
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || err.message || 'Verification link is invalid or has expired.');
      }
    };

    verifyEmail();
  }, [id, hash, location.search]);

  return (
    <div className="email-verify-container">
      <div className="email-verify-card glassmorphism">
        <div className="logo-container">
          <img src="/redback_logo.png" alt="RedBack Logo" className="verify-logo" />
        </div>

        {status === 'verifying' && (
          <div className="status-section">
            <div className="spinner-wrapper">
              <FiLoader className="spin-icon" size={48} />
            </div>
            <h2 className="verify-title">Verifying Email Address</h2>
            <p className="verify-text">We are confirming your email signature with the server. Please wait...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="status-section fade-in">
            <div className="icon-circle success-circle">
              <FiCheckCircle size={32} />
            </div>
            <h2 className="verify-title">Email Verified!</h2>
            <p className="verify-text">{message}</p>
            <button 
              type="button" 
              className="action-btn proceed-btn"
              onClick={() => navigate('/')}
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="status-section fade-in">
            <div className="icon-circle error-circle">
              <FiXCircle size={32} />
            </div>
            <h2 className="verify-title">Verification Failed</h2>
            <p className="verify-text">{message}</p>
            <div className="verify-actions">
              <button 
                type="button" 
                className="action-btn back-btn"
                onClick={() => navigate('/')}
              >
                Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
