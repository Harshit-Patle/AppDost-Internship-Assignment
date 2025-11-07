import apiClient from '../config/apiClient';

/**
 * Sends a signup request to the backend.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise} The axios response promise.
 */
const signup = (name, email, password) => {
    return apiClient.post(`/auth/signup`, { name, email, password });
};

/**
 * Sends a login request to the backend.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise} The axios response promise.
 */
const login = (email, password) => {
    return apiClient.post(`/auth/login`, { email, password });
};

// Export the functions as an object
const authService = {
    signup,
    login,
};

export default authService;