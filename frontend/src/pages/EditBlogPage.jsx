import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import Button from '../components/button';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentBlog, loading, error, getBlogById, editBlog } = useContext(BlogContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(''); // Assuming URL string
  const [tags, setTags] = useState(''); // Comma-separated string

  useEffect(() => {
    getBlogById(id);
  }, [id, getBlogById]);

  useEffect(() => {
    if (currentBlog) {
      setTitle(currentBlog.title);
      setContent(currentBlog.content);
      setCoverImage(currentBlog.coverImage || '');
      setTags((currentBlog.tags || []).join(', '));
    }
  }, [currentBlog]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error('Title and content are required fields.');
      return;
    }

    const blogData = {
      title,
      content,
      coverImage,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    };

    try {
      await editBlog(id, blogData);
      navigate(`/blogs/${id}`);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  if (loading || !currentBlog) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 dark:text-red-400 mt-8">Error: {error.message || 'Something went wrong.'}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto my-8 p-4">
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Edit Blog Post</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            <textarea
              id="content"
              rows="10"
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200 resize-y"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image URL</label>
            <input
              type="text"
              id="coverImage"
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tags (comma-separated)</label>
            <input
              type="text"
              id="tags"
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., react, javascript, webdev"
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Updating Blog...' : 'Update Blog'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EditBlogPage;