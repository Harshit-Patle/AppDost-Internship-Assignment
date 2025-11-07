import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Inline Login form wired to AuthContext, preserving current UI
const Login = () => {
    const { login } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) return;
        setSubmitting(true);
        try {
            await login(formData.email, formData.password);
        } catch (err) {
            // AuthContext already alerts on failure
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your password"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
                {submitting ? 'Logging in…' : 'Log In'}
            </button>
        </form>
    );
};

// Inline Signup form wired to AuthContext, preserving current UI
const Signup = () => {
    const { signup } = useAuth();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) return;
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        setSubmitting(true);
        try {
            await signup(formData.name, formData.email, formData.password);
        } catch (err) {
            // AuthContext already alerts on failure
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your name"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Create a password"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm your password"
                    required
                />
            </div>
            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
                {submitting ? 'Signing up…' : 'Sign Up'}
            </button>
        </form>
    );
};

// Main Auth Page
const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    const toggleForm = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div className="min-h-screen flex bg-linear-to-br from-blue-50 via-gray-50 to-blue-100">
            {/* Left Section - Hero/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-600 to-purple-700 p-12 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full mix-blend-overlay opacity-10 animate-pulse"></div>
                    <div
                        className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full mix-blend-overlay opacity-10 animate-pulse"
                        style={{ animationDelay: "1s" }}
                    ></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center max-w-lg mx-auto text-white">
                    <div className="mb-8">
                        <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-2xl mb-6">
                            <span className="text-blue-400 font-bold text-3xl">LC</span>
                        </div>
                        <h1 className="text-5xl font-bold mb-4 leading-tight">
                            Welcome to LinkedIn Clone
                        </h1>
                        <p className="text-xl text-blue-100 mb-8">
                            Connect with professionals, share your journey, and grow your
                            career
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
                                <svg
                                    className="w-6 h-6 text-blue-500"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">
                                    Build Your Network
                                </h3>
                                <p className="text-blue-100 text-sm">
                                    Connect with professionals from around the world
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Share Your Story</h3>
                                <p className="text-blue-100 text-sm">
                                    Post updates and engage with your community
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg mb-1">Grow Your Career</h3>
                                <p className="text-blue-100 text-sm">
                                    Discover opportunities and advance professionally
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Section - Auth Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Logo (Visible only on mobile) */}
                    <div className="lg:hidden text-center mb-8">
                        <div className="inline-flex items-center justify-center mb-4">
                            <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-2xl">LC</span>
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            LinkedIn Clone
                        </h1>
                        <p className="text-gray-600">
                            Connect, share, and grow professionally
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {isLogin ? "Welcome back" : "Create your account"}
                            </h2>
                            <p className="text-gray-600 text-sm">
                                {isLogin
                                    ? "Enter your credentials to access your account"
                                    : "Sign up to start connecting with professionals"}
                            </p>
                        </div>

                        {isLogin ? <Login /> : <Signup />}

                        {/* Toggle Form Button */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <button
                                onClick={toggleForm}
                                className="w-full text-center font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-3 px-4 rounded-lg transition-all duration-200"
                            >
                                {isLogin
                                    ? "Don't have an account? Sign up"
                                    : "Already have an account? Log in"}
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 text-sm mt-6">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
