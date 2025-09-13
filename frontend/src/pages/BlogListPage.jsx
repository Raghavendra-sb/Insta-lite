import React, { useEffect, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { BlogContext } from '../context/BlogContext';
import Card from '../components/Card';
import Button from '../components/Button.jsx';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'; // Outline icons

const BlogListPage = () => {
  const { blogs, loading, error, getBlogs } = useContext(BlogContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');

  useEffect(() => {
    getBlogs();
  }, [getBlogs]);

  const allTags = [...new Set(blogs.flatMap(blog => blog.tags || []))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearchTerm = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = filterTag ? (blog.tags || []).includes(filterTag) : true;
    return matchesSearchTerm && matchesTag;
  });

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
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-900 dark:text-gray-100">All Blogs</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search blogs by title or content..."
          className="flex-grow p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-200"
          value={filterTag}
          onChange={(e) => setFilterTag(e.target.value)}
        >
          <option value="">All Tags</option>
          {allTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        {filterTag && (
          <Button onClick={() => setFilterTag('')} className="bg-gray-400 hover:bg-gray-500 text-sm">Clear Tag</Button>
        )}
      </div>

      {filteredBlogs.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">No blogs found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
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
    </div>
  );
};

export default BlogListPage;