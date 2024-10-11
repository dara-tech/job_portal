// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BLOG_API_ENDPOINT } from '../../utils/constant';

// const useGetAllBlog = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchAllBlogs = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(BLOG_API_ENDPOINT, { withCredentials: true });
//         setBlogs(response.data);
//         console.log(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.message || 'An error occurred while fetching the blogs');
//         setLoading(false);
//       }
//     };

//     fetchAllBlogs();
//   }, []);

//   return { blogs, loading, error };
// };

// export default useGetAllBlog;
