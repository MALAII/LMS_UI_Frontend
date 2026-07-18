import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import RoleSidebar from './components/RoleSidebar/RoleSidebar';
import AppRoutes from './routes/AppRoutes';
import Login from './pages/Login/Login';
import { configureAuthInterceptors, logoutService } from './services/auth';
import './App.css';

export default function App() {
  // Authentication State with User Profile details
  const [currentUser, setCurrentUser] = useState(() => {
    const cached = sessionStorage.getItem('currentUser');
    return cached ? JSON.parse(cached) : null;
  });

  const [activePersona, setActivePersona] = useState('talent');

  // Desktop defaults to expanded, tablets and mobile default to collapsed
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(window.innerWidth > 1024);

  // Set up auth response interceptors for 401 logouts
  useEffect(() => {
    configureAuthInterceptors(() => {
      if (sessionStorage.getItem('currentUser')) {
        handleLogout(true); // Local cleanup only to prevent loops
        setIsLoginModalOpen(true);
      }
    });
  }, []);

  // Automatically adjust sidebar expansion on window resize
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth <= 1024) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    }
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarExpanded(prev => !prev);
  };

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    sessionStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = async (localOnly = false) => {
    if (!localOnly) {
      try {
        await logoutService();
      } catch (err) {
        console.error("Backend logout failed:", err);
      }
    }
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('isLoggedIn');
    delete axios.defaults.headers.common['Authorization'];
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <Router>
      <div className="app-container">
        {/* Leftmost narrow role selector sidebar */}
        <RoleSidebar
          activePersona={activePersona}
          onPersonaChange={setActivePersona}
          user={currentUser}
          onLoginClick={() => setIsLoginModalOpen(true)}
          toggleSidebar={toggleSidebar}
        />

        {/* The right section layout (Header + Sidebar + Content) */}
        <div className="app-right-layout">
          {/* Fixed Header with User Avatar */}
          <Header 
            toggleSidebar={toggleSidebar} 
            isSidebarExpanded={isSidebarExpanded} 
            logout={handleLogout}
            user={currentUser}
            onLoginClick={() => setIsLoginModalOpen(true)}
          />

          {/* Main Content Layout Panel */}
          <div className="main-layout">
            {/* Collapsible Sidebar with Role-Filtered Links */}
            <Sidebar 
              isExpanded={isSidebarExpanded} 
              toggleSidebar={toggleSidebar} 
              logout={handleLogout}
              user={currentUser}
              activePersona={activePersona}
              onLoginClick={() => setIsLoginModalOpen(true)}
            />

            {/* Render Active Page Content view */}
            <main 
              className={`content-container ${
                isSidebarExpanded ? 'sidebar-expanded' : 'sidebar-collapsed'
              }`}
            >
              <AppRoutes 
                user={currentUser} 
                activePersona={activePersona}
                logout={handleLogout}
                onLoginClick={() => setIsLoginModalOpen(true)} 
                onUpdateUser={handleLogin}
              />
            </main>
          </div>
        </div>

        {/* Login Modal Overlay */}
        {isLoginModalOpen && (
          <div className="login-modal-overlay" onClick={() => setIsLoginModalOpen(false)}>
            <div className="login-modal-content" onClick={(e) => e.stopPropagation()}>
              <Login 
                onLogin={(userData) => {
                  handleLogin(userData);
                  setIsLoginModalOpen(false);
                }} 
                onClose={() => setIsLoginModalOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}
