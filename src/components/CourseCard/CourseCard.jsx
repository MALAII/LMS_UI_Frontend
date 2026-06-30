import React from 'react';
import { FiUser, FiArrowRight, FiStar } from 'react-icons/fi';
import './CourseCard.css';

export default function CourseCard({ 
  title, 
  instructor, 
  progress, 
  thumbnail, 
  category, 
  rating = 4.8 
}) {
  return (
    <div className="course-card glassmorphism lift-effect">
      {/* Visual Header / Thumbnail */}
      <div className="course-thumbnail" style={{ background: thumbnail }}>
        <div className="thumbnail-overlay"></div>
        {category && <span className="course-category badge badge-primary">{category}</span>}
        <div className="course-rating">
          <FiStar className="star-icon" size={12} />
          <span>{rating}</span>
        </div>
      </div>
      
      {/* Course Details */}
      <div className="course-content">
        <h4 className="course-title">{title}</h4>
        
        <div className="course-instructor">
          <div className="instructor-avatar-mini">
            {instructor.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="instructor-name">{instructor}</span>
        </div>

        {/* Completion Progress */}
        <div className="course-progress-section">
          <div className="progress-info">
            <span className="progress-label">Course Progress</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Call to action */}
        <button className="continue-learning-btn">
          <span>Continue Learning</span>
          <FiArrowRight className="arrow-icon" size={16} />
        </button>
      </div>
    </div>
  );
}
