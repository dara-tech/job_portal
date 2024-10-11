// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BLOG_API_ENDPOINT } from '../../utils/constant';

// const useGetBlog = (blogId) => {
//   const [blog, setBlog] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBlog = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`${BLOG_API_ENDPOINT}/${blogId}`, { withCredentials: true });
//         setBlog(response.data);
//         console.log(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message || 'An error occurred while fetching the blog');
//         setLoading(false);
//       }
//     };

//     if (blogId) {
//       fetchBlog();
//     }
//   }, [blogId]);

//   return { blog, loading, error };
// };

// export default useGetBlog;
