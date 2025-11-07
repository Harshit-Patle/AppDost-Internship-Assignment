import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_PREFIX = import.meta.env.VITE_API_PREFIX || '/api';

const apiClient = axios.create({
    baseURL: `${API_BASE}${API_PREFIX}`,
});

export default apiClient;
