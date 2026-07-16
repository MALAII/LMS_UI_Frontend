import React from 'react';
import { 
  FiArrowRight, FiBriefcase, FiSearch, FiAward, FiFileText, 
  FiVideo, FiUsers, FiBookOpen, FiClock, FiCheckSquare 
} from 'react-icons/fi';
import StatsCard from '../../components/StatsCard/StatsCard';
import CourseCard from '../../components/CourseCard/CourseCard';
import ActivityCard from '../../components/ActivityCard/ActivityCard';
import './Dashboard.css';

// SVG LMS Illustration Component for Google Careers-style Card
const LmsIllustration = () => (
  <svg 
    viewBox="0 0 500 400" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="hero-svg"
  >
    {/* Background Decorative Rings */}
    <circle cx="250" cy="200" r="160" stroke="#EFF6FF" strokeWidth="8" strokeDasharray="16 16" />
    <circle cx="250" cy="200" r="120" stroke="#EEF2FF" strokeWidth="4" />
    
    {/* Floating Elements (Glassmorphic Mockups) */}
    {/* Certificate Node */}
    <g className="floating-item delay-1">
      <rect x="50" y="80" width="130" height="90" rx="16" fill="white" filter="drop-shadow(0px 8px 16px rgba(15, 23, 42, 0.06))" />
      <rect x="66" y="96" width="36" height="36" rx="8" fill="#FEF3C7" />
      <path d="M84 105L89 115L79 110L69 115L74 105" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="114" y="102" width="50" height="6" rx="3" fill="#E2E8F0" />
      <rect x="114" y="114" width="30" height="6" rx="3" fill="#F1F5F9" />
      <rect x="66" y="142" width="98" height="12" rx="6" fill="#EFF6FF" />
      <rect x="76" y="146" width="78" height="4" rx="2" fill="#3B82F6" />
    </g>

    {/* Code / Study Node */}
    <g className="floating-item delay-2">
      <rect x="320" y="60" width="140" height="100" rx="16" fill="white" filter="drop-shadow(0px 8px 16px rgba(15, 23, 42, 0.06))" />
      <rect x="336" y="76" width="36" height="36" rx="8" fill="#EFF6FF" />
      <path d="M348 90L352 94L360 86" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="384" y="82" width="60" height="6" rx="3" fill="#E2E8F0" />
      <rect x="384" y="94" width="40" height="6" rx="3" fill="#F1F5F9" />
      <rect x="336" y="124" width="108" height="6" rx="3" fill="#10B981" />
      <rect x="336" y="136" width="80" height="6" rx="3" fill="#E2E8F0" />
    </g>

    {/* Student / Instructor Center Card */}
    <g className="floating-item main-center">
      {/* Laptop / Console Frame */}
      <rect x="120" y="170" width="260" height="170" rx="20" fill="white" filter="drop-shadow(0px 12px 24px rgba(15, 23, 42, 0.08))" />
      <rect x="136" y="186" width="228" height="100" rx="12" fill="#F8FAFC" />
      {/* Grid Content inside Console */}
      <circle cx="164" cy="214" r="16" fill="#E2E8F0" />
      <path d="M164 220C157 220 152 225 152 230H176C176 225 171 220 164 220Z" fill="#94A3B8" />
      <rect x="192" y="204" width="80" height="8" rx="4" fill="#E2E8F0" />
      <rect x="192" y="218" width="50" height="6" rx="3" fill="#F1F5F9" />
      {/* Graphic Bars */}
      <rect x="152" y="254" width="60" height="16" rx="8" fill="#EEF2FF" />
      <rect x="162" y="260" width="40" height="4" rx="2" fill="#4F46E5" />
      <rect x="222" y="254" width="60" height="16" rx="8" fill="#ECFDF5" />
      <rect x="232" y="260" width="40" height="4" rx="2" fill="#10B981" />
      <rect x="292" y="254" width="60" height="16" rx="8" fill="#FEF2F2" />
      <rect x="302" y="260" width="40" height="4" rx="2" fill="#EF4444" />
      
      {/* Keyboard Laptop base decoration */}
      <rect x="100" y="340" width="300" height="10" rx="5" fill="#E2E8F0" />
      <rect x="220" y="340" width="60" height="4" rx="2" fill="#94A3B8" />
    </g>

    {/* Extra statistics node */}
    <g className="floating-item delay-3">
      <rect x="300" y="260" width="150" height="90" rx="16" fill="white" filter="drop-shadow(0px 8px 16px rgba(15, 23, 42, 0.06))" />
      <circle cx="330" cy="300" r="16" fill="#EEF2FF" />
      <path d="M326 304V296M330 304V292M334 304V300" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
      <rect x="356" y="292" width="70" height="8" rx="4" fill="#0F172A" />
      <rect x="356" y="306" width="40" height="6" rx="3" fill="#64748B" />
    </g>
  </svg>
);

