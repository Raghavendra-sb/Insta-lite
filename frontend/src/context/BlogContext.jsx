import React, { createContext, useState, useContext, useCallback } from 'react';
import { fetchBlogs, fetchBlogById, createBlog, updateBlog, deleteBlog } from '../api/blogs';
import { AuthContext } from './AuthContext';
import { toast } from 'react-toastify';

export const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const { user } = useContext(AuthContext); // To check if user is logged in for certain actions
  const [blogs, setBlogs] = useState([]);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getBlogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBlogs();
      setBlogs(data);
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to fetch blogs.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getBlogById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBlogById(id);
      setCurrentBlog(data);
      return data;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to fetch blog details.');
    } finally {
      setLoading(false);
    }
  }, []);

  const addBlog = useCallback(async (blogData) => {
    setLoading(true);
    setError(null);
    try {
      const newBlog = await createBlog(blogData);
      setBlogs((prevBlogs) => [newBlog, ...prevBlogs]); // Add to the beginning for freshness
      toast.success('Blog created successfully!');
      return newBlog;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to create blog.');
      throw err; // Re-throw to allow component to handle navigation etc.
    } finally {
      setLoading(false);
    }
  }, []);

  const editBlog = useCallback(async (id, blogData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedBlog = await updateBlog(id, blogData);
      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) => (blog._id === id ? updatedBlog : blog))
      );
      setCurrentBlog(updatedBlog); // Update current blog if it's the one being edited
      toast.success('Blog updated successfully!');
      return updatedBlog;
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to update blog.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeBlog = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await deleteBlog(id);
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
      toast.success('Blog deleted successfully!');
    } catch (err) {
      setError(err);
      toast.error(err.message || 'Failed to delete blog.');
    } finally {
      setLoading(false);
    }
  }, []);

  // You can add more blog-related actions here, like liking, commenting etc.
  // For likes and comments, it's often better to update the specific blog object
  // in the `blogs` array rather than refetching all blogs.
  // Example for updating a single blog's likes in the global state:
  const updateBlogInState = useCallback((updatedBlog) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) => (blog._id === updatedBlog._id ? updatedBlog : blog))
    );
    if (currentBlog && currentBlog._id === updatedBlog._id) {
      setCurrentBlog(updatedBlog);
    }
  }, [currentBlog]);


  return (
    <BlogContext.Provider
      value={{
        blogs,
        currentBlog,
        loading,
        error,
        getBlogs,
        getBlogById,
        addBlog,
        editBlog,
        removeBlog,
        updateBlogInState, // Expose this for external updates like likes/comments
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};