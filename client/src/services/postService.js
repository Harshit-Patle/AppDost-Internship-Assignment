import apiClient from '../config/apiClient';

/**
 * Gets all posts from the server.
 * @returns {Promise} The axios response promise.
 */
const getAllPosts = () => {
    // This is a public route, so no token is needed.
    return apiClient.get('/posts');
};

/**
 * Creates a new post.
 * @param {string} text - The content of the post.
 * @param {string} token - The user's authentication token.
 * @returns {Promise} The axios response promise.
 */
const createPost = (text, image, token) => {
    // We must send the token in the headers to prove we are logged in.
    // This matches the 'x-auth-token' header your backend expects.
    return apiClient.post(
        '/posts',
        { text, image },
        { headers: { 'x-auth-token': token } }
    );
};

/**
 * Likes or unlikes a post.
 * @param {string} postId - The ID of the post to like.
 * @param {string} token - The user's authentication token.
 * @returns {Promise} The axios response promise.
 */
const likePost = (postId, token) => {
    return apiClient.post(`/posts/${postId}/like`, {}, { headers: { 'x-auth-token': token } });
};

/**
 * Adds a comment to a post.
 * @param {string} postId - The ID of the post to comment on.
 * @param {string} text - The comment text.
 * @param {string} token - The user's authentication token.
 * @returns {Promise} The axios response promise.
 */
const addComment = (postId, text, token) => {
    return apiClient.post(`/posts/${postId}/comment`, { text }, { headers: { 'x-auth-token': token } });
};

/**
 * Deletes a comment from a post.
 * @param {string} postId - The ID of the post.
 * @param {string} commentId - The ID of the comment to delete.
 * @param {string} token - The user's authentication token.
 * @returns {Promise} The axios response promise.
 */
const deleteComment = (postId, commentId, token) => {
    return apiClient.delete(`/posts/${postId}/comment/${commentId}`, { headers: { 'x-auth-token': token } });
};

/**
 * Edits a post.
 * @param {string} postId - The ID of the post to edit.
 * @param {string} text - The updated post text.
 * @param {string} token - The user's authentication token.
 * @returns {Promise} The axios response promise.
 */
const editPost = (postId, text, image, token) => {
    return apiClient.put(`/posts/${postId}`, { text, image }, { headers: { 'x-auth-token': token } });
};

/**
 * Deletes a post.
 * @param {string} postId - The ID of the post to delete.
 * @param {string} token - The user's authentication token.
 * @returns {Promise} The axios response promise.
 */
const deletePost = (postId, token) => {
    return apiClient.delete(`/posts/${postId}`, { headers: { 'x-auth-token': token } });
};

const postService = {
    getAllPosts,
    createPost,
    likePost,
    addComment,
    deleteComment,
    editPost,
    deletePost,
};

export default postService;