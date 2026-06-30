export const sidebarData = [
  {
    id: 'home',
    label: 'Home',
    icon: 'FiHome',
    path: '/'
  },
  {
    id: 'internships',
    label: 'Internships',
    icon: 'FiLayers',
    path: '/internships',
    submenu: [
      { label: 'All Internships', path: '/internships' },
      { label: 'Enrolled Internships', path: '/internships/enrolled' },
      { label: 'Applications', path: '/internships/applications' }
    ]
  },
  {
    id: 'jobs',
    label: 'Jobs',
    icon: 'FiBriefcase',
    path: '/jobs',
    submenu: [
      { label: 'All Jobs', path: '/jobs' },
      { label: 'Applied', path: '/jobs/applied' },
      { label: 'Bookmarks', path: '/jobs/bookmarks' }
    ]
  },

  {
    id: 'mock-tests',
    label: 'Mock Tests',
    icon: 'FiCheckSquare',
    path: '/mock-tests'
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: 'FiBookOpen',
    path: '/courses',
    submenu: [
      { label: 'All Courses', path: '/courses' },
      { label: 'My Courses', path: '/courses/my-courses' },
      { label: 'Categories', path: '/courses/categories' },
      { label: 'Learning Paths', path: '/courses/learning-paths' },
      { label: 'Live Classes', path: '/courses/live' }
    ]
  },
  {
    id: 'more',
    label: 'More',
    icon: 'FiSliders',
    path: '/more',
    submenu: [
      { label: 'Analytics', path: '/analytics' },
      { label: 'Students Roster', path: '/students' },
      { label: 'Settings', path: '/settings' },
      { label: 'Logout', path: '/logout' }
    ]
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: 'FiLogOut',
    path: '/logout'
  }
];
