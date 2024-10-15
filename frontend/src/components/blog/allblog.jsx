import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogCard from './blogcard';
import { Skeleton } from "@/components/ui/skeleton"
import { BLOG_API_ENDPOINT } from '../../utils/constant';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, Frown, Loader, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(9);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(BLOG_API_ENDPOINT);
        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }
        const data = await response.json();
        setBlogs(data.data);
      } catch (err) {
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog =>
    (blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    blog.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (selectedTags.length === 0 || selectedTags.every(tag => blog.tags.includes(tag)))
  );

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const allTags = [...new Set(blogs.flatMap(blog => blog.tags))];

  const toggleTag = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  if (loading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="container mx-auto px-4 py-8"
      >
        <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Unveiling Our Blog Universe</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
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
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="container mx-auto px-4 py-8 text-center text-red-500"
      >
        <Frown className="mx-auto h-16 w-16 mb-4" />
        <h1 className="text-4xl font-bold mb-4">Oops! Our Blog Cosmos Hit a Black Hole</h1>
        <p className="text-xl">{error}</p>
        <Button className="mt-4 animate-pulse" onClick={() => window.location.reload()}>
          <Loader className="mr-2 h-4 w-4" /> Realign the Stars
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">Explore Our Blog Galaxy</h1>
      <motion.div 
        className="mb-8 flex flex-col items-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="relative w-full max-w-xl mb-4">
          <Input
            type="text"
            placeholder="Navigate through blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-full  focus:ring-2 focus:ring-purple-400"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {allTags.map(tag => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer transition-all hover:scale-105"
              onClick={() => toggleTag(tag)}
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </motion.div>
      <AnimatePresence>
        {currentBlogs.length > 0 ? (
          <>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              {currentBlogs.map((blog) => (
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
            <motion.div 
              className="mt-8 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {[...Array(Math.ceil(filteredBlogs.length / blogsPerPage))].map((_, index) => (
                <Button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`mx-1 rounded-full ${currentPage === index + 1 ? 'bg-gradient-to-r from-purple-400 to-pink-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  {index + 1}
                </Button>
              ))}
            </motion.div>
          </>
        ) : (
          <motion.div 
            className="text-center text-muted-foreground py-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg shadow-inner"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <BookOpen className="mx-auto h-16 w-16 mb-4 text-gray-400" />
            <p className="text-2xl font-semibold">Our Blog Universe is Expanding</p>
            <p className="mt-2 text-lg">New celestial bodies of knowledge coming soon!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}