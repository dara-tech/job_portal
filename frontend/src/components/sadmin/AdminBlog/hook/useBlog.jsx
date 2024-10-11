import { useState, useEffect } from 'react';
import axios from 'axios';
import { BLOG_API_ENDPOINT } from '../../../../utils/constant';

const useBlog = () => {
  const [blogs, setBlogs] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleError = (err, customMessage) => {
    if (err.response) {
      setError(`${customMessage}: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
    } else if (err.request) {
      setError(`${customMessage}: No response received. Please check your network connection.`);
    } else {
      setError(`${customMessage}: ${err.message}`);
    }
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BLOG_API_ENDPOINT}`, { withCredentials: true });
      setBlogs(response.data);
    } catch (err) {
      handleError(err, 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`${BLOG_API_ENDPOINT}/${id}`, { withCredentials: true });
      setBlogs((prevBlogs) => {
        if (Array.isArray(prevBlogs.data)) {
          return {
            ...prevBlogs,
            data: prevBlogs.data.filter((blog) => blog._id !== id)
          };
        }
        return prevBlogs;
      });
    } catch (err) {
      handleError(err, 'Failed to delete blog');
      throw err; // rethrow to allow handling in BlogTable
    }
  };

  const updateBlog = async (id, updatedData) => {
    try {
      const response = await axios.put(`${BLOG_API_ENDPOINT}/${id}`, updatedData, { withCredentials: true });
      setBlogs((prevBlogs) => {
        if (Array.isArray(prevBlogs.data)) {
          return {
            ...prevBlogs,
            data: prevBlogs.data.map((blog) => blog._id === id ? response.data.data : blog)
          };
        }
        return prevBlogs;
      });
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to update blog');
      throw err;
    }
  };

  const likeBlog = async (id) => {
    try {
      const response = await axios.post(`${BLOG_API_ENDPOINT}/${id}/like`, {}, { withCredentials: true });
      return response.data;
      console.log(response.data);
    } catch (err) {
      handleError(err, 'Failed to like blog');
      throw err;
    }
  };

  const addComment = async (id, commentText) => {
    try {
      const response = await axios.post(`${BLOG_API_ENDPOINT}/${id}/comment`, { text: commentText }, { withCredentials: true });
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to add comment');
      throw err;
    }
  };

  const getComments = async (id) => {
    try {
      const response = await axios.get(`${BLOG_API_ENDPOINT}/${id}/comments`, { withCredentials: true });
      return response.data;
    } catch (err) {
      handleError(err, 'Failed to get comments');
      throw err;
    }
  };

  return { blogs, loading, error, deleteBlog, updateBlog, fetchBlogs, likeBlog, addComment, getComments };
};

export default useBlog;
