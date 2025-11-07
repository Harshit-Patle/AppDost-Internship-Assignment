import apiClient from '../config/apiClient';

// Profile service now receives token explicitly for consistency and testability
const getProfile = (token) => {
    return apiClient.get('/auth/profile', {
        headers: { 'x-auth-token': token },
    });
};

const updateProfile = (profileData, token) => {
    return apiClient.put('/auth/profile', profileData, {
        headers: { 'x-auth-token': token },
    });
};

export default { getProfile, updateProfile };
