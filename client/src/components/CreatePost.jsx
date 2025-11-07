import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import postService from "../services/postService";
import mapPost from "../utils/mapPost";

const CreatePost = ({ onPostCreated }) => {
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const { token, user } = useAuth();
    const { push } = useToast();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token || !user) return;
        if (!(content.trim() || imagePreview)) return;
        setSubmitting(true);
        try {
            const response = await postService.createPost(content, imagePreview, token);
            onPostCreated(mapPost(response.data));
            setContent("");
            setImage(null);
            setImagePreview(null);
            push("Post published", "success");
        } catch (err) {
            console.error("Create post failed", err);
            push("Failed to create post", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-6 mb-4 sm:mb-6">
            <div className="flex gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                    YO
                </div>
                <div className="flex-1">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Share your thoughts..."
                        aria-label="Create a post"
                        className="w-full border border-gray-200 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={2}
                    />
                    {imagePreview && (
                        <div className="mt-3 relative">
                            <img src={imagePreview} alt="Preview" className="w-full rounded-lg max-h-96 object-cover" />
                            <button
                                onClick={removeImage}
                                aria-label="Remove image"
                                className="absolute top-2 right-2 w-8 h-8 bg-gray-900 bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-all flex items-center justify-center"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                        <div className="flex items-center gap-2">
                            <label className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium">Photo</span>
                                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" aria-label="Add a photo" />
                            </label>
                        </div>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || (!content.trim() && !imagePreview)}
                            aria-label="Publish post"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {submitting ? "Posting..." : "Post"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
