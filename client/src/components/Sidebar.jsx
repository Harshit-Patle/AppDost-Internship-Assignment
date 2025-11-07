import React from 'react';
import { Briefcase, Users, BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ userName, postCount }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const trending = [
        { topic: 'AI Innovation', posts: '1.2k' },
        { topic: 'Remote Work', posts: '856' },
        { topic: 'Tech Startups', posts: '643' }
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" aria-label="Profile summary">
                <div className="h-16 bg-linear-to-r from-blue-600 to-purple-600"></div>
                <div className="p-4 -mt-8">
                    <div className="w-16 h-16 bg-linear-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl border-4 border-white mb-3" aria-label="User avatar">
                        {(userName || 'U')
                            .split(' ')
                            .map(n => n[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-gray-900" aria-label="User name">{userName || 'Your Profile'}</h3>
                    <div className="flex gap-4 text-sm" aria-label="User stats">
                        <div>
                            <span className="font-semibold text-gray-900" aria-label="Post count">{typeof postCount === 'number' ? postCount : 0}</span>
                            <p className="text-gray-600">Posts</p>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/profile')}
                                aria-label="View profile"
                                className="w-full px-4 text-blue-600 hover:text-blue-800 transition-all font-semibold text-sm active:scale-95 flex items-center justify-center gap-2">
                                View Profile
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        aria-label="Logout"
                        className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                    >Logout</button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" aria-label="Quick links">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    Quick Access
                </h3>
                <div className="space-y-2">
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-gray-700" aria-label="My Network">
                        <Users className="w-4 h-4" />
                        My Network
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-gray-700" aria-label="Jobs">
                        <Briefcase className="w-4 h-4" />
                        Jobs
                    </button>
                    <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm text-gray-700" aria-label="Learning">
                        <BookOpen className="w-4 h-4" />
                        Learning
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4" aria-label="Trending topics">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Trending Topics
                </h3>
                <div className="space-y-3">
                    {trending.map((item, idx) => (
                        <button
                            key={idx}
                            className="w-full text-left hover:bg-gray-50 p-2 rounded-lg transition-colors"
                            aria-label={`Trending topic ${item.topic}`}
                        >
                            <h4 className="font-medium text-sm text-gray-900">#{item.topic}</h4>
                            <p className="text-xs text-gray-500">{item.posts} posts today</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
