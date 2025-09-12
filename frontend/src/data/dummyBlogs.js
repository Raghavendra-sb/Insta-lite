// This file is optional for development. If your backend is ready, you might not need it.
// Here's an example of how you might structure dummy data.

const dummyBlogs = [
    {
      _id: '1',
      title: 'First Blog Post',
      content: 'This is the content of the first blog post. It contains some interesting information about various topics.',
      coverImage: 'https://via.placeholder.com/600x400?text=Blog+Cover+1',
      tags: ['react', 'frontend', 'webdev'],
      author: {
        _id: 'user1',
        username: 'john_doe',
      },
      pictures: ['https://via.placeholder.com/300?text=Picture+1A', 'https://via.placeholder.com/300?text=Picture+1B'],
      likesCount: 5,
      commentsCount: 2,
      createdAt: '2023-01-15T10:00:00Z',
      updatedAt: '2023-01-15T10:00:00Z',
    },
    {
      _id: '2',
      title: 'Exploring Modern JavaScript',
      content: 'A deep dive into ES6+ features, asynchronous JavaScript, and best practices for writing clean and efficient code.',
      coverImage: 'https://via.placeholder.com/600x400?text=Blog+Cover+2',
      tags: ['javascript', 'es6', 'programming'],
      author: {
        _id: 'user2',
        username: 'jane_smith',
      },
      pictures: ['https://via.placeholder.com/300?text=Picture+2A'],
      likesCount: 12,
      commentsCount: 5,
      createdAt: '2023-02-20T11:30:00Z',
      updatedAt: '2023-02-20T11:30:00Z',
    },
    {
        _id: '3',
        title: 'The Future of AI in Web Development',
        content: 'How artificial intelligence is shaping the future of web development, from automated code generation to enhanced user experiences.',
        coverImage: 'https://via.placeholder.com/600x400?text=Blog+Cover+3',
        tags: ['ai', 'webdev', 'future'],
        author: {
          _id: 'user1',
          username: 'john_doe',
        },
        pictures: [],
        likesCount: 8,
        commentsCount: 3,
        createdAt: '2023-03-01T14:45:00Z',
        updatedAt: '2023-03-01T14:45:00Z',
      },
  ];
  
  export default dummyBlogs;