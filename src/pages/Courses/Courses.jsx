import React, { useState } from 'react';
import { FiPlus, FiSearch, FiSliders } from 'react-icons/fi';
import CourseCard from '../../components/CourseCard/CourseCard';
import './Courses.css';

export default function Courses({ user }) {
  const isAdmin = user?.role === 'admin';
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const allCourses = [
    { title: 'Full Stack Web Development', instructor: 'Tim Berners-Lee', progress: 45, thumbnail: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', category: 'Development', status: 'published', rating: 4.8 },
    { title: 'MERN Stack Development', instructor: 'Dan Abramov', progress: 12, thumbnail: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', category: 'Development', status: 'published', rating: 4.9 },
    { title: 'Java Full Stack Development', instructor: 'James Gosling', progress: 80, thumbnail: 'linear-gradient(135deg, #10B981 0%, #047857 100%)', category: 'Development', status: 'published', rating: 4.7 },
    { title: 'Python Full Stack Development', instructor: 'Guido van Rossum', progress: 0, thumbnail: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', category: 'Development', status: 'published', rating: 4.6 },
    { title: 'PHP Full Stack Development', instructor: 'Rasmus Lerdorf', progress: 0, thumbnail: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)', category: 'Development', status: 'published', rating: 4.5 },
    { title: 'WordPress Development', instructor: 'Matt Mullenweg', progress: 100, thumbnail: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', category: 'Development', status: 'published', rating: 4.4 },
    { title: 'Java Programming', instructor: 'Bjarne Stroustrup', progress: 95, thumbnail: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', category: 'Programming', status: 'published', rating: 4.8 },
    { title: 'Python Programming', instructor: 'Alan Turing', progress: 60, thumbnail: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', category: 'Programming', status: 'published', rating: 4.9 },
    { title: 'JavaScript Programming', instructor: 'Brendan Eich', progress: 100, thumbnail: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)', category: 'Programming', status: 'published', rating: 4.8 },
    { title: 'React.js Development', instructor: 'Jordan Walke', progress: 30, thumbnail: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', category: 'Development', status: 'published', rating: 4.9 },
    { title: 'UI/UX Design', instructor: 'Sarah Jenkins', progress: 75, thumbnail: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', category: 'Design', status: 'published', rating: 4.7 },
    { title: 'Graphic Design', instructor: 'Aaron Draplin', progress: 0, thumbnail: 'linear-gradient(135deg, #F59E0B 0%, #B45309 100%)', category: 'Design', status: 'published', rating: 4.6 },
    { title: 'Digital Marketing', instructor: 'Neil Patel', progress: 0, thumbnail: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)', category: 'Marketing', status: 'published', rating: 4.5 },
    { title: 'Data Analytics', instructor: 'Grace Hopper', progress: 25, thumbnail: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', category: 'Data Science', status: 'published', rating: 4.7 },
    { title: 'Artificial Intelligence', instructor: 'Demis Hassabis', progress: 0, thumbnail: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', category: 'Data Science', status: 'published', rating: 4.9 },
    { title: 'Machine Learning', instructor: 'Andrew Ng', progress: 0, thumbnail: 'linear-gradient(135deg, #10B981 0%, #047857 100%)', category: 'Data Science', status: 'published', rating: 4.8 },
    { title: 'Cybersecurity', instructor: 'Kevin Mitnick', progress: 10, thumbnail: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)', category: 'Cybersecurity', status: 'published', rating: 4.7 },
    { title: 'Computer Networking', instructor: 'Vint Cerf', progress: 0, thumbnail: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', category: 'Cybersecurity', status: 'published', rating: 4.6 },
    { title: 'Cloud Computing', instructor: 'Jeff Bezos', progress: 50, thumbnail: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', category: 'Cloud', status: 'published', rating: 4.8 },
    { title: 'DevOps Engineering', instructor: 'Gene Kim', progress: 0, thumbnail: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', category: 'Cloud', status: 'published', rating: 4.7 },
    { title: 'Software Testing', instructor: 'Kent Beck', progress: 100, thumbnail: 'linear-gradient(135deg, #10B981 0%, #047857 100%)', category: 'Testing', status: 'published', rating: 4.5 },
    { title: 'Android App Development', instructor: 'Andy Rubin', progress: 0, thumbnail: 'linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)', category: 'Development', status: 'published', rating: 4.8 },
    { title: 'AWS Cloud', instructor: 'Andy Jassy', progress: 15, thumbnail: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)', category: 'Cloud', status: 'published', rating: 4.9 }
  ];

  // Dynamic user stats calculations
  const totalCourses = allCourses.length;
  const inProgressCourses = allCourses.filter(c => c.progress > 0 && c.progress < 100).length;
  const completedCourses = allCourses.filter(c => c.progress === 100).length;
  const avgProgress = Math.round(allCourses.reduce((acc, c) => acc + c.progress, 0) / totalCourses);

  const courseStats = isAdmin ? [
    { label: 'Total Catalog', value: '45 Courses' },
    { label: 'Enrolled Students', value: '12,842' },
    { label: 'Avg. Completion Rate', value: '82.4%' }
  ] : [
    { label: 'Enrolled Courses', value: `${totalCourses} Classes` },
    { label: 'In Progress', value: `${inProgressCourses} Active` },
    { label: 'Average Completion', value: `${avgProgress}%` }
  ];

  // Filtering Logic
  const filteredCourses = allCourses.filter(course => {
    let matchesTab = true;
    if (isAdmin) {
      matchesTab = activeTab === 'all' || course.status === activeTab;
    } else {
      if (activeTab === 'in-progress') {
        matchesTab = course.progress > 0 && course.progress < 100;
      } else if (activeTab === 'completed') {
        matchesTab = course.progress === 100;
      }
    }

    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          course.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="courses-page">
      {/* Page Header */}
      <div className="page-title-row">
        <div>
          <h2 className="page-heading">{isAdmin ? 'Courses Catalog' : 'My Learning catalog'}</h2>
          <p className="page-subheading">
            {isAdmin 
              ? "Manage and build your platform's educational courses."
              : 'Browse and track your educational curriculum and class progression.'}
          </p>
        </div>
        {isAdmin && (
          <button className="create-course-btn">
            <FiPlus size={18} />
            <span>Create Course</span>
          </button>
        )}
      </div>

      {/* Welcome Banner */}
      <section className="courses-welcome-banner">
        <div className="banner-content">
          <span className="banner-badge">Learning Hub</span>
          <h3 className="banner-title">
            {user ? `Welcome back, ${user.name}!` : 'Expand Your Tech Skills Today'}
          </h3>
          <p className="banner-text">
            Explore our curated selection of 23 professional-grade classes. Enroll in new tracks, track your progression, and earn verified certifications.
          </p>
        </div>
        <div className="banner-graphic">
          <div className="graphic-glow-circle"></div>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <div className="catalog-control-bar glassmorphism">
        {/* Tabs */}
        <div className="catalog-tabs">
          <button 
            className={`catalog-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            {isAdmin ? 'All Courses' : 'All Classes'}
          </button>
          {isAdmin ? (
            <>
              <button 
                className={`catalog-tab-btn ${activeTab === 'published' ? 'active' : ''}`}
                onClick={() => setActiveTab('published')}
              >
                Published
              </button>
              <button 
                className={`catalog-tab-btn ${activeTab === 'draft' ? 'active' : ''}`}
                onClick={() => setActiveTab('draft')}
              >
                Drafts
              </button>
              <button 
                className={`catalog-tab-btn ${activeTab === 'archived' ? 'active' : ''}`}
                onClick={() => setActiveTab('archived')}
              >
                Archived
              </button>
            </>
          ) : (
            <>
              <button 
                className={`catalog-tab-btn ${activeTab === 'in-progress' ? 'active' : ''}`}
                onClick={() => setActiveTab('in-progress')}
              >
                In Progress
              </button>
              <button 
                className={`catalog-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed
              </button>
            </>
          )}
        </div>

        {/* Controls right */}
        <div className="catalog-controls-right">
          <div className="catalog-search">
            <FiSearch size={16} className="search-input-icon" />
            <input 
              type="text" 
              placeholder="Search by title, instructor..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredCourses.length > 0 ? (
        <div className="courses-catalog-grid">
          {filteredCourses.map((course, idx) => (
            <CourseCard key={idx} {...course} />
          ))}
        </div>
      ) : (
        <div className="empty-catalog-state glassmorphism">
          <p className="empty-state-text">No courses match your active search or filters.</p>
          <button 
            className="clear-search-btn"
            onClick={() => { setActiveTab('all'); setSearchQuery(''); }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
