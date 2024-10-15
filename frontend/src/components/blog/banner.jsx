import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Tag, User } from 'lucide-react';
import { BLOG_API_ENDPOINT } from '../../utils/constant';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Banner = () => {
  const [featuredPost, setFeaturedPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const fetchFeaturedPost = useCallback(async () => {
    try {
      const response = await fetch(`${BLOG_API_ENDPOINT}?featured=true&limit=1`);
      if (!response.ok) throw new Error("Failed to fetch featured post");
      const data = await response.json();
      setFeaturedPost(data.data[0]);
    } catch (error) {
      console.error("Error fetching featured post:", error);
      setError("Failed to load featured post. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedPost();
  }, [fetchFeaturedPost]);

  const renderContent = () => {
    if (loading) return <BannerSkeleton />;
    if (error) return <ErrorMessage message={error} onRetry={fetchFeaturedPost} />;
    if (!featuredPost) return null;

    return (
      <AnimatePresence>
        {inView && (
          <motion.div 
            className="max-w-4xl mx-auto relative z-10 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.span 
              className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider uppercase bg-white/20 backdrop-blur-sm rounded-full"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Featured Post
            </motion.span>
            <motion.h1 
              className="text-4xl sm:text-5xl font-bold mb-4 leading-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {featuredPost.title}
            </motion.h1>
            <motion.p 
              className="text-lg mb-6 line-clamp-2 opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <div dangerouslySetInnerHTML={{ __html: featuredPost.content.substring(0, 150) + '...' }} />
            </motion.p>
            <motion.div
              className="flex flex-wrap items-center gap-6 text-sm opacity-80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>{new Date(featuredPost.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span>{featuredPost.author && typeof featuredPost.author === 'object' ? featuredPost.author.fullname : 'Anonymous'}</span>
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span>{featuredPost.category || 'Uncategorized'}</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Button
                variant="secondary"
                size="lg"
                className="mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white"
                onClick={() => window.location.href = `/blog/${featuredPost._id}`}
              >
                Read More
                <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div 
      ref={ref}
      className="py-20 px-4 sm:px-6 lg:px-8 rounded-xl shadow-lg mb-12 overflow-hidden relative"
      style={{
        backgroundImage: featuredPost && featuredPost.picture ? `url(${featuredPost.picture})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black opacity-50"></div>
      {renderContent()}
    </div>
  );
};

const BannerSkeleton = () => (
  <div className="space-y-4 relative z-10">
    <Skeleton className="h-6 w-24 bg-white/20" />
    <Skeleton className="h-10 w-3/4 bg-white/20" />
    <Skeleton className="h-20 w-full bg-white/20" />
    <div className="flex justify-between">
      <Skeleton className="h-6 w-40 bg-white/20" />
      <Skeleton className="h-10 w-28 bg-white/20" />
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center relative z-10 text-white">
    <p className="text-xl mb-4">{message}</p>
    <Button onClick={onRetry} variant="secondary" className="bg-white/20 hover:bg-white/30">Retry</Button>
  </div>
);

export default Banner;
