import API, { setAuthToken } from './auth'; // Import the configured axios instance and setAuthToken

// Utility to get the token from local storage and set it for requests
const getTokenAndSetHeader = () => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    setAuthToken(token);
  }
};

export const fetchBlogs = async () => {
  try {
    getTokenAndSetHeader();
    const response = await API.get('/blogs');
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const fetchBlogById = async (id) => {
  try {
    getTokenAndSetHeader();
    const response = await API.get(`/blogs/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createBlog = async (formData) => {
  try {
    getTokenAndSetHeader();
    const response = await API.post('/blogs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file uploads (pictures)
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateBlog = async (id, blogData) => {
  try {
    getTokenAndSetHeader();
    const response = await API.put(`/blogs/${id}`, blogData);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteBlog = async (id) => {
  try {
    getTokenAndSetHeader();
    const response = await API.delete(`/blogs/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const toggleLike = async (blogId) => {
  try {
    getTokenAndSetHeader();
    const response = await API.post(`/blogs/like/${blogId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createComment = async (blogId, content) => {
  try {
    getTokenAndSetHeader();
    const response = await API.post(`/blogs/${blogId}/comments`, { content });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// You might need a separate API call to fetch comments for a blog if not already included in fetchBlogById
// For now, I'll assume fetchBlogById might return comments or that comments will be managed via creation.