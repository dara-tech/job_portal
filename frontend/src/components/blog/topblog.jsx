import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './blogcard';
import { Skeleton } from "@/components/ui/skeleton"
import { BLOG_API_ENDPOINT } from '../../utils/constant';
import { Sparkles, AlertTriangle } from 'lucide-react';

export default function TopBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(BLOG_API_ENDPOINT);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        const sortedBlogs = data.data.sort((a, b) => {
          const scoreA = (a.likes?.length || 0) + (a.comments?.length || 0) + (a.views || 0);
          const scoreB = (b.likes?.length || 0) + (b.comments?.length || 0) + (b.views || 0);
          return scoreB - scoreA;
        });
        setBlogs(sortedBlogs.slice(0, 3)); // Get top 3 blogs
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
          <Sparkles className="mr-2 text-yellow-400" />
          Top Blogs
          <Sparkles className="ml-2 text-yellow-400" />
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto px-4 py-8 text-center text-red-500"
      >
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center">
          <AlertTriangle className="mr-2" />
          Oops! Something went wrong
        </h2>
        <p>{error}</p>
      </motion.div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center">
        <Sparkles className="mr-2 text-yellow-400" />
        Top Blogs
        <Sparkles className="ml-2 text-yellow-400" />
      </h2>
      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog._id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
              }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
