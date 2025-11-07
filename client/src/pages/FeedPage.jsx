import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import postService from "../services/postService";
import mapPost from "../utils/mapPost";
import CreatePost from "../components/CreatePost";
import Post from "../components/Post";
import Sidebar from "../components/Sidebar";
import MobileProfileCard from "../components/MobileProfileCard";

// Main Feed Page
const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { token, user } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setError("");
                const response = await postService.getAllPosts();
                const mapped = Array.isArray(response.data) ? response.data.map(mapPost) : [];
                setPosts(mapped);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
                setError("Failed to load posts. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    const handlePostCreated = (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    const handlePostUpdated = (updatedPost) => {
        // If a post signals _deleted, remove it from list
        if (updatedPost._deleted) {
            setPosts((prev) => prev.filter((p) => p._id !== updatedPost._id));
            return;
        }
        setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
    };

    const handlePostDeleted = (postId) => {
        setPosts(posts.filter((post) => post._id !== postId));
    };

    const userPostCount = useMemo(() => user ? posts.filter((p) => p.userId === user._id).length : 0, [posts, user]);

    return (
        <div className="min-h-screen bg-linear-to-b from-blue-50 via-white to-gray-50">
            {/* Decorative background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
                <div className="absolute bottom-0 -left-32 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
            </div>

            {/* Main Layout */}
            <div className="relative z-10">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex gap-6 py-6">
                        {/* Left Sidebar - Hidden on mobile */}
                        <aside className="hidden lg:block w-80 shrink-0">
                            <div className="sticky top-6">
                                <Sidebar userName={user?.name} postCount={userPostCount} />
                            </div>
                        </aside>

                        {/* Main Feed */}
                        <main className="flex-1 max-w-2xl mx-auto lg:mx-0">

                            {/* Mobile Profile Card */}
                            {user && <MobileProfileCard userName={user.name} postCount={userPostCount} />}

                            <CreatePost onPostCreated={handlePostCreated} />

                            {/* Feed Header */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                                            Your Feed
                                        </h2>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Stay connected with professionals
                                        </p>
                                    </div>
                                </div>
                                <div className="h-1 w-16 bg-linear-to-r from-blue-600 to-blue-400 rounded-full"></div>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((item) => (
                                        <div
                                            key={item}
                                            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                                        >
                                            <div className="flex gap-4 mb-4">
                                                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                                                <div className="flex-1">
                                                    <div className="h-4 bg-gray-200 rounded w-32 mb-2 animate-pulse"></div>
                                                    <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="h-3 bg-gray-200 rounded w-full animate-pulse"></div>
                                                <div className="h-3 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                                <div className="h-3 bg-gray-100 rounded w-4/6 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="bg-red-50 border border-red-200 text-red-900 px-6 py-4 rounded-xl">
                                    <div className="flex items-start gap-3">
                                        <svg
                                            className="w-5 h-5 mt-0.5 shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            />
                                        </svg>
                                        <div className="flex-1">
                                            <p className="font-semibold">{error}</p>
                                            <button
                                                onClick={() => window.location.reload()}
                                                className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Posts List */}
                            {!loading && !error && (
                                <div className="space-y-4">
                                    {posts.length > 0 ? (
                                        posts.map((post) => (
                                            <Post key={post._id} post={post} onPostUpdated={handlePostUpdated} />
                                        ))
                                    ) : (
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                                            <div className="mx-auto mb-6 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                                <svg
                                                    className="w-8 h-8 text-blue-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 016 0v6a3 3 0 01-3 3z"
                                                    />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                No posts yet
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-6">
                                                Be the first to share something with the community!
                                            </p>
                                            <button
                                                onClick={() => {
                                                    const textarea = document.querySelector("textarea");
                                                    if (textarea) textarea.focus();
                                                }}
                                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium"
                                            >
                                                Create First Post
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </main>

                        {/* Right Sidebar - Hidden on mobile and tablet */}
                        <aside className="hidden xl:block w-80 shrink-0">
                            <div className="sticky top-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                                    <h3 className="font-semibold text-gray-900 mb-3">
                                        LinkedIn News
                                    </h3>
                                    <div className="space-y-3">
                                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                            <h4 className="font-medium text-sm text-gray-900">
                                                Tech layoffs continue
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                2h ago • 1,234 readers
                                            </p>
                                        </button>
                                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                            <h4 className="font-medium text-sm text-gray-900">
                                                AI reshaping workplaces
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                4h ago • 3,456 readers
                                            </p>
                                        </button>
                                        <button className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors">
                                            <h4 className="font-medium text-sm text-gray-900">
                                                Remote work trends 2025
                                            </h4>
                                            <p className="text-xs text-gray-500">
                                                6h ago • 2,134 readers
                                            </p>
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-linear-to-br from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
                                    <h3 className="font-semibold mb-2">Upgrade to Premium</h3>
                                    <p className="text-sm text-blue-100 mb-4">
                                        Get exclusive tools and insights to accelerate your career
                                    </p>
                                    <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                                        Try for Free
                                    </button>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedPage;
