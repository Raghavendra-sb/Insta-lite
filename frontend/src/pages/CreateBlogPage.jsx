import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import Button from '../components/button';
import Card from '../components/Card';
import { toast } from 'react-toastify';

const CreateBlogPage = () => {
  const navigate = useNavigate();
  const { addBlog, loading } = useContext(BlogContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(null); // File object for cover image
  const [tags, setTags] = useState(''); // Comma-separated string
  const [pictures, setPictures] = useState([]); // Array of file objects

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      toast.error('Title and content are required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (coverImage) {
      formData.append('coverImage', coverImage); // Backend expects coverImage field for URL,
                                                 // but if it's a file upload, naming needs to match Multer config.
                                                 // Your backend accepts 'coverImage' directly in req.body for URL.
                                                 // For file upload, your backend needs to adapt, or we'll send it as part of 'pictures'.
                                                 // Let's assume coverImage is handled as a URL for simplicity, OR it's a file and backend has a specific field for it.
                                                 // Your `createBlog` in backend expects `coverImage` in req.body as a string (URL).
                                                 // If you want to upload cover image as file, you need to extend multer middleware in `blog.route.js` and `blog.controller.js` to handle it.
                                                 // For now, I'll remove coverImage file upload here and keep it for the backend's expected URL.
                                                 // If `coverImage` is a file, backend must handle it like `pictures`.
                                                 // For this frontend, let's assume if it's a file, it's part of 'pictures' for simplicity, or just a URL string.
                                                 // Given your current backend, `coverImage` is a URL string.
    }
    
    // For picture files
    pictures.forEach((file) => {
      formData.append('pictures', file); // 'pictures' must match the field name in multer.middleware.js -> blog.route.js
    });

    // For tags
    if (tags) {
      tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '').forEach(tag => {
        formData.append('tags', tag); // Append each tag individually
      });
    }

    try {
      await addBlog(formData);
      navigate('/dashboard'); // Navigate to dashboard after successful creation
    } catch (err) {
      // Error handled by context, toast shown. No additional action needed here unless specific to UI.
      console.error("Error creating blog:", err);
    }
  };

  const handleCoverImageChange = (e) => {
    // If coverImage is a file input
    // if (e.target.files && e.target.files[0]) {
    //   setCoverImage(e.target.files[0]);
    // }
    // If coverImage is meant to be a URL string
    setCoverImage(e.target.value);
  };

  const handlePictureChange = (e) => {
    if (e.target.files) {
      setPictures([...e.target.files]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-8 p-4">
      <Card className="p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Create New Blog Post</h1>
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
              type="text" // Input type for URL, change to "file" if backend supports file upload for cover image
              id="coverImage"
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200"
              value={coverImage || ''} // Handle null state for initial render
              onChange={handleCoverImageChange}
            />
             {/* If you change coverImage to file upload, uncomment below and comment out the above input */}
             {/* <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cover Image File (Optional)</label>
             <input
               type="file"
               id="coverImage"
               className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
               accept="image/*"
               onChange={handleCoverImageChange}
             /> */}
          </div>

          <div>
            <label htmlFor="pictures" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Additional Pictures (Max 5)</label>
            <input
              type="file"
              id="pictures"
              className="mt-1 block w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              accept="image/*"
              multiple
              onChange={handlePictureChange}
            />
             {pictures.length > 0 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {pictures.length} file(s) selected: {pictures.map(file => file.name).join(', ')}
              </p>
            )}
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
            {loading ? 'Creating Blog...' : 'Create Blog'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateBlogPage; 