import React, { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import Card from '../components/Card';
import Button from '../components/Button.jsx';
import { ArrowRightIcon } from '@heroicons/react/24/outline'; // Example icon
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const { blogs, loading, error, getBlogs } = useContext(BlogContext);

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  const recentBlogs = blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);

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

  return (
    <div className="container mx-auto p-4">
      <section className="text-center py-20 bg-indigo-600 dark:bg-indigo-900 text-white rounded-lg shadow-xl mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight">Welcome to My Blog</h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">Your source for insightful articles and engaging stories.</p>
        <Link to="/blogs">
          <Button className="bg-white text-indigo-700 hover:bg-gray-100 dark:hover:bg-gray-200 px-8 py-3 text-lg font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
            Explore Blogs <ArrowRightIcon className="inline-block h-5 w-5 ml-2" />
          </Button>
        </Link>
      </section>

      <section className="my-12">
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">Recent Posts</h2>
        {recentBlogs.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">No recent blogs to display. Why not create one?</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentBlogs.map((blog) => (
              <Card key={blog._id} className="flex flex-col">
                {blog.coverImage && (
                  <img
                    src={blog.coverImage}
                    alt={blog.title}
                    className="w-full h-48 object-cover rounded-t-lg mb-4"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    By <span className="font-semibold">{blog.author?.username || 'Unknown'}</span> on{' '}
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow line-clamp-3">{blog.content}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                  {(blog.tags || []).map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                  <div className="flex items-center justify-between text-gray-500 dark:text-gray-400 text-sm mt-auto pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2">
                      <HeartIcon className="h-4 w-4" />
                      <span>{blog.likesCount}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ChatBubbleLeftIcon className="h-4 w-4" />
                      <span>{blog.commentsCount}</span>
                    </div>
                  </div>
                  <Link to={`/blogs/${blog._id}`} className="mt-4">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-sm">Read More</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="text-center py-12">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Join Our Community</h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Register today to start writing your own blogs, comment on others' posts, and connect with fellow readers.
        </p>
        <Link to="/register">
          <Button className="bg-green-600 hover:bg-green-700 px-6 py-3 text-lg font-semibold rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
            Register Now
          </Button>
        </Link>
      </section>
    </div>
  );
};

export default HomePage;