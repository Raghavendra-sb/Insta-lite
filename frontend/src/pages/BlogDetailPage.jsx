import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import { toggleLike, createComment } from '../api/blogs';
import { toast } from 'react-toastify';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'; // Outline icons
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'; // Solid heart for liked state

const BlogDetailPage = () => {
  const { id } = useParams();
  const { currentBlog, loading, error, getBlogById, updateBlogInState } = useContext(BlogContext);
  const { user } = useContext(AuthContext);
  const [commentContent, setCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [blogState, setBlogState] = useState(null); // Local state to manage likes/comments for immediate UI update

  useEffect(() => {
    getBlogById(id);
  }, [id, getBlogById]);

  useEffect(() => {
    // Sync local state with global context state when currentBlog changes
    if (currentBlog) {
      setBlogState(currentBlog);
    }
  }, [currentBlog]);

  const handleToggleLike = async () => {
    if (!user) {
      toast.info('Please log in to like this blog.');
      return;
    }
    if (!blogState) return;

    try {
      // Optimistically update UI
      const hasLiked = blogState.likedBy?.includes(user._id);
      const newLikedBy = hasLiked
        ? blogState.likedBy.filter(userId => userId !== user._id)
        : [...(blogState.likedBy || []), user._id];
      const newLikesCount = hasLiked ? blogState.likesCount - 1 : blogState.likesCount + 1;

      setBlogState(prev => ({
        ...prev,
        likedBy: newLikedBy,
        likesCount: newLikesCount,
      }));

      await toggleLike(id);
      // Backend call successful, if context updates blogs, it will eventually sync.
      // Or, you can explicitly ask BlogContext to update the specific blog object.
      // For now, `toggleLike` in backend updates the count, we need to refetch to get updated `likedBy` or update locally.
      // A more robust way would be for `toggleLike` API to return the updated blog object.
      // Assuming `updateBlogInState` can handle this:
      // const updatedBlogFromServer = await toggleLike(id);
      // updateBlogInState(updatedBlogFromServer);
      // If the backend returns full updated blog, uncomment above and remove optimistic update
      toast.success(hasLiked ? 'Blog unliked!' : 'Blog liked!');
    } catch (err) {
      toast.error(err.message || 'Failed to toggle like.');
      // Revert optimistic update if API call fails
            // If the backend returns full updated blog, uncomment above and remove optimistic update
      // For now, let's just refetch the blog to ensure consistent state.
      getBlogById(id);
    } 
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please log in to comment on this blog.');
      return;
    }
    if (!commentContent.trim()) {
      toast.warn('Comment cannot be empty.');
      return;
    }
    if (!blogState) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await createComment(id, commentContent);
      // Optimistically add the new comment to the local state
      setBlogState(prev => ({
        ...prev,
        comments: prev.comments ? [...prev.comments, newComment._id] : [newComment._id], // Assuming comments store IDs
        commentsCount: (prev.commentsCount || 0) + 1,
        // For a full comment display, you'd want the actual comment object
        // For now, we'll refetch the blog to get updated comments (including author details)
      }));
      setCommentContent('');
      toast.success('Comment added successfully!');
      getBlogById(id); // Refetch to get the full comment object with author details
    } catch (err) {
      toast.error(err.message || 'Failed to add comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading || !blogState) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 dark:text-red-400 mt-8">Error: {error.message || 'Something went wrong.'}</div>;
  }

  const hasLiked = blogState.likedBy?.includes(user?._id);

  return (
    <div className="max-w-4xl mx-auto my-8">
      <Card className="p-8">
        {blogState.coverImage && (
          <img
            src={blogState.coverImage}
            alt={blogState.title}
            className="w-full h-80 object-cover rounded-lg mb-6 shadow-md"
          />
        )}
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">{blogState.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
          By <span className="font-semibold">{blogState.author?.username || 'Unknown'}</span> on{' '}
          {new Date(blogState.createdAt).toLocaleDateString()}
        </p>

        <div className="flex items-center space-x-4 mb-6">
          <Button
            onClick={handleToggleLike}
            className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-full ${
              hasLiked ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
            }`}
          >
            {hasLiked ? <HeartSolidIcon className="h-5 w-5 text-white" /> : <HeartIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />}
            <span>{blogState.likesCount} {blogState.likesCount === 1 ? 'Like' : 'Likes'}</span>
          </Button>
          <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
            <ChatBubbleLeftIcon className="h-5 w-5" />
            <span>{blogState.commentsCount} Comments</span>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 mb-8 leading-relaxed">
          <p>{blogState.content}</p>
        </div>

        {blogState.pictures && blogState.pictures.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blogState.pictures.map((picture, index) => (
                <img
                  key={index}
                  src={picture}
                  alt={`Blog related image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-md shadow-sm"
                />
              ))}
            </div>
          </div>
        )}

        {blogState.tags && blogState.tags.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {blogState.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 rounded-full text-sm font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-10 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-inner">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Comments</h2>
          {user && (
            <form onSubmit={handleCommentSubmit} className="mb-8">
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200 resize-y"
                rows="4"
                placeholder="Write your comment..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                disabled={isSubmittingComment}
              ></textarea>
              <Button
                type="submit"
                className="mt-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                disabled={isSubmittingComment || !commentContent.trim()}
              >
                {isSubmittingComment ? 'Posting Comment...' : 'Post Comment'}
              </Button>
            </form>
          )}

          {blogState.comments && blogState.comments.length > 0 ? (
            <div className="space-y-6">
              {/* This assumes your blogState.comments now contains actual comment objects
                  after getBlogById refetches. If it only stores IDs, you'd need a separate
                  API to fetch full comment details, or ensure getBlogById populates comments. */}
              {blogState.comments.map((comment, index) => (
                <div key={comment._id || index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                  <p className="text-gray-800 dark:text-gray-200 text-lg">{comment.content}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    By <span className="font-semibold">{comment.author?.username || 'Anonymous'}</span> on{' '}
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default BlogDetailPage;