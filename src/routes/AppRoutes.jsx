import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard/Dashboard';
import Courses from '../pages/Courses/Courses';
import Students from '../pages/Students/Students';
import Analytics from '../pages/Analytics/Analytics';
import Settings from '../pages/Settings/Settings';
import EmailVerify from '../pages/EmailVerify/EmailVerify';

// Clean visual fallback for routes that are under active catalog development
const MockPage = ({ title }) => (
  <div 
    style={{ 
      padding: '4rem 2rem', 
      textAlign: 'center', 
      backgroundColor: 'var(--card-bg)', 
      border: '1px solid var(--border)', 
      borderRadius: '20px', 
      minHeight: '360px', 
      display: 'flex', 
      
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      boxShadow: 'var(--shadow-sm)',
      boxSizing: 'border-box'
    }}
  >
    <div 
      style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '800',
        fontSize: '1.5rem',
        marginBottom: '1.25rem'
      }}
    >
      ⚙️
    </div>
    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text)', marginBottom: '0.5rem' }}>{title} View</h2>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '380px', lineHeight: '1.5' }}>
      This workspace section is currently under development. Interactive controls will be added soon.
    </p>
  </div>
);

// Route guard component to intercept unauthenticated users
const ProtectedRoute = ({ user, children, onLoginClick }) => {
  useEffect(() => {
    if (!user && onLoginClick) {
      onLoginClick();
    }
  }, [user, onLoginClick]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function AppRoutes({ user, onLoginClick, logout, onUpdateUser }) {
  return (
    <Routes>
      <Route path="/" element={<Dashboard user={user} onLoginClick={onLoginClick} />} />
      <Route path="/email/verify/:id/:hash" element={<EmailVerify />} />
      
      {/* Protected Routes */}
      <Route 
        path="/courses/*" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <Courses user={user} />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/students/*" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <Students />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/analytics/*" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <Analytics />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <Settings user={user} logout={logout} onUpdateUser={onUpdateUser} />
          </ProtectedRoute>
        } 
      />
      
      {/* Fallback mock routes (also protected to verify credentials) */}
      <Route 
        path="/internships" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Internships Management" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/jobs" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Jobs Portal" />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/mock-tests" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Mock Testing Centre" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/instructors" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Instructors Management" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/assignments" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Assignments Dashboard" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/certificates" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Certificates Hub" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/logout" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Logout Session" />
          </ProtectedRoute>
        } 
      />
      
      {/* Recruiter Persona Mock Routes */}
      <Route 
        path="/recruiter/dashboard" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Recruiter Dashboard" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recruiter/jobs" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Jobs & Internships Management" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recruiter/opportunity" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Opportunities Portal" />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/recruiter/assessments" 
        element={
          <ProtectedRoute user={user} onLoginClick={onLoginClick}>
            <MockPage title="Assessments Hub" />
          </ProtectedRoute>
        } 
      />

      {/* Catch-all 404 page */}
      <Route path="*" element={<MockPage title="Page Not Found" />} />
    </Routes>
  );
}
