import React from 'react';
import { Link } from 'react-router-dom';
import './FlyoutMenu.css';

export default function FlyoutMenu({ 
  submenu, 
  parentLabel, 
  top, 
  left,
  onMouseEnter, 
  onMouseLeave, 
  onItemClick 
}) {
  if (!submenu || submenu.length === 0) return null;

  return (
    <div 
      className="flyout-container glassmorphism" 
      style={{ top: `${top}px`, left: `${left}px` }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="flyout-header">{parentLabel}</div>
      <ul className="flyout-list">
        {submenu.map((item, idx) => (
          <li key={idx} className="flyout-item">
            <Link 
              to={item.path} 
              className="flyout-link"
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
