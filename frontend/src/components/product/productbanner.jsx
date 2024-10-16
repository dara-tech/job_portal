import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { PRODUCT_API_ENDPOINT } from '@/utils/constant';
import { Link } from 'react-router-dom';

const ProductBanner = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const { data } = await axios.get(`${PRODUCT_API_ENDPOINT}?sort=-createdAt&limit=5`, { withCredentials: true });
        if (data.success && data.data.length > 0) {
          setLatestProducts(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch latest products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % latestProducts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [latestProducts.length]);

  const nextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % latestProducts.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + latestProducts.length) % latestProducts.length);
  };

  if (loading) {
    return <ProductBannerSkeleton />;
  }

  if (latestProducts.length === 0) return null;

  const currentProduct = latestProducts[currentIndex];

  return (
    <div className="dark:bg-gradient-to-r from-gray-900 to-gray-800 py-20 relative overflow-hidden mb-4 rounded-3xl">
      <div className="container mx-auto px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between"
          >
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0 text-white">
              <motion.h1 
                className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-600 "
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
              >
                {currentProduct.name}
              </motion.h1>
              <motion.p 
                className="text-xl mb-8 text-gray-300"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              >
                <div className='text-muted-foreground font-light' dangerouslySetInnerHTML={{ __html: currentProduct.description.substring(0, 100) }} />
              </motion.p>
              <motion.div 
                className="flex items-center justify-center md:justify-start mb-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 80 }}
              >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-6 h-6 ${i < Math.round(currentProduct.rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
                ))}
                <span className="ml-2 text-gray-300">({currentProduct.rating.toFixed(1)})</span>
              </motion.div>
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 60 }}
              >
                <Link to={`/products/${currentProduct._id}`}>
                  <Button
                    className="dark:bg-gradient-to-r from-purple-600 to-pink-600 bg-gradient-to-r from-blue-600 to-green-600 text-white hover:from-purple-700 hover:to-pink-700 transition-all duration-300 text-lg px-10 py-4 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Shop Now
                  </Button>
                </Link>
              </motion.div>
            </div>
            <motion.div 
              className="md:w-1/2 relative"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <img 
                src={currentProduct.image} 
                alt={currentProduct.name} 
                className="w-full h-auto object-cover"
              />
              <motion.div 
                className="absolute -bottom-5 -right-2 bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 rounded-full shadow-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
              >
                <span className="text-3xl font-bold">${currentProduct.price.toFixed(2)}</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {latestProducts.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-purple-600 scale-125' : 'bg-gray-400'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-300"
        onClick={prevProduct}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-300"
        onClick={nextProduct}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

const ProductBannerSkeleton = () => {
  return (
    <div className="dark:bg-gradient-to-r from-gray-900 to-gray-800 py-20 relative overflow-hidden mb-4 rounded-3xl">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <div className="h-12 bg-gray-300 rounded w-3/4 mb-6 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6 mb-8 animate-pulse"></div>
            <div className="flex items-center justify-center md:justify-start mb-8">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-6 h-6 bg-gray-300 rounded-full mr-1 animate-pulse"></div>
              ))}
            </div>
            <div className="h-12 bg-gray-300 rounded-full w-40 animate-pulse"></div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-full h-80 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="absolute -bottom-5 -right-2 bg-gray-300 w-24 h-12 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;
