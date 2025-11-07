// Utility to normalize backend post shape to the UI-consumed shape
// Keeps UI classes unchanged by mapping only the data structure
export const mapPost = (p) => ({
    ...p,
    author: {
        name: p.userName,
        avatar: p.userName
            ? p.userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "U",
        title: "Professional", // Placeholder
    },
    content: p.text,
    likesCount: p.likes ? p.likes.length : 0,
    commentsCount: p.comments ? p.comments.length : 0,
});

export default mapPost;
