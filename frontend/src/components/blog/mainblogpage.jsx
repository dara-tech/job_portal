import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBlogs from './topblog';
import AllBlogs from './allblog';
import Banner from './banner';
import TopAuthor from './topauthor';
import { Sparkles, ArrowRight, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainBlogPage() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.h1 
        className="text-6xl font-extrabold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
      >
        Explore Our Blog Universe
      </motion.h1>

      <AnimatePresence>
        {showContent && (
          <>
            <motion.div 
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Banner />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
              <motion.div 
                className="lg:col-span-2"
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
              >
                <h2 className="text-3xl font-semibold mb-6 flex items-center">
                  <Sparkles className="mr-3 text-yellow-400" /> Featured Posts
                </h2>
                <TopBlogs />
              </motion.div>

              <motion.div
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
              >
                <h2 className="text-3xl font-semibold mb-6 flex items-center">
                  <Users className="mr-3 text-blue-400" /> Top Authors
                </h2>
                <TopAuthor />
              </motion.div>
            </div>

            <motion.div
              className="mt-16"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 100, delay: 1 }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-semibold flex items-center">
                  <BookOpen className="mr-3 text-green-400" /> All Posts
                </h2>
                <Button 
                  variant="outline" 
                  className="flex items-center text-lg" 
                  onClick={() => window.location.href = '/blog/allblogs'}
                >
                  View All <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <AllBlogs />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
