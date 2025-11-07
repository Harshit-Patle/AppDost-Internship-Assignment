import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import profileService from '../services/profileService';

const ProfilePage = () => {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();
    const { push } = useToast();

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        email: '',
    });

    // Fetch user profile on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setError('');
                const response = await profileService.getProfile(token);
                setFormData({
                    name: response.data.name,
                    bio: response.data.bio || '',
                    email: response.data.email,
                });
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                setError('Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setSuccess('');
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setError('');
        setSuccess('');

        try {
            const response = await profileService.updateProfile({
                name: formData.name,
                bio: formData.bio,
            }, token);

            setSuccess(response.data.msg || 'Profile updated successfully!');
            push(response.data.msg || 'Profile updated successfully!', 'success');
            setIsEditing(false);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Failed to update profile';
            setError(errorMsg);
            push(errorMsg, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-gray-50">
                <div className="max-w-4xl mx-auto container-responsive py-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-48 bg-gray-200 rounded-lg"></div>
                        <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-gray-50">
            {/* Decorative background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-0 -left-32 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
            </div>

            {/* Main content */}
            <div className="relative z-10 max-w-4xl mx-auto container-responsive py-4 sm:py-6">

                <main className="mt-8">
                    {/* Messages */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-slideDown">
                            <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-red-900">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-slideDown">
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-green-900">{success}</p>
                        </div>
                    )}

                    {/* Profile Header Card */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-slideUp mb-6">
                        {/* Header background */}
                        <div className="h-32 bg-linear-to-r from-blue-600 to-blue-700"></div>

                        {/* Profile header content */}
                        <div className="px-6 pb-6 pt-4 relative">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4 w-full">
                                    {/* Avatar */}
                                    <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg border-4 border-white shrink-0">
                                        {formData.name.charAt(0).toUpperCase()}
                                    </div>

                                    {/* Name and Member Since */}
                                    <div className="flex-1">
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{formData.name}</h1>
                                    </div>
                                </div>

                                {/* Edit Button */}
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium text-sm hover:shadow-md active:scale-95 whitespace-nowrap w-full sm:w-auto"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Column - Main Info */}
                        <div className="md:col-span-2 space-y-6">
                            {/* Edit Form */}
                            {isEditing ? (
                                <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>

                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        {/* Name Field */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                placeholder="Enter your full name"
                                                required
                                            />
                                        </div>

                                        {/* Bio Field */}
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Bio <span className="text-xs text-gray-500">(max 500 characters)</span>
                                            </label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                                placeholder="Write a brief bio about yourself"
                                                rows={4}
                                                maxLength={500}
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {formData.bio.length}/500 characters
                                            </p>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="submit"
                                                disabled={isSaving}
                                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                                            >
                                                {isSaving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setError('');
                                                    setSuccess('');
                                                }}
                                                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium active:scale-95"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            ) : (
                                <>
                                    {/* Bio Card */}
                                    {formData.bio && (
                                        <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
                                            <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{formData.bio}</p>
                                        </div>
                                    )}

                                    {/* Email Card */}
                                    <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
                                        <h2 className="text-lg font-bold text-gray-900 mb-3">Contact Information</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">
                                                    Email Address
                                                </p>
                                                <p className="text-base text-gray-900 font-medium">{formData.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Member Since Card */}
                                    <div className="bg-white rounded-2xl shadow-lg p-6 animate-slideUp">
                                        <h2 className="text-lg font-bold text-gray-900 mb-3">Account</h2>
                                        <div>
                                            <p className="text-xs text-gray-600 font-semibold uppercase tracking-wide mb-1">
                                                Member Since
                                            </p>
                                            <p className="text-base text-gray-900 font-medium">
                                                {new Date().toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Right Column - Actions */}
                        <div className="md:col-span-1">

                            <div className="space-y-3">
                                <button
                                    onClick={() => navigate('/feed')}
                                    className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold text-sm active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    Back to Feed
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;
