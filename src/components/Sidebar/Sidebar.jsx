import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Icons from 'react-icons/fi';
import { sidebarData } from '../../data/sidebarData';
import FlyoutMenu from '../FlyoutMenu/FlyoutMenu';
import './Sidebar.css';

export default function Sidebar({ isExpanded, toggleSidebar, logout, user, activePersona, onLoginClick }) {
  const location = useLocation();
  const navigate = useNavigate();
  const activePath = location.pathname;

  // Hover state to expand sidebar on hover when collapsed
  const [isHovered, setIsHovered] = useState(false);

  // State for hover flyout submenu (rendered at the right side of the sidebar)
  const [activeFlyout, setActiveFlyout] = useState(null); // { item, top, left }
  const flyoutTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (flyoutTimeoutRef.current) clearTimeout(flyoutTimeoutRef.current);
    };
  }, []);

  // Flyout Hover Logic - Triggered on hover for any item with a submenu
  const handleMouseEnterItem = (e, item) => {
    if (!item.submenu) return;

    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
    }

    const rect = e.currentTarget.getBoundingClientRect();
    
    // Dynamically calculate the flyout height to prevent bottom viewport overflow
    const estimatedHeight = item.submenu.length * 42 + 45; // ~42px per item + ~45px header/borders
    let top = rect.top;
    
    // Shift upwards if it overflows the window height
    if (top + estimatedHeight > window.innerHeight) {
      top = Math.max(10, window.innerHeight - estimatedHeight - 15);
    }

    setActiveFlyout({
      item,
      top: top,
      left: rect.right
    });
  };

  const handleMouseLeaveItem = () => {
    flyoutTimeoutRef.current = setTimeout(() => {
      setActiveFlyout(null);
    }, 150);
  };

  const handleMouseEnterFlyout = () => {
    if (flyoutTimeoutRef.current) {
      clearTimeout(flyoutTimeoutRef.current);
    }
  };

  const handleMouseLeaveFlyout = () => {
    setActiveFlyout(null);
  };

  const handleFlyoutItemClick = () => {
    setActiveFlyout(null);
  };

  const handleItemClick = (item) => {
    // Prevent navigating to the /more grouping route
    if (item.id === 'more') {
      return;
    }

    // Intercept guest navigations to prompt login
    if (!user && item.path !== '/') {
      if (onLoginClick) {
        onLoginClick();
      }
      return;
    }

    navigate(item.path);
  };

  const handleLogoutClick = () => {
    if (logout) {
      logout();
    } else {
      alert('Logging out...');
    }
  };

  const isItemActive = (item) => {
    if (item.path === '/') {
      return activePath === '/';
    }
    return activePath.startsWith(item.path);
  };

  const isCurrentlyExpanded = isExpanded || isHovered;

  // Separating logout and more from main listings depending on activePersona
  let mainNavigationItems = [];
  let moreItem = null;
  const logoutItem = sidebarData.find(item => item.id === 'logout');

  if (activePersona === 'recruiter') {
    mainNavigationItems = [
      {
        id: 'recruiter-dashboard',
        label: 'Dashboard',
        icon: 'FiActivity',
        path: '/recruiter/dashboard'
      },
      {
        id: 'recruiter-jobs',
        label: 'Jobs & Internships',
        icon: 'FiBriefcase',
        path: '/recruiter/jobs'
      },
      {
        id: 'recruiter-opportunity',
        label: 'Opportunity',
        icon: 'FiSliders',
        path: '/recruiter/opportunity'
      },
      {
        id: 'recruiter-assessments',
        label: 'Assessments',
        icon: 'FiFileText',
        path: '/recruiter/assessments'
      }
    ];
  } else {
    // Talent view (default candidate view)
    mainNavigationItems = sidebarData.filter(item => item.id !== 'logout' && item.id !== 'more');
    moreItem = sidebarData.find(item => item.id === 'more');

    // Filter listings based on user role (SaaS personalization)
    if (user?.role === 'student') {
      moreItem = null; // Students do not see platform analytics or admin rosters
      
      // Place Settings directly in their sidebar list
      if (!mainNavigationItems.some(i => i.id === 'settings')) {
        mainNavigationItems.push({
          id: 'settings',
          label: 'Settings',
          icon: 'FiSettings',
          path: '/settings'
        });
      }
    }
  }

  return (
    <aside 
      className={`sidebar-container ${isCurrentlyExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveFlyout(null);
      }}
    >
      {/* 1. Main Navigation Listings (Placed at the top) */}
      <div className="sidebar-menu-wrapper">
        <ul className="sidebar-list">
          {mainNavigationItems.map((item) => {
            const IconComponent = Icons[item.icon] || Icons.FiHelpCircle;
            const isActive = isItemActive(item);
            const hasSubmenu = !!item.submenu;

            return (
              <li 
                key={item.id} 
                className="sidebar-list-item-wrapper"
                onMouseEnter={(e) => handleMouseEnterItem(e, item)}
                onMouseLeave={handleMouseLeaveItem}
              >
                <button
                  onClick={() => handleItemClick(item)}
                  className={`sidebar-btn-item ${isActive ? 'active' : ''}`}
                >
                  <div className="btn-content-left">
                    <div className={`icon-circle-bg ${isActive ? 'active' : ''}`}>
                      <IconComponent className="sidebar-icon" size={20} />
                    </div>
                    <span className="sidebar-label">{item.label}</span>
                  </div>
                  
                  {hasSubmenu && isCurrentlyExpanded && (
                    <Icons.FiChevronRight 
                      className="arrow-chevron" 
                      size={14} 
                    />
                  )}
                </button>
              </li>
            );
          })}

          {/* More Submenu Item */}
          {moreItem && (
            <li 
              className="sidebar-list-item-wrapper"
              onMouseEnter={(e) => handleMouseEnterItem(e, moreItem)}
              onMouseLeave={handleMouseLeaveItem}
            >
              <button
                onClick={() => handleItemClick(moreItem)}
                className={`sidebar-btn-item ${isItemActive(moreItem) ? 'active' : ''}`}
              >
                <div className="btn-content-left">
                  <div className={`icon-circle-bg ${isItemActive(moreItem) ? 'active' : ''}`}>
                    <Icons.FiSliders className="sidebar-icon" size={20} />
                  </div>
                  <span className="sidebar-label">{moreItem.label}</span>
                </div>
                {isCurrentlyExpanded && (
                  <Icons.FiChevronRight 
                    className="arrow-chevron" 
                    size={14} 
                  />
                )}
              </button>
            </li>
          )}
        </ul>
      </div>

      {/* 2. Logout Action Button (Kept separately at the bottom end) */}
      {logoutItem && user && (
        <div className="sidebar-footer-wrapper">
          <button
            onClick={handleLogoutClick}
            className="sidebar-btn-item logout-btn-item"
            title={logoutItem.label}
          >
            <div className="btn-content-left">
              <div className="icon-circle-bg logout-icon-bg">
                <Icons.FiLogOut className="sidebar-icon" size={20} />
              </div>
              <span className="sidebar-label">{logoutItem.label}</span>
            </div>
          </button>
        </div>
      )}

      {/* Hover Flyout Submenu Panel (Aligns dynamically at rect.right) */}
      {activeFlyout && (
        <FlyoutMenu
          submenu={activeFlyout.item.submenu}
          parentLabel={activeFlyout.item.label}
          top={activeFlyout.top}
          left={activeFlyout.left}
          onMouseEnter={handleMouseEnterFlyout}
          onMouseLeave={handleMouseLeaveFlyout}
          onItemClick={handleFlyoutItemClick}
        />
      )}
    </aside>
  );
}
