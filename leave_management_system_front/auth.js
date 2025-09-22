// Authentication utilities for frontend
class AuthManager {
    constructor() {
        this.baseURL = 'http://localhost:3001';
        this.currentUser = null;
    }

    // Store JWT token in localStorage
    setToken(token) {
        if (token) {
            // store token under both keys for compatibility
            localStorage.setItem('jwt_token', token);
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('authToken');
        }
    }

    // Get JWT token from localStorage
    getToken() {
        // prefer authToken (used in newer frontends), fall back to jwt_token
        return localStorage.getItem('authToken') || localStorage.getItem('jwt_token');
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;
        
        try {
            // Check if token is expired (basic check)
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000; // Convert to milliseconds
            
            if (Date.now() >= expiry) {
                this.logout(); // Remove expired token
                return false;
            }
            
            return true;
        } catch (e) {
            this.logout(); // Remove invalid token
            return false;
        }
    }

    // Get current user data
    async getCurrentUser() {
        if (!this.isAuthenticated()) {
            throw new Error('Not authenticated');
        }

        if (this.currentUser) {
            return this.currentUser;
        }

        try {
            const response = await fetch(`${this.baseURL}/auth/me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                    throw new Error('Authentication expired');
                }
                throw new Error('Failed to get user data');
            }

            const result = await response.json();
            this.currentUser = result.user;
            return this.currentUser;
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    }

    // Login user
    async login(email, password) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const result = await response.json();
            
            if (result.access_token) {
                this.setToken(result.access_token);
                this.currentUser = result.user;
                return result;
            } else {
                throw new Error('No access token received');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    // Logout user
    logout() {
        this.setToken(null);
        this.currentUser = null;
        window.location.href = '/login.html';
    }

    // Redirect to login if not authenticated
    requireAuth() {
        if (!this.isAuthenticated()) {
            alert('Please login to access this page');
            this.logout();
            return false;
        }
        return true;
    }

    // Make authenticated API requests
    async authenticatedFetch(url, options = {}) {
        if (!this.isAuthenticated()) {
            throw new Error('Not authenticated');
        }

        const headers = {
            'Authorization': `Bearer ${this.getToken()}`,
            'Content-Type': 'application/json',
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (response.status === 401) {
            this.logout();
            throw new Error('Authentication expired');
        }

        return response;
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// Utility function to get current user ID
async function getCurrentUserId() {
    try {
        const user = await authManager.getCurrentUser();
        return user.id;
    } catch (error) {
        console.error('Error getting current user ID:', error);
        throw error;
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, authManager, getCurrentUserId };
}