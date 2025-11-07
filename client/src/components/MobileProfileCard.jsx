import React from 'react';
import { useAuth } from '../context/AuthContext';

const MobileProfileCard = ({ userName, postCount }) => {
    const { logout } = useAuth();
    return (
        <div className="lg:hidden mb-3">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {(userName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{userName || 'Your Profile'}</h3>
                        <div className="mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[11px] font-medium">
                                {typeof postCount === 'number' ? postCount : 0} Posts
                            </span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/profile')}
                            aria-label="View profile"
                            className="w-full px-4 text-blue-600 hover:text-blue-800 transition-all font-semibold text-sm active:scale-95 flex items-center justify-center gap-2">
                            View Profile
                        </button>
                    </div>
                    <button
                        onClick={logout}
                        aria-label="Logout"
                        className="shrink-0 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors"
                    >Logout</button>
                </div>
            </div>
        </div>
    );
};

export default MobileProfileCard;
