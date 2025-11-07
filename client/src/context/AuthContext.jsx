import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Will hold { _id: '...', name: '...' }
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true); // For initial load
    const navigate = useNavigate();

    // 3. Check for existing token on app load
    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        const savedName = localStorage.getItem('name');
        const savedId = localStorage.getItem('userId');
        if (savedToken && savedName && savedId) {
            setUser({ _id: savedId, name: savedName });
            setToken(savedToken);
        }
        setLoading(false); // We're done checking
    }, []);

    // 4. Login function
    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            const { token, name, _id } = response.data;

            setUser({ _id, name });
            setToken(token);
            localStorage.setItem('token', token);
            localStorage.setItem('name', name);
            localStorage.setItem('userId', _id);

            navigate('/feed'); // Redirect to the feed
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed. Please check your credentials.');
        }
    };

    // 5. Signup function
    const signup = async (name, email, password) => {
        try {
            const response = await authService.signup(name, email, password);
            const { token, name: userName, _id } = response.data;

            setUser({ _id, name: userName });
            setToken(token);
            localStorage.setItem('token', token);
            localStorage.setItem('name', userName);
            localStorage.setItem('userId', _id);

            navigate('/feed'); // Redirect to the feed
        } catch (error) {
            console.error('Signup failed:', error);
            alert('Signup failed. This email might already be in use.');
        }
    };

    // 6. Logout function
    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        localStorage.removeItem('userId');
        navigate('/login'); // Redirect to login
    };

    // 7. The value to be passed to consumers
    const value = {
        user,
        token,
        login,
        signup,
        logout,
        isAuthenticated: !!token, // A handy boolean
    };

    // 8. Don't render the app until we've checked for a token
    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// 9. Custom hook to use the context easily
export const useAuth = () => {
    return useContext(AuthContext);
};