import React, { useContext, useEffect, useState } from 'react';
import { BlogContext } from '../context/BlogContext';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card';
import Modal from '../components/Model';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Outline icons
import { toast } from 'react-toastify';

const DashboardPage = () => {
  const { blogs, loading, error, getBlogs, removeBlog } = useContext(BlogContext);
  const { user } = useContext(AuthContext); // To filter blogs by current user

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    // Fetch all blogs when component mounts
    getBlogs();
  }, [getBlogs]);

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (blogToDelete) {
      try {
        await removeBlog(blogToDelete._id);
        toast.success(`Blog "${blogToDelete.title}" deleted successfully!`);
        setIsModalOpen(false);
        setBlogToDelete(null);
      } catch (err) {
        toast.error(`Failed to delete blog: ${err.message || 'Unknown error'}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 dark:text-red-400 mt-8">Error: {error.message || 'Something went wrong.'}</div>;
  }

  const userBlogs = blogs.filter(blog => blog.author?._id === user._id);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-gray-100">Your Blog Dashboard</h1>

      <div className="flex justify-end mb-6">
        <Link to="/create-blog">
          <Button className="bg-green-600 hover:bg-green-700">Create New Blog</Button>
        </Link>
      </div>

      {userBlogs.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">You haven't created any blogs yet. Start writing!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {userBlogs.map((blog) => (
            <Card key={blog._id} className="flex flex-col">
              {blog.coverImage && (
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="w-full h-48 object-cover rounded-t-lg mb-4"
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">{blog.title}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  Created on {new Date(blog.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow line-clamp-3">{blog.content}</p>

                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link to={`/edit-blog/${blog._id}`}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-sm flex items-center space-x-1">
                      <PencilIcon className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <Button
                    onClick={() => handleDeleteClick(blog)}
                    className="bg-red-600 hover:bg-red-700 text-sm flex items-center space-x-1"
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Deletion"
        onSubmit={confirmDelete}
        submitText="Delete"
      >
        <p className="text-gray-700 dark:text-gray-300">
          Are you sure you want to delete the blog post "<span className="font-semibold">{blogToDelete?.title}</span>"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default DashboardPage;