const categories = [
  { id: 'internships', label: 'Internships', icon: FiBriefcase, color: 'blue' },
  { id: 'jobs', label: 'Jobs', icon: FiSearch, color: 'navy' },
  { id: 'mock-tests', label: 'Mock Tests', icon: FiFileText, color: 'cyan' },
  { id: 'mock-interviews', label: 'Mock Interviews', icon: FiVideo, color: 'indigo' },
  { id: 'courses', label: 'Courses', icon: FiBookOpen, color: 'rose' }
];

const featuredCampaigns = [
  { 
    title: "Master AI with Galaxy", 
    subtitle: "Join Samsung Galaxy AI treasure hunt. Win vouchers up to ₹40,000!", 
    tag: "Samsung Galaxy Hunt", 
    gradient: "linear-gradient(135deg, #1e1b4b 0%, #1e3a8a 100%)" 
  },
  { 
    title: "Reinvent with Accenture", 
    subtitle: "Accenture campus recruitment drive. Register to apply.", 
    tag: "Accenture Careers", 
    gradient: "linear-gradient(135deg, #3b0764 0%, #581c87 100%)" 
  },
  { 
    title: "unstop CLUB VERSE 2026", 
    subtitle: "Can your college club make it to India's Top 10?", 
    tag: "Club Orientations", 
    gradient: "linear-gradient(135deg, #0f172a 0%, #0369a1 100%)" 
  },
  { 
    title: "Reinvent with Accenture", 
    subtitle: "Full-time software engineering roles in Indore.", 
    tag: "Accenture Indore", 
    gradient: "linear-gradient(135deg, #4c0519 0%, #881337 100%)" 
  }
];

