import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const Home = () => {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [commentModal, setCommentModal] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // ✅ full user object
  const userId = user?.id;

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("Failed to load posts");
    }
  };

  // create new post
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      await API.post("/posts", { content });
      setContent("");
      fetchPosts();
    } catch (err) {
      if (err.response?.status === 401) {
        alert("Please log in again.");
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Toggle like
  const handleLike = async (postId) => {
    try {
      const res = await API.post(`/posts/${postId}/like`);
      // res.data should return { likes: updatedLikesArray }
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p._id === postId ? { ...p, likes: res.data.likes } : p
        )
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  //open comment model and fetch coments
  const openCommentModal = async (postId) => {
    setSelectedPostId(postId);
    setCommentModal(true);
    try {
      const res = await API.get(`/posts/${postId}/comments`);
      setComments(res.data);
    } catch {
      console.error("Failed to load comments");
    }
  };
  // submit new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await API.post(`/posts/${selectedPostId}/comments`, {
        text: newComment,
      });
      const res = await API.get(`/posts/${selectedPostId}/comments`);
      setComments(res.data);
      setNewComment("");
    } catch {
      console.error("Failed to post comment");
    }
  };

  // edit post
  const startEditingPost = (postId, content) => {
    setEditingPostId(postId);
    setEditingContent(content);
  };

  const handleEditSubmit = async (postId) => {
    try {
      await API.put(`/posts/${postId}`, { content: editedContent });
      setEditingPostId(null);
      setEditedContent("");
      fetchPosts();
    } catch (err) {
      console.error("Edit post failed", err);
    }
  };

  // Delete post
  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post")) return;

    try {
      await API.delete(`/posts/${postId}`);
      fetchPosts();
    } catch (err) {
      console.error("Detete post failed", err);
    }
  };

  // Delete Comment

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await API.delete(`/posts/${postId}/comments/${commentId}`);
      const res = await API.get(`/posts/${postId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("Delete comment failed", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Post Form */}
        <div className="bg-white p-6 rounded-2xl shadow-md col-span-1 h-fit sticky top-10">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Create a Post
          </h3>
          <form onSubmit={handleSubmit}>
            <textarea
              rows="4"
              placeholder="What's on your mind?"
              className="w-full p-4 border border-gray-300 rounded-lg bg-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Post
            </button>
          </form>
        </div>

        {/* Feed */}
        <div className="md:col-span-2">
          <h3 className="text-3xl font-bold text-gray-800 mb-6">Public Feed</h3>
          {posts.length === 0 ? (
            <p className="text-gray-600">No posts yet. Be the first!</p>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition mb-6"
              >
                <div className="flex items-start gap-4">
                  <img
                    src={post.author?.avatar || "/Default_avatar.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-grow">
                    {editingPostId === post._id ? (
                      <>
                        <textarea
                          className="w-full border p-2 rounded bg-gray-200 text-black"
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEditSubmit(post._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPostId(null)}
                            className="bg-gray-400 text-white px-3 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-900 text-lg whitespace-pre-line mb-1">
                        {post.content}
                      </p>
                    )}

                    {post.author?._id === userId &&
                      editingPostId !== post._id && (
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() =>
                              startEditingPost(post._id, post.content)
                            }
                            className="bg-yellow-400 text-white px-3 py-1 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                      <span>
                        —{" "}
                        <a
                          href={`/profile/${post.author?._id || ""}`}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          {post.author?.name || "Unknown"}
                        </a>{" "}
                        | {new Date(post.createdAt).toLocaleString()}
                      </span>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleLike(post._id)}
                          className="flex items-center bg-zinc-600 border-gray-400 gap-1 text-white hover:text-sky-400 px-2 py-1 rounded"
                        >
                          {post.likes?.includes(userId) ? `❤️` : `🤍`}{" "}
                          {post.likes?.length || 0}
                        </button>
                        <button
                          onClick={() => openCommentModal(post._id)}
                          className="flex items-center gap-1 bg-zinc-600 text-white hover:text-sky-400 px-2 py-1 rounded"
                        >
                          💬 Comment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Comment Modal */}
      {commentModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-800 bg-white hover:text-black text-xl"
              onClick={() => setCommentModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Comments</h2>

            <div className="max-h-72 overflow-y-auto space-y-4 mb-4">
              {comments.length === 0 ? (
                <p className="text-gray-500">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3">
                    <img
                      src={comment.author?.avatar || "/Default_avatar.png"}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm">
                        <span className="font-semibold text-gray-800">
                          {comment.author?.name}
                        </span>{" "}
                        <span className="text-gray-700">{comment.text}</span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {comment.author?._id === userId && (
                      <button
                        onClick={() =>
                          handleDeleteComment(selectedPostId, comment._id)
                        }
                        className="ml-2 bg-red-600 text-white text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleCommentSubmit}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Write a comment..."
                className="flex-grow border rounded px-3 py-2 text-sm bg-gray-200 focus:outline-none focus:ring focus:ring-blue-300"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                Comment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
