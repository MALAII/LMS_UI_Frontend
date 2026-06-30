/**
 * Authentication Service (Mock implementation for Frontend Prototyping)
 * 
 * Instructions for Backend Integration:
 * When the backend endpoints are ready, replace the setTimeout Promises below
 * with actual fetch() or axios requests to your backend server.
 */

/**
 * Sign In Service Call
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} User session profile object
 */
export const loginService = (email, password) => {
  return new Promise((resolve, reject) => {
    // Simulate API call latency (800ms)
    setTimeout(() => {
      // Validate mock credentials or format
      if (!email || !password) {
        reject(new Error("Email and password are required."));
        return;
      }

      // Route based on mock credentials
      if (email.toLowerCase().includes('admin')) {
        resolve({
          name: 'Alex Morgan',
          email: email,
          role: 'admin',
          roleLabel: 'Administrator',
          initials: 'AM',
          token: 'mock-jwt-token-admin-12345'
        });
      } else {
        resolve({
          name: 'Sarah Jenkins',
          email: email,
          role: 'student',
          roleLabel: 'Student Member',
          initials: 'SJ',
          token: 'mock-jwt-token-student-67890'
        });
      }
    }, 800);
  });
};

/**
 * Sign Up / Registration Service Call
 * @param {string} fullName 
 * @param {string} email 
 * @param {string} password 
 * @param {string} role 'student' | 'admin'
 * @returns {Promise<Object>} User session profile object
 */
export const signUpService = (fullName, email, password, role) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!fullName.trim() || !email || !password) {
        reject(new Error("Please fill in all registration fields."));
        return;
      }

      // Generate custom user profile details
      const nameParts = fullName.trim().split(/\s+/);
      const initials = nameParts.map(part => part[0]).join('').toUpperCase().slice(0, 2) || 'U';

      resolve({
        name: fullName.trim(),
        email: email,
        role: role,
        roleLabel: role === 'admin' ? 'Administrator' : 'Student Member',
        initials: initials,
        token: 'mock-jwt-token-newly-registered'
      });
    }, 800);
  });
};