export default function Dashboard({ user, onLoginClick }) {
  const isAdmin = user?.role === 'admin';
  const isStudent = user?.role === 'student';

  const statsData = isAdmin ? [
    { title: 'Total Students', value: '12,842', icon: 'FiUsers', trend: 12.5, trendType: 'up', trendLabel: 'from last month' },
    { title: 'Active Courses', value: '45', icon: 'FiBookOpen', trend: 4.8, trendType: 'up', trendLabel: 'new courses added' },
    { title: 'Assignments Submitted', value: '18,294', icon: 'FiFileText', trend: 22.1, trendType: 'up', trendLabel: 'graded today' },
    { title: 'Certificates Issued', value: '3,482', icon: 'FiAward', trend: 2.1, trendType: 'down', trendLabel: 'pending validation' }
  ] : isStudent ? [
    { title: 'Enrolled Courses', value: '4', icon: 'FiBookOpen', trend: 25.0, trendType: 'up', trendLabel: 'from last week' },
    { title: 'Study Time', value: '42.5 hrs', icon: 'FiClock', trend: 15.2, trendType: 'up', trendLabel: 'active this week' },
    { title: 'Tasks Completed', value: '18', icon: 'FiCheckSquare', trend: 5.5, trendType: 'up', trendLabel: '3 pending review' },
    { title: 'Credentials Earned', value: '2', icon: 'FiAward', trend: 100.0, trendType: 'up', trendLabel: 'certificates' }
  ] : [
    { title: 'Active Learners', value: '25,482', icon: 'FiUsers', trend: 18.2, trendType: 'up', trendLabel: 'new learners this week' },
    { title: 'Total Catalog Courses', value: '120+', icon: 'FiBookOpen', trend: 8.4, trendType: 'up', trendLabel: 'updated recently' },
    { title: 'Daily Submissions', value: '3,420', icon: 'FiFileText', trend: 12.0, trendType: 'up', trendLabel: 'graded instantly' },
    { title: 'Success Rate', value: '94.8%', icon: 'FiAward', trend: 1.5, trendType: 'up', trendLabel: 'course completion rate' }
  ];

  const popularCourses = [
    { 
      title: 'React.js Development', 
      instructor: 'Jordan Walke', 
      progress: 30, 
      thumbnail: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)', 
      category: 'Development',
      rating: 4.9 
    },
    { 
      title: 'UI/UX Design', 
      instructor: 'Sarah Jenkins', 
      progress: 75, 
      thumbnail: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)', 
      category: 'Design',
      rating: 4.7 
    },
    { 
      title: 'Python Programming', 
      instructor: 'Alan Turing', 
      progress: 60, 
      thumbnail: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)', 
      category: 'Programming',
      rating: 4.9 
    },
    { 
      title: 'MERN Stack Development', 
      instructor: 'Dan Abramov', 
      progress: 12, 
      thumbnail: 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)', 
      category: 'Development',
      rating: 4.9 
    }
  ];

  const activities = isAdmin ? [
    { type: 'enrollment', text: 'Sarah Jenkins enrolled in React.js Development', time: '5 mins ago', meta: 'New Student' },
    { type: 'assignment', text: 'Marcus Aurelius submitted Assignment 4 in UI/UX Design', time: '32 mins ago', meta: 'Graded (A+)' },
    { type: 'certificate', text: 'Certificate generated for Emily Davis for completing JavaScript Programming', time: '2 hours ago', meta: 'Issued' },
    { type: 'course', text: 'New Course published: Full Stack Web Development by Tim Berners-Lee', time: '1 day ago', meta: 'Published' }
  ] : isStudent ? [
    { type: 'enrollment', text: 'You enrolled in React.js Development', time: '5 mins ago', meta: 'Learning' },
    { type: 'assignment', text: 'You submitted Assignment 4 in UI/UX Design Guidelines', time: '32 mins ago', meta: 'Pending Grade' },
    { type: 'certificate', text: 'Certificate generated for your course completion: JavaScript Programming', time: '2 hours ago', meta: 'Issued' },
    { type: 'course', text: 'New course published on your catalog: Full Stack Web Development', time: '1 day ago', meta: 'New' }
  ] : [
    { type: 'enrollment', text: 'Sarah Jenkins enrolled in React.js Development', time: '5 mins ago', meta: 'Student' },
    { type: 'assignment', text: 'Marcus Aurelius submitted Assignment 4 in UI/UX Design', time: '32 mins ago', meta: 'Student' },
    { type: 'certificate', text: 'Certificate generated for Emily Davis for JavaScript Programming', time: '2 hours ago', meta: 'Student' },
    { type: 'course', text: 'New course published: Full Stack Web Development', time: '1 day ago', meta: 'Course' }
  ];

  // Guest view (Before Login) styled to mimic Unstop's landing page
  if (!user) {
    return (
      <div className="dashboard-page guest-dashboard-view">
        {/* 1. Unstop-style Hero Banner */}
        <section className="dashboard-hero guest-hero glassmorphism">
          <div className="hero-text-content">
            <div className="profile-badge-floating">
              <span className="bullet"></span>
              <span>Access to 850M+ profiles</span>
            </div>
            <h1 className="hero-title">
              Unlock Your <span className="highlight-career">Career!</span>
            </h1>
            <p className="hero-subtitle">
              Connect, collaborate, showcase, and get skilled. Explore popular learning paths, complete assignments, and earn verified industry-ready credentials.
            </p>
            <button className="hero-cta-btn" onClick={onLoginClick}>
              <span>Explore Opportunities</span>
              <FiArrowRight size={18} />
            </button>
          </div>
          <div className="hero-illustration-content">
            <LmsIllustration />
          </div>
        </section>

        {/* 2. Unstop-style Horizontal Categories pills with Infinite Marquee Slider */}
        <section className="categories-section">
          <div className="categories-slider-container">
            <div className="categories-marquee-track">
              {[...categories, ...categories].map((cat, index) => {
                const Icon = cat.icon;
                return (
                  <div 
                    key={`${cat.id}-${index}`} 
                    className={`category-pill-card pill-${cat.color}`}
                    onClick={onLoginClick}
                  >
                    <div className="cat-icon-container">
                      <Icon size={20} />
                    </div>
                    <span className="cat-label">{cat.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Unstop-style Featured Opportunities slide grid */}
        <section className="featured-opportunities-section">
          <div className="featured-header">
            <span className="featured-title-line"></span>
            <h3 className="featured-section-title">Featured</h3>
          </div>
          <div className="featured-grid">
            {featuredCampaigns.map((camp, idx) => (
              <div 
                key={idx} 
                className="featured-campaign-card"
                style={{ background: camp.gradient }}
                onClick={onLoginClick}
              >
                <div className="camp-card-overlay"></div>
                <div className="camp-card-content">
                  <span className="camp-badge">{camp.tag}</span>
                  <h4 className="camp-title">{camp.title}</h4>
                  <p className="camp-subtitle">{camp.subtitle}</p>
                  <button className="camp-btn">
                    <span>Register Now</span>
                    <FiArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Platform Statistics */}
        <section className="platform-stats-section">
          <div className="section-header">
            <h3 className="section-title">RedBack Community Impact</h3>
          </div>
          <div className="dashboard-stats-grid">
            {statsData.map((stat, idx) => (
              <StatsCard key={idx} {...stat} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  // Authenticated view (After Login)
  return (
    <div className="dashboard-page">
      {/* 1. Hero Section (Google Careers Card Style) */}
      <section className="dashboard-hero glassmorphism">
        <div className="hero-text-content">
          <h1 className="hero-title">
            Welcome back, {user.name}!
          </h1>
          <p className="hero-subtitle">
            {isAdmin 
              ? 'Manage courses, students and progress from one centralized, modern dashboard. Keep track of grades, submissions, and metrics effortlessly.'
              : 'Track your learning path, watch course lectures, check your progress, and download your course certificates.'}
          </p>
          <button className="hero-cta-btn">
            <span>Explore Courses</span>
            <FiArrowRight size={18} />
          </button>
        </div>
        <div className="hero-illustration-content">
          <LmsIllustration />
        </div>
      </section>

      {/* 2. Statistics Grid */}
      <section className="dashboard-stats-grid">
        {statsData.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </section>

      {/* 3. Splitted Content Section */}
      <div className="dashboard-content-split">
        {/* Popular Courses list */}
        <section className="courses-column">
          <div className="section-header">
            <h3 className="section-title">Popular Courses</h3>
            <button className="section-action-link">View All</button>
          </div>
          <div className="courses-grid">
            {popularCourses.map((course, idx) => (
              <CourseCard key={idx} {...course} />
            ))}
          </div>
        </section>

        {/* Recent Activity Timeline */}
        <section className="activity-column">
          <div className="section-header">
            <h3 className="section-title">Recent Activity</h3>
            <button className="section-action-link">View Logs</button>
          </div>
          <div className="activity-timeline-card glassmorphism">
            <div className="timeline-container">
              {activities.map((activity, idx) => (
                <ActivityCard key={idx} {...activity} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
