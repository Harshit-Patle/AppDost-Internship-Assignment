import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import postService from '../services/postService';
import mapPost from '../utils/mapPost';

const Post = ({ post, onPostUpdated }) => {
    const { token, user } = useAuth();
    const { push } = useToast();
    const [liked, setLiked] = useState(post.likes?.some(l => l.userId === user?._id));
    const [likesCount, setLikesCount] = useState(post.likes ? post.likes.length : post.likesCount || 0);
    const [showFullImage, setShowFullImage] = useState(false);
    const [likeSubmitting, setLikeSubmitting] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isCommentLoading, setIsCommentLoading] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const isPostOwner = user?._id === post.userId;
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(post.text || post.content || "");
    const [editImage, setEditImage] = useState(post.image || null);
    const [isEditLoading, setIsEditLoading] = useState(false);
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex gap-3 mb-4 relative">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                        {post.author.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                        <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
                    </div>
                    {isPostOwner && !isEditing && (
                        <div className="shrink-0">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                                aria-label="Post options"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.5 1.5H9.5V3.5H10.5V1.5ZM10.5 8.5H9.5V10.5H10.5V8.5ZM10.5 15.5H9.5V17.5H10.5V15.5Z" />
                                </svg>
                            </button>
                            {showMenu && (
                                <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-md w-36 z-10">
                                    <button
                                        onClick={() => { setIsEditing(true); setShowMenu(false); }}
                                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 border-b border-gray-200"
                                    >✏️ Edit</button>
                                    <button
                                        onClick={async () => {
                                            if (!token || !window.confirm('Delete this post?')) { setShowMenu(false); return; }
                                            setIsDeleteLoading(true);
                                            try {
                                                await postService.deletePost(post._id, token);
                                                onPostUpdated && onPostUpdated({ ...post, _deleted: true });
                                                push('Post deleted', 'success');
                                            } catch (err) {
                                                console.error('Delete post failed', err);
                                                push('Failed to delete post', 'error');
                                            } finally {
                                                setIsDeleteLoading(false);
                                                setShowMenu(false);
                                            }
                                        }}
                                        disabled={isDeleteLoading}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                                    >{isDeleteLoading ? '⏳ Deleting...' : '🗑️ Delete'}</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <form
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if ((!editText.trim() && !editImage) || !token) return;
                            setIsEditLoading(true);
                            try {
                                const resp = await postService.editPost(post._id, editText.trim(), editImage, token);
                                setIsEditing(false);
                                onPostUpdated && onPostUpdated(mapPost(resp.data.post));
                                push('Post updated', 'success');
                            } catch (err) {
                                console.error('Edit post failed', err);
                                push('Failed to update post', 'error');
                            } finally {
                                setIsEditLoading(false);
                            }
                        }}
                        className="mb-4"
                    >
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full px-3 py-2 border-2 border-blue-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 resize-none"
                            rows={4}
                            placeholder="Edit your post..."
                        />
                        {editImage && (
                            <div className="mt-3">
                                <div className="overflow-hidden rounded-lg border border-gray-200">
                                    <img src={editImage} alt="Post" className="max-h-80 w-full object-contain bg-gray-50" />
                                </div>
                                <div className="flex items-center justify-end gap-2 mt-2">
                                    <button type="button" onClick={() => setEditImage(null)} className="text-sm text-red-600 hover:text-red-700 font-medium">Remove image</button>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3 mt-3">
                            <label className="inline-flex items-center justify-center py-2 px-3 border border-dashed border-blue-300 rounded-lg text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (!file || !file.type.startsWith('image/')) return;
                                        const reader = new FileReader();
                                        reader.onloadend = () => setEditImage(reader.result);
                                        reader.readAsDataURL(file);
                                    }}
                                />
                                📷 {editImage ? 'Change Image' : 'Add Image'}
                            </label>
                            <div className="flex-1" />
                            <button
                                type="submit"
                                disabled={isEditLoading || (!editText.trim() && !editImage)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                            >{isEditLoading ? '💾 Saving...' : 'Save'}</button>
                            <button
                                type="button"
                                onClick={() => { setIsEditing(false); setEditText(post.text || post.content || ''); setEditImage(post.image || null); }}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-400"
                            >Cancel</button>
                        </div>
                    </form>
                ) : (
                    <>
                        {post.content && (
                            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
                        )}
                        {post.image && (
                            <div
                                className="mb-4 rounded-lg bg-gray-50 cursor-pointer hover:opacity-95 transition-opacity"
                                onClick={() => setShowFullImage(true)}
                            >
                                <div className="w-full max-h-96 flex items-center justify-center overflow-hidden rounded-lg">
                                    <img src={post.image} alt="Post content" className="max-h-96 max-w-full object-contain" />
                                </div>
                            </div>
                        )}
                    </>
                )}

                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                    <button
                        onClick={async () => {
                            if (!token || !user || likeSubmitting) return;
                            setLikeSubmitting(true);
                            try {
                                const updated = await postService.likePost(post._id, token);
                                const isNowLiked = updated.data.likes.some(l => l.userId === user._id);
                                setLiked(isNowLiked);
                                setLikesCount(updated.data.likes.length);
                                onPostUpdated && onPostUpdated(mapPost(updated.data));
                                push(isNowLiked ? 'Post liked' : 'Like removed', 'success');
                            } catch (err) {
                                console.error("Like failed", err);
                                push('Failed to toggle like', 'error');
                            } finally {
                                setLikeSubmitting(false);
                            }
                        }}
                        className={`flex items-center gap-2 ${liked ? "text-blue-600" : "text-gray-600"} hover:text-blue-600 transition-colors disabled:opacity-50`}
                        disabled={likeSubmitting}
                        aria-label="Like post"
                    >
                        <svg className="w-5 h-5" fill={liked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span className="text-sm font-medium">{likesCount}</span>
                    </button>
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                        aria-label="Toggle comments"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="text-sm font-medium">{comments.length}</span>
                    </button>
                </div>

                {showComments && (
                    <div className="mt-3 space-y-3 animate-slideDown">
                        {user && (
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!commentText.trim() || !token) return;
                                    setIsCommentLoading(true);
                                    try {
                                        const updated = await postService.addComment(post._id, commentText.trim(), token);
                                        setComments(updated.data.comments || []);
                                        setCommentText("");
                                        onPostUpdated && onPostUpdated(mapPost(updated.data));
                                        push('Comment added', 'success');
                                    } catch (err) {
                                        console.error("Add comment failed", err);
                                        push('Failed to add comment', 'error');
                                    } finally {
                                        setIsCommentLoading(false);
                                    }
                                }}
                                className="flex gap-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    disabled={isCommentLoading}
                                    className="flex-1 px-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    aria-label="Write a comment"
                                />
                                <button
                                    type="submit"
                                    disabled={!commentText.trim() || isCommentLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    aria-label="Post comment"
                                >
                                    {isCommentLoading ? "..." : "Reply"}
                                </button>
                            </form>
                        )}
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {comments.length > 0 ? (
                                comments.map((c) => (
                                    <div key={c._id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 text-sm">{c.userName}</p>
                                                <p className="text-gray-600 text-sm mt-1">{c.text}</p>
                                                <p className="text-xs text-gray-500 mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            {user?._id === c.userId && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            const updated = await postService.deleteComment(post._id, c._id, token);
                                                            setComments(updated.data.comments || []);
                                                            onPostUpdated && onPostUpdated(mapPost(updated.data));
                                                            push('Comment deleted', 'success');
                                                        } catch (err) {
                                                            console.error("Delete comment failed", err);
                                                            push('Failed to delete comment', 'error');
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700 text-xs font-medium"
                                                    aria-label="Delete comment"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm text-center py-2">No comments yet. Be the first!</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {showFullImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowFullImage(false)}
                >
                    <button
                        onClick={() => setShowFullImage(false)}
                        className="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-20 text-white rounded-full hover:bg-opacity-30 transition-all flex items-center justify-center"
                        aria-label="Close image"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img src={post.image} alt="Full size" className="max-w-full max-h-full object-contain" onClick={(e) => e.stopPropagation()} />
                </div>
            )}
        </>
    );
};

export default Post;